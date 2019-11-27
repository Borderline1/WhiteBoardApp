import React, {Component} from 'react'
import className from 'classnames'
// import {Button} from 'semantic-ui-react'

const ToolButton = ({tool, types, name, handleSelectTool}) => {
  const handleOnClick = () => {
    handleSelectTool(types[name])
  }
  return (
    <button
      onClick={handleOnClick}
      className={className('tool-container', {
        toolContainerSelected: tool.name === name
      })}
    >
      {name}
    </button>
  )
}

export default ToolButton
