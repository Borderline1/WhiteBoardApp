/* eslint-disable max-params */
/* eslint-disable react/display-name */
import React from 'react'

let _id = 0

export const line = {
  name: 'Line',
  DimensionsComponent: props => {
    return (
      <div>
        <label>Stroke Width</label>
        <input
          type="number"
          value={props.layer.props.strokeWidth}
          onChange={event => {
            props.onChange('stroke-width', event.target.value)
          }}
        />
      </div>
    )
  },
  ElementComponent: props => {
    return (
      <svg width={props.x1 - props.x2} height={props.y1 - props.y2}>
        <line x1={props.x1} x2={props.x2} y1={props.y1} y2={props.y2} stroke={props.fill} strokeWidth={props.strokeWidth} />
      </svg>
    )
  },
  handleDoubleClick: function(layers, setLayers, x, y, color, uuid) {
    setLayers([...layers, this.create(x, y, x - 20, y - 15, color, uuid)])
  },
  create: (x, y, x2, y2, fill = 'black', strokeWidth = 2, uuid) => {
    return {
      type: 'line',
      x,
      y,
      id: uuid,
      props: {
        x1: x,
        y1: y,
        x2,
        y2,
        strokeWidth,
        fill
      }
    }
  }
}
