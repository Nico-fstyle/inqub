import Phaser from './lib/phaser.js';
import { SCENE_KEYS } from './scenes/scene-keys.js';
import { PreloadScene } from './scenes/preload-scene.js';
import { BattleScene } from './scenes/battle-scene.js';
import { WorldScene } from './scenes/world-scene.js';

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
    canvas.style.borderRadius = '20px'; // Par exemple, un border radius de 10 pixels
    canvas.style.overflow = 'hidden'; // Assurez-vous que le contenu ne dépasse pas les coins arrondis

  }
});

game.scene.add(SCENE_KEYS.PRELOAD_SCENE, PreloadScene);
game.scene.add(SCENE_KEYS.WORLD_SCENE, WorldScene);
game.scene.add(SCENE_KEYS.BATTLE_SCENE, BattleScene);
game.scene.start(SCENE_KEYS.PRELOAD_SCENE);
