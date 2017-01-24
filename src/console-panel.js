const React = require('react')
const PanelHistory = require('./panel-history')

class ConsolePanel extends React.Component {
  onKeydown (event) {
    switch (event.keyCode) {
      case 13:  // Enter
        this.props.dispatch(event.target.value)
        this.textInput.value = ''
        break
    }
  }

  render (props, state) {
    // styles.panel.visibility = props.visible ? 'visible' : 'hidden'
    // styles.panel.marginTop = props.visible ? '0px' : '-' + halfViewportHeight
    console.log(styles.panel.marginTop)
    return (
      <label style={styles.panel}>
        <PanelHistory logs={props.history} />
        <input ref={el => { this.textInput = el }}
          style={styles.input}
          onkeydown={this.onKeydown.bind(this)} />
      </label>
    )
  }
}

const halfViewportHeight = parseInt(window.innerHeight / 2) + 'px'
const styles = {
  panel: {
    zIndex: 99999,
    display: 'block',
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: halfViewportHeight,
    marginTop: '-0.' + halfViewportHeight,
    transition: 'margin-top 100ms ease-out 1ms',
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
