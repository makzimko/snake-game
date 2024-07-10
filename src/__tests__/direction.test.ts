import {getNewDirection} from "../direction.ts";
import {Direction, TurnDirection} from "../types.ts";

describe('direction helpers', () => {
    describe('getNewDirection', () => {
        it('should define new direction after turn', () => {
            expect(getNewDirection(Direction.UP, TurnDirection.LEFT)).toBe(Direction.LEFT);
            expect(getNewDirection(Direction.RIGHT, TurnDirection.LEFT)).toBe(Direction.UP);
            expect(getNewDirection(Direction.UP, TurnDirection.RIGHT)).toBe(Direction.RIGHT);
        })
    });
});