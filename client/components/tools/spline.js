/* eslint-disable react/display-name */
import React from 'react'
import {Input} from 'semantic-ui-react'

export const spline = {
  name: 'spline',
  handleMouseMove: (selectedLayer, newX, newY, socket) => {
    const {coordArr, oldX, oldY, initialX, initialY} = selectedLayer.props
    const splineData = {
      type: 'l',
      x: newX - oldX,
      y: newY - oldY
    }

    const newOldX = newX
    const newOldY = newY

    let xValue = coordArr.reduce((acc, currPoint) => {
      return acc + currPoint.x
    }, selectedLayer.x)
    let yValue = coordArr.reduce((acc, currPoint) => {
      return acc + currPoint.y
    }, selectedLayer.y)

    newX = Math.min(selectedLayer.x, xValue)
    newY = Math.min(selectedLayer.y, yValue)

    let maxX = 0
    let maxY = 0
    let currX = maxX
    let currY = maxY
    for (let i = 1; i < coordArr.length; i++) {
      currX += coordArr[i].x
      currY += coordArr[i].y
      if (currX > maxX) {
        maxX = currX
      }
      if (currY > maxY) {
        maxY = currY
      }
    }

    const newWidth = maxX + initialX - newX + selectedLayer.props.strokeWidth
    const newHeight = maxY + initialY - newY + selectedLayer.props.strokeWidth
    const middlePoints = coordArr.slice(1)
    socket.emit('change', {
      ...selectedLayer,
      x: newX,
      y: newY,
      props: {
        ...selectedLayer.props,
        width: newWidth,
        height: newHeight,
        oldX: newOldX,
        oldY: newOldY,
        coordArr: [
          {type: 'M', x: initialX - newX, y: initialY - newY},
          ...middlePoints,
          splineData
        ]
      }
    })
  },
  DimensionsComponent: (
    selectedLayer,
    handleChange,
    handleTextPropsChange,
    handleRotate
  ) => {
    return (
      <div>
        <label>Rotate</label>
        <Input
          name="rotate"
          type="number"
          value={selectedLayer.props.rotate}
          onChange={handleRotate}
        />
        <label>Stroke Width</label>
        <Input
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
    fill,
    stroke,
    strokeWidth,
    id,
    handleDelete,
    index,
    setRotating,
    setChanging,
    coordArr
  }) => {
    let deleteButtonDisplay = 'none'
    if (selectedLayer && selectedLayer.id === id) {
      deleteButtonDisplay = 'inline'
    }
    let pointString = ''
    for (let coord of coordArr) {
      pointString += ` ${coord.type} ${coord.x} ${coord.y}`
    }
    return (
      <div>
        <svg width={width} height={height}>
          <path
            d={pointString}
            stroke={stroke}
            fill={fill}
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
        <button
          name="rotate"
          type="button"
          className="rotateElement"
          style={{display: deleteButtonDisplay}}
          onMouseDown={() => {
            setChanging(false)
            setRotating(true)
          }}
          onMouseUp={() => {
            setRotating(false)
          }}
        >
          <p style={{position: 'absolute', right: '3px', top: '-4px'}}>⤺</p>
        </button>
      </div>
    )
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
  handleCreate: (x, y, fill, uuid, socket, strokeColor) => {
    const data = {
      type: 'spline',
      x: x,
      y: y,
      id: uuid,
      rotate: 0,
      props: {
        fill: 'transparent',
        stroke: strokeColor,
        strokeWidth: 10,
        width: 10,
        height: 10,
        initialX: x,
        initialY: y,
        oldX: x,
        oldY: y,
        coordArr: [{type: 'M', x: 0, y: 0}],
        rotate: 0
      }
    }
    socket.emit('create', data)
  }
}
