/* eslint-disable complexity */
/* eslint-disable max-params */
/* eslint-disable react/display-name */
import React from 'react'
import className from 'classnames'

// let _id = 0

export const line = {
  name: 'line',
  DimensionsComponent: (selectedLayer, handleChange) => {
    return (
      <div>
        <label>Stroke Width</label>
        <input
          name="strokeWidth"
          type="number"
          value={selectedLayer.props.strokeWidth}
          onChange={handleChange}
        />
      </div>
    )
  },
  ElementComponent: ({
    selectedLayer,
    width,
    height,
    stroke,
    strokeWidth,
    handleDelete,
    id,
    index,
    x1,
    x2,
    y1,
    y2
  }) => {
    let deleteButtonDisplay = 'none'
    if (selectedLayer && selectedLayer.id === id) {
      deleteButtonDisplay = 'inline'
    }
    return (
      <div>
        <svg width={width} height={height}>
          <line
            x1={x1}
            x2={x2}
            y1={y1}
            y2={y2}
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
        </svg>
        <button
          name="X"
          type="button"
          className="deleteElement"
          style={{display: deleteButtonDisplay}}
          onClick={() => {
            handleDelete(index)
          }}
        >
          <p style={{position: 'absolute', left: '4px', top: '-4px'}}>x</p>
        </button>
        <div
          id="canvas"
          className="changeLine"
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
  handleChange: (
    clientX,
    clientY,
    prevX,
    prevY,
    socket,
    selectedLayer,
    layerInitialPositionX,
    layerInitialPositionY
  ) => {
    const xPos = Math.min(layerInitialPositionX, clientX)
    const yPos = Math.min(layerInitialPositionY, clientY)
    const width = Math.abs(layerInitialPositionX - clientX)
    const height = Math.abs(layerInitialPositionY - clientY)

    if (clientX > layerInitialPositionX && clientY > layerInitialPositionY) {
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
    if (clientX < layerInitialPositionX && clientY < layerInitialPositionY) {
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
    if (clientX > layerInitialPositionX && clientY < layerInitialPositionY) {
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
    if (clientX < layerInitialPositionX && clientY > layerInitialPositionY) {
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
        stroke: 'black',
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
