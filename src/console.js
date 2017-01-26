const React = require('react')
const ConsolePanel = require('./console-panel')

const noop = () => {}
const defaultOptions = {
  hotkey: 192,    // KeyCode for '~'
  welcome: '',    // welcome message
  onShow: noop,   // on show callback
  onHide: noop,   // on hide callback
  defaultHandler: noop,   // fallback handler
  caseSensitive: false,   // whether case sensitive
  autoComplete: true      // press `tab` to auto complete
}

// Console constructor
function Console (options = {}, handlers) {
  this.config = Object.assign({}, defaultOptions, options)
  this.history = []
  this.handlers = {}

  this.log(this.config.welcome)

  if (handlers) {
    for (let cmd in handlers) {
      this.register(cmd, handlers[cmd], handlers[cmd].config)
    }
  }

  this._render()

  return this
}

Console.prototype._render = function () {
  const panelProps = {
    config: this.config,
    history: this.history,
    dispatch: this.dispatch.bind(this),
    autoCompleteFn: this.autoComplete.bind(this)
  }
  const panel = <ConsolePanel ref={p => (this.panel = p)} {...panelProps} />
  this.element = React.render(panel, document.body, this.element)
  return this
}

Console.prototype.toggle = function (visibility) {
  this.panel.toggle(visibility)
}

Console.prototype.log = function (message, instruction) {
  this.history.push({
    ins: instruction,
    msg: message
  })
}

Console.prototype.register = function (cmd, handler, config) {
  if (typeof cmd === 'function') {
    this.config.defaultHandler = cmd
  } else if (typeof cmd === 'string' && typeof handler === 'function') {
    !this.config.caseSensitive && (cmd = cmd.toLowerCase())

    this.handlers[cmd] = {
      cmd: cmd,
      fn: handler,
      cfg: config
    }
  }
  return this
}

Console.prototype.autoComplete = function (prefix) {
  if (typeof this.config.autoComplete === 'function') {
    return this.config.autoComplete(prefix)
  }

  if (this.config.autoComplete) {
    const cmds = Object.keys(this.handlers)
    const matched = cmds.filter(cmd => cmd.indexOf(prefix) === 0)
    if (matched.length === 1) {
      return matched[0]
    } else {
      this.log(matched.map(n => '  ' + n).join('\n'))
      return prefix
    }
  }
}

Console.prototype.dispatch = function (instruction) {
  let [cmd, ...args] = instruction.split(' ')
  cmd = this.config.caseSensitive ? cmd : cmd.toLowerCase()
  args = args.join(' ')

  let result
  const handler = this.handlers[cmd]
  if (typeof handler === 'object' && typeof handler.fn === 'function') {
    result = handler.fn(args)
  } else if (this.config.defaultHandler) {
    result = this.config.defaultHandler(args)
  }

  this.log(result, instruction)
  this._render()
}

Console.prototype.destroy = function () {
  React.render('', document.body, this.element)
  this.element = null
}

module.exports = Console
