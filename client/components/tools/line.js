/* eslint-disable complexity */
/* eslint-disable max-params */
/* eslint-disable react/display-name */
import React from 'react'

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
    deleteTop,
    deleteBottom,
    deleteRight,
    deleteLeft,
    changeTop,
    changeBottom,
    changeRight,
    changeLeft,
    changeRadius,
    id,
    index,
    x1,
    x2,
    y1,
    y2,
    setSelectedLayerIds,
    setChanging
  }) => {
    let deleteButtonDisplay = 'none'
    if (selectedLayer && selectedLayer.id === id) {
      deleteButtonDisplay = 'inline'
    }
    const containerWidth = width + strokeWidth * 2
    const containerHeight = height + strokeWidth
    return (
      <div>
        <svg width={containerWidth} height={containerHeight}>
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
          className="deleteLineRect"
          style={{
            display: deleteButtonDisplay,
            top: deleteTop,
            bottom: deleteBottom,
            right: deleteRight,
            left: deleteLeft
          }}
          onClick={() => {
            handleDelete(index)
          }}
        >
          <p style={{position: 'absolute', left: '4px', top: '-4px'}}>x</p>
        </button>
        <div
          className="changeLineRect"
          style={{
            display: deleteButtonDisplay,
            top: changeTop,
            bottom: changeBottom,
            right: changeRight,
            left: changeLeft,
            borderRadius: changeRadius
          }}
          onMouseDown={() => {
            setSelectedLayerIds([id])
            setChanging(true)
          }}
          onMouseUp={() => {
            setChanging(false)
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
    layerInitialPositionXs,
    layerInitialPositionYs
  ) => {
    const layerInitialPositionX = layerInitialPositionXs[0]
    const layerInitialPositionY = layerInitialPositionYs[0]
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
          x1: 2,
          y1: 2,
          x2: width - 0.5,
          y2: height - 0.5,
          deleteTop: '-6px',
          deleteBottom: '',
          deleteRight: '-8px',
          deleteLeft: '',
          changeTop: '',
          changeBottom: '-6px',
          changeRight: '-8px',
          changeLeft: '',
          changeRadius: '100% 100% 0 100%'
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
          x1: width - 0.5,
          y1: height - 0.5,
          x2: 2,
          y2: 2,
          deleteTop: '-6px',
          deleteBottom: '',
          deleteRight: '-8px',
          deleteLeft: '',
          changeTop: '-6px',
          changeBottom: '',
          changeRight: '',
          changeLeft: '-8px',
          changeRadius: '0 100% 100% 100%'
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
          x1: width - 0.5,
          y1: 2,
          x2: 2,
          y2: height - 0.5,
          deleteTop: '',
          deleteBottom: '-6px',
          deleteRight: '-8px',
          deleteLeft: '',
          changeTop: '-6px',
          changeBottom: '',
          changeRight: '-8px',
          changeLeft: '',
          changeRadius: '100% 0 100% 100%'
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
          x1: 2,
          y1: height - 0.5,
          x2: width - 0.5,
          y2: 2,
          deleteTop: '-6px',
          deleteBottom: '',
          deleteRight: '-8px',
          deleteLeft: '',
          changeTop: '',
          changeBottom: '-6px',
          changeRight: '',
          changeLeft: '-8px',
          changeRadius: '100% 100% 100% 0%'
        }
      })
    }
  },
  handleCreate: (x, y, fill = '#000000', uuid, socket, strokeColor) => {
    const data = {
      type: 'line',
      x,
      y,
      id: uuid,
      props: {
        x1: 2,
        y1: 2,
        x2: 3,
        y2: 3,
        stroke: strokeColor,
        strokeWidth: 3,
        height: 4,
        width: 4,
        deleteTop: '-6px',
        deleteBottom: '',
        deleteRight: '-8px',
        deleteLeft: '',
        changeTop: '',
        changeBottom: '-6px',
        changeRight: '-8px',
        changeLeft: '',
        changeRadius: '100% 100% 0 100%'
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
            x1: 2,
            y1: 2,
            x2: width - 0.5,
            y2: height - 0.5,
            deleteTop: '-6px',
            deleteBottom: '',
            deleteRight: '-8px',
            deleteLeft: '',
            changeTop: '',
            changeBottom: '-6px',
            changeRight: '-8px',
            changeLeft: '',
            changeRadius: '100% 100% 0 100%'
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
            x1: width - 0.5,
            y1: height - 0.5,
            x2: 2,
            y2: 2,
            deleteTop: '-6px',
            deleteBottom: '',
            deleteRight: '-8px',
            deleteLeft: '',
            changeTop: '-6px',
            changeBottom: '',
            changeRight: '',
            changeLeft: '-8px',
            changeRadius: '0 100% 100% 100%'
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
            x1: width - 0.5,
            y1: 2,
            x2: 2,
            y2: height - 0.5,
            deleteTop: '',
            deleteBottom: '-6px',
            deleteRight: '-8px',
            deleteLeft: '',
            changeTop: '-6px',
            changeBottom: '',
            changeRight: '-8px',
            changeLeft: '',
            changeRadius: '100% 0 100% 100%'
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
            x1: 2,
            y1: height - 0.5,
            x2: width - 0.5,
            y2: 2,
            deleteTop: '-6px',
            deleteBottom: '',
            deleteRight: '-8px',
            deleteLeft: '',
            changeTop: '',
            changeBottom: '-6px',
            changeRight: '',
            changeLeft: '-8px',
            changeRadius: '100% 100% 100% 0%'
          }
        })
      }
    }
  }
}
