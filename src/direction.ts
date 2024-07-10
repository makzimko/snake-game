import {Direction, TurnDirection} from "./types.ts";

const DIRECTION_VECTORS = [Direction.UP, Direction.LEFT, Direction.DOWN, Direction.RIGHT];
export const getNewDirection = (direction: Direction, turn: TurnDirection) => {
    const index = DIRECTION_VECTORS.indexOf(direction) + (turn === TurnDirection.LEFT ? 1 : -1);
    return DIRECTION_VECTORS[index] ?? DIRECTION_VECTORS[index - 4] ?? DIRECTION_VECTORS[index + 4]
}