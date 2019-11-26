/* eslint-disable max-params */
/* eslint-disable react/display-name */
import React from 'react'

let _id = 0

export const textBox = {
  name: 'textBox',
  DimensionsComponent: (
    selectedLayer,
    handleTextPropsChange,
    handleTextChange,
    textBox
  ) => {
    return (
      <div>
        <form onSubmit={handleTextPropsChange}>
          <label>Text</label>
          <input
            name="text"
            type="text"
            value={textBox}
            onChange={handleTextChange}
          />
          <button type="submit">Update Text</button>
        </form>
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
      <p
        styling={`width: ${props.width}; height: ${props.height}; color: ${props.textColor}; background-color: ${props.backgroundColor}`}
      >
        {props.text === '' ? 'Text' : props.text}
      </p>
    )
  },
  handleDoubleClick: function(layers, setLayers, x, y, color, uuid, socket) {
    // setLayers([...layers, this.create(x, y, 20, color, uuid, socket)])
    this.create(x, y, '', 50, 70, color, uuid, socket, '#000000')
  },
  handleUpdate: function(x, y) {},
  create: (
    x,
    y,
    text = '',
    height = 50,
    width = 70,
    color = '#ffffff',
    uuid,
    socket,
    textColor = '#000000'
  ) => {
    const data = {
      type: 'textBox',
      x,
      y,
      id: uuid,
      props: {
        height,
        width,
        text,
        backgroundColor: '#ffffff',
        textColor
      }
    }
    socket.emit('create', data)
  }
}
