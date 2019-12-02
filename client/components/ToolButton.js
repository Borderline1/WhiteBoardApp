import React, {Component} from 'react'
import className from 'classnames'
import {Button} from 'semantic-ui-react'

const ToolButton = ({tool, types, name, handleSelectTool}) => {
  const handleOnClick = () => {
    handleSelectTool(types[name])
  }
  return (
    <Button
      onClick={handleOnClick}
      className={className('tool-button', {
        toolButtonSelected: tool.name === name
      })}
    >
      {name}
    </Button>
  )
}

export default ToolButton
