/**
 * CONSOLE.JS - A game console for web.
 * http://gh.amio.us/console.js
 * v0.0.2
 *
 * Created by Amio
 * http://amio.us/
 */

(function () {

  var root = this;
  var config = {
    hotKey: 27, // 'ESC'
    welcome: '',
    caseSensitive: false,
    historySize: 2
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

    // Leave history[0] for input.value.
    cfg.historySize++;

    this.history = [];
    this.cfg = cfg;

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
    cfg.hotKey && window.addEventListener('keydown', hotKeyListener(this, cfg.hotKey));

    // Init welcome message
    cfg.welcome && this.log('message', cfg.welcome);

    // Bind 'Enter' listener on input
    this.inputEl.addEventListener('keydown', inputKeydownListener(this));
    this.inputEl.addEventListener('keyup', inputKeyupListener(this));

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

  function inputKeydownListener(cnsl) {
    var i = 0;
    return function (e) {
      switch (e.keyCode) {
      case 38:
        // Up Arrow
        cnsl.history[i] !== void 0 && (e.target.value = cnsl.history[i++]);
        i >= cnsl.history.length && (i = cnsl.history.length - 1);
        e.preventDefault();
        break;
      case 40:
        // Down Arrow
        cnsl.history[i] !== void 0 && (e.target.value = cnsl.history[i--]);
        i < 0 && (i = 0);
        break;
      default:
        i = 0;
        cnsl.history[0] = e.target.value;
      }
    };
  }

  function inputKeyupListener(cnsl) {
    return function (e) {
      switch (e.keyCode) {
      case 13:
        // Enter
        var cmd = e.target.value;
        e.target.value = '';
        cmd && cnsl.log('command', cmd);
        cnsl.history.unshift('');
        if (cnsl.history.length > cnsl.cfg.historySize) {
          cnsl.history = cnsl.history.splice(0, cnsl.cfg.historySize);
        }
        cnsl.dispatch(cmd);
      }
    };
  }

  Console.prototype.toggle = function (status) {

    if (status === 'off' || this.isShown) {
      this.panelEl.style.display = 'none';
      this.isShown = false;
    } else if (status === 'on' || !this.isShown) {
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
      log = util.toElement('<dt></dt>');
      log.appendChild(document.createTextNode(args[0])); // Sanitize.
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

    var parts = cmd.split(' ');
    var command = this.commands[parts[0]];
    if (command) {

      // support alias
      while (util.isString(command.__fn)) {
        command = this.commands[command.__fn];
        if (command === parts[0]) {
          throw new Error('Alias loop.');
        }
      }

      var result = command && command.__fn.apply(command, parts.splice(1));
      result && this.log('message', result);
    }

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
    return this;
  };

  /**
   * Handy utilities
   */

  var util = {
    defaults: function (target) {
      Array.prototype.slice.call(arguments, 1).forEach(function (source) {
        for (var prop in source) {
          if (target[prop] === void 0) {
            target[prop] = source[prop];
          }
        }
      });
      return target;
    },
    toElement: function (html) {
      var wrapper = document.createElement('div');
      wrapper.innerHTML = html;
      return wrapper.firstChild;
    },
    preventDefault: function (e) {
      e.preventDefault();
    },
    isNumber: function (num) {
      return toString.call(num) == '[object Number]';
    },
    isString: function (str) {
      return toString.call(str) == '[object String]';
    }
  };

  // AMD Support
  if (typeof define === 'function' && define.amd) {
    define([], function () {
      return Console;
    });
  }

}).call(this);
