/* eslint-disable complexity */
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
  const [strokeColor, setStrokeColor] = useState('#000000')
  const [filling, setFilling] = useState(true)
  const [tool, setTool] = useState(types.picker)
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const [prevX, setprevX] = useState(0)
  const [prevY, setprevY] = useState(0)
  const [cursors, setCursors] = useState([])
  const [roomName, setRoomName] = useState('')
  const [name, setName] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [layers, setLayers] = useState([])
  const [indicatedLayerIds, setIndicatedLayerIds] = useState([])
  const [selectedLayerIds, setSelectedLayerIds] = useState([])
  const [dragging, setDragging] = useState(false)
  const [creating, setCreating] = useState(false)
  const [changing, setChanging] = useState(false)
  const [layerInitialPositionX, setLayerInitialPositionX] = useState(null)
  const [layerInitialPositionY, setLayerInitialPositionY] = useState(null)
  const [lasso, setLasso] = useState(null)
  const [lassoing, setLassoing] = useState(false)

  const clientLayers = layers.map(layer => {
    return {...layer, type: types[layer.type]}
  })

  const selectedLayers = clientLayers.filter(layer =>
    selectedLayerIds.includes(layer.id))
  const selectedLayer =
    selectedLayers && selectedLayers.length === 1 ? selectedLayers[0] : null

  const indicatedLayers = clientLayers.filter(layer =>
    indicatedLayerIds.includes(layer.id))
  const indicatedLayer =
    indicatedLayers && indicatedLayers.length === 1 ? indicatedLayers[0] : null

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

  const toggleFilling = bool => {
    setFilling(bool)
  }
  const handleColorChange = color => {
    setColor(color)
  }
  const handleStrokeColorChange = stroke => {
    setStrokeColor(stroke)
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
    if (tool.name === 'picker') {
      if (changing) {
        selectedLayer.type.handleChange(
          clientX,
          clientY,
          prevX,
          prevY,
          socket,
          selectedLayer,
          layerInitialPositionX,
          layerInitialPositionY
        )
      } else if (dragging) {
        tool.handleDragging(
          selectedLayers,
          layerInitialPositionX,
          layerInitialPositionY,
          prevX,
          prevY,
          clientX,
          clientY,
          socket
        )
      } else if (lassoing) {
        tool.handleLasso(
          clientX,
          clientY,
          prevX,
          prevY,
          setLasso,
          setIndicatedLayerIds,
          clientLayers
        )
      }
    } else if (creating && selectedLayer) {
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
        socket,
        strokeColor
      )
      setSelectedLayerIds([layerId])
    } else if (event.target.id !== 'canvas') {
      setDragging(true)
    } else if (event.target.id === 'canvas') {
      setSelectedLayerIds([])
      setLassoing(true)
      setLasso({x: mouseX, y: mouseY, width: 1, height: 1})
    }
  }

  const handleDisplayMouseUp = event => {
    setChanging(false)
    if (dragging) {
      setDragging(false)
    }
    if (creating) {
      //make DRY vv; note to self - Henry
      setSelectedLayerIds([])
      setprevX(null)
      setprevY(null)
      if (tool.name === 'textBox') {
        setTool(types.picker)
        setCreating(false)
      }
    }
    if (lassoing) {
      const layersToSelectIds = clientLayers.reduce((acc, layer) => {
        if (layer.x < lasso.x + lasso.width && layer.x > lasso.x) {
          if (layer.y < lasso.y + lasso.height && layer.y > lasso.y) {
            acc.push(layer.id)
          }
        }
        return acc
      }, [])
      setSelectedLayerIds(layersToSelectIds)
      setLasso(null)
      setLassoing(false)
    }
  }

  const handleSelectTool = tool => {
    setTool(tool)
    setSelectedLayerIds([])
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
            types={types}
            tool={tool}
            color={color}
            strokeColor={strokeColor}
            handleColorChange={handleColorChange}
            handleStrokeColorChange={handleStrokeColorChange}
            toggleFilling={toggleFilling}
            filling={filling}
            handleSelectTool={handleSelectTool}
            selectedLayer={selectedLayer} //taggg
            socket={socket}
          />
          <div
            id="canvas"
            //lets think about changing canvas width height soon; note to self - Henry
            style={{position: 'absolute', width: 1800, height: 1800}}
            onMouseMove={handleDisplayMouseMove}
            onMouseDown={handleDisplayMouseDown}
            onMouseUp={handleDisplayMouseUp}
          >
            {clientLayers.map((layer, index) => {
              return (
                <div
                  key={layer.id}
                  onMouseEnter={() => {
                    if (tool.name === 'picker') {
                      setIndicatedLayerIds([layer.id])
                    }
                  }}
                  onMouseLeave={() => setIndicatedLayerIds([])}
                  onMouseDown={() => {
                    setSelectedLayerIds([layer.id])
                    setDragging(true)
                    setLayerInitialPositionX(layer.x)
                    setLayerInitialPositionY(layer.y)
                    setStrokeColor(layer.props.stroke)
                    setColor(layer.props.fill)
                  }}
                  onMouseUp={() => {
                    if (dragging) return
                    else setSelectedLayerIds([layer.id])
                  }}
                  className={className('layer', {
                    indicated: indicatedLayerIds.includes(layer.id),
                    selected: selectedLayerIds.includes(layer.id)
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
                    index={index}
                    handleDelete={handleDelete}
                    setChanging={setChanging}
                    id={layer.id}
                    setSelectedLayerIds={setSelectedLayerIds} //tagg
                    selectedLayerIds={selectedLayerIds}
                    x={layer.x}
                    y={layer.y}
                  />
                </div>
              )
            })}
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
            {lasso ? (
              <div
                id="lasso"
                style={{
                  position: 'absolute',
                  left: lasso.x,
                  top: lasso.y,
                  width: lasso.width,
                  height: lasso.height,
                  border: '1px black dashed',
                  zIndex: 10
                }}
              />
            ) : null}
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
          roomName={roomName}
          setRoomName={setRoomName}
        />
      )}
    </div>
  )
}

export default App
