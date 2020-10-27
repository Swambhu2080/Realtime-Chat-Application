const express = require('express')
const app = express()
const http = require('http').createServer(app)
const path =require('path')
const PORT = process.env.PORT || 8000

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

app.use(express.static(path.join(__dirname, "/public")))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

// Socket

const io = require('socket.io')(http)

const user = {};


io.on('connection', (socket) => {

    console.log('Connected...')

    socket.on('new-user-joined', (name) =>{
        console.log("New user", name)
        user[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });


    socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg)
    })

    socket.on('disconnect', (message) =>{
        console.log("New user", message)
        socket.broadcast.emit('left', user[socket.id]);
        delete user[socket.id];
    });

})