/* eslint-disable max-params */
/* eslint-disable react/display-name */
import React from 'react'

let _id = 0

export const lineDrag = {
  name: 'lineDrag',
  DimensionsComponent: selectedLayer => {
    return (
      <div>
        <label>Stroke Width</label>
        <input
          type="number"
          value={selectedLayer.strokeWidth}
          onChange={event => {
            selectedLayer.onChange('stroke-width', event.target.value)
          }}
        />
      </div>
    )
  },
  ElementComponent: props => {
    return (
      <svg width={1} height={1}>
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
    this.create(x, y, 1, 1, 'black', uuid, socket)
  },
  create: (x, y, x2, y2, fill = `black`, uuid, socket, strokeWidth = 3) => {
    console.log(x, y, x2, y2)
    const data = {
      type: 'lineDrag',
      x,
      y,
      id: uuid,
      props: {
        x1: 0,
        y1: 0,
        x2: x2,
        y2: y2,
        fill,
        strokeWidth
      }
    }
    socket.emit('create', data)
    return data
  }
}
