import React, {useEffect, useState} from 'react'
import SideBar from './components/SideBar'
import {types} from './components/tools'
import useInterval from '@use-it/interval'
import faker from 'faker'
import className from 'classnames'

import io from 'socket.io-client'

const serverAddress = window.location.origin

const App = () => {
  const canvas = document.querySelector('#canvas')
  const [socket, setSocket] = useState(null)
  const [color, setColor] = useState('#000000')
  const [tool, setTool] = useState(types.circle)
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
  const [create, setCreate] = useState(false)
  const [textBox, setTextBox] = useState('Text here')

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
    //socket when we receive cursor data
  }, [])

  useEffect(() => {
    if (loaded) {
      socket.on('cursor', data => {
        setCursors(data)
      })
      socket.on('create', elements => {
        setLayers(elements)
      })
      socket.on('change', elements => {
        setLayers(elements)
      })
    }
  }, [loaded])

  useEffect(() => {
    if (loaded) {
      let notnow = false
      const mouseDown = () => {
        if (notnow) {
          //Create element
          console.log('hey')
          tool.handleDoubleClick(
            layers,
            setLayers,
            mouseX + window.scrollX - 8,
            mouseY + window.scrollY - 22,
            color,
            faker.random.uuid(),
            socket
          )
        } else {
          //Moving element
          setDragging(true)
        }
      }
      const mouseUp = () => {
        setDragging(false)
      }
      const canvasDiv = document.querySelector('#canvas')
      if (!canvasDiv) return
      canvasDiv.addEventListener('mousedown', mouseDown)
      window.addEventListener('mouseup', mouseUp)
      return () => {
        canvasDiv.removeEventListener('mousedown', mouseDown)
        window.removeEventListener('mouseup', mouseUp)
      }
    }
  })

  const handleNameInput = e => {
    const name = e.target.value
    setName(name)
  }
  const handleJoin = e => {
    fetch(serverAddress + '/create_user', {
      body: JSON.stringify({
        name
      }),
      method: 'post',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(json => {
        if (json.success) {
          localStorage.sessionKey = json.sessionKey
          setLoaded(true)
        }
      })
  }

  const handleColorChange = color => {
    setColor(color)
  }

  const handleTextBoxChange = text => {
    setTextBox(text)
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
    if (create) {
      if (name !== 'x' && name !== 'y') {
        console.log('PROPS CAN BE TRUE')
        socket.emit('change', {
          ...selectedLayer,
          props: {...selectedLayer.props, [name]: editValue}
        })
      } else {
        socket.emit('change', {...selectedLayer, [name]: editValue})
      }
    }
  }

  const handleSelectTool = tool => {
    setTool(tool)
    if (tool.name === 'picker') {
      setCreate(false)
    } else {
      setCreate(false)
    }
  }

  const handleChange = e => {
    const {type, name, value} = e.target
    console.log(type, name, value, e)
    let editValue
    if (type === 'number') {
      editValue = +value
    } else if (type === 'color') {
      console.log(e.target.value)
    }

    if (name !== 'x' && name !== 'y') {
      console.log('PROPS CAN BE TRUE')
      socket.emit('change', {
        ...selectedLayer,
        props: {...selectedLayer.props, [name]: editValue}
      })
    } else {
      socket.emit('change', {...selectedLayer, [name]: editValue})
    }
  }

  return (
    <div className="App">
      {loaded ? (
        <div>
          <SideBar
            color={color}
            types={types}
            tool={tool}
            textBox={textBox}
            handleTextBoxChange={handleTextBoxChange}
            handleColorChange={handleColorChange}
            handleSelectTool={handleSelectTool}
            selectedLayer={selectedLayer}
            socket={socket}
          />
          <div
            id="canvas"
            style={{position: 'absolute', width: 1800, height: 1800}}
            onMouseMove={
              e => handleDisplayMouseMove(e)
              // dragging implementation
            }
            onClick={e => {
              if (e.target.id === 'canvas') setSelectedLayerId(null)
            }}
            onDoubleClick={event => {
              tool.handleDoubleClick(
                layers,
                setLayers,
                mouseX + window.scrollX - 20,
                // 20 represents a tool specific offset to center the object
                mouseY + window.scrollY - 20,
                color,
                faker.random.uuid(),
                socket
              )
            }}
            //   onMouseUp={this.handleDisplayMouseUp.bind(this)}
          >
            {layers
              ? clientLayers.map(layer => {
                  return (
                    <div
                      key={layer.id}
                      onMouseEnter={() => {
                        setIndicatedLayerId(layer.id)
                      }}
                      onMouseLeave={() => setIndicatedLayerId(null)}
                      onMouseDown={() => {
                        setSelectedLayerId(layer.id)
                      }}
                      onMouseUp={() => {
                        if (dragging) return
                        // if (layer.id === selectedLayerId) setSelectedLayerId(null);
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
                      <layer.type.ElementComponent {...layer.props} />
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
        <div className="join-container">
          <input
            type="text"
            value={name}
            onChange={handleNameInput}
            className="join-input"
            placeholder="Enter a name to use ..."
          />
          <br />
          <button className="join-button" onClick={handleJoin}>
            Join
          </button>
        </div>
      )}
    </div>
  )
}

export default App
