/**
 * CONSOLE.JS - A game console for web.
 * http://gh.amio.us/console.js
 * v0.0.1
 *
 * Created by Amio
 * http://amio.us/
 */

(function () {

  var root = this;
  var config = {
    hotKey       : 27, // 'ESC'
    welcome      : 'Hello friendo.',
    caseSensitive: false,
    historySize  : 256
  };
  var pannelHTML = '<label class="console-pannel"><dl class="console-history"></dl><input class="console-input"/></label>';

  /**
   * Console constructor.
   *
   * @param {Object} commands
   * @param {Object} option
   * @constructor
   */
  root.Console = function (commands, option) {

    var cfg = util.defaults(option || {}, config);

    this.history = [];

    this.commands = {};
    for (var name in commands) {
      if (commands.hasOwnProperty(name)) {
        this.commands[name] = {
          __fn: commands[name]
        };
      }
    }

    this.panelEl = util.toElement(pannelHTML);
    this.logEl = this.panelEl.firstChild;
    this.inputEl = this.logEl.nextSibling;

    // Bind hotkey listener
    if (util.isNumber(cfg.hotKey)) {
      window.addEventListener('keydown', hotKeyListener(this, cfg.hotKey));
    }

    // Bind 'Enter' listener on input
    this.inputEl.addEventListener('keydown', enterListener(this));

    // Init welcome message
    this.log('message', cfg.welcome);

    // Inject to page.
    document.body.appendChild(this.panelEl);
  };

  function hotKeyListener(console, key) {
    return function (e) {
      if (e.keyCode === key) {
        console.toggle();
      }
    };
  }

  function enterListener(console) {
    return function (e) {
      if (e.keyCode === 13) {
        var cmd = e.target.value;
        e.target.value = '';
        console.dispatch(cmd);
      }
    };
  }

  Console.prototype.toggle = function () {

    if (this.isShown) {
      this.panelEl.style.display = 'none';
      this.isShown = false;
    } else {
      this.panelEl.style.display = 'block';
      this.inputEl.focus();
      this.isShown = true;
    }
  };

  Console.prototype.log = function (type) {
    var args = Array.prototype.slice.call(arguments, 1);

    var log;
    switch (type) {
    case 'command':
      log = util.toElement('<dt>' + args.join(' ') + '</dt>');
      break;
    case 'message':
      log = util.toElement('<dd>' + args.join(' ') + '</dd>');
      break;
    default:
      args.unshift(type);
      log = util.toElement('<dd>' + args.join(' ') + '</dd>');
    }

    this.logEl.appendChild(log);
  };

  Console.prototype.dispatch = function (cmd) {

    this.history.push(cmd);
    this.log('command', cmd);

    var parts = cmd.split(' ');
    var command = this.commands[parts[0]];
    var result = command && command.__fn.apply(command, parts.splice(1));

    result && this.log('message', result);
  };

  /**
   * Register a command
   *
   * @param {String} cmd
   * @param {Function} fn
   * @param {=Object} config Custom configs
   */
  Console.prototype.register = function (cmd, fn, config) {
    this.commands[cmd] = util.defaults({
      __fn: fn
    }, config);
  };

  /**
   * Handy utilities
   */

  var util = {
    defaults : function (target) {
      Array.prototype.slice.call(arguments, 1).forEach(function (source) {
        for (var prop in source) {
          if (target[prop] === void 0) {
            target[prop] = source[prop];
          }
        }
      });
      return target;
    },
    isNumber : function (num) {
      return toString.call(num) == '[object Number]';
    },
    toElement: function (html) {
      var wrapper = document.createElement('div');
      wrapper.innerHTML = html;
      return wrapper.firstChild;
    }
  }

}).call(this);
