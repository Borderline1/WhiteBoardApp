/* eslint-disable max-params */
/* eslint-disable react/display-name */
import React from 'react'

export const rectangle = {
  name: 'rectangle',
  DimensionsComponent: (selectedLayer, handleChange) => {
    return (
      <div>
        <label>Width</label>
        <input
          name="width"
          type="number"
          value={selectedLayer.props.width}
          onChange={handleChange}
        />
        <label>Height</label>
        <input
          name="height"
          type="number"
          value={selectedLayer.props.height}
          onChange={handleChange}
        />
        <label>Stroke Width</label>
        <input
          name="strokeWidth"
          type="number"
          value={selectedLayer.props.strokeWidth}
          onChange={handleChange}
        />
      </div>
    )
  },
  ElementComponent: ({
    selectedLayer,
    width,
    height,
    fill,
    stroke,
    strokeWidth,
    handleDelete,
    id,
    index
  }) => {
    let deleteButtonDisplay = 'none'
    if (selectedLayer && selectedLayer.id === id) {
      deleteButtonDisplay = 'inline'
    }
    return (
      <div>
        <svg width={width + strokeWidth} height={height + strokeWidth}>
          <rect
            x={strokeWidth / 2}
            y={strokeWidth / 2}
            width={width}
            height={height}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
        </svg>
        <button
          name="X"
          type="button"
          className="deleteElement"
          style={{display: deleteButtonDisplay}}
          onClick={() => {
            handleDelete(index)
          }}
        >
          <p style={{position: 'absolute', left: '4px', top: '-4px'}}>x</p>
        </button>
      </div>
    )
  },
  handleCreate: (x, y, fill = 'black', uuid, socket) => {
    const data = {
      type: 'rectangle',
      x,
      y,
      id: uuid,
      rotate: 0,
      props: {
        width: 10,
        height: 10,
        fill,
        stroke: 'black',
        strokeWidth: 5
      }
    }
    socket.emit('create', data)
  },
  handleCreatingUpdate: (
    selectedLayer,
    prevX,
    prevY,
    clientX,
    clientY,
    socket
  ) => {
    const xPos = Math.min(prevX, clientX)
    const yPos = Math.min(prevY, clientY)
    const width = Math.abs(prevX - clientX)
    const height = Math.abs(prevY - clientY)
    if (selectedLayer) {
      socket.emit('change', {
        ...selectedLayer,
        x: xPos,
        y: yPos,
        props: {...selectedLayer.props, width, height}
      })
    }
  }
}
