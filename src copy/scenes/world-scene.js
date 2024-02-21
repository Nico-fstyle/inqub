import Phaser from '../lib/phaser.js';
import { WORLD_ASSET_KEYS } from '../assets/asset-keys.js';
import { SCENE_KEYS } from './scene-keys.js';
import { Player } from '../world/characters/player.js';
import { Controls } from '../utils/controls.js';
import { DIRECTION } from '../common/direction.js';
import { TILED_COLLISION_LAYER_ALPHA, TILE_SIZE } from '../config.js';

/** @type {import('../types/typedef.js').Coordinate} */
const PLAYER_POSITION = Object.freeze({
  x: 22 * TILE_SIZE,
  y: 1.5 * TILE_SIZE,
});

/*
  Our scene will be 16 x 9 (1024 x 576 pixels)
  each grid size will be 64 x 64 pixels
*/

export class WorldScene extends Phaser.Scene {
  /** @type {Player} */
  #player;
  /** @type {Controls} */
  #controls;
  /** @type {Phaser.Tilemaps.TilemapLayer} */
  #encounterLayer;
  /** @type {boolean} */
  #wildMonsterEncountered;

  constructor() {
    super({
      key: SCENE_KEYS.WORLD_SCENE,
    });
  }

  init() {
    console.log(`[${WorldScene.name}:init] invoked`);
    this.#wildMonsterEncountered = false;
  }

  create() {
    console.log(`[${WorldScene.name}:create] invoked`);

    const x = 22 * TILE_SIZE;
    const y = 1.5 * TILE_SIZE;

    // this value comes from the width of the level background image we are using
    // we set the max camera width to the size of our image in order to control what
    // is visible to the player, since the phaser game world is infinite.
    this.cameras.main.setBounds(0, 0, 1280, 640);
    this.cameras.main.setZoom(1);
    this.cameras.main.centerOn(x, y);

    // create map and collision layer
    const map = this.make.tilemap({ key: WORLD_ASSET_KEYS.WORLD_MAIN_LEVEL });
    // The first parameter is the name of the tileset in Tiled and the second parameter is the key
    // of the tileset image used when loading the file in preload.
    const collisionTiles = map.addTilesetImage('collision', WORLD_ASSET_KEYS.WORLD_COLLISION);
    if (!collisionTiles) {
      console.log(`[${WorldScene.name}:create] encountered error while creating collision tiles from tiled`);
      return;
    }
    const collisionLayer = map.createLayer('Collision', collisionTiles, 0, 0);
    if (!collisionLayer) {
      console.log(`[${WorldScene.name}:create] encountered error while creating collision layer using data from tiled`);
      return;
    }
    collisionLayer.setAlpha(TILED_COLLISION_LAYER_ALPHA).setDepth(0);


    this.add.image(0, 0, WORLD_ASSET_KEYS.WORLD_BACKGROUND, 0).setOrigin(0);

    this.#player = new Player({
      scene: this,
      position: PLAYER_POSITION,
      direction: DIRECTION.DOWN,
      collisionLayer: collisionLayer,
      
    });
    this.cameras.main.startFollow(this.#player.sprite);

    // create foreground for depth
    this.add.image(0, 0, WORLD_ASSET_KEYS.WORLD_FOREGROUND, 0).setOrigin(0).setDepth(1);

    this.#controls = new Controls(this);

    this.cameras.main.fadeIn(800, 0, 0, 0)
    this.cameras.main.setRoundPixels(true);

    this.input.on('wheel', (pointer, gameObject, deltaX, deltaY, deltaZ) => {
      // deltaY < 0 : zoom avant, deltaY > 0 : zoom arrière
      const zoomAmount = deltaY > 0 ? 0.1 : -0.1;
      const currentZoom = this.cameras.main.zoom + zoomAmount;

      // Limiter le dézoom en fonction de la taille de la carte
      const minZoom = Math.min(
        this.cameras.main.width / this.scale.width,
        this.cameras.main.height / this.scale.height
      );

      if (currentZoom < minZoom) {
        this.cameras.main.setZoom(minZoom);
        this.cameras.main.setRoundPixels(true);

      } else {
        this.cameras.main.setZoom(currentZoom);
      }
    });

    // Gestion du pincement pour le zoom sur les appareils tactiles
    let initialDistance = 0;

    this.input.on('pointerdown', (pointer) => {
      if (pointer.getDistance() > 20) {
        initialDistance = pointer.getDistance();
      }
    });

    this.input.on('pointerup', (pointer) => {
      if (initialDistance && pointer.getDistance() > 20) {
        const distanceDifference = initialDistance - pointer.getDistance();
        const zoomAmount = distanceDifference > 0 ? 0.01 : -0.01;
        const currentZoom = this.cameras.main.zoom + zoomAmount;

        // Limiter le dézoom en fonction de la taille de la carte
        const minZoom = Math.min(
          this.cameras.main.width / this.scale.width,
          this.cameras.main.height / this.scale.height
        );

        if (currentZoom < minZoom) {
          this.cameras.main.setZoom(minZoom);
        } else {
          this.cameras.main.setZoom(currentZoom);
        }
      }
      initialDistance = 0;
    });

    // Centrer la caméra sur le personnage
    this.cameras.main.startFollow(this.#player.sprite);
  
    
  }

  /**
   * @param {DOMHighResTimeStamp} time
   * @returns {void}
   */
  update(time) {
    if (this.#wildMonsterEncountered) {
      this.#player.update(time);
      return;
    }

    const selectedDirection = this.#controls.getDirectionKeyPressedDown();
    if (selectedDirection !== DIRECTION.NONE) {
      this.#player.moveCharacter(selectedDirection);
    }

    this.#player.update(time);
  };


}
