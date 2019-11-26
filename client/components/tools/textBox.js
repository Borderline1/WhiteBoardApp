/* eslint-disable react/display-name */
import React from 'react'

let _id = 0

export const circle = {
  name: 'circle',
  DimensionsComponent: (selectedLayer, handleChange) => {
    return (
      <div>
        <label>Text</label>
        <input
          name="text"
          type="text"
          value={selectedLayer.props.text}
          onChange={handleChange}
        />
        <label>Text Color</label>
        <input
          name="textColor"
          type="color"
          value={selectedLayer.props.textColor}
          onChange={handleChange}
        />
        <label>Background Color</label>
        <input
          name="backgroundColor"
          type="color"
          value={selectedLayer.props.backgroundColor}
          onChange={handleChange}
        />
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
      </div>
    )
  },
  ElementComponent: props => {
    return (
      <text width={props.width} height={props.height}>
        asdf
      </text>
    )
  },
  handleDoubleClick: function(layers, setLayers, x, y, color, uuid, socket) {
    // setLayers([...layers, this.create(x, y, 20, color, uuid, socket)])
    this.create(x, y, 1, color, uuid, socket)
  },
  handleUpdate: function(x, y) {},
  create: (x, y, text = '', fill = '#000000', uuid, socket) => {
    const data = {
      type: 'circle',
      x,
      y,
      id: uuid,
      props: {
        text,
        fill
      }
    }
    socket.emit('create', data)
  }
}
