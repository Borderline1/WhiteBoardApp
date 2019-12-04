import React, {Component} from 'react'
import className from 'classnames'
import {Button, Icon} from 'semantic-ui-react'

const ToolButton = ({tool, types, name, handleSelectTool}) => {
  const handleOnClick = () => {
    handleSelectTool(types[name])
  }
  const toolIcons = {
    picker: 'mouse pointer',
    circle: 'circle',
    rectangle: 'square',
    textBox: 'font',
    line: 'minus',
    image: 'file image outline'
  }
  return (
    <Button
      onClick={handleOnClick}
      className={className('tool-button', {
        toolButtonSelected: tool.name === name
      })}
    >
      {toolIcons[name] ? (
        <Icon name={toolIcons[name]} size="large" style={{marginLeft: 11}} />
      ) : name === 'triangle' ? (
        <img
          src="https://img.icons8.com/material/15/000000/triangle-stroked--v1.png"
          alt={name}
        />
      ) : name === 'rightTriangle' ? (
        <img
          src="https://img.icons8.com/ios-glyphs/15/000000/trigonometry.png"
          alt={name}
        />
      ) : name === 'polygon' ? (
        <img
          src="https://img.icons8.com/ios-filled/15/000000/pentagon.png"
          alt={name}
        />
      ) : (
        name
      )}
    </Button>
  )
}

export default ToolButton
