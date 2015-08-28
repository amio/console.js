/**
 * CONSOLE.JS - A game console for the browser.
 * http://gh.amio.us/console.js
 *
 * Created by Amio
 * http://amio.us/
 */

(function () {

  var root = this;
  var config = {
    hotkey: 192, // '~'
    welcome: '',
    onShow: null,
    onHide: null,
    defaultHandler: null,
    caseSensitive: false,
    historySize: 256
  };
  var panelStyle = '/* CONSOLE CSS */';
  var panelHTML = '<label class="console-panel"><dl class="console-history"></dl><input class="console-input"/></label>';
  var currentConsole = null;

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
        this.register(name, commands[name]);
      }
    }

    this.panelEl = util.toElement(panelHTML);
    this.logEl = this.panelEl.firstChild;
    this.inputEl = this.logEl.nextSibling;

    // Bind hotkey listener
    if (cfg.hotkey) {
      this.hotkeyListener = createHotkeyListener(this, cfg.hotkey);
      window.addEventListener('keydown', this.hotkeyListener);
    }

    // Bind 'Enter' listener on input
    this.inputEl.addEventListener('keydown', createInputListener(this));

    // Init welcome message
    cfg.welcome && this.log('message', cfg.welcome);

    // Inject to page.
    document.body.appendChild(this.panelEl);
    injectStyleSheet(panelStyle);
  };

  function createHotkeyListener(konsole, key) {
    return function (e) {
      if (e.keyCode === key) {
        konsole.toggle();
        e.preventDefault();
      }
    };
  }

  function createInputListener(konsole) {
    var i = 0;
    return function (e) {
      var cmd = e.target.value.toLowerCase();
      switch (e.keyCode) {
      case 13:
        // Enter
        konsole.history[0] = cmd;
        e.target.value = '';
        cmd && konsole.log('command', cmd);
        konsole.history.unshift('');
        if (konsole.history.length > konsole.cfg.historySize) {
          konsole.history = konsole.history.splice(0, konsole.cfg.historySize);
        }
        konsole.dispatch(cmd);
        break;
      case 38:
        // Up Arrow
        konsole.history[i + 1] !== void 0 && (e.target.value = konsole.history[++i]);
        i >= konsole.history.length && (i = konsole.history.length - 1);
        e.preventDefault();
        break;
      case 40:
        // Down Arrow
        konsole.history[i] !== '' && (e.target.value = konsole.history[--i]);
        i < 0 && (i = 0);
        break;
      case 9:
        // Tab
        i = 0;
        konsole.history[0] = e.target.value = konsole.autoComplete();
        e.preventDefault();
        break;
      default:
        i = 0;
        konsole.history[0] = e.target.value;
      }
    };
  }

  function injectStyleSheet(css) {
    if (css) {
      document.head.appendChild(util.toElement('<style>' + css + '</style>'));
      panelStyle = false;
    }
  }

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

  Console.prototype.dispatch = function (command) {

    var parts = command.split(' ');
    var cmd = this.cfg.caseSensitive === false ? parts[0].toLowerCase() : parts[0];
    var handlerObj = this.commands[cmd], result;
    if (handlerObj) {

      // support alias
      while (util.isString(handlerObj.__fn)) {
        handlerObj = this.commands[handlerObj.__fn];
        if (handlerObj === cmd) {
          throw new Error('Alias loop.');
        }
      }

      result = handlerObj && handlerObj.__fn.apply(handlerObj, parts.splice(1));
    } else if (util.isFunction(this.cfg.defaultHandler)) {
      result = this.cfg.defaultHandler.apply(this, parts);
    }

    result && this.log('message', result);

  };

  /**
   * Toggle console.
   * @param {=String} status specify 'on' or 'off'.
   */
  Console.prototype.toggle = function (status) {

    if (status === 'off' || this.isShown) {
      currentConsole = false;
      util.removeClass(this.panelEl, 'shown');
      this.inputEl.blur();
      this.isShown = false;
      util.isFunction(this.cfg.onHide) && this.cfg.onHide(this);
    } else if (status === 'on' || !this.isShown) {
      currentConsole && currentConsole.toggle('off');
      currentConsole = this;
      util.addClass(this.panelEl, 'shown');
      this.inputEl.focus();
      this.isShown = true;
      util.isFunction(this.cfg.onShow) && this.cfg.onShow(this);
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
    this.cfg.caseSensitive === false && (cmd = cmd.toLowerCase());
    this.commands[cmd] = util.defaults({
      __fn: fn
    }, config);
    return this;
  };

  /**
   * Console self destroy
   */
  Console.prototype.destroy = function () {
    this.hotkeyListener && window.removeEventListener('keydown', this.hotkeyListener);
    document.body.removeChild(this.panelEl);
  };

  /**
   * Output commands list.
   */
  Console.prototype.printHelp = function (filterFn) {
    var cmds = this.commands;
    var i, cmd, lineout;
    var indent = '  ';

    var names = Object.keys(this.commands).sort()
    if (util.isFunction(filterFn)){
      names = names.filter(filterFn);
    }

    for (i = 0; i < names.length; i++) {
      cmd = this.commands[names[i]]

      lineout = ''
      if (cmd.usage) lineout += (indent + cmd.usage)
      if (cmd.desc) lineout += (indent + cmd.desc)
      if (lineout === '') lineout = indent + names[i]

      this.log(lineout);
    }
  }

  /**
   * Auto complete the command.
   */
  Console.prototype.autoComplete = function () {
    var cmd = this.inputEl.value;
    if (cmd === '') return cmd;

    var filterFn = function (handlerName) {
      return handlerName.indexOf(cmd) === 0;
    }

    var matched = Object.keys(this.commands).filter(filterFn)
    switch (matched.length) {
      case 0:
        return cmd;
      case 1:
        return matched[0] + ' ';
      default:
        this.log('message', cmd);
        this.printHelp(filterFn);
        return cmd;
    }
  }

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
    hasClass: function (el, klass) {
      new RegExp('\\b' + klass + '\\b').test(el.className);
    },
    removeClass: function (el, klass) {
      el.className = el.className.replace(new RegExp('\\b ?' + klass + '\\b', 'g'), '');
    },
    addClass: function (el, klass) {
      el.className = el.className.replace(new RegExp('\\b' + klass + '\\b|$'), ' ' + klass);
    },
    isFunction: function (fn) {
      return typeof fn === 'function';
    },
    isNumber: function (num) {
      return toString.call(num) === '[object Number]';
    },
    isString: function (str) {
      return toString.call(str) === '[object String]';
    }
  };

  // AMD Support
  if (typeof define === 'function' && define.amd) {
    define([], function () {
      return Console;
    });
  }

}).call(this);
