/* eslint-disable max-statements */
import React, {useEffect, useState} from 'react'
import SideBar from './components/SideBar'
import {types} from './components/tools'
import useInterval from '@use-it/interval'
import faker from 'faker'
import className from 'classnames'
import io from 'socket.io-client'
import {Button} from 'semantic-ui-react'
import sockCon from './socket'
import Entry from './components/entry'

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
  const [creating, setCreating] = useState(false)
  const [textBox, setTextBox] = useState('Text here')

  const clientLayers = layers.map(layer => {
    return {...layer, type: types[layer.type]}
  })

  const selectedLayer = clientLayers.find(layer => layer.id === selectedLayerId)

  const indicatedLayer = clientLayers.find(
    layer => layer.id === indicatedLayerId
  )

  //unneeded useInterval?
  useInterval(() => {
    console.log('44', loaded)
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
    // const socket = io(serverAddress)
    const runSocket = async () => {
      await setSocket(sockCon)
    }
    runSocket()
    //socket when we receive cursor data
  }, [])

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
  const handleJoin = async e => {
    await setSocket(sockCon)
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
    if (dragging) {
      console.log('dragging')
      // do things later with picker
    }
    if (creating && selectedLayerId) {
      console.log(clientX)
      tool.handleCreatingUpdate(
        selectedLayer,
        prevX,
        prevY,
        clientX,
        clientY,
        socket
      )
    }
  }

  const handleSelectTool = tool => {
    setTool(tool)
    if (tool.name === 'picker') {
      setDragging(true)
      setCreating(false)
    } else {
      setCreating(true)
      setSelectedLayerId(null)
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
            textBoxVal={textBox}
            handleTextBoxChange={handleTextBoxChange}
            handleColorChange={handleColorChange}
            handleSelectTool={handleSelectTool}
            selectedLayer={selectedLayer}
            socket={socket}
          />
          <div
            id="canvas"
            style={{position: 'absolute', width: 1800, height: 1800}}
            onMouseMove={e => handleDisplayMouseMove(e)}
            onClick={e => {
              if (e.target.id === 'canvas') setSelectedLayerId(null)
            }}
            onMouseDown={event => {
              if (creating) {
                setprevX(mouseX)
                setprevY(mouseY)
                const layerId = faker.random.uuid()
                tool.handleCreate(mouseX, mouseY, color, layerId, socket)
                setSelectedLayerId(layerId)
              } else {
                setDragging(true)
              }
            }}
            onMouseUp={event => {
              if (creating) {
                setSelectedLayerId(null)
              }
            }}
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
        <div>
          <div className="join-container">
            <input
              type="text"
              value={name}
              onChange={handleNameInput}
              className="join-input"
              placeholder="Enter a name to use ..."
            />
            <br />
            <Button className="join-button" onClick={handleJoin}>
              Join
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
