/* eslint-disable react/display-name */
import React from 'react'

export const image = {
  name: 'image',
  DimensionsComponent: (selectedLayer, handleChange) => {
    return (
      <div>
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
        <label>Source</label>
        <input
          name="source"
          type="text"
          value={selectedLayer.props.source}
          onChange={handleChange}
        />
      </div>
    )
  },
  ElementComponent: props => {
    return (
      <div width={props.width} height={props.height}>
        <img
          src={props.source}
          width={props.width}
          height={props.height}
          // style={{draggable: false}}
          onDragStart={() => false}
        />
        <button
          name="X"
          type="button"
          className="deleteElement"
          onClick={() => {
            props.handleDelete(props.index)
          }}
        >
          <p style={{position: 'absolute', left: '4px', top: '-4px'}}>x</p>
        </button>
      </div>
    )
  },
  handleCreate: (x, y, fill = 'black', uuid, socket) => {
    const data = {
      type: 'image',
      x,
      y,
      id: uuid,
      rotate: 0,
      props: {
        width: 100,
        height: 100,
        fill,
        source:
          'https://www.schiffner.com/wp-content/themes/schiff-responsive/images/noimage.jpg'
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
    const xPos = Math.min(prevX, clientX)
    const yPos = Math.min(prevY, clientY)
    const width = Math.abs(prevX - clientX)
    const height = Math.abs(prevY - clientY)
    if (selectedLayer) {
      socket.emit('change', {
        ...selectedLayer,
        x: xPos,
        y: yPos,
        props: {...selectedLayer.props, width, height, source}
      })
    }
  }
}
