const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)
const path = require("path")

app.use(express.static("build"))

app.get('/game/', (req, res) => {

})

let rooms = {}

//on client side, const socket must me initialized to io() after importing from 'socket.io-client
io.on('connection', async (socket) => {
  socket.on('disconnect', () => {
    let index = rooms[socket.data.room].clients.indexOf(socket)
    rooms[socket.data.room].clients.splice(index, 1)
    if (rooms[socket.data.room].clients.length > 0) {
      updateRoom(socket)
    }
  })
  socket.on('submit-secret-word', (secret) => {
    console.log(secret)
    socket.data.done = true
    for (let s of rooms[socket.data.room].clients) {
      s.emit('share-secret', secret)
      s.data.done = false
    }
  })
  socket.on('submit-solution', (score) => {
    socket.data.score += score
    socket.data.done = true
    updateRoom(socket)
  })

  socket.on('join-room', async (userName, roomId) => {
    socket.data.name = userName
    socket.data.room = roomId
    socket.data.done = true
    socket.data.score = 0
    socket.data.isMaster = false

    if (rooms[roomId] && rooms[socket.data.room].clients.length >= 50) {
      socket.disconnect()
      return;
    }

    if (rooms[roomId] && rooms[roomId].clients.length > 0) {
      rooms[roomId].clients.push(socket);
    } else {
      rooms[roomId] = { clients: [socket] }
      socket.data.done = true
    }
    updateRoom(socket)
  });
})
const setMaster = (socket) => {
  let active = false
  let master = 0
  for (let s of rooms[socket.data.room].clients) {
    if (!s.data.done) {
      active = true
    }
  }
  if (!active) {
    console.log('fml')
    for (let s of rooms[socket.data.room].clients) {
      if(s.data.isMaster){
        master = rooms[socket.data.room].clients.indexOf(s) 
      }
      s.data.done = true
      s.data.isMaster = false
      s.emit('reset')
    }
    let m = master + 1;
    if (!!rooms[socket.data.room].clients[m]) {
      rooms[socket.data.room].clients[m].data.isMaster = true
      rooms[socket.data.room].clients[m].data.done = false
      rooms[socket.data.room].clients[m].emit('you-are-master')
    }else{
      rooms[socket.data.room].clients[0].data.isMaster = true
      rooms[socket.data.room].clients[0].data.done = false
      rooms[socket.data.room].clients[0].emit('you-are-master')
    }
  }
}
const updateRoom = (socket) => {
  setMaster(socket)
  for (let s of rooms[socket.data.room].clients) {
    s.emit("update-room", rooms[socket.data.room].clients.map(ss => ss.data));
  }
}

server.listen(3000, () => {
  console.log('listening on *:3000')
})