/* eslint-disable complexity */
/* eslint-disable max-params */
/* eslint-disable react/display-name */
import React from 'react'
import {Input, Form} from 'semantic-ui-react'

export const ellipse = {
  name: 'ellipse',
  DimensionsComponent: (
    selectedLayer,
    handleChange,
    handleTextPropsChange,
    handleRotate
  ) => {
    return (
      <div>
        <label className="input-label">Radius X</label>
        <Input
          className="input-input"
          min="0"
          name="rx"
          type="number"
          value={selectedLayer.props.rx}
          onChange={handleChange}
        />
        <label className="input-label">Radius Y</label>
        <Input
          className="input-input"
          min="0"
          name="ry"
          type="number"
          value={selectedLayer.props.ry}
          onChange={handleChange}
        />
        <label className="input-label">Stroke Width</label>
        <Input
          className="input-input"
          min="0"
          name="strokeWidth"
          type="number"
          value={selectedLayer.props.strokeWidth}
          onChange={handleChange}
        />
        <label className="input-label">Rotate</label>
        <Input
          className="input-input"
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
    rx,
    ry,
    fill,
    stroke,
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
    const containerSizeX = rx * 2 + strokeWidth
    const containerSizeY = ry * 2 + strokeWidth
    return (
      <div>
        <svg width={containerSizeX} height={containerSizeY}>
          <ellipse
            cx={rx + strokeWidth / 2}
            cy={ry + strokeWidth / 2}
            rx={rx}
            ry={ry}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
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
    layerInitialPositionXs,
    layerInitialPositionYs
  ) => {
    const layerInitialPositionX = layerInitialPositionXs[0]
    const layerInitialPositionY = layerInitialPositionYs[0]
    const xPos = Math.min(layerInitialPositionX, clientX)
    const yPos = Math.min(layerInitialPositionY, clientY)
    const rx = Math.abs(layerInitialPositionX - clientX) / 2
    const ry = Math.abs(layerInitialPositionY - clientY) / 2

    if (clientX > layerInitialPositionX && clientY > layerInitialPositionY) {
      socket.emit('change', {
        ...selectedLayer,
        x: xPos,
        y: yPos,
        props: {
          ...selectedLayer.props,
          rx,
          ry,
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
          rx,
          ry,
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
          rx,
          ry,
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
          rx,
          ry,
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
  handleCreate: (x, y, fill = 'black', uuid, socket, strokeColor, roomName) => {
    const data = {
      type: 'ellipse',
      x,
      y,
      id: uuid,
      props: {
        rx: 8,
        ry: 12,
        rotate: 0,
        fill,
        stroke: 'black',
        strokeWidth: 5,
        roomName: roomName,
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
    const xPos = Math.min(prevX, clientX)
    const yPos = Math.min(prevY, clientY)
    const rx = Math.abs(prevX - clientX) / 2
    const ry = Math.abs(prevY - clientY) / 2
    if (selectedLayer) {
      if (clientX > prevX && clientY > prevY) {
        socket.emit('change', {
          ...selectedLayer,
          x: xPos,
          y: yPos,
          props: {
            ...selectedLayer.props,
            rx,
            ry,
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
            rx,
            ry,
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
            rx,
            ry,
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
            rx,
            ry,
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
