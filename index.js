const express = require('express');
const path = require('path');
const { Server } = require("socket.io");

const app = express();
const LEN_LAYERS = 13

const { createServer } = require('http');
console.log('Lien vers le serveur express nodemon : %c http://localhost:5000/', 'color: blue; text-decoration: underline;');
const httpServer = createServer(app);

const io = new Server(httpServer);

const TICK_RATE = 30;

function tick () {
    for (const player of players) {
        const moves = moveMap[player.id];
        if (moveMap[player.id]) {
            player.x = moves.x;
            player.y = moves.y;

            
        }
        if (encount[player.id]) {
            player.encounters = encount[player.id];
        }

    }
    io.emit('players', players);
}

const players = [];
const moveMap = {};
const encount = [];

io.on('connect', (socket) => {
    console.log('user connected', socket.id);
    moveMap[socket.id] = {
        x: 664,
        y: 30
    };
    encount[socket.id] = Array.from({ length: LEN_LAYERS }, () => -1);
    players.push({
        id: socket.id,
        x: 664,
        y: 30,
        encounters: encount[socket.id],
    });
    
    socket.on('move', (movements) => {
        moveMap[socket.id] = movements;
        console.log(moveMap);

          });

    socket.on('encounter', (data) => {
    if (data.layer[1] === 1) {
            console.log(`player ${socket.id} entered layer ${data.layer[0]}`);
            encount[socket.id][data.layer[0]] = 1;
        }
        else {
            console.log(`player ${socket.id} exited layer ${data.layer[0]}`);
            encount[socket.id][data.layer[0]] = -1;
        };
    });

    

});

app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'src')));


httpServer.listen(5000);

setInterval(tick, 1000 / TICK_RATE)

