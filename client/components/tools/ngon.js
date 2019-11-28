import React from 'react'

//svg then circle then shape.
//the circle's radius will be based off of the width and height
//and the shape will be based off of the radius and width and height. thats all we need.
//this also ensures that the shape will always be within the div.
//based off number of sides we can calculate all the necessary points
//we can use an array to store all the coordinates and join it etc to fit the format of the points attribute
//on the polygon svg element.
//prevx&y calculations might get a little hairy.
export const ngon = {
  name: 'polygon',
  coords: [], //subject to move
  DimensionsComponent: () => {},
  ElementsComponent: props => {
    console.log(name) //if works we can use coords
    return (
      <svg>
        <circle>
          <polygon points={name} />
        </circle>
      </svg>
    )
  },
  handleCreate: (x, y, fill, uuid, socket) => {
    const data = {
      type: 'polygon',
      id: uuid,
      x,
      y,
      props: {
        fill,
        base,
        height
      }
    }
  },
  handleCreatingUpdate: () => {}
}
