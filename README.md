Console.js
==========

A Game Console for Browsers.

Check the [live demo](http://amio.github.io/console.js).

## Usage

Include `console.min.js` in your page:

```
<script src="http://amio.github.io/console.js/lib/console.min.js"></script>
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
var cnsl = new Console({}, {
    hotKey: 27, // <kbd>ESC</kbd> ('~' for default)
    welcome: 'Try "help":'
});
```

- `hotKey`: {Number|boolean} The keyCode of hotkey.  
If you want to manually put up console(`cnsl.toggle("on")`), set to a falsy value. 
- `welcome`: {String} The welcome message.

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

## Instance Methods

#### `.register(cmd,fn[,config])`

- `.register(cmd, fn)` Register a `fn` to `cmd`
- `.register(cmd, fn, config)` Register a `fn` to `cmd` with a config object

#### `.toggle([switch])`

- `.toggle()` Toggle the console
- `.toggle("on")` Show the console
- `.toggle("off")` Hide the console
