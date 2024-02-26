import Phaser from '../lib/phaser.mjs';
import {
  CHARACTER_ASSET_KEYS,
  DATA_ASSET_KEYS,
  WORLD_ASSET_KEYS,
} from '../assets/asset-keys.mjs';
import { SCENE_KEYS } from './scene-keys.js';
import { DataUtils } from '../utils/data-utils.js';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({
      key: SCENE_KEYS.PRELOAD_SCENE,
    });
  }

  preload() {
    console.log(`[${PreloadScene.name}:preload] invoked`);

    const monsterTamerAssetPath = 'assets/images/monster-tamer';
    const axulArtAssetPath = 'assets/images/axulart';
    const pbGamesAssetPath = 'assets/images/parabellum-games';

    this.load.audio('Ambiance', ['assets/audio/ambiance.mp3']);

    // load json data
    this.load.json(DATA_ASSET_KEYS.ANIMATIONS, 'assets/data/animations.json');


    // load world assets
    this.load.image(WORLD_ASSET_KEYS.WORLD_BACKGROUND, `${monsterTamerAssetPath}/map/level_background.png`);
    this.load.tilemapTiledJSON(WORLD_ASSET_KEYS.WORLD_MAIN_LEVEL, `assets/data/level.json`);
    this.load.image(WORLD_ASSET_KEYS.WORLD_COLLISION, `${monsterTamerAssetPath}/map/collision.png`);
    this.load.image(WORLD_ASSET_KEYS.WORLD_FOREGROUND, `${monsterTamerAssetPath}/map/level_foreground.png`);
    this.load.image(WORLD_ASSET_KEYS.WORLD_ENCOUNTER_ZONE, `${monsterTamerAssetPath}/map/encounter.png`);

    // load character images
    this.load.spritesheet(CHARACTER_ASSET_KEYS.PLAYER, `${axulArtAssetPath}/character/custom.png`, {
      frameWidth: 64,
      frameHeight: 88,
    });
    this.load.spritesheet(CHARACTER_ASSET_KEYS.NPC, `${pbGamesAssetPath}/characters.png`, {
      frameWidth: 16,
      frameHeight: 16,
    });
  }

  create() {
    console.log(`[${PreloadScene.name}:create] invoked`);
    this.#createAnimations();
    this.scene.start(SCENE_KEYS.WORLD_SCENE);
  }

  #createAnimations() {
    const animations = DataUtils.getAnimations(this);
    animations.forEach((animation) => {
      const frames = animation.frames
        ? this.anims.generateFrameNumbers(animation.assetKey, { frames: animation.frames })
        : this.anims.generateFrameNumbers(animation.assetKey);
      this.anims.create({
        key: animation.key,
        frames: frames,
        frameRate: animation.frameRate,
        repeat: animation.repeat,
        delay: animation.delay,
        yoyo: animation.yoyo,
      });
    });
  }
}
