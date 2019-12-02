import React, {Component} from 'react'
import {ChromePicker} from 'react-color'
import ToolButton from './ToolButton'
import {Container, Segment, Grid} from 'semantic-ui-react'

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
  const firstHalf = Object.keys(types).slice(
    0,
    Object.keys(types).length / 2 + 1
  )
  const secondHalf = Object.keys(types).slice(Object.keys(types).length / 2 + 1)
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
      {/* iterate over all tools instead of hard coding */}
      <label htmlFor="color" />
      <input name="color" type="color" value={color} onChange={handleChange} />
      <div className="toolbox">
        <Segment className="tool-table">
          <h4 className="tools-header">TOOLS</h4>
          <Grid columns={2}>
            <Grid.Column id="tools-column-1">
              {firstHalf.map(typeKey => {
                return (
                  <Grid.Row>
                    <ToolButton
                      key={types[typeKey].name}
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
                  <Grid.Row>
                    <ToolButton
                      key={types[typeKey].name}
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
              handleTextPropsChange
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default SideBar
