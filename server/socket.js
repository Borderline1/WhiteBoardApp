const socketio = require('socket.io')
const mongoose = require('mongoose')
const db = require('./db/index')
const Elem = require('./db/schemas/shapeSchema')

function socketWorks(server, elements, sessions) {
  const io = socketio(server)
  let socketCount = 0
  io.on('connection', socket => {
    socket.on('joinRoom', function(roomName) {
      socket.join(roomName)
      // console.log('sessions 12', sessions)
      // console.log('sOCKET', socket)
      if (!elements[roomName]) {
        elements[roomName] = []
        // console.log('sessions 17', sessions)
      }
      socket.emit('create', elements[roomName])
    })
    // socket.emit('create', elements) //not working? should render previously created elements on connect
    //maybe bc we are broadcasting on create.
    console.log(`socket ${socket.id} connected`)
    let interval
    socketCount++

    if (socketCount === 1) {
      interval = setInterval(() => {
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
        socket.emit('cursor', cursorPositions)
        // broadcast exludes the socket that the event came from
      }, Math.round(1000 / 30))
    }
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
      socket.emit('create', elements)
      socket.broadcast.emit('create', elements)
      let elem = new Elem({
        _id: data.id,
        type: data.type,
        x: data.x,
        y: data.y,
        rotate: data.rotate,
        props: data.props
      })
      elem.save()
    })
    socket.on('change', data => {
      const element = elements.find(element => element.id === data.id)
      Object.keys(element).forEach(key => {
        if (key !== 'type') {
          element[key] = data[key]
        }
      })
      socket.emit('change', elements)
      socket.broadcast.emit('change', elements)
      Elem.findOneAndUpdate(
        {_id: data.id},
        {
          type: data.type.name,
          x: data.x,
          y: data.y,
          rotate: data.rotate,
          props: data.props
        },
        {new: true},
        (error, elem) => {
          if (error) {
            console.log(elem)
            throw error
          }
        }
      )
    })
    socket.on('delete', (data, index) => {
      elements.splice(index, 1)
      socket.emit('delete', elements)
      socket.broadcast.emit('delete', elements)
      Elem.deleteOne({_id: data.id})
    })
    socket.on('disconnect', socket => {
      --socketCount
      console.log('socket disconnected:', socket)
      if (socketCount === 0) {
        clearInterval(interval)
      }
    })
  })
}

module.exports = socketWorks
