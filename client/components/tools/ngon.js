import React from 'react'
//svg then circle then shape.
//the circle's radius will be based off of the width and height
//and the shape will be based off of the radius and width and height. thats all we need.
//this also ensures that the shape will always be within the div.
//based off number of sides we can calculate all the necessary points
//we can use an array to store all the coordinates and join it etc to fit the format of the points attribute
//on the polygon svg element.
//prevx&y calculations might get a little hairy.
//loop through the sides and then push to coords array
//angle = 2 * pi / numPoints
// for (let i = 0; i < numPoints; i++)
// {
//     x = centerX + radius * sin(i * angle);
//     y = centerY + radius * cos(i * angle);
// } where centerXY are coordinates for center of circle.
export const ngon = {
  name: 'polygon',
  // coords: [], //subject to move
  // converted: ``,
  makeConverted: () => {
    let coordinateStr = ''
    let sides = selectedLayer.props.sides
    //am i using this context properly for getAngle?
    for (let i = 0; i < sides; i++) {
      coordinateStr += (
        selectedLayer.x +
        props.radius * Math.sin(i * ((2 * Math.PI) / sides))
      ).toString()

      coordinateStr += ' '

      coordinateStr += (
        selectedLayer.y +
        props.radius * Math.cos(i * ((2 * Math.PI) / sides))
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
  ElementsComponent: props => {
    console.log(name) //if works we can use coords
    return (
      <svg width={props.radius * 2} height={props.radius * 2}>
        <circle
          cx={props.radius}
          cy={props.radius}
          r={props.radius}
          fill="none"
          stroke="none"
        >
          <polygon points={this.makeConverted()} fill={props.fill} />
        </circle>
      </svg>
    )
  },
  handleCreate: (x, y, fill, uuid, socket) => {
    const data = {
      type: 'polygon',
      id: uuid,
      x: x - props.radius,
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
