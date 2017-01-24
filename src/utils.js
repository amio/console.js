module.exports = {
  toElement: function (html) {
    var wrapper = document.createElement('div')
    wrapper.innerHTML = html
    return wrapper.firstChild
  },
  preventDefault: function (e) {
    e.preventDefault()
  },
  hasClass: function (el, klass) {
    new RegExp('\\b' + klass + '\\b').test(el.className)
  },
  removeClass: function (el, klass) {
    el.className = el.className.replace(new RegExp('\\b ?' + klass + '\\b', 'g'), '')
  },
  addClass: function (el, klass) {
    el.className = el.className.replace(new RegExp('\\b' + klass + '\\b|$'), ' ' + klass)
  },
  isFunction: function (fn) {
    return typeof fn === 'function'
  },
  isNumber: function (num) {
    return toString.call(num) === '[object Number]'
  },
  isString: function (str) {
    return toString.call(str) === '[object String]'
  }
}
