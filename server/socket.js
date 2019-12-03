const socketio = require('socket.io')
const mongoose = require('mongoose')
const {db, Elem, Room} = require('./db')

function socketWorks(server, elements, sessions, roomRefs) {
  const io = socketio(server)
  let socketCount = 0
  io.on('connection', socket => {
    console.log(`socket ${socket.id} connected`)
    socket.on('joinRoom', async function(roomName) {
      console.log(`socket ${socket.id} connected to room ${roomName}`)
      socket.join(roomName)
      if (!elements[roomName]) {
        // lookup in database if roomName exists
        const DBroom = await db.collection('rooms').find({roomName})
        console.log('DB ROOM ON RESULT OF LOOKUP', DBroom)
        // if it does, upload all elements into elements[roomName]

        // else
        elements[roomName] = []
      }
      roomRefs[socket.id] = roomName
      socket.emit('create', elements[roomName])
    })
    let interval
    socketCount++

    if (socketCount === 1) {
      let roomId = roomRefs[socket.id]
      interval = setInterval(() => {
        const sessionKeys = Object.keys(sessions)
        const cursorRefs = {}
        cursorRefs[roomId] = []
        for (let i = 0, n = sessionKeys.length; i < n; i++) {
          const key = sessionKeys[i]
          const session = sessions[key]
          cursorRefs[roomId].push({
            x: session.getMouseX(),
            y: session.getMouseY(),
            name: session.getName(),
            sessionKey: key
          })
        }
        socket.emit('cursor', cursorRefs[roomId])
        socket.to(roomId).emit('cursor', cursorRefs[roomId])
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
      let roomId = roomRefs[socket.id]
      elements[roomId].push(data)
      socket.emit('create', elements[roomId])
      socket.to(roomId).emit('create', elements[roomId])
      //add room structure to db
      // let elem = new Elem({
      //   _id: data.id,
      //   type: data.type,
      //   x: data.x,
      //   y: data.y,
      //   rotate: data.rotate,
      //   props: data.props
      // })
      // elem.save()
    })
    socket.on('change', data => {
      let roomId = roomRefs[socket.id]
      const element = elements[roomId].find(element => element.id === data.id)
      Object.keys(element).forEach(key => {
        if (key !== 'type') {
          element[key] = data[key]
        }
      })
      socket.emit('change', elements[roomId])
      socket.to(roomId).emit('change', elements[roomId])
      //update db and db code!
      // Elem.findOneAndUpdate(
      //   {_id: data.id},
      //   {
      //     type: data.type.name,
      //     x: data.x,
      //     y: data.y,
      //     rotate: data.rotate,
      //     props: data.props
      //   },
      //   {new: true},
      //   (error, elem) => {
      //     if (error) {
      //       console.log(elem)
      //       throw error
      //     }
      //   }
      // )
    })
    socket.on('massChange', data => {
      let roomId = roomRefs[socket.id]
      for (const layer of data) {
        const element = elements[roomId].find(
          element => element.id === layer.id
        )
        Object.keys(element).forEach(key => {
          if (key !== 'type') {
            element[key] = layer[key]
          }
        })
      }
      socket.emit('change', elements[roomId])
      socket.to(roomId).emit('change', elements[roomId])
    })
    socket.on('delete', (data, index) => {
      let roomId = roomRefs[socket.id]
      elements[roomId].splice(index, 1)
      socket.emit('delete', elements[roomId])
      socket.to(roomId).emit('delete', elements[roomId])
      //fix db datastructures and such
      // Elem.deleteOne({_id: data.id})
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
