/* eslint-disable max-params */
/* eslint-disable react/display-name */
import React from 'react'
import {Input} from 'semantic-ui-react'

export const circle = {
  name: 'circle',
  DimensionsComponent: (selectedLayer, handleChange) => {
    return (
      <div>
        <label className="input-label">Radius</label>
        <Input
          className="input-input"
          min="0"
          name="radius"
          type="number"
          width="4"
          value={selectedLayer.props.radius}
          onChange={handleChange}
        />
        <label className="input-label">Stroke Width</label>
        <Input
          className="input-input"
          min="0"
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
    radius,
    fill,
    stroke,
    strokeWidth,
    id,
    handleDelete,
    index,
    setChanging,
    setSelectedLayerIds
  }) => {
    let deleteButtonDisplay = 'none'
    if (selectedLayer && selectedLayer.id === id) {
      deleteButtonDisplay = 'inline'
    }
    const containerSize = radius * 2 + strokeWidth
    const center = radius + strokeWidth / 2
    return (
      <div>
        <svg width={containerSize} height={containerSize}>
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill={fill}
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
          className="changeElement"
          style={{display: deleteButtonDisplay}}
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
    layerInitialPositionsXs
  ) => {
    const layerInitialPositionX = layerInitialPositionsXs[0]
    const oldRadius = (prevX - layerInitialPositionX) / 2
    const movementX = clientX - prevX
    const newRadius = movementX / 2
    socket.emit('change', {
      ...selectedLayer,
      props: {
        ...selectedLayer.props,
        radius: oldRadius + newRadius
      }
    })
  },
  handleCreate: (x, y, fill, uuid, socket, strokeColor, roomName) => {
    const data = {
      type: 'circle',
      x: x - 10,
      y: y - 10,
      id: uuid,
      props: {
        radius: 9,
        rotate: 0,
        fill,
        stroke: strokeColor,
        strokeWidth: 6,
        roomName: roomName
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
    const strokeAdd = selectedLayer.props.strokeWidth / 2
    const xdiff = prevX - clientX
    const ydiff = prevY - clientY
    const radius = Math.round(Math.sqrt(xdiff * xdiff + ydiff * ydiff))
    const xPos = prevX - radius - strokeAdd
    const yPos = prevY - radius - strokeAdd

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
