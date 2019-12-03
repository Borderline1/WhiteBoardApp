import React from 'react'
import {Segment, Icon} from 'semantic-ui-react'

const ColorWheel = props => {
  const {
    color,
    strokeColor,
    handleColorChange,
    handleStrokeColorChange,
    toggleFilling,
    filling,
    selectedLayer,
    socket
  } = props
  const colors = {
    red: '#ff0000',
    orange: '#ff8000',
    lightCoral: '#ff9999',
    yellow: '#ffff00',

    green: '#009900',
    turquoise: '#009999',
    lime: '#80ff00',
    teal: '#66ffb2',

    purple: '#7f00ff',
    navy: '#0000ff',
    blue1: '#0080ff',
    aqua: '#00ffff',

    black: '#000000',
    lightGray: '#c0c0c0',
    white: '#ffffff',
    none: 'none'
  }
  const handleFillStrokeChange = (color, type, selectedLayer, socket) => {
    socket.emit('change', {
      ...selectedLayer,
      props: {...selectedLayer.props, [type]: color}
    })
  }
  return (
    <Segment id="color-grid-container">
      <div id="main-colors-container">
        <div className="applied-color-1" onClick={() => toggleFilling(true)}>
          <div
            id="fill-color"
            style={
              color !== 'none'
                ? {backgroundColor: color}
                : {backgroundColor: 'white'}
            }
          >
            {color !== 'none' ? null : (
              <Icon color="red" name="ban" size="large" />
            )}
          </div>
          <p className="color-label">Fill</p>
        </div>
        <div className="applied-color-2" onClick={() => toggleFilling(false)}>
          <div
            id="stroke-color"
            style={
              strokeColor !== 'none'
                ? {backgroundColor: strokeColor}
                : {backgroundColor: 'white'}
            }
          >
            {strokeColor !== 'none' ? null : (
              <Icon color="red" name="ban" size="large" />
            )}
          </div>
          <p className="color-label">Stroke</p>
        </div>
      </div>
      <div id="color-selections">
        {Object.values(colors).map(color => {
          return (
            <div
              key={color}
              className="selected-color-container"
              onClick={() => {
                if (selectedLayer) {
                  const type = filling ? 'fill' : 'stroke'
                  handleFillStrokeChange(color, type, selectedLayer, socket)
                }
                if (filling) handleColorChange(color)
                else handleStrokeColorChange(color)
              }}
            >
              <div
                className="selected-color"
                style={
                  color !== 'none'
                    ? {backgroundColor: color}
                    : {backgroundColor: 'white'}
                }
              >
                {color !== 'none' ? null : (
                  <Icon color="red" name="ban" size="large" />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </Segment>
  )
}

export default ColorWheel
