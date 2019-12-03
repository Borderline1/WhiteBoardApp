/* eslint-disable complexity */
/* eslint-disable max-params */
/* eslint-disable react/display-name */
import React from 'react'
import className from 'classnames'

export const rectangle = {
  name: 'rectangle',
  DimensionsComponent: (
    selectedLayer,
    handleChange,
    handleTextPropsChange,
    handleRotate
  ) => {
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
        <label>Stroke Width</label>
        <input
          name="strokeWidth"
          type="number"
          value={selectedLayer.props.strokeWidth}
          onChange={handleChange}
        />
        <label>Rotate</label>
        <input
          name="rotate"
          type="number"
          value={selectedLayer.props.rotate}
          onChange={handleRotate}
        />
      </div>
    )
  },
  ElementComponent: ({
    selectedLayer,
    width,
    height,
    fill,
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
    setSelectedLayerIds,
    setChanging,
    setRotating
  }) => {
    let deleteButtonDisplay = 'none'
    if (selectedLayer && selectedLayer.id === id) {
      deleteButtonDisplay = 'inline'
    }
    return (
      <div>
        <svg width={width + strokeWidth} height={height + strokeWidth}>
          <rect
            x={strokeWidth / 2}
            y={strokeWidth / 2}
            width={width}
            height={height}
            fill={fill}
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
        <div
          className="rotateElement"
          style={{display: deleteButtonDisplay}}
          onMouseDown={() => {
            setSelectedLayerIds([id])
            setChanging(false)
            setRotating(true)
          }}
          onMouseUp={() => {
            setRotating(false)
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
          width: width,
          height: height,
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
          width: width,
          height: height,
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
          width: width,
          height: height,
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
          width: width,
          height: height,
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
  handleRotate: (selectedLayer, socket, prevX, prevY, clientX, clientY) => {
    const movementX = clientX - prevX
    const movementY = clientY - prevY
    socket.emit('change', {
      ...selectedLayer,
      props: {
        ...selectedLayer.props,
        rotate: +Math.floor(movementX * 0.5 - movementY * 0.5)
      }
    })
  },
  handleCreate: (x, y, fill = 'black', uuid, socket, strokeColor) => {
    const data = {
      type: 'rectangle',
      x,
      y,
      id: uuid,
      props: {
        width: 10,
        height: 10,
        rotate: 0,
        fill,
        stroke: 'black',
        strokeWidth: 5,
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
