/* eslint-disable max-params */
/* eslint-disable react/display-name */
import React from 'react'

let _id = 0

export const rectangle = {
  name: 'rectangle',
  DimensionsComponent: selectedLayer => {
    return (
      <div>
        <label>Width</label>
        <input
          type="number"
          value={selectedLayer.props.width}
          onChange={event => {
            selectedLayer.onChange('width', event.target.value)
          }}
        />
        <label>Height</label>
        <input
          type="number"
          value={selectedLayer.props.height}
          onChange={event => {
            selectedLayer.onChange('height', event.target.value)
          }}
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
  handleDoubleClick: function(layers, setLayers, x, y, color, uuid, socket) {
    this.create(x, y, 40, 30, 'black', uuid, socket)
  },
  create: (
    x,
    y,
    width = '20px',
    height = '15px',
    fill = 'black',
    uuid,
    socket
  ) => {
    const data = {
      type: 'rectangle',
      x,
      y,
      id: uuid,
      props: {
        width,
        height,
        fill
      }
    }
    socket.emit('create', data)
  }
}
