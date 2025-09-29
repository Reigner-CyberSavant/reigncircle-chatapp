
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT,()=> console.log(`Server is running on Port: ${PORT}`));

const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));


//create varable for connected sockets
let socketsConnected = new Set();

//listen for the connection event on websocket server
io.on ('connection', onConnected);

function onConnected (socket) {
    console.log(socket.id)
    socketsConnected.add(socket.id)
    io.emit('active-users', socketsConnected.size)

    //Display then delete disconnected socket(s) id
    socket.on ('disconnect', () => {
        console.log('socket disconnected:', socket.id)
        socketsConnected.delete(socket.id)
        io.emit('active-users', socketsConnected.size)
    });

    socket.on ('message', (data) => {
        console.log(data)
        socket.broadcast.emit('chat-message', data)
    })
};
