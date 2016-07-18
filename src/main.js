import riot from 'riot'
import './console.tag'
import './logline.tag'

class Console {
  constructor (cfg = {}) {
    this.wrapper = this.initWrapperElement()
    this.wrapperClassName = 'console-panel'

    riot.mount(this.wrapper)
  }

  initWrapperElement () {
    const wrapper = document.createElement('console')
    wrapper.style.height = Math.round(window.innerHeight / 2) + 'px'

    document.body.insertBefore(wrapper, document.body.firstChild)
    return wrapper
  }
}

export default Console
