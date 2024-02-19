import { DIRECTION } from "../../common/direction.js";
import { getTargetPositionFromGameObjectPositionAndDirection } from "../../utils/grid-utils.js";


/**
 * @typedef CharacterConfig
 * @type {object}
 * @property {Phaser.Scene} scene
 * @property {string} assetKey
 * @property {number} [assetFrame = 0]
 * @property {import("../../types/typedef").Coordinate} position
 * @property {import("../../common/direction.js").Direction} direction
 * @property {() => void} [spriteGridMovementFinishedCallBack]
 */
export class Character {
    /** @type {Phaser.Scene} */
    _scene;
    /** @type {Phaser.GameObjects.Sprite} */
    _phaserGameObjects;
    /** @protected @type {import("../../common/direction.js").Direction} */
    _direction;
    /** @protected @type {boolean} */
    _isMoving;
    /** @protected @type {import("../../types/typedef").Coordinate} */
    _targetPosition;
    /** @protected @type {import("../../types/typedef").Coordinate} */
    _previousTargetPosition;
    /** @protected @type {() => void} */
    _spriteGridMovementFinishedCallBack;

    /**
     * @param {CharacterConfig} config
     */
    constructor(config){
        this._scene = config.scene;
        this._direction = config.direction;
        this._isMoving = false;
        this._targetPosition = {...config.position};
        this._previousTargetPosition = {...config.position};
        this._phaserGameObjects = this._scene.add.sprite(
            config.position.x, 
            config.position.y, 
            config.assetKey, 
            config.assetFrame || 0
        ).setOrigin(0,0);
        this._spriteGridMovementFinishedCallBack = config.spriteGridMovementFinishedCallBack;
    }

    /** @type {boolean} */
    get isMoving(){
        return this._isMoving;
    }
    /** @type {import("../../common/direction.js").Direction} */
    get direction(){
        return this._direction;
    }


    /**
     * @param {import("../../common/direction.js").Direction} direction
     */
    moveCharacter(direction){
        if(this._isMoving){
            return;
        }
        this._moveSprite(direction);
    }

    /**
     * @param {import("../../common/direction.js").Direction} direction
     * @returns {void}
     */
    _moveSprite(direction){
        this._direction = direction;
        if (this._isBlockingTile()){
            return
        }
        this._isMoving = true;
        this.#handleSpriteMovement();
    }

    _isBlockingTile(){
        if(this.direction === DIRECTION.NONE){ 
            return;
        }
        return false;
    }

    #handleSpriteMovement(){
        if(this.direction === DIRECTION.NONE){
            return;
        }

        const updatedPosition = getTargetPositionFromGameObjectPositionAndDirection(this._targetPosition, this._direction);
        this._previousTargetPosition = {...this._targetPosition};
        this._targetPosition.x = updatedPosition.x;
        this._targetPosition.y = updatedPosition.y;
        this._scene.add.tween({
            delay: 0,
            duration: 300,
            y:{
                from: this._phaserGameObjects.y,
                start: this._phaserGameObjects.y,
                to: this._targetPosition.y,
            },
            x:{
                from: this._phaserGameObjects.x,
                start: this._phaserGameObjects.x,
                to: this._targetPosition.x,
            },
            targets: this._phaserGameObjects,
            onComplete: ()=>{
                this._isMoving = false;
                this._previousTargetPosition = {...this._targetPosition};
            
                if(this._spriteGridMovementFinishedCallBack){
                    this._spriteGridMovementFinishedCallBack();
                }}
        })
    }
}