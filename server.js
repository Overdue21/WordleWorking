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
  
  
  socket.on('submit-secret-word', (secret) => {
    io.to(socket.room).emit('share-word', secret)
  })
  socket.on('submit-solution', (score) => {
    socket.data.score += score
    updateRoom(socket)
  })
  
  socket.on('join-room', async (userName, roomId) => {
    socket.data.name = userName
    socket.data.room = roomId
    socket.data.score = 0
    
    if(rooms[roomId] && rooms[socket.data.room].clients.length >= 50) {
        socket.disconnect()
        return;
    }

    if (rooms[roomId]) {
      rooms[roomId].clients.push(socket);
    } else {
      rooms[roomId] = {
        started: false,
        clients: [socket],
      };
    }

    
    updateRoom(socket)    
    if(rooms[socket.data.room].clients.length >= 3 && !rooms[socket.data.room].started) {
      let master = Math.floor(Math.random()*rooms[socket.data.room].clients.length)
      
    }
   });
})

const updateRoom = (socket) => {
    
    for(let s of rooms[socket.data.room].clients) {
        s.emit("update-room", rooms[socket.data.room].clients.map(ss => ss.data));
    }
}

server.listen(3000, () => {
  console.log('listening on *:3000')
})