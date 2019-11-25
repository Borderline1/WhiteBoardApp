/* eslint-disable react/display-name */
import React from 'react'

let _id = 0

export const rectangle = {
  name: 'Rectangle',
  DimensionsComponent: props => {
    return (
      <div>
        <label>Width</label>
        <input
          type="number"
          value={props.layer.props.width}
          onChange={event => {
            props.onChange('width', event.target.value)
          }}
        />
        <label>Height</label>
        <input
          type="number"
          value={props.layer.props.height}
          onChange={event => {
            props.onChange('height', event.target.value)
          }}
        />
      </div>
    )
  },
  ElementComponent: props => {
    return (
      <svg width={props.width} height={props.height}>
        <rectangle x={props.width} y={props.height} fill={props.fill} />
      </svg>
    )
  },
  handleDoubleClick: function(layers, setLayers, x, y, color, uuid) {
    setLayers([...layers, this.create(x, y, 20, 15, color, uuid)])
  },
  create: (x, y, width = '20px', height = '15px', fill = 'black', uuid) => {
    return {
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
  }
}
