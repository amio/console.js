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
    hotKey: 27, // 'ESC'
    welcome: 'Hello friendo.',
    caseSensitive: false,
    host: document.body,
    historySize: 256
  };
  var pannelHTML = '<label class="console-pannel"><dl class="console-history"></dl><input class="console-input"/></label>';

  root.Console = function (commands, cfg) {
    cfg = util.defaults(cfg || {}, config);

    this.commands = commands || {};

    this.history = [];

    this.el = util.toElement(pannelHTML);
    document.body.appendChild(this.el);

    this.his = this.el.firstChild;
    this.ipt = this.his.nextSibling;

    // Bind hotkey listener
    if (util.isNumber(cfg.hotKey)) {
      window.addEventListener('keydown', hotKeyListener(this, cfg.hotKey));
    }

    // Bind 'Enter' listener on input
    this.ipt.addEventListener('keydown', enterListener(this));

    this.log(cfg.welcome);
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
        console.dispatch(e.target.value);
        e.target.value = '';
      }
    };
  }

  Console.prototype.toggle = function () {

    if (this.isShown) {
      this.el.style.display = 'none';
      this.isShown = false;
    } else {
      this.el.style.display = 'block';
      this.ipt.focus();
      this.isShown = true;
    }
  };

  Console.prototype.log = function (type) {
    var args = Array.prototype.slice.call(arguments, 1);
    var log = type == 'command' ?
        util.toElement('<dt>' + args.join(' ') + '</dt>') :
        util.toElement('<dd>' + args.join(' ') + '</dd>');
    this.his.appendChild(log);
  };

  Console.prototype.dispatch = function (cmd) {

    this.history.push(cmd);
    this.log('command', cmd);

    var parts = cmd.split(' ');
    var fn = this.commands[parts[0]];
    var result = fn && fn.apply(window, parts.splice(1));

    result && this.log('result', result);
  };

  var util = {
    defaults: function(target){
      Array.prototype.slice.call(arguments,1).forEach(function(source){
        for(var prop in source){
          if(target[prop] === void 0){
            target[prop] = source[prop];
          }
        }
      });
    },
    isNumber: function (num) {
      return toString.call(num) == '[object Number]';
    },
    toElement: function (html) {
      var wrapper = document.createElement('div');
      wrapper.innerHTML = html;
      return wrapper.firstChild;
    }
  }

}).call(this);
