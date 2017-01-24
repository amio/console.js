const React = require('react')

class PanelHistory extends React.Component {
  renderLogs (logs) {
    const els = []
    logs.forEach(log => {
      log.cmd && els.push(<dt style={styles.cmd}>{ log.cmd }</dt>)
      log.msg && els.push(<dd style={styles.msg}>{ log.msg }</dd>)
    })
    return els
  }
  render (props) {
    return (
      <dl style={styles.panelHistory}>
        { this.renderLogs(props.logs) }
      </dl>
    )
  }
}

const styles = {
  panelHistory: {
    margin: 0,
    padding: '2px 5px',
    boxSizing: 'border-box',
    position: 'absolute',
    width: '100%',
    letterSpacing: '.05em',
    bottom: '18px'
  },
  msg: {
    margin: 0,
    color: '#DDD'
  },
  cmd: {
    margin: 0,
    color: '#7E0'
  }
}

module.exports = PanelHistory
