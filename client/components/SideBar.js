import React, {Component} from 'react'
import {ChromePicker} from 'react-color'
import Tool from './Tool'

const SideBar = props => {
  return (
    <div
      style={{
        position: 'fixed',
        height: '100vh',
        width: '17.5vw',
        backgroundColor: 'lightgray',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '5px',
        zIndex: 100000
      }}
    >
      <div className="toolbox" style={{}}>
        <ChromePicker
          color={props.brushColor}
          onChangeComplete={props.handleColorChange}
        />
        {/* iterate over all tools instead of hard coding */}
        <Tool
          name="Eraser"
          currentTool={props.toolId}
          toolId="eraser"
          onSelect={props.handleToolClick}
        />
        <Tool
          name="Pen"
          currentTool={props.toolId}
          toolId="pen"
          onSelect={props.handleToolClick}
        />
        <code className="brush-size-label">
          Size ({String(props.brushSize)})
        </code>{' '}
        <input
          onChange={props.handleBrushResize}
          value={props.brushSize}
          type="range"
          min="1"
          max="50"
        />
        <span
          className="brush-size-indicator"
          style={{
            width: props.brushSize + 'px',
            height: props.brushSize + 'px',
            background: props.brushColor
          }}
        />
      </div>
    </div>
  )
}

export default SideBar
