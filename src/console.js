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
  historySize: 256        // history size
}

// Console constructor
function Console (options = {}, handlers) {
  this.config = Object.assign({ handlers: {} }, defaultOptions, options)
  this.visible = false
  this.history = []

  if (this.config.welcome) {
    this.history.push({ msg: this.config.welcome })
  }

  if (handlers) {
    for (let cmd in handlers) {
      this.register(cmd, handlers[cmd])
    }
  }

  this._render()
  this._listen()
  window.cnsl = this
  return this
}

Console.prototype._render = function () {
  const panelProps = {
    history: this.history,
    visible: this.visible,
    dispatch: this.dispatch.bind(this)
  }
  const panel = <ConsolePanel {...panelProps} />
  this.element = React.render(panel, document.body, this.element)
  return this
}

Console.prototype._listen = function () {
  this.hotkeyListener = window.addEventListener('keydown', (e) => {
    if (e.keyCode === this.config.hotkey) {
      this.toggle()
    }
  })
}

Console.prototype.toggle = function (visibility) {
  switch (visibility) {
    case 'on':
      this.visible = true
      break
    case 'off':
      this.visible = false
      break
    default:
      this.visible = !this.visible
  }
  this._render()
}

Console.prototype.register = function (cmd, handler, config) {
  !this.config.caseSensitive && (cmd = cmd.toLowerCase())

  this.config.handlers[cmd] = {
    command: cmd,
    handler: handler,
    config: config
  }
  return this
}

Console.prototype.dispatch = function (instruction) {
  let [cmd, ...args] = instruction.split(' ')
  cmd = this.config.caseSensitive ? cmd : cmd.toLowerCase()
  args = args.join(' ')

  let result
  const handler = this.config.handlers[cmd]
  if (typeof handler === 'function') {
    result = handler(args)
  } else if (this.config.defaultHandler) {
    result = this.config.defaultHandler(args)
  }

  this.history.push({
    cmd: instruction,
    msg: result
  })

  this._render()
}

Console.prototype.destroy = function () {
  React.render('', document.body, this.element)
  this.element = null
}

module.exports = Console
