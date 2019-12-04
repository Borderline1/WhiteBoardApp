import React, {Component} from 'react'
import ToolButton from './ToolButton'
import ColorWheel from './ColorWheel'
import {Segment, Grid, Header} from 'semantic-ui-react'

const SideBar = ({
  color,
  strokeColor,
  handleStrokeColorChange,
  toggleFilling,
  filling,
  tool,
  selectedLayer,
  handleColorChange,
  types,
  handleSelectTool,
  socket,
  selectedColor,
  setSelectedColor
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
  const handleRotate = e => {
    let {name, type, value} = e.target
    socket.emit('change', {
      ...selectedLayer,
      props: {
        ...selectedLayer.props,
        rotate: value
      }
    })
  }
  const firstHalf = Object.keys(types).slice(0, Object.keys(types).length / 2)
  const secondHalf = Object.keys(types).slice(Object.keys(types).length / 2)
  return (
    <div id="sidebar">
      <Header as="h1">SVG Board</Header>
      <div className="toolbox">
        <Segment className="tool-table">
          <h4 className="tools-header">TOOLS</h4>
          <Grid columns={2}>
            <Grid.Column id="tools-column-1">
              {firstHalf.map(typeKey => {
                return (
                  <Grid.Row key={types[typeKey].name}>
                    <ToolButton
                      name={types[typeKey].name}
                      tool={tool}
                      types={types}
                      handleSelectTool={handleSelectTool}
                    />
                  </Grid.Row>
                )
              })}
            </Grid.Column>
            <Grid.Column id="tools-column-2">
              {secondHalf.map(typeKey => {
                return (
                  <Grid.Row key={types[typeKey].name}>
                    <ToolButton
                      name={types[typeKey].name}
                      tool={tool}
                      types={types}
                      handleSelectTool={handleSelectTool}
                    />
                  </Grid.Row>
                )
              })}
            </Grid.Column>
          </Grid>
        </Segment>
        <ColorWheel
          color={color}
          strokeColor={strokeColor}
          handleColorChange={handleColorChange}
          handleStrokeColorChange={handleStrokeColorChange}
          toggleFilling={toggleFilling}
          filling={filling}
          selectedLayer={selectedLayer}
          socket={socket}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
        />
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
            {selectedLayer.type.DimensionsComponent(
              selectedLayer,
              handleChange,
              handleTextPropsChange,
              handleRotate
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default SideBar
