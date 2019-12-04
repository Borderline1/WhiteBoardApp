/* eslint-disable react/display-name */
import React from 'react'
import {Input} from 'semantic-ui-react'
//onMouseDown we start with that x, y
//how do we get?
//prevx - clientx is new x
//prevy - clienty is new y
export const spline = {
  name: 'spline',
  coordArr: [],
  pointString: 'M ',
  handleMouseMove: (newX, newY, socket) => {
    // const arrCopy = spline.pointString.slice(-5)
    // const oldX = arrCopy[arrCopy.length - 1]
    // const oldY = arrCopy[arrCopy.length - 2]
    // spline.pointString +=
    //   ' L ' +
    //   (Number(oldX) * 2 - newX).toString() +
    //   ' ' +
    //   (Number(oldY) * 2 - newY).toString()
    const oldX = coordArr[coordArr.length - 2]
    const oldY = coordArr[coordArr.length - 1]

    spline.updateCoordArr(2 * oldX - newX, 2 * oldY - newY)
    socket.emit('change', {})
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
      setSelectedLayerIds
    } = props
    // let deleteButtonDisplay = 'none'
    // if (selectedLayer && selectedLayer.id === id) {
    //   deleteButtonDisplay = 'inline'
    // }
    // for (let i = 0; i < spline.pointString.length; i += 2) {
    //   if (i === 0) {

    //   }
    // }
    return (
      <div>
        <svg width="100" height="100">
          <path d={points} stroke={stroke} />
        </svg>
      </div>
    )
  },
  updateCoordArr: (x, y) => {
    const data = {
      x,
      y
    }
    spline.coordArr.push(data)
  },
  handleCreate: (x, y, fill, uuid, socket, strokeColor) => {
    //x and y are mouseX + window.scrollX and mouseY + window.scrollY
    const data = {
      type: 'spline',
      x: x,
      y: y,
      id: uuid,
      rotate: 0,
      props: {
        fill: 'transparent',
        stroke: 'black',
        strokeWidth: 6,
        initialX: x,
        initialY: y,
        coordArr: spline.coordArr
      }
    }
    // spline.pointString += x + ' ' + y
    spline.updateCoordArr(x, y)
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
