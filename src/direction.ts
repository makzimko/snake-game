import {Direction, TurnDirection} from "./types.ts";

const DIRECTION_VECTORS = [Direction.UP, Direction.LEFT, Direction.DOWN, Direction.RIGHT];

export const getNewDirection = (direction: Direction, turn: TurnDirection) => {
    const index = DIRECTION_VECTORS.indexOf(direction) + (turn === TurnDirection.LEFT ? 1 : -1);
    return DIRECTION_VECTORS[index] ?? DIRECTION_VECTORS[index - 4] ?? DIRECTION_VECTORS[index + 4]
}

export const getDirectionTurn = (direction: Direction, newDirection: Direction): TurnDirection | void => {
    if (isDirectionAdjacent(direction, newDirection)) {
        const distance = DIRECTION_VECTORS.indexOf(newDirection) - DIRECTION_VECTORS.indexOf(direction);
        if ((distance > 0 && distance < 3) || distance < -2) {
            return TurnDirection.LEFT;
        }
        return TurnDirection.RIGHT;
    }
}

export const isDirectionAdjacent = (direction: Direction, newDirection: Direction) => {
    const distance = Math.abs(DIRECTION_VECTORS.indexOf(direction) - DIRECTION_VECTORS.indexOf(newDirection));
    return [1, 3].includes(distance);
}

export const oppositeDirections: Record<Direction, Direction> = {
    [Direction.UP]: Direction.DOWN,
    [Direction.DOWN]: Direction.UP,
    [Direction.LEFT]: Direction.RIGHT,
    [Direction.RIGHT]: Direction.LEFT,
}