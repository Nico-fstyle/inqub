import { SCENE_KEYS } from './scenes/scene-keys.js';
import { PreloadScene } from './scenes/preload-scene.js';
import { BattleScene } from './scenes/battle-scene.js';
import { WorldScene } from './scenes/world-scene.js';
// WEBSOCKET SERVER COTE CLIENT : voir world_scene

// const socket = io('ws://localhost:5000'); // Établir la connexion WebSocket

// let players = [];

// socket.on('connect', () => {
//   console.log('connected');
// });

// socket.on('players', (serverPlayers) => {
//   players = serverPlayers;
// });

// export { socket, players };

const game = new Phaser.Game({
  type: Phaser.CANVAS,
  pixelArt: true,
  scale: {
    parent: 'game-container',
    width: 1024,
    height: 576,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  backgroundColor: '#000000',
});


window.addEventListener('load', () => {
  const canvas = document.querySelector('canvas');
  if (canvas) {
    canvas.style.borderRadius = '20px'; 
    canvas.style.overflow = 'hidden'; 
  }
});

game.scene.add(SCENE_KEYS.PRELOAD_SCENE, PreloadScene);
game.scene.add(SCENE_KEYS.WORLD_SCENE, WorldScene);
game.scene.start(SCENE_KEYS.PRELOAD_SCENE);



// let socket;
// let players = [];

// function initSocket(io) {
//   socket = io;

//   socket.on('connect', () => {
//     console.log('connected');
//   });

//   socket.on('players', (serverPlayers) => {
//     players = serverPlayers;
//   });
// }
// initSocket(io);
// export { socket, players };

// const socket = io(`ws://localhost:5000`);

// let players = [];

// socket.on('connect', () => {
//   console.log('connected');
// });

// socket.on('players', (serverPlayers) => {
//   players = serverPlayers;
// });

// export default socket ;