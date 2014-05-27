window.onload = function () {

  // Init Console
  var cnsl = new Console({}, {
    hotkey: 27, // <kbd>ESC</kbd>
    welcome: 'Try "help":'
  });

  // Game data
  var player = {
    name: 'Player'
  };

  /**
   * Register console command handlers.
   */

  var handlers = {
    say: function (something) {
      return player.name + ': "' + something + '"';
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

};
