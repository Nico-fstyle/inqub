const express = require('express');
const path = require('path');
const { Server } = require("socket.io");

const app = express();

const { createServer } = require('http');

const httpServer = createServer(app);

const io = new Server(httpServer);

const TICK_RATE = 30;

function tick () {
    for (const player of players) {
        const moves = moveMap[player.id];
        if (moveMap[player.id]) {
            player.x = moves.x;
            player.y = moves.y;
        };
    }
    io.emit('players', players);


}

const players = [];
const moveMap = {};

io.on('connect', (socket) => {
    console.log('user connected', socket.id);
    moveMap[socket.id] = {
        x: 664,
        y: 30
    };
    players.push({
        id: socket.id,
        x: 664,
        y: 30
    });
    
    socket.on('move', (movements) => {
        moveMap[socket.id] = movements;
        console.log(moveMap);    });
});

app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'src')));


httpServer.listen(5000);

setInterval(tick, 1000 / TICK_RATE)

