/* eslint-disable react/display-name */
import React from 'react'
import className from 'classnames'

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
          onChange={handleChange}
        />
      </div>
    )
  },
  ElementComponent: ({
    selectedLayer,
    base,
    height,
    fill,
    stroke,
    strokeWidth,
    handleDelete,
    id,
    index,
    setSelectedLayerId,
    setChanging,
    setRotating
  }) => {
    let deleteButtonDisplay = 'none'
    if (selectedLayer && selectedLayer.id === id) {
      deleteButtonDisplay = 'inline'
    }
    return (
      <div>
        <svg width={base + strokeWidth} height={height + strokeWidth}>
          <polygon
            stroke={stroke}
            strokeWidth={strokeWidth}
            points={`${base / 2 + strokeWidth / 4} ${strokeWidth /
              2}, ${strokeWidth / 2} ${height + strokeWidth / 2}, ${base +
              strokeWidth / 2} ${height + strokeWidth / 2}`}
            fill={fill}
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
          className="changeElement"
          style={{display: deleteButtonDisplay}}
          onMouseDown={() => {
            setSelectedLayerId(id)
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
            setSelectedLayerId(id)
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
    layerInitialPositionX,
    layerInitialPositionY
  ) => {
    const oldBase = prevX - layerInitialPositionX
    const oldHeight = prevY - layerInitialPositionY
    const movementX = clientX - prevX
    const movementY = clientY - prevY
    socket.emit('change', {
      ...selectedLayer,
      props: {
        ...selectedLayer.props,
        base: oldBase + movementX,
        height: oldHeight + movementY
      }
    })
  },
  handleRotate: (selectedLayer, socket, prevX, prevY, clientX, clientY) => {
    const movementX = clientX - prevX
    socket.emit('change', {
      ...selectedLayer,
      props: {
        ...selectedLayer.props,
        rotate: +Math.floor(movementX * 0.5)
      }
    })
  },
  handleCreate: (x, y, fill = 'black', uuid, socket, strokeColor) => {
    const data = {
      type: 'triangle',
      id: uuid,
      x: x - 5, //relative to canvas mouseX
      y,
      rotate: 0,
      props: {
        fill,
        base: 10,
        height: 10,
        stroke: strokeColor,
        strokeWidth: 5
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
