# Console.js [![npm-version][npm-badge]][npm-link]

`Console.js` is a tiny lib for creating [Console (video game cli)](https://en.wikipedia.org/wiki/Console_(video_game_CLI)) popups in browser.

[![Console.js Screenshot][screenshot]][home]

Check the [Live Demo][home], or [Basic Usage](#basic-usage) / [Advance Usage](#advance-usage) / [API](#api).

## Basic Usage

1. To install console.js, either:

  - Use npm: `npm install console.js`
  - Include `console.js` in html:  
    `<script src="https://unpkg.com/console.js@2"></script>`

1. Create a Console:

```javascript
const cnsl = new Console({ hotkey: 192 })

cnsl.register('addbots', function (num) {
    // Add some bots, then tell player:
    return num + ' bots added.'
})
```

## Advance Usage

#### Options

```javascript
var cnsl = new Console({
    hotkey: 27, // <kbd>ESC</kbd>
    welcome: 'Hello User.',
    caseSensitive: true,
    autoComplete: true,
    defaultHandler: function () {},
    onShow: function () {},
    onHide: function () {}
}, {
  'cmd1': function (args) {/*...*/},
  'cmd2': function (args) {/*...*/}
});
```

- `hotkey` : {Number|Boolean} The keyCode of hotkey. `192`(the <kbd>~</kbd>) by default.
- `welcome`: {String} The welcome message. `''` by default.
- `caseSensitive`: {Boolean} If you want to. `false` by default.
- `autoComplete`: {Boolean|Function} Enable <kbd>tab</kbd> for auto completion.
- `defaultHandler`: {Function} The fallback handler for all commands. `noop` by default.
- `onShow` : {Function} On show callback. `noop` by default.
- `onHide` : {Function} On hide callback. `noop` by default.

#### Register command with extra config

`.register(commandName, commandHandler, commandConfig)`

```javascript
var cnsl = new Console()

cnsl.register('say', function () {
  return player.name + ': "' + Array.prototype.join.call(arguments, ' ') + '"'
}, {
  usage: 'SAY <message string>: Broadcast a message to other players in the game.'
})

cnsl.register('help', function () {
  return Object.keys(cnsl.handlers).map(function (name) {
    return ' - ' + cnsl.handlers[name].cfg.usage
  }).join('\n')
}, {
  usage: 'HELP: Show help messages.'
})
```

#### Custome autoComplete function

```javascript
var cnsl = new Console({
  hotkey: 27,
  autoComplete: customeAutoComplete
})

function customeAutoComplete (inputString) {
  const availableCommands = Object.keys(cnsl.handlers)
  cnsl.log(availableCommands.join(' '))

  return inputString
}
```

## API

### Create a Console

- `new Console()` Create a console instance (with default options)
- `new Console(options)` Create a console with options. (see [Basic Usage](#basic-usage))

### Instance Methods

Note: Console instances on [https://amio.github.io/console.js/][home]
were exposed on window. You can fiddle with them(`window.cnsl` and `window.smtc`) in devtools.

#### .register(command, handler[, config])

- `.register(command, handler)` Register a `handler` to `command`
- `.register(command, handler, config)` Register a `handler` to `cmd` with a config object
- `.register(handler)` Register a `defaultHandler`

#### .log(msg[, cmd])

- `.log(msg)` Write a message to console
- `.log(msg, cmd)` Write a message with an instruction to console

#### .clear()

- `.clear()` Clear history

#### .toggle([switch])

- `.toggle()` Toggle the console
- `.toggle("on")` Open it
- `.toggle("off")` Close it

#### .destroy()

- `.destroy()` Suicide.

## License

MIT © [Amio][author]

[screenshot]: https://cloud.githubusercontent.com/assets/215282/9493105/e7e3ee38-4c2f-11e5-85cc-c24168e8c706.png
[npm-badge]:  https://img.shields.io/npm/v/console.js.svg?style=flat-square
[npm-link]:   https://www.npmjs.com/package/console.js
[author]:     https://github.com/amio
[home]:       https://amio.github.io/console.js/
