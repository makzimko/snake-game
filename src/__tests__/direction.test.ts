import {getDirectionTurn, getNewDirection, isDirectionAdjacent} from "../direction.ts";
import {Direction, TurnDirection} from "../types.ts";

describe('direction helpers', () => {
    describe('getNewDirection', () => {
        it('should define new direction after turn', () => {
            expect(getNewDirection(Direction.UP, TurnDirection.LEFT)).toBe(Direction.LEFT);
            expect(getNewDirection(Direction.RIGHT, TurnDirection.LEFT)).toBe(Direction.UP);
            expect(getNewDirection(Direction.UP, TurnDirection.RIGHT)).toBe(Direction.RIGHT);
        })
    });

    describe('getDirectionTurn', () => {
      it.each([
        [Direction.UP, Direction.LEFT, TurnDirection.LEFT],
        [Direction.UP, Direction.RIGHT, TurnDirection.RIGHT],
        [Direction.UP, Direction.UP, undefined],
        [Direction.UP, Direction.DOWN, undefined],

        [Direction.LEFT, Direction.DOWN, TurnDirection.LEFT],
        [Direction.LEFT, Direction.UP, TurnDirection.RIGHT],
        [Direction.LEFT, Direction.RIGHT, undefined],
        [Direction.LEFT, Direction.LEFT, undefined],

        [Direction.RIGHT, Direction.UP, TurnDirection.LEFT],
        [Direction.RIGHT, Direction.DOWN, TurnDirection.RIGHT],
        [Direction.RIGHT, Direction.LEFT, undefined],
        [Direction.RIGHT, Direction.RIGHT, undefined],

        [Direction.DOWN, Direction.RIGHT, TurnDirection.LEFT],
        [Direction.DOWN, Direction.LEFT, TurnDirection.RIGHT],
        [Direction.DOWN, Direction.UP, undefined],
        [Direction.DOWN, Direction.DOWN, undefined],
      ])('should define turn direction by current and new direction', (currentDirection, newDirection, turn) => {
        expect(getDirectionTurn(currentDirection, newDirection)).toBe(turn);
      });
    });

    describe('isDirectionAdjacent', () => {
        it.each([
          [true, Direction.UP, Direction.LEFT],
          [true, Direction.UP, Direction.RIGHT],
          [false, Direction.UP, Direction.DOWN],
          [false, Direction.UP, Direction.UP],

          [true, Direction.LEFT, Direction.UP],
          [true, Direction.LEFT, Direction.DOWN],
          [false, Direction.LEFT, Direction.RIGHT],
          [false, Direction.LEFT, Direction.LEFT],

          [true, Direction.RIGHT, Direction.UP],
          [true, Direction.RIGHT, Direction.DOWN],
          [false, Direction.RIGHT, Direction.LEFT],
          [false, Direction.RIGHT, Direction.RIGHT],

          [true, Direction.DOWN, Direction.LEFT],
          [true, Direction.DOWN, Direction.RIGHT],
          [false, Direction.DOWN, Direction.UP],
          [false, Direction.DOWN, Direction.DOWN],
        ])('should return %s if current direction is %i and new direction is %i', (result, currentDirection, newDirection) => {
            expect(isDirectionAdjacent(currentDirection, newDirection)).toBe(result);
        });
    })
});