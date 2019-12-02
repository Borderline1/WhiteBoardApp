/* eslint-disable react/display-name */
import React from 'react'
import {Dropdown, Input, Select} from 'semantic-ui-react'

const selectOptions = [
  {key: 0, value: 'none', text: 'No Border'}
  // { key: 1, value: "white", text: "white" },
  // { key: 2, value: "red", text: "red" },
  // { key: 3, value: "yellow", text: "yellow" },
  // { key: 4, value: "green", text: "green" },
  // { key: 5, value: "black", text: "black" }
]

export const circle = {
  name: 'circle',
  DimensionsComponent: (selectedLayer, handleChange) => {
    return (
      <div>
        <label>Radius</label>
        <Input
          name="radius"
          type="number"
          width="4"
          value={selectedLayer.props.radius}
          onChange={handleChange}
        />
        {/* <label>Stroke</label>
        <Select
          name="stroke"
          width='4'
          options={selectOptions}
          placeholder='Choose a Color'
          value={selectedLayer.props.stroke}
          onSelect={handleChange}
        /> */}
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
  ElementComponent: ({
    selectedLayer,
    radius,
    fill,
    stroke,
    strokeWidth,
    id,
    handleDelete,
    index
  }) => {
    let deleteButtonDisplay = 'none'
    if (selectedLayer && selectedLayer.id === id) {
      deleteButtonDisplay = 'inline'
    }
    const containerSize = radius * 2 + strokeWidth
    const center = radius + strokeWidth / 2
    return (
      <div>
        <svg width={containerSize} height={containerSize}>
          <circle
            cx={center}
            cy={center}
            r={radius}
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
          id="canvas"
          className="changeElement"
          // onClick={() => {
          //   props.setSelectedLayerId(props.id)
          //   console.log('clicky')
          // }}
          onMouseDown={() => {
            props.setSelectedLayerId(props.id)
            props.setChanging(true)
            console.log('down')
          }}
          onMouseUp={() => {
            props.setChanging(false)
            console.log('up')
          }}
        />
      </div>
    )
  },
  handleChange: (clientX, clientY, prevX, prevY, socket, selectedLayer) => {
    const movementX = clientX - prevX
    const movementY = clientY - prevY
    const newRadius = movementX / 2
    socket.emit('change', {
      ...selectedLayer,
      props: {
        ...selectedLayer.props,
        radius: newRadius,
        width: movementX,
        height: movementY
      }
    })
  },
  handleCreate: (x, y, fill, uuid, socket) => {
    const data = {
      type: 'circle',
      x: x - 10,
      y: y - 10,
      id: uuid,
      rotate: 0,
      props: {
        radius: 9,
        fill,
        stroke: '#000',
        strokeWidth: 5
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
    const strokeAdd = selectedLayer.props.strokeWidth / 2
    const xdiff = prevX - clientX
    const ydiff = prevY - clientY
    const radius = Math.round(Math.sqrt(xdiff * xdiff + ydiff * ydiff))
    const xPos = prevX - radius - strokeAdd
    const yPos = prevY - radius - strokeAdd

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
