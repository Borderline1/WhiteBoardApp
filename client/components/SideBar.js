import React, {Component} from 'react'
import {ChromePicker} from 'react-color'
import ToolButton from './ToolButton'

const SideBar = ({
  color,
  tool,
  selectedLayer,
  handleColorChange,
  types,
  handleSelectTool,
  socket
}) => {
  const handleChange = e => {
    const {type, name, value} = e.target
    // console.log(type, name, value, e)
    let editValue
    editValue = type === 'number' ? +value : value
    if (type === 'color') handleColorChange(editValue)

    if (name !== 'x' && name !== 'y') {
      // console.log('PROPS CAN BE TRUE')
      socket.emit('change', {
        ...selectedLayer,
        props: {...selectedLayer.props, [name]: editValue}
      })
    } else {
      socket.emit('change', {...selectedLayer, [name]: editValue})
    }
  }
  return (
    <div
      style={{
        position: 'fixed',
        height: '100vh',
        width: '17.5vw',
        backgroundColor: 'lightgray',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: '5px',
        zIndex: 100000
      }}
    >
      <div
        className="toolbox"
        style={{display: 'flex', flexDirection: 'column'}}
      >
        {/* iterate over all tools instead of hard coding */}
        <label htmlFor="color" />
        <input
          name="color"
          type="color"
          value={color}
          onChange={handleChange}
        />

        {Object.keys(types).map(typeKey => (
          <ToolButton
            key={types[typeKey].name}
            name={types[typeKey].name}
            tool={tool}
            types={types}
            handleSelectTool={handleSelectTool}
          />
        ))}

        {/* Form Stuff */}
        {selectedLayer ? (
          <div>
            <h2>{selectedLayer.type.name}</h2>
            <label htmlFor="x">X position</label>
            <input
              name="x"
              type="number"
              value={selectedLayer.x}
              onChange={handleChange}
            />
            <label htmlFor="y">Y position</label>
            <input
              name="y"
              type="number"
              value={selectedLayer.y}
              onChange={handleChange}
            />
            <label>Fill</label>
            <input
              name="fill"
              type="color"
              value={selectedLayer.props.fill}
              onChange={handleChange}
            />
            {selectedLayer.type.DimensionsComponent(
              selectedLayer,
              handleChange
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default SideBar
