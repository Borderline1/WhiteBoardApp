/* eslint-disable react/display-name */
import React from 'react'

let _id = 0

export const circle = {
  name: 'Circle',
  DimensionsComponent: props => {
    return (
      <div>
        <label>Radius</label>
        <input
          type="number"
          value={props.layer.props.radius}
          onChange={event => {
            props.onChange('radius', event.target.value)
          }}
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
  handleDoubleClick: function(layers, setLayers, x, y, color, uuid, socket) {
    setLayers([...layers, this.create(x, y, 20, color, uuid, socket)])
  },
  create: (x, y, radius = '10px', fill = 'black', uuid, socket) => {
    const data = {
      type: 'circle',
      x,
      y,
      id: uuid,
      props: {
        radius,
        fill
      }
    }
    socket.emit('create', data)
    return data
  }
}
