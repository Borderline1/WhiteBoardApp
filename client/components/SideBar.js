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
  return (
    <div
      style={{
        position: 'fixed',
        height: '100vh',
        width: '17.5vw',
        backgroundColor: 'lightgray',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '5px',
        zIndex: 100000
      }}
    >
      <div className="toolbox" style={{}}>
        <ChromePicker color={color} onChangeComplete={handleColorChange} />
        {/* iterate over all tools instead of hard coding */}
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
            <label htmlFor="xPosition">X position</label>
            <input
              name="XPosition"
              type="number"
              value={selectedLayer.x}
              onChange={event => {
                const newX = event.target.value
                socket.emit('change', {...selectedLayer, x: +newX})
              }}
            />
            <label htmlFor="YPosition">Y position</label>
            <input name="Yposition" type="number" value={selectedLayer.y} />
            <label>Fill Color</label>
            <input
              type="color"
              value={selectedLayer.props.fill}
              onChange={event => {
                // on change needs to update server value
              }}
            />
            {selectedLayer.type.DimensionsComponent(selectedLayer)}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default SideBar
