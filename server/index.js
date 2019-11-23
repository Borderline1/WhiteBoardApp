const path = require('path')
const express = require('express')
const compression = require('compression')
const PORT = process.env.PORT || 8080
const app = express()
module.exports = app
// const http = require("http").Server(app);
const socketio = require('socket.io') /*(http)*/
const bodyParser = require('body-parser')
const cors = require('cors')
const faker = require('faker')

const sessions = {}
const elements = []

// logging middleware
// body parsing middleware
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// compression middleware
app.use(compression())

// static file-serving middleware
app.use(express.static(path.join(__dirname, '..', 'public')))

const generateId = () => {
  return faker.random.uuid()
}

app.post('/create_user', (req, res) => {
  const sessionKey = generateId()
  sessions[sessionKey] = new Session(req.body.name)
  res.json({success: true, sessionKey})
})

setInterval(() => {
  // maybe this setInterval is being ram intensive ??
  for (sessionKey in sessions) {
    const session = sessions[sessionKey]
    session.decrementTimer()
    if (session.getTimer() === 0) {
      delete sessions[sessionKey]
    }
  }
}, 1000)

class Session {
  constructor(name) {
    this._name = name
    this._mouseX = 0
    this._mouseY = 0
    this._timer = 10
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

  // set up our socket control center
  const io = socketio(server)
  io.on('connection', socket => {
    socket.emit('create', elements) //not working? should render previously created elements on connect
    console.log(`socket ${socket.id} connected`)
    // if(interval){clearInterval(interval)}
    // See need to clear interval to not duplicate work done
    const interval = setInterval(() => {
      const sessionKeys = Object.keys(sessions)
      const cursorPositions = []
      for (let i = 0, n = sessionKeys.length; i < n; i++) {
        const key = sessionKeys[i]
        const session = sessions[key]
        cursorPositions.push({
          x: session.getMouseX(),
          y: session.getMouseY(),
          name: session.getName(),
          sessionKey: key
        })
      }
      // console.log(cursorPositions)
      socket.broadcast.emit('cursor', cursorPositions)
      // broadcast exludes the socket that the event came from
    }, Math.round(1000 / 30))

    socket.on('cursor', data => {
      const session = sessions[data.sessionKey]
      if (session) {
        session.resetTimer()
        session.setMouseX(data.x)
        session.setMouseY(data.y)
      }
    })
    socket.on('create', data => {
      elements.push(data)
      console.log(elements)
      socket.broadcast.emit('create', elements)
    })
    // socket.on('line', data => {
    //   const session = sessions[data.sessionKey]
    //   const lineCoordinates = data.lineCoordinates
    //   io.emit('line', {
    //     lineWidth: data.lineWidth,
    //     lineColor: data.lineColor,
    //     lineCoordinates
    //   })
    // })
    socket.on('disconnect', socket => {
      clearInterval(interval)
    })
  })
}

async function bootApp() {
  // await createApp()
  await startListening()
}
// This evaluates as true when this file is run directly from the command line,
// i.e. when we say 'node server/index.js' (or 'nodemon server/index.js', or 'nodemon server', etc)
// It will evaluate false when this module is required by another module - for example,
// if we wanted to require our app in a test spec
if (require.main === module) {
  bootApp()
} else {
  createApp()
}
