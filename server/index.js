const path = require('path')
const express = require('express')
const compression = require('compression')
const PORT = process.env.PORT || 8080
const app = express()
module.exports = app
// const http = require("http").Server(app);
/*(http)*/
const bodyParser = require('body-parser')
const cors = require('cors')
const uuidv1 = require('uuid/v1')
const socketWorks = require('./socket')

const sessions = {}
const elements = {}
const roomRefs = {}

// logging middleware
// body parsing middleware
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// compression middleware
app.use(compression())

// static file-serving middleware
app.use(express.static(path.join(__dirname, '..', 'public')))

//replace with real uuid gen
const generateId = () => {
  return uuidv1()
}

app.post('/create_user', (req, res) => {
  const sessionKey = generateId()
  sessions[sessionKey] = new Session(req.body.name, req.body.roomName)
  res.json({success: true, sessionKey})
})
setInterval(() => {
  // maybe this setInterval is being ram intensive ?? gets called once, works properly
  for (sessionKey in sessions) {
    const session = sessions[sessionKey]
    session.decrementTimer()
    if (session.getTimer() === 0) {
      delete sessions[sessionKey]
    }
  }
}, 1000)

class Session {
  constructor(name, roomName) {
    this._name = name
    this._room = roomName
    this._mouseX = 0
    this._mouseY = 0
    this._timer = 10
    this._socketId = null
  }
  getRoom() {
    return this._room
  }
  setRoom(roomName) {
    this._room = roomName
  }
  getName() {
    return this._name
  }
  getMouseX() {
    return this._mouseX
  }
  getMouseY() {
    return this._mouseY
  }
  setMouseX(x) {
    this._mouseX = x
  }
  setMouseY(y) {
    this._mouseY = y
  }
  resetTimer() {
    this._timer = 10
  }
  decrementTimer() {
    this._timer -= 1
  }
  getTimer() {
    return this._timer
  }
}

// any remaining requests with an extension (.js, .css, etc.) send 404
// sends index.html
app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public/index.html'))
})

app.use((req, res, next) => {
  if (path.extname(req.path).length) {
    const err = new Error('Not found')
    err.status = 404
    next(err)
  } else {
    next()
  }
})

// error handling endware
app.use((err, req, res, next) => {
  console.error(err)
  console.error(err.stack)
  res.status(err.status || 500).send(err.message || 'Internal server error.')
})

const startListening = () => {
  // start listening (and create a 'server' object representing our server)
  const server = app.listen(PORT, () =>
    console.log(`listening on port http://localhost:${PORT}`))

  // call DB to sync rooms to server

  // upload all elements to elements object before its passed to socketWorks

  // set up our socket control center
  socketWorks(server, elements, sessions, roomRefs)
}

async function bootApp() {
  await startListening()
}

if (require.main === module) {
  bootApp()
} else {
  console.log('error')
}
