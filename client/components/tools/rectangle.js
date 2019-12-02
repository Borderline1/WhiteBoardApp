/* eslint-disable max-params */
/* eslint-disable react/display-name */
import React from 'react'
import className from 'classnames'

export const rectangle = {
  name: 'rectangle',
  DimensionsComponent: (selectedLayer, handleChange) => {
    return (
      <div>
        <label>Width</label>
        <input
          name="width"
          type="number"
          value={selectedLayer.props.width}
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
        <svg width={props.width} height={props.height}>
          <rect width={props.width} height={props.height} fill={props.fill} />
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
    socket.emit('change', {
      ...selectedLayer,
      props: {
        ...selectedLayer.props,
        width: movementX,
        height: movementY
      }
    })
  },
  handleCreate: (x, y, fill = 'black', uuid, socket) => {
    const data = {
      type: 'rectangle',
      x,
      y,
      id: uuid,
      rotate: 0,
      props: {
        width: 10,
        height: 10,
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
    const xPos = Math.min(prevX, clientX)
    const yPos = Math.min(prevY, clientY)
    const width = Math.abs(prevX - clientX)
    const height = Math.abs(prevY - clientY)
    if (selectedLayer) {
      socket.emit('change', {
        ...selectedLayer,
        x: xPos,
        y: yPos,
        props: {...selectedLayer.props, width, height}
      })
    }
  }
}
