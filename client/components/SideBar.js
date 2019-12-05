import React, {Component} from 'react'
import ToolButton from './ToolButton'
import ColorWheel from './ColorWheel'
import {Segment, Grid, Header, Input, Form} from 'semantic-ui-react'

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
  setSelectedColor,
  cursorColors,
  cursors
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
      <Header as="h1" id="title-header">
        SVG Board
      </Header>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div style={{top: '50', color: 'white', fontWeight: 'bold'}}>
          USERS:
        </div>
        {cursors.map((cursor, idx) => (
          <div
            key={idx}
            style={{
              height: '2rem',
              width: '2rem',
              borderRadius: '50%',
              backgroundColor: cursorColors[idx],
              // display: 'inline-block',
              // textAlign: 'center',
              margin: '0.5rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <div
              style={{
                top: '50',
                color: 'black',
                fontWeight: '900'
              }}
            >
              {cursor.name.slice(0, 1).toUpperCase()}
            </div>
          </div>
        ))}
      </div>
      <div className="toolbox">
        <Segment className="tool-table">
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
          <div id="dimensions-form-outer">
            <div id="dimensions-form-inner">
              <label htmlFor="x" className="input-label">
                X position
              </label>
              <Input
                className="input-input"
                min="0"
                name="x"
                type="number"
                value={selectedLayer.x}
                onChange={handleChange}
              />

              <label htmlFor="y" className="input-label">
                Y position
              </label>
              <Input
                className="input-input"
                min="0"
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
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default SideBar
