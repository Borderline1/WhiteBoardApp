/* eslint-disable react/display-name */
import React from 'react'

let _id = 0

export const circle = {
  name: 'circle',
  DimensionsComponent: (selectedLayer, handleChange) => {
    return (
      <div>
        <label>Radius</label>
        <input
          name="radius"
          type="number"
          value={selectedLayer.props.radius}
          onChange={handleChange}
        />
      </div>
    )
  },
  ElementComponent: props => {
    return (
      <svg width={props.radius * 2} height={props.radius * 2}>
        <circle
          cx={props.radius}
          cy={props.radius}
          r={props.radius}
          fill={props.fill}
        />
      </svg>
    )
  },
  handleCreate: (x, y, fill, uuid, socket) => {
    const data = {
      type: 'circle',
      x: x - 10,
      y: y - 10,
      id: uuid,
      props: {
        radius: 10,
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
    const xdiff = prevX - clientX
    const ydiff = prevY - clientY
    const radius = Math.round(Math.sqrt(xdiff * xdiff + ydiff * ydiff))
    const xPos = prevX - radius
    const yPos = prevY - radius

    if (selectedLayer) {
      socket.emit('change', {
        ...selectedLayer,
        x: xPos,
        y: yPos,
        props: {...selectedLayer.props, radius}
      })
    }
  }
}
