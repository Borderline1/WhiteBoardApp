/* eslint-disable max-params */
/* eslint-disable react/display-name */
import React from 'react'

let _id = 0

export const line = {
  name: 'line',
  DimensionsComponent: selectedLayer => {
    return (
      <div>
        <label>Stroke Width</label>
        <input
          type="number"
          value={selectedLayer.strokeWidth}
          onChange={event => {
            selectedLayer.onChange('strokeWidth', event.target.value)
          }}
        />
      </div>
    )
  },
  ElementComponent: props => {
    return (
      <svg width={40} height={30}>
        <line
          x1={props.x1}
          x2={props.x2}
          y1={props.y1}
          y2={props.y2}
          stroke={props.fill}
          strokeWidth={props.strokeWidth}
        />
      </svg>
    )
  },
  handleDoubleClick: function(layers, setLayers, x, y, color, uuid, socket) {
    // console.log(color)
    this.create(x, y, x + 40, y + 30, 'black', uuid, socket)
  },
  create: (x, y, x2, y2, fill = `black`, uuid, socket, strokeWidth = 3) => {
    // console.log(fill)
    const data = {
      type: 'line',
      x,
      y,
      id: uuid,
      props: {
        x1: 0,
        y1: 0,
        x2: 40,
        y2: 30,
        fill,
        strokeWidth
      }
    }
    socket.emit('create', data)
  }
}
