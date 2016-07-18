import riot from 'riot'
import './console.tag'
import './logline.tag'

const defaultConfig = {
  hotkey: 192, // '~'
  welcome: '',
  onShow: null,
  onHide: null,
  defaultHandler: null,
  caseSensitive: false,
  historySize: 256
}

class Console {
  constructor (cfg = {}) {
    this.wrapper = this.initWrapperElement()
    this.config = {...defaultConfig, ...cfg}
    this.history = []

    riot.mount(this.wrapper)
  }

  initWrapperElement () {
    const wrapper = document.createElement('console')
    wrapper.style.height = Math.round(window.innerHeight / 2) + 'px'

    document.body.insertBefore(wrapper, document.body.firstChild)
    return wrapper
  }

  createHotkeyListener(keyCode) {
    return (e) => {
      if (e.keyCode === keyCode) {
        this.toggle()
        e.preventDefault()
      }
    }
  }

}

export default Console
