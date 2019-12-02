/* eslint-disable max-params */
/* eslint-disable react/display-name */
import React from 'react'
import className from 'classnames'

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
    const {
      handleTextChange,
      selectedLayer,
      socket,
      id,
      setSelectedLayerId,
      setChanging
    } = props
    let deleteButtonDisplay = 'none'
    if (selectedLayer && selectedLayer.id === id) {
      deleteButtonDisplay = 'inline'
    }
    let styleObj = {
      width: props.width,
      height: props.height,
      color: props.textColor,
      backgroundColor: props.backgroundColor,
      whiteSpace: 'unset',
      hyphens: 'auto'
    }
    return (
      <div style={styleObj}>
        <textarea
          id={props.id}
          style={styleObj}
          value={props.text}
          selectionstart={props.selectionStart}
          selectionend={props.selectionEnd}
          onChange={e => handleTextChange(e, selectedLayer, socket, props.id)}
        />
        <button
          name="X"
          type="button"
          className="deleteElement"
          style={{display: deleteButtonDisplay}}
          onClick={() => {
            props.handleDelete(props.index)
          }}
        >
          <p style={{position: 'absolute', left: '4px', top: '-4px'}}>x</p>
        </button>
        <div
          className="changeElement"
          style={{display: deleteButtonDisplay}}
          onMouseDown={() => {
            setSelectedLayerId(id)
            setChanging(true)
          }}
          onMouseUp={() => {
            setChanging(false)
          }}
        />
      </div>
    )
  },
  handleChange: (
    clientX,
    clientY,
    prevX,
    prevY,
    socket,
    selectedLayer,
    layerInitialPositionX,
    layerInitialPositionY
  ) => {
    const oldWidth = prevX - layerInitialPositionX
    const oldHeight = prevY - layerInitialPositionY
    const movementX = clientX - prevX
    const movementY = clientY - prevY
    socket.emit('change', {
      ...selectedLayer,
      props: {
        ...selectedLayer.props,
        width: oldWidth + movementX,
        height: oldHeight + movementY
      }
    })
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
        rotate: 0,
        text: 'Text',
        backgroundColor: '#ffffff',
        textColor,
        selectionStart: 0,
        selectionEnd: 0,
        id: uuid
      }
    }
    socket.emit('create', data)
  },
  handleTextChange: (event, selectedLayer, socket) => {
    if (selectedLayer) {
      socket.emit('change', {
        ...selectedLayer,
        props: {
          ...selectedLayer.props,
          text: event.target.value
        }
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
