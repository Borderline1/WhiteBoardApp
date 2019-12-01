import React from 'react'
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
        r + r * Math.sin(i * ((2 * Math.PI) / sides))
      ).toString()
      coordinateStr += ' '

      coordinateStr += Math.round(
        r + r * Math.cos(i * ((2 * Math.PI) / sides))
      ).toString()
      if (i < sides - 1) coordinateStr += ', '
    }
    return coordinateStr
  },
  DimensionsComponent: (selectedLayer, handleChange) => {
    return (
      <div>
        <label>Sides</label>
        <input
          name="sides"
          type="number"
          value={selectedLayer.props.sides}
          onChange={handleChange}
        />
        <label>Radius</label>
        <input
          name="radius"
          type="number"
          value={selectedLayer.props.radius}
          onChange={handleChange}
        />
      </div>
    )
  },
  ElementComponent: (props, handleChange, selectedLayer, socket, x, y) => {
    const points = polygon.generatePoints(props, x, y)
    console.log(points)
    return (
      <svg width={props.radius * 2} height={props.radius * 2}>
        {/* <circle
          cx={props.radius}
          cy={props.radius}
          r={props.radius}
          fill="none"
          stroke="none"
        > */}
        <polygon points={points} fill={props.fill} stroke={props.stroke} />
        {/* </circle> */}
      </svg>
    )
  },

  handleCreate: (x, y, fill, uuid, socket) => {
    const data = {
      type: 'polygon',
      id: uuid,
      x: x - 10,
      y,
      props: {
        radius: 10,
        fill,
        sides: 5,
        width: 20,
        height: 20
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
