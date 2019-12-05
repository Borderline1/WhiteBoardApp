import React from 'react'
import {Segment, Icon} from 'semantic-ui-react'
import className from 'classnames'

const ColorWheel = props => {
  const {
    color,
    strokeColor,
    handleColorChange,
    handleStrokeColorChange,
    toggleFilling,
    filling,
    selectedLayer,
    socket,
    selectedColor,
    setSelectedColor
  } = props
  const colors = {
    red: '#ff0000',
    orange: '#ff8000',
    tartOrange: '#FE4A49',
    orangeYellow: '#FED766',

    green: '#009900',
    ball: '#009999',
    lime: '#80ff00',
    teal: '#66ffb2',

    purple: '#7f00ff',
    navy: '#0000ff',
    ballBlue: '#2AB7CA',
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
        <div
          className="applied-color-1"
          style={
            filling ? {boxShadow: '0 0 12px #FFD700'} : {boxShadow: '0 0 0'}
          }
          onClick={() => toggleFilling(true)}
        >
          <div
            id="fill-color"
            style={
              color !== 'none'
                ? {backgroundColor: color}
                : {backgroundColor: 'white'}
            }
          >
            <div
              style={{
                position: 'absolute',
                display: 'inline-block',
                textAlign: 'center',
                right: '0%'
              }}
            >
              {color !== 'none' ? null : (
                <Icon color="red" name="ban" size="large" />
              )}
            </div>
          </div>
          <p className="color-label">Fill</p>
        </div>
        <div
          className="applied-color-2"
          style={
            !filling ? {boxShadow: '0 0 12px #FFD700'} : {boxShadow: '0 0 0'}
          }
          onClick={() => toggleFilling(false)}
        >
          <div
            id="stroke-color"
            style={
              strokeColor !== 'none'
                ? {backgroundColor: strokeColor}
                : {backgroundColor: 'white'}
            }
          >
            <div
              style={{
                position: 'absolute',
                display: 'inline-block',
                textAlign: 'center',
                right: '0%'
              }}
            >
              {strokeColor !== 'none' ? null : (
                <Icon color="red" name="ban" size="large" />
              )}
            </div>
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
                setSelectedColor(color)
                if (filling) handleColorChange(color)
                else handleStrokeColorChange(color)
              }}
            >
              <div
                className={className('selected-color', {
                  selected: selectedColor === color
                })}
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
