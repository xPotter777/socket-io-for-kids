const express = require('express')
const app = express()
const http = require('http')
const cors = require('cors')
const {Server} = require('socket.io')

app.use(cors())

const server = http.createServer(app)

const ioServer = new Server(server, {
    cors : {
        origin: 'http://localhost:3000',
        methods: ['GET','POST'],
    }
})

ioServer.on('connection', (socket) => {
    console.log(`User ${socket.id} connected`)

    socket.on('join-room', (roomId, username) => {
        socket.join(roomId)
        console.log(`User ${username} joined the room ${roomId}`)
    })

    socket.on('send-message',(data) => {
        socket.to(data.room).emit('receive-message', data)
    })

    socket.on('disconnect', () => {
        console.log('User disconnected',socket.id)
    })
})


server.listen(3001, () => {
    console.log('Server has started')
})