/* eslint-disable react/display-name */
import React from 'react'

let _id = 0

const circle = {
  circle: {
    name: 'Circle',
    mongoObj: {_id, name: 'Circle', radius: props.layer.props.radius},
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
    handleDoubleClick: function(layers, layersRef, x, y, color) {
      layersRef.push(this.create(x, y, 10, color))
    },
    create: (x, y, radius = 10, fill = 'black') => {
      return {
        type: 'circle',
        x,
        y,
        props: {
          radius,
          fill,
        }
      }
    }
  }
}

export default circle
