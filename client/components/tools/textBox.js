/* eslint-disable max-params */
/* eslint-disable react/display-name */
import React from 'react'

// let _id = 0

export const textBox = {
  name: 'textBox',
  DimensionsComponent: (selectedLayer, handleChange, handleTextPropsChange) => {
    return (
      <div>
        <label>Text Color</label>
        <input
          name="textColor"
          type="color"
          value={selectedLayer.props.textColor}
          onChange={handleTextPropsChange}
        />
        <label>Background Color</label>
        <input
          name="backgroundColor"
          type="color"
          value={selectedLayer.props.backgroundColor}
          onChange={handleTextPropsChange}
        />
        <label>Width</label>
        <input
          name="width"
          type="number"
          value={selectedLayer.props.width}
          onChange={handleTextPropsChange}
        />
        <label>Height</label>
        <input
          name="height"
          type="number"
          value={selectedLayer.props.height}
          onChange={handleTextPropsChange}
        />
      </div>
    )
  },
  ElementComponent: props => {
    let styleObj = {
      width: props.width,
      height: props.height,
      color: props.textColor,
      backgroundColor: props.backgroundColor
    }
    return <div style={styleObj}>{props.text === '' ? 'Text' : props.text}</div>
  },
  handleCreate: (
    x,
    y,
    color = '#ffffff',
    uuid,
    socket,
    text = '',
    textColor = '#000000'
  ) => {
    const data = {
      type: 'textBox',
      x,
      y,
      id: uuid,
      rotate: 0,
      props: {
        width: 70,
        height: 50,
        text,
        backgroundColor: '#ffffff',
        textColor
      }
    }
    socket.emit('create', data)
  },
  handleTextChange: (text, selectedLayer, socket) => {
    if (selectedLayer) {
      socket.emit('change', {
        ...selectedLayer,
        props: {...selectedLayer.props, text}
      })
    }
  },
  handleCreatingUpdate: (
    selectedLayer,
    prevX,
    prevY,
    clientX,
    clientY,
    socket
  ) => {
    const xPos = Math.min(prevX, clientX)
    const yPos = Math.min(prevY, clientY)
    const width = Math.abs(prevX - clientX)
    const height = Math.abs(prevY - clientY)
    if (selectedLayer) {
      socket.emit('change', {
        ...selectedLayer,
        x: xPos,
        y: yPos,
        props: {...selectedLayer.props, width, height}
      })
    }
  }
}
