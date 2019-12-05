/* eslint-disable react/display-name */
import React from 'react'
import {Input} from 'semantic-ui-react'
//svg then circle then shape.
//the circle's radius will be based off of the width and height
//and the shape will be based off of the radius and width and height. thats all we need.
//this also ensures that the shape will always be within the div due to its bounding circle
//based off number of sides we can calculate all the necessary points
//the polygon points attribute is passed a coordinate string that is generated using some quick maths.
//angle = 2 * pi / numPoints
// for (let i = 0; i < numPoints; i++)
// {
//     x = centerX + radius * sin(i * angle);
//     y = centerY + radius * cos(i * angle);
// } where centerXY are coordinates for center of circle. I am going to use selectedLayer.x and y for now.
export const polygon = {
  name: 'polygon',
  generatePoints: (props, x, y) => {
    let coordinateStr = ''
    let sides = props.sides
    let r = props.radius

    for (let i = 0; i < sides; i++) {
      coordinateStr += Math.round(
        props.strokeWidth + r + r * Math.sin(i * ((2 * Math.PI) / sides))
      ).toString()
      coordinateStr += ' '

      coordinateStr += Math.round(
        props.strokeWidth + r + r * Math.cos(i * ((2 * Math.PI) / sides))
      ).toString()
      if (i < sides - 1) coordinateStr += ', '
    }
    return coordinateStr
  },
  DimensionsComponent: (
    selectedLayer,
    handleChange,
    handleTextPropsChange,
    handleRotate
  ) => {
    return (
      <div>
        <label>Sides</label>
        <Input
          name="sides"
          type="number"
          value={selectedLayer.props.sides}
          onChange={handleChange}
        />
        <label>Radius</label>
        <Input
          name="radius"
          type="number"
          value={selectedLayer.props.radius}
          onChange={handleChange}
        />
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
  ElementComponent: props => {
    const {
      selectedLayer,
      stroke,
      strokeWidth,
      fill,
      handleDelete,
      x,
      y,
      id,
      index,
      setSelectedLayerIds,
      setChanging,
      setRotating
    } = props
    const points = polygon.generatePoints(props, x, y)
    let deleteButtonDisplay = 'none'
    if (selectedLayer && selectedLayer.id === id) {
      deleteButtonDisplay = 'inline'
    }
    const containerSize = props.radius * 2 + strokeWidth * 2
    return (
      <div>
        <svg width={containerSize} height={containerSize} className="polygon">
          <polygon
            points={points}
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
        <button
          name="rotate"
          type="button"
          className="rotateElement"
          style={{display: deleteButtonDisplay}}
          onMouseDown={() => {
            setSelectedLayerIds([id])
            setChanging(false)
            setRotating(true)
          }}
          onMouseUp={() => {
            setSelectedLayerIds([])
            setRotating(false)
          }}
        >
          <p style={{position: 'absolute', right: '3px', top: '-4px'}}>⤺</p>
        </button>
      </div>
    )
  },
  //when polygon is rotated upsidedown,
  //attempting to change size will bheave oddly, shrinking in size.
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
    const oldRadius = (prevX - layerInitialPositionX) / 2
    const oldWidth = prevX - layerInitialPositionX
    const oldHeight = prevY - layerInitialPositionY
    const movementX = clientX - prevX
    const movementY = clientY - prevY
    const newRadius = movementX / 2
    socket.emit('change', {
      ...selectedLayer,
      props: {
        ...selectedLayer.props,
        radius: oldRadius + newRadius,
        width: Math.abs(oldWidth + movementX),
        height: Math.abs(oldHeight + movementY)
      }
    })
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
  handleCreate: (x, y, fill, uuid, socket, strokeColor, roomName) => {
    const data = {
      type: 'polygon',
      id: uuid,
      x: x - 10,
      y,
      props: {
        radius: 10,
        stroke: strokeColor,
        strokeWidth: 3,
        fill,
        sides: 5,
        width: 20,
        height: 20,
        rotate: 0,
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
