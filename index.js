window.onload = function () {

  // Init Console
  var cnsl = new Console({}, {
    welcome: 'Hello user. Need any "help"?'
  });

  // Game data
  var player = {
    name: 'Player'
  };

  /**
   * Register console command handlers.
   */

  var handlers = {
    say: function () {
      return player.name + ': "' + Array.prototype.join.call(arguments, ' ') + '"';
    },
    name: 'setname',
    setname: function (name) {
      player.name = name;
      return 'Player name is ' + player.name + ' now.';
    },
    help: function () {
      var cmds = cnsl.commands;
      for (var name in cmds) {
        if (cmds.hasOwnProperty(name)) {
          cmds[name].desc && cnsl.log(' -', cmds[name].usage + ':', cmds[name].desc);
        }
      }
    }
  };

  var handlerProps = {
    say: {
      usage: 'SAY &lt;message string&gt;',
      desc: 'Broadcast a message to other players in the game.'
    },
    setname: {
      usage: 'SETNAME &lt;newname&gt; || NAME &lt;newname&gt;',
      desc: 'Change your name (works in network play too).'
    },
    help: {
      usage: 'HELP',
      desc: 'Show help messages.'
    }
  };

  for (var cmdname in handlers) {
    cnsl.register(cmdname, handlers[cmdname], handlerProps[cmdname]);
  }

  // Init Console 2

  var codes = {
    'showmethecode':
      ' - createconsole: How to init a new console.\n' +
      ' - options: Available options.\n' +
      ' - more: More docs.',
    'createconsole':
      'new Console({\n' +
      '  "addbots": function (num) {\n' +
      '      // add some bots,\n' +
      '      // then tell player:\n' +
      '      return num + " bots added."\n' +
      '  }\n' +
      '});',
    'options':
      'new Console({}, {\n' +
      '    hotkey: 27, \n' +
      '    welcome: "Hello User:",\n' +
      '    caseSensitive: true,\n' +
      '    defaultHandler: function(){}\n' +
      '    onShow: function(){},\n' +
      '    onHide: function(){}\n' +
      '});\n' +
      ' - `hotkey` : {Number|boolean} The keyCode of hotkey. *Hint: If you want to manually put' +
      ' up console(`cnsl.toggle("on")`), set to a falsy value.* `192` by default, the "~".\n' +
      ' - `welcome`: {String} The welcome message. `""` by default.\n' +
      ' - `caseSensitive`: {Boolean} If you want to. `false` by default.' +
      ' - `defaultHandler`: {Function} the default handler for any unspecified command. `null` by default.\n' +
      ' - `onShow` : {Function} On show callback. `null` by default.\n' +
      ' - `onHide` : {Function} On hide callback. `null` by default.',
    'more': 'Visit <a href="http://github.com/amio/console.js/">http://github.com/amio/console.js/</a>'
  };

  var smtc = new Console({}, {
    hotkey: 27, // <kbd>ESC</kbd>
    welcome: 'Use "showmethecode":',
    defaultHandler: function (cmd) {
      return codes[cmd];
    }
  });

  // For tablet visiters
  document.getElementById('slash').addEventListener('click', function () {cnsl.toggle()})
  document.getElementById('esc').addEventListener('click', function () {smtc.toggle()})

};
