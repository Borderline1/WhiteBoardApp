import React, {useEffect} from 'react'
import {Button, Input, Card, Container} from 'semantic-ui-react'
import {withRouter} from 'react-router'
const serverAddress = window.location.origin
const queryString = require('query-string')
const uuidv1 = require('uuid/v1')

const Entry = ({
  loaded,
  setLoaded,
  name,
  setName,
  socket,
  roomName,
  setRoomName,
  history
}) => {
  useEffect(() => {
    const parsedQueryString = queryString.parse(window.location.search)
    if (parsedQueryString.name) setRoomName(parsedQueryString.name)
  })

  const handleNameInput = e => {
    name = e.target.value
    setName(name)
  }

  const handleRoomInput = e => {
    roomName = e.target.value
    setRoomName(roomName)
  }
  const handleJoin = e => {
    const parsedQueryString = queryString.parse(window.location.search)
    const roomID = parsedQueryString.id ? parsedQueryString.id : uuidv1()
    socket.emit('joinRoom', {roomName, roomID})
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
    const query = queryString.stringify({name: roomName, id: roomID})
    history.push(`?${query}`)
  }

  return (
    <div className="join-container">
      <Input
        type="text"
        value={roomName}
        onChange={handleRoomInput}
        className="join-input"
        disabled={!!window.location.search}
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

export default withRouter(Entry)
