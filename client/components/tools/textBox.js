/* eslint-disable max-params */
/* eslint-disable react/display-name */
import React from 'react'

let _id = 0

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
  ElementComponent: (
    props,
    handleTextChange,
    selectedLayer,
    socket,
    localText,
    setLocalText,
    useLocalText,
    setUseLocalText
  ) => {
    let styleObj = {
      width: props.width,
      height: props.height,
      color: props.textColor,
      backgroundColor: props.backgroundColor
    }
    let inputStyleObj = {
      width: props.width,
      height: props.height,
      color: props.textColor,
      backgroundColor: props.backgroundColor,
      overflowWrap: 'break-word',
      hyphens: 'auto'
    }
    // return <div style={styleObj}>{props.text === '' ? 'Text' : props.text}</div>
    return (
      <div style={styleObj}>
        {useLocalText ? (
          <input
            style={inputStyleObj}
            type="text"
            value={localText}
            onChange={e =>
              handleTextChange(
                e,
                selectedLayer,
                socket,
                setLocalText,
                setUseLocalText
              )
            }
          />
        ) : (
          <input
            style={inputStyleObj}
            type="text"
            value={props.text}
            onChange={e =>
              handleTextChange(
                e,
                selectedLayer,
                socket,
                setLocalText,
                setUseLocalText
              )
            }
          />
        )}
      </div>
    )
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
      props: {
        width: 70,
        height: 50,
        text: 'Text',
        backgroundColor: '#ffffff',
        textColor
      }
    }
    socket.emit('create', data)
  },
  handleTextChange: (
    event,
    selectedLayer,
    socket,
    setLocalText,
    setUseLocalText
  ) => {
    // setUseLocalText(true)
    // if (selectedLayer) {
    //   let text = event.target.value
    //   setLocalText(text)
    // }
    // function socketEmit() {
    //   if (selectedLayer) {
    //     let newText = event.target.value
    //     socket.emit('change', {
    //       ...selectedLayer,
    //       props: {...selectedLayer.props, text: newText}
    //     })
    //     setUseLocalText(false)
    //     setLocalText('Text')
    //   }
    // }
    // window.addEventListener('click', socketEmit)
    // window.removeEventListener('click', socketEmit)
    if (selectedLayer) {
      socket.emit('change', {
        ...selectedLayer,
        props: {...selectedLayer.props, text: event.target.value}
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
