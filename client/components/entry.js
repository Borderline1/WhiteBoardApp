import React from 'react'
import {Button, Input, Card} from 'semantic-ui-react'
const serverAddress = window.location.origin

const Entry = ({
  loaded,
  setLoaded,
  name,
  setName,
  socket,
  roomName,
  setRoomName
}) => {
  const handleNameInput = e => {
    name = e.target.value
    setName(name)
  }

  const handleRoomInput = e => {
    roomName = e.target.value
    setRoomName(roomName)
  }
  const handleJoin = e => {
    socket.emit('joinRoom', roomName)
    fetch(serverAddress + '/create_user', {
      body: JSON.stringify({
        name,
        roomName
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

  return (
    <div className="join-container">
      <h1 className="join-title">SVG Board</h1>
      <Input
        type="text"
        value={roomName}
        onChange={handleRoomInput}
        className="join-input"
        placeholder="Enter a room to use ..."
      />
      <Input
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
  )
}

export default Entry
