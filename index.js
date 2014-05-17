window.onload = function () {

  var cnsl = new Console({
    "addbots": function (num) {
      return num + ' bots added.'
    }
  },{
    welcome: 'Need some help? Try "help":'
  });

  cnsl.register('setname', function (name) {
    return 'My name is ' + name + ' now.';
  }, {
    desc: 'Change your name (works in network play too).'
  });

  cnsl.register('whosyourdaddy', function () {
    console.log('WHOSYOURDADDY!');
  });

  cnsl.register('help', function () {
    var cmds = cnsl.commands;
    for (var name in cmds) {
      if (cmds.hasOwnProperty(name)) {
        cmds[name].desc && cnsl.log(' -', name.toUpperCase() + ':', cmds[name].desc);
      }
    }
  },{
    desc: 'Show help messages.'
  });

  window.cnsl = cnsl;
};
