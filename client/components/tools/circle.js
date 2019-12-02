/* eslint-disable react/display-name */
import React from 'react'
import {PromiseProvider} from 'mongoose'
import className from 'classnames'

export const circle = {
  name: 'circle',
  DimensionsComponent: (selectedLayer, handleChange) => {
    return (
      <div>
        <label>Radius</label>
        <input
          name="radius"
          type="number"
          value={selectedLayer.props.radius}
          onChange={handleChange}
        />
      </div>
    )
  },
  ElementComponent: props => {
    return (
      <div>
        <svg width={props.radius * 2} height={props.radius * 2}>
          <circle
            cx={props.radius}
            cy={props.radius}
            r={props.radius}
            fill={props.fill}
          />
        </svg>
        <button
          name="X"
          type="button"
          className={className('deleteElement', {
            visible: props.id === props.selectedLayerId
          })}
          onClick={() => {
            props.handleDelete(props.index)
          }}
        >
          <p style={{position: 'absolute', left: '4px', top: '-4px'}}>x</p>
        </button>
        <div
          id="canvas"
          className="changeElement"
          // onClick={() => {
          //   props.setSelectedLayerId(props.id)
          //   console.log('clicky')
          // }}
          onMouseDown={() => {
            props.setSelectedLayerId(props.id)
            props.setChanging(true)
            console.log('down')
          }}
          onMouseUp={() => {
            props.setChanging(false)
            console.log('up')
          }}
        />
      </div>
    )
  },
  handleChange: (clientX, clientY, prevX, prevY, socket, selectedLayer) => {
    const movementX = clientX - prevX
    const movementY = clientY - prevY
    const newRadius = movementX / 2
    socket.emit('change', {
      ...selectedLayer,
      props: {
        ...selectedLayer.props,
        radius: newRadius,
        width: movementX,
        height: movementY
      }
    })
  },
  handleCreate: (x, y, fill, uuid, socket) => {
    const data = {
      type: 'circle',
      x: x - 10,
      y: y - 10,
      id: uuid,
      rotate: 0,
      props: {
        radius: 10,
        fill
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
    const xdiff = prevX - clientX
    const ydiff = prevY - clientY
    const radius = Math.round(Math.sqrt(xdiff * xdiff + ydiff * ydiff))
    const xPos = prevX - radius
    const yPos = prevY - radius

    if (selectedLayer) {
      socket.emit('change', {
        ...selectedLayer,
        x: xPos,
        y: yPos,
        props: {...selectedLayer.props, radius}
      })
    }
  }
}
