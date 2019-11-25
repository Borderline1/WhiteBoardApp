const socketio = require('socket.io')
const mongoose = require('mongoose')
const db = require('./db/index')
const Elem = require('./db/schemas/sampleSchema')

function socketWorks(server, elements, sessions) {
  const io = socketio(server)
  io.on('connection', socket => {
    socket.emit('create', elements) //not working? should render previously created elements on connect
    //maybe bc we are broadcasting on create.
    console.log(`socket ${socket.id} connected`)
    // if(interval){clearInterval(interval)}
    // See need to clear interval to not duplicate work done
    let socketArr = []
    if (!socketArr.includes(socket.id)) {
      socketArr.push(socket.id)
    }

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
    socket.on('create', async data => {
      elements.push(data)
      let elem = new Elem({any: data})
      let res = await elem.save()
      console.log(res)
      socket.emit('create', elements)
    })
    socket.on('change', data => {
      console.log('ElementsBefore', elements)
      const element = elements.find(element => element.id === data.id)
      Object.keys(element).forEach(key => {
        if (key !== 'type') {
          element[key] = data[key]
        }
      })
      console.log(elements)
      socket.emit('change', elements)
    })
    socket.on('disconnect', socket => {
      if (socketArr.length === 0) {
        clearInterval(interval)
      }
    })
  })
}

module.exports = socketWorks
