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
          type="number"
          value={selectedLayer.props.width}
          onChange={handleChange}
        />
        <label>Height</label>
        <input
          type="number"
          value={selectedLayer.props.height}
          onChange={handleChange}
        />
      </div>
    )
  },
  ElementComponent: props => {
    return (
      <svg width={props.width} height={props.height}>
        <rect width={props.width} height={props.height} fill={props.fill} />
      </svg>
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
        fill
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
