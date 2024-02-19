import { BATTLE_ASSET_KEYS, BATTLE_BACKGROUND_ASSET_KEYS, CHARACTER_ASSET_KEYS, DATA_ASSET_KEYS, HEALTH_BAR_ASSET_KEYS, MONSTER_ASSET_KEYS, WORLD_ASSET_KEYS } from '../assets/asset-keys.js';
import Phaser from '../lib/phaser.js'
import { SCENE_KEYS } from './scene-keys.js';

export class PreloadScene extends Phaser.Scene
{
    constructor()
    {
        super({
            key: SCENE_KEYS.PRELOAD_SCENE,
            active: true
        });
        console.log(SCENE_KEYS.PRELOAD_SCENE);
    }

    preload(){
        const monsterPath = "assets/images/monster-tamer";
        const kenneysPath = "assets/images/kenneys-assets";
        const pimenAssetPath = 'assets/images/pimen';
        const axulArtAssetPath = "assets/images/axulart";
        const pbGamesAssetPath = "assets/images/parabellum-games";
        
        //battle backgrounds
        this.load.image(
            BATTLE_BACKGROUND_ASSET_KEYS.FOREST, 
            `${monsterPath}/battle-backgrounds/forest-background.png`
        );
        // battle assets
        this.load.image(
            BATTLE_ASSET_KEYS.HEALTH_BAR_BACKGROUND, 
            `${kenneysPath}/ui-space-expansion/custom-ui.png`
        );
        //health bar assets
        this.load.image(
            HEALTH_BAR_ASSET_KEYS.RIGHT_CAP, 
            `${kenneysPath}/ui-space-expansion/barHorizontal_green_right.png`
        );
        this.load.image(
            HEALTH_BAR_ASSET_KEYS.MIDDLE, 
            `${kenneysPath}/ui-space-expansion/barHorizontal_green_mid.png`
        );
        this.load.image(
            HEALTH_BAR_ASSET_KEYS.LEFT_CAP, 
            `${kenneysPath}/ui-space-expansion/barHorizontal_green_left.png`
        );
        //monster assets
        this.load.image(
            MONSTER_ASSET_KEYS.CARNODUSK, 
            `${monsterPath}/monsters/carnodusk.png`
        );
        this.load.image(
            MONSTER_ASSET_KEYS.IGUANIGNITE, 
            `${monsterPath}/monsters/iguanignite.png`
        );

        //load json data
        this.load.json(DATA_ASSET_KEYS.ANIMATIONS, 'assets/data/animations.json');

        //load world assets
        this.load.image(
            WORLD_ASSET_KEYS.WORLD_BACKGROUND, 
            `${monsterPath}/map/level_background.png`
        );

        // load character images
        this.load.spritesheet(
            CHARACTER_ASSET_KEYS.PLAYER, 
            `${axulArtAssetPath}/character/custom.png`,
            {
                frameWidth: 64,
                frameHeight: 88,
            }
        );
        this.load.spritesheet(
            CHARACTER_ASSET_KEYS.NPC, 
            `${pbGamesAssetPath}/characters.png`,
            {
                frameWidth: 16,
                frameHeight: 16,
            }
        );
    }

    create(){
        console.log(`[${PreloadScene.name}:preload] invoked`);
        this.#createAnimations();
        this.scene.start(SCENE_KEYS.WORLD_SCENE);
    }

    #createAnimations(){
        this.anims.create({
            key: "PLAYER_DOWN",
            frames: this.anims.generateFrameNumbers("PLAYER", {frames: [6,7,8]}),
            frameRate: 6,
            repeat: -1,
            yoyo: true,
            delay:0
        });
    }
}