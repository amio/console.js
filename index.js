window.onload = function () {

  var player = {
    name: 'Player'
  };

  var cnsl = new Console({
    name: 'setname' // Alias Command
  }, {
    hotKey: 27, // <kbd>ESC</kbd>
    welcome: 'Try "help":'
  });

  cnsl.register('say', function (something) {
    return player.name + ': "' + something + '"';
  }, {
    usage: 'SAY &lt;message string&gt;',
    desc: 'Broadcast a message to other players in the game.'
  });

  cnsl.register('setname', function (name) {
    player.name = name;
    return 'Player name is ' + player.name + ' now.';
  }, {
    usage: 'SETNAME &lt;newname&gt; || NAME &lt;newname&gt;',
    desc: 'Change your name (works in network play too).'
  });

  cnsl.register('help', function () {
    var cmds = cnsl.commands;
    for (var name in cmds) {
      if (cmds.hasOwnProperty(name)) {
        cmds[name].desc && cnsl.log(' -', cmds[name].usage + ':', cmds[name].desc);
      }
    }
  }, {
    usage: 'HELP',
    desc: 'Show help messages.'
  });

  window.cnsl = cnsl;
};
