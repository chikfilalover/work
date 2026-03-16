// server.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Store connected users
let users = {};

app.get('/', (req, res) => {
    res.send('<h1>Welcome to Superhero.io Game Server</h1>');
});

io.on('connection', (socket) => {
    console.log('A user connected: ' + socket.id);

    // Handle new user
    socket.on('newUser', (username) => {
        users[socket.id] = username;
        socket.broadcast.emit('userConnected', username);
        socket.emit('userList', users);
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        const username = users[socket.id];
        delete users[socket.id];
        socket.broadcast.emit('userDisconnected', username);
        console.log('User disconnected: ' + username);
    });

    // Handle game events (e.g. move, attack)
    socket.on('gameEvent', (data) => {
        socket.broadcast.emit('gameEvent', data);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});