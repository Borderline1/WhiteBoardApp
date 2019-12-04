const socketio = require('socket.io')
const mongoose = require('mongoose')
const {db, Elem, Room} = require('./db')
const uuidv1 = require('uuid/v1')

function socketWorks(server, elements, sessions, roomRefs) {
  const io = socketio(server)
  let socketCount = 0
  io.on('connection', socket => {
    console.log(`socket ${socket.id} connected`)
    socket.on('joinRoom', async function(roomInfo) {
      const {roomName, roomID} = roomInfo
      console.log(`socket ${socket.id} connected to room ${roomID}`)
      socket.join(roomID)
      // getting elements
      if (!elements[roomID]) {
        // lookup in database if roomName exists
        const room = await Room.findOne({_id: roomID})
        if (room) {
          elements[roomID] = room.elements ? room.elements : []
        } else {
          const roomAdded = await Room.create({name: 'room', _id: roomID})
          elements[roomID] = []
        }
      }
      roomRefs[socket.id] = roomID
      console.log(elements[roomID], 'ROOM ELEMENTS')
      socket.emit('create', elements[roomID])
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
    socket.on('create', async data => {
      let roomId = roomRefs[socket.id]
      elements[roomId].push(data)
      socket.emit('create', elements[roomId])
      socket.to(roomId).emit('create', elements[roomId])
      const element = {
        _id: data.id,
        type: data.type,
        x: data.x,
        y: data.y,
        props: data.props
      }
      // try{
      //   const room = await Room.findOne({_id:roomId})
      //   room.elements.push(element)
      //   await room.save()
      // } catch (err) {
      //   console.error(err)
      // }
      // Room.findOneAndUpdate({_id:roomId}, {$push: {elements:element}})
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
