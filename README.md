console.js
==========

A game console for web. Check the [live demo](http://amio.github.io/console.js).

## Usage

Include CSS & JS in your page:

```
	<link href="http://amio.github.io/console.js/lib/console.css" rel="stylesheet" />
	<script src="http://amio.github.io/console.js/lib/console.js"></script>
```

then:
```
new Console({
    "addbots": function (num) {
        // add some bots,
        // then tell player:
        return num + ' bots added.'
    }
});
```

## Advance Usage

#### Init Console with options

```
new Console({
    "addbots": function (num) {
        // add some bots,
        // then tell player:
        return num + ' bots added.'
    }
}, {
    welcome: 'Need some help? Try "help":'
});
```

#### Alias

```
new Console({
    "add": "addbots",
    "addbots": function (num) {
        // add some bots,
        // then tell player:
        return num + ' bots added.'
    }
});
```

#### Late register command

```
var playerName = 'Player';

var cnsl = new Console();

cnsl.register('setname',function(name){
    playerName = name;
    return 'Player name is' + playerName + ' now.';
});
```

#### Late register command with extra (any) config

```
var playerName = 'Player';

var cnsl = new Console();

cnsl.register('setname',function(name){
    playerName = name;
    return 'Player name is' + playerName + ' now.';
}, {
    usage: 'SETNAME &lt;newname&gt; || NAME &lt;newname&gt;',
    desc: 'Change your name (works in network play too).'
})

.register('help', function () {
    var cmds = cnsl.commands;
    for (var name in cmds) {
        if (cmds.hasOwnProperty(name)) {
        cmds[name].desc && cnsl.log(' -', cmds[name].usage + ':', cmds[name].desc);
        }
    }
},{
    usage: 'HELP',
    desc: 'Show help messages.'
});
```
