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
  console.log(socket.id)
  socket.on('submit-secret-word', (secret) => {
    console.log(secret)
    for(let s of rooms[socket.data.room].clients) {
      s.emit('share-secret', secret)
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
    socket.data.done = false
    socket.data.score = 0
    socket.data.isMaster = false
    
    if(rooms[roomId] && rooms[socket.data.room].clients.length >= 50) {
        socket.disconnect()
        return;
    }

    if (rooms[roomId]) {
      rooms[roomId].clients.push(socket);
    } else {
      rooms[roomId] = {clients: [socket]}
      socket.data.done = true
    }
    updateRoom(socket)    
   });
})
const setMaster = (socket) => {
  let active = false
  for(let s of rooms[socket.data.room].clients) {
    if(!s.data.done){
      active = true
    }
  }
  if(!active){ 
    for(let s of rooms[socket.data.room].clients) {
      s.data.done = false
      s.data.isMaster = false
      s.emit('reset')
    }
    let rand = Math.floor(Math.random()*rooms[socket.data.room].clients.length)
    rooms[socket.data.room].clients[rand].data.isMaster = true
    rooms[socket.data.room].clients[rand].data.done = true
    rooms[socket.data.room].clients[rand].emit('you-are-master')
  }
}
const updateRoom = (socket) => {
  setMaster(socket)
  for(let s of rooms[socket.data.room].clients) {
    s.emit("update-room", rooms[socket.data.room].clients.map(ss => ss.data));
  }  
}

server.listen(3000, () => {
  console.log('listening on *:3000')
})