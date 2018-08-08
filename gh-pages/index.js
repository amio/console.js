window.onload = function () {
  /**
   * Init Console 1: cnsl
   */

  var cnsl = new window.Console({
    welcome: 'Hello Player. Need any help?'
  })

  // Virtual game data
  var player = {
    name: 'Player'
  }

  // .register(<name>, <handler>, <anything>)
  cnsl.register('say', function () {
    return player.name + ': "' + Array.prototype.join.call(arguments, ' ') + '"'
  }, {
    usage: 'SAY <message string>: Broadcast a message to other players in the game.'
  })

  cnsl.register('setname', function (name) {
    player.name = name
    return 'Player name is ' + player.name + ' now.'
  }, {
    usage: 'SETNAME <newname>; || NAME <newname>: Change your name (works in network play too).'
  })

  cnsl.register('help', function () {
    return Object.keys(cnsl.handlers).map(function (name) {
      return ' - ' + cnsl.handlers[name].cfg.usage
    }).join('\n')
  }, {
    usage: 'HELP: Show help messages.'
  })

  cnsl.register(function () {
    return 'Unrecognized command. Use `help`.'
  })

  /**
   *  Init Console 2: Show Me The Code
   */

  var codes = {
    'showmethecode':
      ' - create: How to init a new console.\n' +
      ' - options: Available options.\n' +
      ' - more: More docs.',
    'create':
      'new Console({ hotkey: 27 }, {\n' +
      '  "addbots": function (num) {\n' +
      '      // add some bots,\n' +
      '      // then tell player:\n' +
      '      return num + " bots added."\n' +
      '  }\n' +
      '});',
    'options':
      'new Console({\n' +
      '    hotkey: 27, \n' +
      '    welcome: "Hello User:",\n' +
      '    caseSensitive: true,\n' +
      '    defaultHandler: function(){}\n' +
      '    onShow: function(){},\n' +
      '    onHide: function(){}\n' +
      '});\n' +
      ' - `hotkey` : {Number|boolean} The keyCode of hotkey. `192`(the "~") by default.\n' +
      ' - `welcome`: {String} The welcome message. `""` by default.\n' +
      ' - `caseSensitive`: {Boolean} If you want to. `false` by default.\n' +
      ' - `defaultHandler`: {Function} the fallback handler for all commands. `noop` by default.\n' +
      ' - `onShow` : {Function} On show callback. `noop` by default.\n' +
      ' - `onHide` : {Function} On hide callback. `noop` by default.',
    'more': 'Visit http://github.com/amio/console.js/'
  }

  var smtc = new window.Console({
    hotkey: 27, // <kbd>ESC</kbd>
    welcome: 'Use "showmethecode":',
    caseSensitive: true,
    defaultHandler: function (cmd) {
      return codes[cmd]
    }
  })

  smtc.register('showmethecode', function () { return codes['showmethecode'] })
  smtc.register('create', function () { return codes['create'] })
  smtc.register('options', function () { return codes['options'] })
  smtc.register('more', function () { return codes['more'] })

  // For tablet visiters
  document.getElementById('slash').addEventListener('click', function () { cnsl.toggle() })
  document.getElementById('esc').addEventListener('click', function () { smtc.toggle() })

  window.cnsl = cnsl
  window.smtc = smtc
}
