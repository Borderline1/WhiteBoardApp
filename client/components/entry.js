import React, {useEffect, useState} from 'react'
import {Button} from 'semantic-ui-react'
import sockCon from '../socket'
import io from 'socket.io-client'
const serverAddress = window.location.origin

const Entry = ({loaded, setLoaded, name, setName, socket, setSocket}) => {
  const handleNameInput = e => {
    const name = e.target.value
    setName(name)
  }
  const handleJoin = async e => {
    console.log('running')
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

  return (
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
  )
}

export default Entry
