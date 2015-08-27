Console.js
==========

A game console for browsers.

[![Console.js Screenshot](https://cloud.githubusercontent.com/assets/215282/9493105/e7e3ee38-4c2f-11e5-85cc-c24168e8c706.png)](http://amio.github.io/console.js)

Check the [live demo](http://amio.github.io/console.js), or [Basic Usage](#basic-usage) / [Advance Usage](#advance-usage) / [API](#api).

## Basic Usage

Include `console.min.js` in your page:

```
<script src="http://amio.github.io/console.js/lib/console.min.js"></script>
```

or just use `bower`: `bower install console.js`

then create a Console:
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
    hotkey: 27, // <kbd>ESC</kbd> ('~' for default)
    welcome: 'Hello User.',
    caseSensitive: true,
    defaultHandler: function(){}
    onShow: function(){},
    onHide: function(){}
});
```

- `hotkey` : {Number|boolean} The keyCode of hotkey. *Hint: If you want to manually put up
 console(`cnsl.toggle("on")`), set to a falsy value.* `192` by default, the "~".
- `welcome`: {String} The welcome message. `''` by default.
- `caseSensitive`: {Boolean} If you want to. `false` by default.
- `defaultHandler`: {Function} the default handler for any unspecified command. `null` by default.
- `onShow` : {Function} On show callback. `null` by default.
- `onHide` : {Function} On hide callback. `null` by default.

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

`.register(command, commandHandler)`

```
var playerName = 'Player';

var cnsl = new Console();

cnsl.register('setname',function(name){
    playerName = name;
    return 'Player name is' + playerName + ' now.';
});
```

#### Late register command with extra (any) config

`.register(command, commandHandler, commandConfig)`

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

# API

## Create a Console

- `new Console()` Create a console (with default options).
- `new Console(cmdObj)` Create a console with command handlers. (see [Basic Usage](#basic-usage))
- `new Console(cmdObj, optionsObj)` Create a console with options. (see [Init console with options](#init-console-with-options))

## Instance Methods

#### .register(cmd, fn[, config])

- `.register(cmd, fn)` Register a `fn` to `cmd`
- `.register(cmd, fn, config)` Register a `fn` to `cmd` with a config object

#### .toggle([switch])

- `.toggle()` Toggle the console
- `.toggle("on")` Show the console
- `.toggle("off")` Hide the console

#### .destroy()

- `.destroy()` Suicide.
