/* eslint-disable complexity */
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
      <svg width={props.width} height={props.height}>
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
    this.create(x, y, x + 40, y + 30, color, uuid, socket)
  },
  create: (x, y, x2, y2, fill = '#000000', uuid, socket, strokeWidth = 3) => {
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
  },
  handleCreate: (x, y, fill = '#000000', uuid, socket) => {
    const data = {
      type: 'line',
      x,
      y,
      id: uuid,
      props: {
        x1: 0,
        y1: 0,
        x2: 3,
        y2: 3,
        fill,
        strokeWidth: 3,
        height: 3,
        width: 3
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
      if (clientX > prevX && clientY > prevY) {
        socket.emit('change', {
          ...selectedLayer,
          x: xPos,
          y: yPos,
          props: {
            ...selectedLayer.props,
            width,
            height,
            x1: 0,
            y1: 0,
            x2: width,
            y2: height
          }
        })
      }
      if (clientX < prevX && clientY < prevY) {
        socket.emit('change', {
          ...selectedLayer,
          x: xPos,
          y: yPos,
          props: {
            ...selectedLayer.props,
            width,
            height,
            x1: width,
            y1: height,
            x2: 0,
            y2: 0
          }
        })
      }
      if (clientX > prevX && clientY < prevY) {
        socket.emit('change', {
          ...selectedLayer,
          x: xPos,
          y: yPos,
          props: {
            ...selectedLayer.props,
            width,
            height,
            x1: width,
            y1: 0,
            x2: 0,
            y2: height
          }
        })
      }
      if (clientX < prevX && clientY > prevY) {
        socket.emit('change', {
          ...selectedLayer,
          x: xPos,
          y: yPos,
          props: {
            ...selectedLayer.props,
            width,
            height,
            x1: 0,
            y1: height,
            x2: width,
            y2: 0
          }
        })
      }
    }
  }
}
