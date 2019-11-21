import React, {Component} from 'react'

export default class Tool extends Component {
  handleOnClick() {
    this.props.onSelect(this.props.toolId)
  }
  render() {
    return (
      <div
        onClick={this.handleOnClick.bind(this)}
        className={`tool-container ${
          this.props.currentTool === this.props.toolId
            ? 'tool-container--selected'
            : ''
        }`}
      >
        <code>{this.props.name}</code>
      </div>
    )
  }
}
