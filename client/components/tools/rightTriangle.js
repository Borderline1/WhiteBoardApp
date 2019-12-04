/* eslint-disable complexity */
/* eslint-disable react/display-name */
import React from 'react'
import {Input} from 'semantic-ui-react'

export const rightTriangle = {
  name: 'rightTriangle',
  DimensionsComponent: (
    selectedLayer,
    handleChange,
    handleTextPropsChange,
    handleRotate
  ) => {
    return (
      <div>
        <label>Base</label>
        <Input
          min="0"
          name="base"
          type="number"
          value={selectedLayer.props.base}
          onChange={handleChange}
        />
        <label>Height</label>
        <Input
          min="0"
          name="height"
          type="number"
          value={selectedLayer.props.height}
          onChange={handleChange}
        />
        <label>Stroke Width</label>
        <Input
          min="0"
          name="strokeWidth"
          type="number"
          value={selectedLayer.props.strokeWidth}
          onChange={handleChange}
        />
        <label>Rotate</label>
        <Input
          min="0"
          name="rotate"
          type="number"
          value={selectedLayer.props.rotate}
          onChange={handleRotate}
        />
      </div>
    )
  },
  ElementComponent: ({
    selectedLayer,
    base,
    height,
    fill,
    stroke,
    points,
    strokeWidth,
    handleDelete,
    deletePosition,
    changePosition,
    rotatePosition,
    id,
    index,
    setSelectedLayerIds,
    setChanging,
    setRotating
  }) => {
    let deleteButtonDisplay = 'none'
    if (selectedLayer && selectedLayer.id === id) {
      deleteButtonDisplay = 'inline'
    }
    return (
      <div>
        <svg width={base + strokeWidth} height={height + strokeWidth}>
          <polygon
            stroke={stroke}
            strokeWidth={strokeWidth}
            points={points}
            fill={fill}
          />
        </svg>
        <button
          name="X"
          type="button"
          className="deleteLineRect"
          style={{
            display: deleteButtonDisplay,
            top: deletePosition.top,
            bottom: deletePosition.bottom,
            right: deletePosition.right,
            left: deletePosition.left
          }}
          onClick={() => {
            handleDelete(index)
          }}
        >
          <p style={{position: 'absolute', left: '4px', top: '-4px'}}>x</p>
        </button>
        <div
          className="changeLineRect"
          style={{
            display: deleteButtonDisplay,
            top: changePosition.top,
            bottom: changePosition.bottom,
            right: changePosition.right,
            left: changePosition.left,
            borderRadius: changePosition.radius
          }}
          onMouseDown={() => {
            setSelectedLayerIds([id])
            setChanging(true)
          }}
          onMouseUp={() => {
            setChanging(false)
          }}
        />
        <button
          name="rotate"
          type="button"
          className="rotateRectTri"
          style={{
            display: deleteButtonDisplay,
            top: rotatePosition.top,
            bottom: rotatePosition.bottom,
            right: rotatePosition.right,
            left: rotatePosition.left
          }}
          onMouseDown={() => {
            setSelectedLayerIds([id])
            setChanging(false)
            setRotating(true)
          }}
          onMouseUp={() => {
            setSelectedLayerIds([])
            setRotating(false)
          }}
        >
          <p style={{position: 'absolute', right: '2px', top: '-4px'}}>⤺</p>
        </button>
      </div>
    )
  },
  handleChange: (
    clientX,
    clientY,
    prevX,
    prevY,
    socket,
    selectedLayer,
    layerInitialPositionsXs,
    layerInitialPositionsYs
  ) => {
    const layerInitialPositionX = layerInitialPositionsXs[0]
    const layerInitialPositionY = layerInitialPositionsYs[0]
    const xPos = Math.min(layerInitialPositionX, clientX)
    const yPos = Math.min(layerInitialPositionY, clientY)
    const base = Math.abs(layerInitialPositionX - clientX)
    const height = Math.abs(layerInitialPositionY - clientY)

    if (clientX > layerInitialPositionX && clientY > layerInitialPositionY) {
      socket.emit('change', {
        ...selectedLayer,
        x: xPos,
        y: yPos,
        props: {
          ...selectedLayer.props,
          base,
          height,
          points: `${selectedLayer.props.base}
            ${selectedLayer.props.strokeWidth / 2}
              , ${selectedLayer.props.strokeWidth} ${selectedLayer.props
            .height +
            selectedLayer.props.strokeWidth / 2}, ${
            selectedLayer.props.base
          } ${selectedLayer.props.height +
            selectedLayer.props.strokeWidth / 2}`,
          deletePosition: {top: '-6px', bottom: '', right: '-8px', left: ''},
          changePosition: {
            top: '',
            bottom: '-6px',
            right: '-8px',
            left: '',
            radius: '100% 100% 0 100%'
          },
          rotatePosition: {top: '-6px', bottom: '', right: '', left: '-8px'}
        }
      })
    }
    if (clientX < layerInitialPositionX && clientY < layerInitialPositionY) {
      socket.emit('change', {
        ...selectedLayer,
        x: xPos,
        y: yPos,
        props: {
          ...selectedLayer.props,
          base,
          height,
          points: `${selectedLayer.props.strokeWidth}
          ${selectedLayer.props.strokeWidth / 2}
            , ${selectedLayer.props.base}
          ${selectedLayer.props.strokeWidth / 2}
            , ${selectedLayer.props.strokeWidth} ${selectedLayer.props.height +
            selectedLayer.props.strokeWidth / 2}`,
          deletePosition: {top: '-6px', bottom: '', right: '-8px', left: ''},
          changePosition: {
            top: '-6px',
            bottom: '',
            right: '',
            left: '-8px',
            radius: '0 100% 100% 100%'
          },
          rotatePosition: {top: '', bottom: '-6px', right: '', left: '-8px'}
        }
      })
    }
    if (clientX > layerInitialPositionX && clientY < layerInitialPositionY) {
      socket.emit('change', {
        ...selectedLayer,
        x: xPos,
        y: yPos,
        props: {
          ...selectedLayer.props,
          base,
          height,
          points: `${selectedLayer.props.strokeWidth}
          ${selectedLayer.props.strokeWidth / 2}
            , ${selectedLayer.props.base}
            ${selectedLayer.props.strokeWidth / 2}, ${
            selectedLayer.props.base
          } ${selectedLayer.props.height +
            selectedLayer.props.strokeWidth / 2}`,
          deletePosition: {top: '', bottom: '-6px', right: '-8px', left: ''},
          changePosition: {
            top: '-6px',
            bottom: '',
            right: '-8px',
            left: '',
            radius: '100% 0 100% 100%'
          },
          rotatePosition: {top: '-6px', bottom: '', right: '', left: '-8px'}
        }
      })
    }
    if (clientX < layerInitialPositionX && clientY > layerInitialPositionY) {
      socket.emit('change', {
        ...selectedLayer,
        x: xPos,
        y: yPos,
        props: {
          ...selectedLayer.props,
          base,
          height,
          points: `${selectedLayer.props.strokeWidth}
            ${selectedLayer.props.strokeWidth / 2}
              , ${selectedLayer.props.strokeWidth} ${selectedLayer.props
            .height +
            selectedLayer.props.strokeWidth / 2}, ${
            selectedLayer.props.base
          } ${selectedLayer.props.height +
            selectedLayer.props.strokeWidth / 2}`,
          deletePosition: {top: '-6px', bottom: '', right: '-8px', left: ''},
          changePosition: {
            top: '',
            bottom: '-6px',
            right: '',
            left: '-8px',
            radius: '100% 100% 100% 0'
          },
          rotatePosition: {top: '-6px', bottom: '', right: '', left: '-8px'}
        }
      })
    }
  },
  handleRotate: (selectedLayer, socket, prevX, prevY, clientX, clientY) => {
    const movementX = clientX - prevX
    const movementY = clientY - prevY
    socket.emit('change', {
      ...selectedLayer,
      props: {
        ...selectedLayer.props,
        rotate: +Math.floor(movementX * 0.5 - movementY * 0.5)
      }
    })
  },
  handleCreate: (x, y, fill = 'black', uuid, socket, strokeColor) => {
    const data = {
      type: 'rightTriangle',
      id: uuid,
      x: x - 5, //relative to canvas mouseX
      y,
      props: {
        fill,
        base: 10,
        height: 10,
        stroke: strokeColor,
        strokeWidth: 5,
        rotate: 0,
        points: '10 2.5, 5 7.5, 10 7.5',
        deletePosition: {top: '-6px', bottom: '', right: '-8px', left: ''},
        changePosition: {
          top: '',
          bottom: '-6px',
          right: '-8px',
          left: '',
          radius: '100% 100% 0 100%'
        },
        rotatePosition: {top: '-6px', bottom: '', right: '', left: '-8px'}
      }
    }
    socket.emit('create', data)
  },
  handleCreatingUpdate: (
    selectedLayer,
    prevX,
    prevY,
    clientX,
    clientY,
    socket
  ) => {
    const xdiff = Math.abs(prevX - clientX)
    const ydiff = Math.abs(prevY - clientY)
    let base = xdiff * 2
    let height = ydiff
    const xPos = prevX - xdiff
    const yPos = Math.min(prevY, clientY)

    if (selectedLayer) {
      if (clientX > prevX && clientY > prevY) {
        socket.emit('change', {
          ...selectedLayer,
          x: xPos,
          y: yPos,
          props: {
            ...selectedLayer.props,
            base,
            height,
            points: `${selectedLayer.props.base}
            ${selectedLayer.props.strokeWidth / 2}
              , ${selectedLayer.props.strokeWidth} ${selectedLayer.props
              .height +
              selectedLayer.props.strokeWidth / 2}, ${
              selectedLayer.props.base
            } ${selectedLayer.props.height +
              selectedLayer.props.strokeWidth / 2}`,
            deletePosition: {top: '-6px', bottom: '', right: '-8px', left: ''},
            changePosition: {
              top: '',
              bottom: '-6px',
              right: '-8px',
              left: '',
              radius: '100% 100% 0 100%'
            },
            rotatePosition: {top: '-6px', bottom: '', right: '', left: '-8px'}
          }
        })
      }
      if (clientX < prevX && clientY < prevY) {
        socket.emit('change', {
          ...selectedLayer,
          x: xPos,
          y: yPos,
          props: {
            ...selectedLayer.props,
            base,
            height,
            points: `${selectedLayer.props.strokeWidth}
            ${selectedLayer.props.strokeWidth / 2}
              , ${selectedLayer.props.base}
            ${selectedLayer.props.strokeWidth / 2}
              , ${selectedLayer.props.strokeWidth} ${selectedLayer.props
              .height +
              selectedLayer.props.strokeWidth / 2}`,
            deletePosition: {top: '-6px', bottom: '', right: '-8px', left: ''},
            changePosition: {
              top: '-6px',
              bottom: '',
              right: '',
              left: '-8px',
              radius: '0 100% 100% 100%'
            },
            rotatePosition: {top: '', bottom: '-6px', right: '', left: '-8px'}
          }
        })
      }
      if (clientX > prevX && clientY < prevY) {
        socket.emit('change', {
          ...selectedLayer,
          x: xPos,
          y: yPos,
          props: {
            ...selectedLayer.props,
            base,
            height,
            points: `${selectedLayer.props.strokeWidth}
            ${selectedLayer.props.strokeWidth / 2}
              , ${selectedLayer.props.base}
              ${selectedLayer.props.strokeWidth / 2}, ${
              selectedLayer.props.base
            } ${selectedLayer.props.height +
              selectedLayer.props.strokeWidth / 2}`,
            deletePosition: {top: '', bottom: '-6px', right: '-8px', left: ''},
            changePosition: {
              top: '-6px',
              bottom: '',
              right: '-8px',
              left: '',
              radius: '100% 0 100% 100%'
            },
            rotatePosition: {top: '-6px', bottom: '', right: '', left: '-8px'}
          }
        })
      }
      if (clientX < prevX && clientY > prevY) {
        socket.emit('change', {
          ...selectedLayer,
          x: xPos,
          y: yPos,
          props: {
            ...selectedLayer.props,
            base,
            height,
            points: `${selectedLayer.props.strokeWidth}
            ${selectedLayer.props.strokeWidth / 2}
              , ${selectedLayer.props.strokeWidth} ${selectedLayer.props
              .height +
              selectedLayer.props.strokeWidth / 2}, ${
              selectedLayer.props.base
            } ${selectedLayer.props.height +
              selectedLayer.props.strokeWidth / 2}`,
            deletePosition: {top: '-6px', bottom: '', right: '-8px', left: ''},
            changePosition: {
              top: '',
              bottom: '-6px',
              right: '',
              left: '-8px',
              radius: '100% 100% 100% 0'
            },
            rotatePosition: {top: '-6px', bottom: '', right: '', left: '-8px'}
          }
        })
      }
    }
  }
}
