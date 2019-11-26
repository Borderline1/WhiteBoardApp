import React, {Component} from 'react'
import {ChromePicker} from 'react-color'
import ToolButton from './ToolButton'

const SideBar = ({
  color,
  tool,
  textBox,
  selectedLayer,
  handleTextBoxChange,
  handleColorChange,
  types,
  handleSelectTool,
  socket
}) => {
  const handleChange = e => {
    e.preventDefault()
    const {type, name, value} = e.target
    let editValue
    editValue = type === 'number' ? +value : value
    if (type === 'color') handleColorChange(editValue)
    if (selectedLayer) {
      if (name !== 'x' && name !== 'y') {
        socket.emit('change', {
          ...selectedLayer,
          props: {...selectedLayer.props, [name]: editValue}
        })
      } else {
        socket.emit('change', {...selectedLayer, [name]: editValue})
      }
    }
  }
  const handleTextPropsChange = e => {
    if (e.target[0].name) {
      socket.emit('change', {
        ...selectedLayer,
        props: {...selectedLayer.props, [e.target[0].name]: e.target[0].value}
      })
    }
  }
  const handleTextChange = e => {
    const {type, name, value} = e.target
    // console.log(type, name, value, e)
    handleTextBoxChange(value)
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
            {selectedLayer.type.name === 'textBox' ? null : (
              <div>
                <label>Fill</label>
                <input
                  name="fill"
                  type="color"
                  value={selectedLayer.props.fill}
                  onChange={handleChange}
                />
              </div>
            )}
            {selectedLayer.type.DimensionsComponent(
              selectedLayer,
              handleChange,
              handleTextPropsChange,
              handleTextChange,
              textBox
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default SideBar
