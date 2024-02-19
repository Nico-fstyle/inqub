import { DIRECTION } from "../common/direction.js";
import { TILE_SIZE } from "../config.js";

/**
 * 
 * @param {import("../types/typedef").Coordinate} currentPosition 
 * @param {import("../common/direction").Direction} direction 
 * @returns {import("../types/typedef").Coordinate}
 */
export function getTargetPositionFromGameObjectPositionAndDirection(currentPosition, direction){
    const targetPosition = {...currentPosition};
    switch(direction){
        case DIRECTION.DOWN:
            targetPosition.y += TILE_SIZE;
            break;
        case DIRECTION.UP:
            targetPosition.y -= TILE_SIZE;
            break;
        case DIRECTION.LEFT:
            targetPosition.x -= TILE_SIZE;
            break;
        case DIRECTION.RIGHT:
            targetPosition.x += TILE_SIZE;
            break;
        default:
            throw new Error(`Error! Reached forbidden guard function with unexpected value`);
    }
    return targetPosition;
}