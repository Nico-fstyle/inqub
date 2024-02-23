import Phaser from '../lib/phaser.js';
import { WORLD_ASSET_KEYS } from '../assets/asset-keys.js';
import { SCENE_KEYS } from './scene-keys.js';
import { Player } from '../world/characters/player.js';
import { Controls } from '../utils/controls.js';
import { DIRECTION } from '../common/direction.js';
import { TILED_COLLISION_LAYER_ALPHA, TILE_SIZE } from '../config.js';
import socket from '../main.js';
import players from '../main.js';





/** @type {import('../types/typedef.js').Coordinate} */
const PLAYER_POSITION = Object.freeze({
  x: 82 * TILE_SIZE,
  y: 6.5 * TILE_SIZE,
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
  /** @type {Phaser.Tilemaps.TilemapLayer | undefined} */
  #work1Layer;
  /** @type {Phaser.Tilemaps.TilemapLayer | undefined} */
  #work2Layer;
  /** @type {Phaser.Tilemaps.TilemapLayer | undefined} */
  #work3Layer;
  /** @type {Phaser.Tilemaps.TilemapLayer | undefined} */
  #work4Layer;
  /** @type {Phaser.Tilemaps.TilemapLayer | undefined} */
  #work5Layer;
  /** @type {Phaser.Tilemaps.TilemapLayer | undefined} */
  #work6Layer;
  /**@type {Phaser.Tilemaps.TilemapLayer | undefined} */
  #work7Layer;
  /** @type {Phaser.Tilemaps.TilemapLayer | undefined} */
  #work8Layer;
  /** @type {Phaser.Tilemaps.TilemapLayer | undefined} */
  #chiefLayer;
  /**@type {Phaser.Tilemaps.TilemapLayer | undefined} */
  #reunion1Layer;
  /** @type {Phaser.Tilemaps.TilemapLayer | undefined} */
  #reunion2Layer;
  /** @type {Phaser.Tilemaps.TilemapLayer | undefined} */
  #reunion3Layer;
  /** @type {Phaser.Tilemaps.TilemapLayer | undefined} */
  #reunion4Layer;

  constructor() {
    super({
      key: SCENE_KEYS.WORLD_SCENE,

    });
    this.M = [];
  }

  init() {
    console.log(`[${WorldScene.name}:init] invoked`);
    this.#wildMonsterEncountered = false;
  }

  create() {
    console.log(`[${WorldScene.name}:create] invoked`);

    const x = 88 * TILE_SIZE;
    const y = 6 * TILE_SIZE;

    // this value comes from the width of the level background image we are using
    // we set the max camera width to the size of our image in order to control what
    // is visible to the player, since the phaser game world is infinite.
    this.cameras.main.setBounds(0, 0, 1280, 640);
    this.cameras.main.setZoom(1);
    this.cameras.main.centerOn(x, y);

    // create map and collision layer
    const map = this.make.tilemap({ key: WORLD_ASSET_KEYS.WORLD_MAIN_LEVEL });
    // this value comes from the width of the level background image we are using
    // we set the max camera width to the size of our image in order to control what
    // is visible to the player, since the phaser game world is infinite.
    this.cameras.main.setBounds(0, 0, 1280, 640);
    this.cameras.main.setZoom(1);
    this.cameras.main.centerOn(x, y);
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

    // AJOUT DES TILED DE REUNIONS 

    const Reunion1Tiles = map.addTilesetImage('encounter', WORLD_ASSET_KEYS.WORLD_ENCOUNTER_ZONE);
    if (!Reunion1Tiles) {
      console.log(`[${WorldScene.name}:create] encountered error while creating collision tiles from tiled`);
      return;
    }
    this.#reunion1Layer = map.createLayer('Reunion 1', Reunion1Tiles, 0, 0);
    if (!this.#reunion1Layer) {
      console.log(`[${WorldScene.name}:create] encountered error while creating collision layer using data from tiled`);
      return;
    }
    this.#reunion1Layer.setAlpha(0.5).setDepth(0);

    const Reunion2Tiles = map.addTilesetImage('encounter', WORLD_ASSET_KEYS.WORLD_ENCOUNTER_ZONE);
    if (!Reunion2Tiles) {
      console.log(`[${WorldScene.name}:create] encountered error while creating collision tiles from tiled`);
      return;
    }
    this.#reunion2Layer = map.createLayer('Reunion 2', Reunion2Tiles, 0, 0);
    if (!this.#reunion2Layer) {
      console.log(`[${WorldScene.name}:create] encountered error while creating collision layer using data from tiled`);
      return;
    }
    this.#reunion2Layer.setAlpha(0.5).setDepth(0);

    const Reunion3Tiles = map.addTilesetImage('encounter', WORLD_ASSET_KEYS.WORLD_ENCOUNTER_ZONE);
    if (!Reunion3Tiles) {
      console.log(`[${WorldScene.name}:create] encountered error while creating collision tiles from tiled`);
      return;
    }
    this.#reunion3Layer = map.createLayer('Reunion 3', Reunion3Tiles, 0, 0);
    if (!this.#reunion3Layer) {
      console.log(`[${WorldScene.name}:create] encountered error while creating collision layer using data from tiled`);
      return;
    }
    this.#reunion3Layer.setAlpha(0.5).setDepth(0);

    const Reunion4Tiles = map.addTilesetImage('encounter', WORLD_ASSET_KEYS.WORLD_ENCOUNTER_ZONE);
    if (!Reunion4Tiles) {
      console.log(`[${WorldScene.name}:create] encountered error while creating collision tiles from tiled`);
      return;
    }
    this.#reunion4Layer = map.createLayer('Reunion 4', Reunion4Tiles, 0, 0);
    if (!this.#reunion4Layer) {
      console.log(`[${WorldScene.name}:create] encountered error while creating collision layer using data from tiled`);
      return;
    }
    this.#reunion4Layer.setAlpha(0.5).setDepth(0);

    // CHIEF DESK REUNION

    const ChiefTiles = map.addTilesetImage('encounter', WORLD_ASSET_KEYS.WORLD_ENCOUNTER_ZONE);
    if (! ChiefTiles) {
      console.log(`[${WorldScene.name}:create] encountered error while creating collision tiles from tiled`);
      return;
    }
    this.#chiefLayer = map.createLayer('Chief desk', ChiefTiles, 0, 0);
    if (!this.#chiefLayer ) {
      console.log(`[${WorldScene.name}:create] encountered error while creating collision layer using data from tiled`);
      return;
    }
    this.#chiefLayer .setAlpha(0.5).setDepth(0);

    // WORK REUNION

    const Work1Tiles = map.addTilesetImage('encounter', WORLD_ASSET_KEYS.WORLD_ENCOUNTER_ZONE);
    if (!Work1Tiles) {
      console.log(`[${WorldScene.name}:create] encountered error while creating collision tiles from tiled`);
      return;
    }
    this.#work1Layer = map.createLayer('Work 1', Work1Tiles, 0, 0);
    if (!this.#work1Layer) {
      console.log(`[${WorldScene.name}:create] encountered error while creating collision layer using data from tiled`);
      return;
    }
    this.#work1Layer.setAlpha(0.5).setDepth(0);

    const Work2Tiles = map.addTilesetImage('encounter', WORLD_ASSET_KEYS.WORLD_ENCOUNTER_ZONE);
    if (!Work2Tiles) {
      console.log(`[${WorldScene.name}:create] encountered error while creating collision tiles from tiled`);
      return;
    }
    this.#work2Layer = map.createLayer('Work 2', Work2Tiles, 0, 0);
    if (!this.#work2Layer ) {
      console.log(`[${WorldScene.name}:create] encountered error while creating collision layer using data from tiled`);
      return;
    }
    this.#work2Layer .setAlpha(0.5).setDepth(0);

    const Work3Tiles = map.addTilesetImage('encounter', WORLD_ASSET_KEYS.WORLD_ENCOUNTER_ZONE);
    if (!Work3Tiles) {
      console.log(`[${WorldScene.name}:create] encountered error while creating collision tiles from tiled`);
      return;
    } 
    this.#work3Layer  = map.createLayer('Work 3', Work3Tiles, 0, 0);
    if (!this.#work3Layer) {
      console.log(`[${WorldScene.name}:create] encountered error while creating collision layer using data from tiled`);
      return;
    } 
    this.#work3Layer.setAlpha(0.5).setDepth(0);

    const Work4Tiles = map.addTilesetImage('encounter', WORLD_ASSET_KEYS.WORLD_ENCOUNTER_ZONE);
    if (!Work4Tiles) {
      console.log(`[${WorldScene.name}:create] encountered error while creating collision tiles from tiled`);
      return;
    }
    this.#work4Layer= map.createLayer('Work 4', Work4Tiles, 0, 0);
    if (!this.#work4Layer) {
      console.log(`[${WorldScene.name}:create] encountered error while creating collision layer using data from tiled`);
      return;
    }
    this.#work4Layer.setAlpha(0.5).setDepth(0);

    const Work5Tiles = map.addTilesetImage('encounter', WORLD_ASSET_KEYS.WORLD_ENCOUNTER_ZONE);
    if (!Work5Tiles) {
      console.log(`[${WorldScene.name}:create] encountered error while creating collision tiles from tiled`);
      return;
    }
    this.#work5Layer = map.createLayer('Work 5', Work5Tiles, 0, 0);
    if (! this.#work5Layer) {
      console.log(`[${WorldScene.name}:create] encountered error while creating collision layer using data from tiled`);
      return;
    }
    this.#work5Layer.setAlpha(0.5).setDepth(0);

    const Work6Tiles = map.addTilesetImage('encounter', WORLD_ASSET_KEYS.WORLD_ENCOUNTER_ZONE);
    if (!Work6Tiles) {
      console.log(`[${WorldScene.name}:create] encountered error while creating collision tiles from tiled`);
      return;
    }
    this.#work6Layer = map.createLayer('Work 6', Work6Tiles, 0, 0);
    if (!this.#work6Layer) {
      console.log(`[${WorldScene.name}:create] encountered error while creating collision layer using data from tiled`);
      return;
    }
    this.#work6Layer.setAlpha(0.5).setDepth(0);

    const Work7Tiles = map.addTilesetImage('encounter', WORLD_ASSET_KEYS.WORLD_ENCOUNTER_ZONE);
    if (!Work7Tiles) {
      console.log(`[${WorldScene.name}:create] encountered error while creating collision tiles from tiled`);
      return;
    }
    this.#work7Layer = map.createLayer('Work 7', Work7Tiles, 0, 0);
    if (! this.#work7Layer ) {
      console.log(`[${WorldScene.name}:create] encountered error while creating collision layer using data from tiled`);
      return;
    }
    this.#work7Layer.setAlpha(0.5).setDepth(0);

    const Work8Tiles = map.addTilesetImage('encounter', WORLD_ASSET_KEYS.WORLD_ENCOUNTER_ZONE);
    if (!Work8Tiles) {
      console.log(`[${WorldScene.name}:create] encountered error while creating collision tiles from tiled`);
      return;
    } 
    this.#work8Layer = map.createLayer('Work 8', Work8Tiles, 0, 0);
    if (! this.#work8Layer ) {
      console.log(`[${WorldScene.name}:create] encountered error while creating collision layer using data from tiled`);
      return;
    }
    this.#work8Layer.setAlpha(0.5).setDepth(0);


    // NEXT 

    this.add.image(0, 0, WORLD_ASSET_KEYS.WORLD_BACKGROUND, 0).setOrigin(0);

    
    
    this.#player = new Player({
      scene: this,
      position: PLAYER_POSITION,
      direction: DIRECTION.DOWN,
      collisionLayer: collisionLayer,
      place: -1,
      spriteGridMovementFinishedCallback: () => {
        this.#handlePlayerMovementUpdate();
      }
    });
    const CAMERA_SPEED = 0.7;
    this.M = [this.#work1Layer, this.#work2Layer, this.#work3Layer, this.#work4Layer, this.#work5Layer, this.#work6Layer, this.#work7Layer, this.#work8Layer, this.#chiefLayer, this.#reunion1Layer, this.#reunion2Layer, this.#reunion3Layer, this.#reunion4Layer];


    // Créer un effet de survol pour la caméra
    this.cameras.main.startFollow(this.#player.sprite, true, CAMERA_SPEED, CAMERA_SPEED);
    
    // Définir la zone de décalage pour centrer le joueur dans la caméra
    this.cameras.main.setFollowOffset(0, 200);
    // create foreground for depth
    this.add.image(0, 0, WORLD_ASSET_KEYS.WORLD_FOREGROUND, 0).setOrigin(0).setDepth(3);

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
      socket.emit('move', {
        x: this.#player.sprite.x,
        y: this.#player.sprite.y,
      });
    }

    this.#player.update(time);



};

 
#handlePlayerMovementUpdate() {

  for (let i = 0; i < this.M.length; i++) {
  
    const isLayer = this.M[i].getTileAtWorldXY(this.#player.sprite.x, this.#player.sprite.y, true).index !== -1;
    if (!isLayer) {
      this.M[i].setDepth(-1);
    }
    else {
      this.M[i].setDepth(1).setAlpha(0.2);
    }
 
  }
  return;
  
}

}
