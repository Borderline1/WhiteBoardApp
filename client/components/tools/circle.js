/* eslint-disable react/display-name */
import React from 'react'

let _id = 0

export const circle = {
  name: 'circle',
  DimensionsComponent: selectedLayer => {
    return (
      <div>
        <label>Radius</label>
        <input
          type="number"
          value={selectedLayer.props.radius}
          onChange={event => {
            selectedLayer.onChange('radius', event.target.value)
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
    // setLayers([...layers, this.create(x, y, 20, color, uuid, socket)])
    this.create(x, y, 20, color, uuid, socket)
  },
  create: (x, y, radius = '10px', fill = 'black', uuid, socket) => {
    console.log('creating')
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
