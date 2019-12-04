/* eslint-disable react/display-name */
import React from 'react'
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
    }, initialX)
    let yValue = coordArr.reduce((acc, currPoint) => {
      return acc + currPoint.y
    }, initialY)

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

    const newWidth = maxX + initialX - newX
    const newHeight = maxY + initialY - newY
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
  DimensionsComponent: () => {
    return <div />
  },
  ElementComponent: props => {
    const {
      selectedLayer,
      radius,
      fill,
      stroke,
      strokeWidth,
      id,
      handleDelete,
      index,
      setChanging,
      setSelectedLayerIds,
      coordArr
    } = props
    // let deleteButtonDisplay = 'none'
    // if (selectedLayer && selectedLayer.id === id) {
    //   deleteButtonDisplay = 'inline'
    // }
    // for (let i = 0; i < spline.pointString.length; i += 2) {
    //   if (i === 0) {

    //   }
    // }
    let pointString = ''
    for (let coord of coordArr) {
      pointString += ` ${coord.type} ${coord.x} ${coord.y}`
    }
    return (
      <div>
        <svg width={props.width} height={props.height}>
          <path
            d={pointString}
            stroke={stroke}
            fill={fill}
            strokeWidth={strokeWidth}
          />
        </svg>
      </div>
    )
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
        stroke: 'black',
        strokeWidth: 10,
        width: 10,
        height: 10,
        initialX: x,
        initialY: y,
        oldX: x,
        oldY: y,
        coordArr: [{type: 'M', x: 0, y: 0}]
      }
    }
    socket.emit('create', data)
  }
  //   handleChange: (
  //     clientX,
  //     clientY,
  //     prevX,
  //     prevY,
  //     socket,
  //     selectedLayer,
  //     layerInitialPositionsXs
  //   ) => {
  //     const layerInitialPositionX = layerInitialPositionsXs[0]
  //     const oldRadius = (prevX - layerInitialPositionX) / 2
  //     const movementX = clientX - prevX
  //     const newRadius = movementX / 2
  //     socket.emit('change', {
  //       ...selectedLayer,
  //       props: {
  //         ...selectedLayer.props,
  //         radius: oldRadius + newRadius
  //       }
  //     })
  //   },

  //   handleCreatingUpdate: (
  //     selectedLayer,
  //     prevX,
  //     prevY,
  //     clientX,
  //     clientY,
  //     socket
  //   ) => {
  //     spline.coordArr.push(clientX)
  //     spline.coordArr.push(clientY)
  //     const xdiff = prevX - clientX
  //     const ydiff = prevY - clientY
  //     const xPos = clientX
  //     const yPos = clientY
  //     for (let i = 0; spline.coordArr.length; i++) {}

  //     if (selectedLayer) {
  //       socket.emit('change', {
  //         ...selectedLayer,
  //         y: xPos,
  //         x: yPos,
  //         props: {...selectedLayer.props}
  //       })
  //     }
  //   }
}
