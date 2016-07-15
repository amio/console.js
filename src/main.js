import riot from 'riot'
import './console.tag'
import './md.tag'

class Console {
  constructor (cfg = {}) {
    this.wrapper = this.initWrapperElement()
    this.wrapperClassName = 'console-panel'

    riot.mount(this.wrapper)
  }

  initWrapperElement () {
    const wrapper = document.createElement('console')
    wrapper.className = this.wrapperClassName
    document.body.insertBefore(wrapper, document.body.firstChild)
    return wrapper
  }
}

export default Console
