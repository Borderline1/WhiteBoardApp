/* eslint-disable max-statements */
import React, {useEffect, useState} from 'react'
import SideBar from './components/SideBar'
import {types} from './components/tools'
import useInterval from '@use-it/interval'
import uuidv1 from 'uuid/v1'
import className from 'classnames'
import io from 'socket.io-client'
import Entry from './components/entry'

const serverAddress = window.location.origin

const App = () => {
  const [socket, setSocket] = useState(null)
  const [color, setColor] = useState('#1133EE')
  const [tool, setTool] = useState(types.picker)
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const [prevX, setprevX] = useState(0)
  const [prevY, setprevY] = useState(0)
  const [cursors, setCursors] = useState([])
  const [name, setName] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [layers, setLayers] = useState([])
  const [indicatedLayerId, setIndicatedLayerId] = useState(null)
  const [selectedLayerId, setSelectedLayerId] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [creating, setCreating] = useState(false)
  const [textBox, setTextBox] = useState('Text here')
  const [layerInitialPositionX, setLayerInitialPositionX] = useState(null)
  const [layerInitialPositionY, setLayerInitialPositionY] = useState(null)

  const clientLayers = layers.map(layer => {
    return {...layer, type: types[layer.type]}
  })

  const selectedLayer = clientLayers.find(layer => layer.id === selectedLayerId)

  const indicatedLayer = clientLayers.find(
    layer => layer.id === indicatedLayerId
  )

  useInterval(() => {
    if (loaded) {
      socket.emit('cursor', {
        name: name,
        x: mouseX + window.scrollX,
        y: mouseY + window.scrollY,
        sessionKey: window.localStorage.getItem('sessionKey')
      })
    }
  }, 3000) // 3 seconds

  // cDM sets up socket on connection set cursors on recieving cursor data
  useEffect(() => {
    const socket = io(serverAddress)
    setSocket(socket)
    socket.on('cursor', data => {
      setCursors(data)
    })
    socket.on('create', elements => {
      setLayers(elements)
    })
    socket.on('change', elements => {
      setLayers(elements)
    })
    socket.on('delete', elements => {
      setLayers(elements)
    })
    //socket when we receive cursor data
  }, [])

  const handleColorChange = color => {
    setColor(color)
  }

  const handleDisplayMouseMove = e => {
    const [clientX, clientY] = [e.clientX, e.clientY]
    if (socket) {
      setMouseX(clientX)
      setMouseY(clientY)

      socket.emit('cursor', {
        name: name,
        x: mouseX + window.scrollX,
        y: mouseY + window.scrollY,
        sessionKey: window.localStorage.getItem('sessionKey')
      })
    }
    if (tool.name === 'picker' && dragging) {
      tool.handleDragging(
        selectedLayer,
        layerInitialPositionX,
        layerInitialPositionY,
        prevX,
        prevY,
        clientX,
        clientY,
        socket
      )
    }
    if (creating && selectedLayerId) {
      tool.handleCreatingUpdate(
        selectedLayer,
        prevX + window.scrollX,
        prevY + window.scrollY,
        clientX + window.scrollX,
        clientY + window.scrollY,
        socket,
        handleSelectTool
      )
    }
  }

  const handleDisplayMouseDown = event => {
    setprevX(mouseX)
    setprevY(mouseY)
    if (creating) {
      const layerId = uuidv1()
      tool.handleCreate(
        mouseX + window.scrollX,
        mouseY + window.scrollY,
        color,
        layerId,
        socket
      )
      setSelectedLayerId(layerId)
    } else if (event.target.id !== 'canvas') {
      setDragging(true)
    } else {
      if (event.target.id === 'canvas') setSelectedLayerId(null)
      // do things with picker for lasso
    }
  }

  const handleSelectTool = tool => {
    setTool(tool)
    setSelectedLayerId(null)
    if (tool.name === 'picker') {
      setCreating(false)
    } else {
      setCreating(true)
    }
  }

  const handleDelete = index => {
    socket.emit('delete', clientLayers[index], index)
  }

  return (
    <div className="App">
      {loaded ? (
        <div>
          <SideBar
            color={color}
            types={types}
            tool={tool}
            handleColorChange={handleColorChange}
            handleSelectTool={handleSelectTool}
            selectedLayer={selectedLayer}
            socket={socket}
          />
          <div
            id="canvas"
            //lets think about changing canvas width height soon; note to self - Henry
            style={{position: 'absolute', width: 1800, height: 1800}}
            onMouseMove={handleDisplayMouseMove}
            onMouseDown={handleDisplayMouseDown}
            onMouseUp={event => {
              if (dragging) {
                setDragging(false)
              }
              if (creating) {
                //make DRY vv; note to self - Henry
                if (tool.name === 'textBox') {
                  setTool(types.picker)
                  setCreating(false)
                  setSelectedLayerId(null)
                  setprevX(null)
                  setprevY(null)
                } else {
                  setSelectedLayerId(null)
                  setprevX(null)
                  setprevY(null)
                }
              }
            }}
          >
            {layers
              ? clientLayers.map((layer, idx) => {
                  return (
                    <div
                      key={layer.id}
                      onMouseEnter={() => {
                        if (tool.name === 'picker') {
                          setIndicatedLayerId(layer.id)
                        }
                      }}
                      onMouseLeave={() => setIndicatedLayerId(null)}
                      onMouseDown={() => {
                        setSelectedLayerId(layer.id)
                        setDragging(true)
                        setLayerInitialPositionX(layer.x)
                        setLayerInitialPositionY(layer.y)
                      }}
                      onMouseUp={() => {
                        if (dragging) return
                        else setSelectedLayerId(layer.id)
                      }}
                      className={className('layer', {
                        indicated: layer.id === indicatedLayerId,
                        selected: layer.id === selectedLayerId
                      })}
                      style={{
                        position: 'absolute',
                        top: layer.y,
                        left: layer.x
                      }}
                    >
                      {/* this layers canvas component */}
                      <layer.type.ElementComponent
                        {...layer.props}
                        handleTextChange={layer.type.handleTextChange}
                        selectedLayer={selectedLayer}
                        socket={socket}
                        index={idx}
                        handleDelete={handleDelete}
                        x={layer.x}
                        y={layer.y}
                      />
                    </div>
                  )
                })
              : null}
            {cursors.map(cursor => (
              <div
                key={cursor.sessionKey}
                className="cursor"
                style={{
                  position: 'absolute',
                  left: cursor.x + 8 + 'px',
                  top: cursor.y + 8 + 'px'
                }}
              >
                <div
                  style={{
                    borderRadius: '50px',
                    position: 'relative',
                    background: 'silver',
                    width: '4px',
                    height: '4px'
                  }}
                />{' '}
                {cursor.name}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Entry
          loaded={loaded}
          setLoaded={setLoaded}
          name={name}
          setName={setName}
          socket={socket}
          setSocket={setSocket}
        />
      )}
    </div>
  )
}

export default App
