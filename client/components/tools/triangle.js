/* eslint-disable react/display-name */
import React from 'react'

export const triangle = {
  name: 'triangle',
  DimensionsComponent: (selectedLayer, handleChange) => {
    return (
      <div>
        <label>Base</label>
        <input
          name="base"
          type="number"
          value={selectedLayer.props.base}
          onChange={handleChange}
        />
        <label>Height</label>
        <input
          name="height"
          type="number"
          value={selectedLayer.props.height}
          onChange={handleChange}
        />
      </div>
    )
  },
  ElementComponent: props => {
    return (
      <div>
        <svg width={props.base} height={props.height}>
          <polygon
            points={`${props.base / 2} 0, 0 ${props.height}, ${props.base} ${
              props.height
            }`}
            fill={props.fill}
          />
        </svg>
        <button
          name="X"
          type="button"
          className="deleteElement"
          onClick={() => {
            props.handleDelete(props.index)
          }}
        >
          <p style={{position: 'absolute', left: '4px', top: '-4px'}}>x</p>
        </button>
      </div>
    )
  },
  handleCreate: (x, y, fill = 'black', uuid, socket) => {
    const data = {
      type: 'triangle',
      id: uuid,
      x: x - 5, //relative to canvas mouseX
      y,
      rotate: 0,
      props: {
        fill,
        base: 10,
        height: 10
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
    const xdiff = Math.abs(prevX - clientX)
    const ydiff = Math.abs(prevY - clientY)
    let base = xdiff * 2
    let height = ydiff
    const xPos = prevX - xdiff
    const yPos = Math.min(prevY, clientY)

    if (selectedLayer) {
      socket.emit('change', {
        ...selectedLayer,
        x: xPos,
        y: yPos,
        props: {...selectedLayer.props, base, height}
      })
    }
  }
}
