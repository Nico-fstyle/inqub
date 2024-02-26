// WEBSOCKET SERVER COTE SERVEUR 

const express = require('express');
const path = require('path');
const { Server } = require("socket.io");
const { createServer } = require('http');
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);


console.log('Lien vers le serveur express nodemon : %c http://localhost:5000/', 'color: blue; text-decoration: underline;');

const LEN_LAYERS = 13
const TICK_RATE = 30;

// function tick () {
//     for (const player of players) {
//         const moves = moveMap[player.id];
//         if (moveMap[player.id]) {
//             player.x = moves.x;
//             player.y = moves.y;
//             player.direction = moves.direction;

            
//         }
//         if (encount[player.id]) {
//             player.encounters = encount[player.id];
//         }

//     }
//     io.emit('players', players);
// }

const players = [];
const moveMap = {};
const encount = [];

io.on('connect', (socket) => {
    console.log('user connected', socket.id);
    moveMap[socket.id] = {
        x: 664,
        y: 30,
        direction: 'NONE',
        moving: false,
    };
    encount[socket.id] = Array.from({ length: LEN_LAYERS }, () => -1);
    players.push({
        id: socket.id,
        x: 664,
        y: 30,
        encounters: encount[socket.id],
        direction: 'NONE',
        moving: false,
    
    });

    io.emit('newPlayerConnected', { players: players, selfId: socket.id });


    
    socket.on('move', (movements) => {
        let allowed=true;
        socket.on('collision', (movements) => {
            if (movements.collision) {
                allowed = false;
            }
        })
        if (allowed) {
            moveMap[socket.id] = {
                x: movements.x,
                y: movements.y,
                direction: movements.direction,
                moving: true,

            };
        console.log(moveMap);
        for (const player of players) {
            const moves = moveMap[player.id];
            if (moves) {
                player.x = moves.x;
                player.y = moves.y;
                player.direction = moves.direction;
                player.moving = moves.moving;
    
                
            }
            if (encount[player.id]) {
                player.encounters = encount[player.id];
            }
    
        }
        io.emit('players', players);
        };
        

          });

        //   socket.on('stop', (movements) => {
        //     moveMap[movements.id].direction = 'NONE';
        //       });

    socket.on('stop', () => {
        moveMap[socket.id].moving = false;
        const player = players.find(player => player.id === socket.id);
        if (player) {
            player.moving = false;
        } else {
            console.log("Player not found in players array");
        }
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

// setInterval(tick, 1000 / TICK_RATE)

