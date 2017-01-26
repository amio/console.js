const React = require('react')
const PanelHistory = require('./panel-history')

const instances = []

class ConsolePanel extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      visible: false
    }

    instances.push(this)
  }

  componentDidMount () {
    this.hotkeyListener = window.addEventListener('keyup', (e) => {
      if (e.keyCode === this.props.config.hotkey) {
        this.toggle()
      }
    })
  }

  toggle (visibility) {
    const visible = {
      'on': true,
      'off': false
    }[visibility] || !this.state.visible

    if (visible === true) {
      // hide other Console instances
      instances.forEach(panel => {
        if (panel === this) return
        panel.setState({ visible: false }, panel.props.config.onHide)
      })
    }

    this.setState({ visible: visible }, () => {
      const { onShow, onHide } = this.props.config
      visible ? onShow(this) : onHide(this)
      visible ? this.cmdInput.focus() : this.cmdInput.blur()
    })
  }

  onKeydown (event) {
    switch (event.keyCode) {
      case this.props.config.hotkey:
        event.preventDefault()
        break
      case 13:  // Enter
        event.stopPropagation()
        this.props.dispatch(event.target.value)
        this.cmdInput.value = ''
        break
      default:
        // event.preventDefault()
    }
  }

  render (props, state) {
    const panelStyle = Object.assign({}, styles.panel, {
      visibility: state.visible ? 'visible' : 'hidden',
      marginTop: state.visible ? '0px' : ('-' + styles.panel.height)
    })
    return (
      <label style={panelStyle}>
        <PanelHistory logs={props.history} />
        <input autoFocus
          ref={el => { this.cmdInput = el }}
          style={styles.input}
          onkeydown={this.onKeydown.bind(this)} />
      </label>
    )
  }
}

const styles = {
  panel: {
    zIndex: 99999,
    display: 'block',
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: parseInt(window.innerHeight / 2) + 'px',
    transition: 'margin-top 100ms ease-out',
    font: '14px/20px Menlo,monospace',
    color: '#DDD'
  },
  input: {
    outline: 0,
    border: 0,
    color: '#DDD',
    font: '14px/20px Menlo,monospace',
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    lineHeight: '16px',
    padding: '4px 5px'
  }
}

module.exports = ConsolePanel
