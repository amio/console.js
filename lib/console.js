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

  function createHotkeyListener(console, key) {
    return function (e) {
      if (e.keyCode === key) {
        console.toggle();
        e.preventDefault();
      }
    };
  }

  function createInputListener(cnsl) {
    var i = 0;
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
        break;
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
