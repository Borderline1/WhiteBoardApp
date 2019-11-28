import React from 'react'
import {Button} from 'semantic-ui-react'
const serverAddress = window.location.origin

const Entry = ({loaded, setLoaded, name, setName}) => {
  const handleNameInput = e => {
    const name = e.target.value
    setName(name)
  }
  const handleJoin = e => {
    console.log('running')

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
