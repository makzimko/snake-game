import Snake from "./Snake.ts";
import {Segment} from "./types.ts";
import {TurnDirection} from "../types.ts";

/** Symbols for snake visualization
 * Head: △ ▷ ▽ ◁
 * Turned head: ◸ ◹ ◺ ◿
 * Body: ■
 * Turns: ◢ ◣ ◤ ◥
 * Tail: ▲ ▶ ▼ ◀
 */

describe('Snake', () => {
    it('should init snake body with default length', () => {
        const snake = new Snake();

        expect(snake.body).toHaveLength(5);
        expect(snake.body).toEqual([
            Segment.HEAD,
            Segment.STRAIGHT,
            Segment.STRAIGHT,
            Segment.STRAIGHT,
            Segment.TAIL
        ]);

        /**
         * ◁ ■ ■ ■ ▶
         */
    });

    it('should init snake with given length', () => {
        const snake = new Snake({ length: 7 });

        expect(snake.body).toHaveLength(7);

        /**
         * ◁ ■ ■ ■ ■ ■ ▶
         */
    })

    it('should init snake with minimal allowed length', () => {
        const snake = new Snake({ length: 1 });

        expect(snake.body).toHaveLength(3);

        /**
         * ◁ ■ ▶
         */
    });

    it('should turn header into given direction', () => {
        const snake = new Snake({ length: 3 });
        snake.turn(TurnDirection.LEFT);

        expect(snake.body).toEqual([
            Segment.HEAD_LEFT,
            Segment.STRAIGHT,
            Segment.TAIL
        ]);

        /**
         * ◿ ■ ▶
         */

        snake.turn(TurnDirection.RIGHT);

        expect(snake.body).toEqual([
            Segment.HEAD_RIGHT,
            Segment.STRAIGHT,
            Segment.TAIL
        ]);

        /**
         * ◹ ■ ▶
         */
    });

    it('should make move into given direction', () => {
        const snake = new Snake({ length: 5 });

        snake.turn(TurnDirection.LEFT);
        snake.move();

        expect(snake.body).toEqual([
            Segment.HEAD,
            Segment.TURN_RIGHT,
            Segment.STRAIGHT,
            Segment.STRAIGHT,
            Segment.TAIL
        ]);

        /**
         * ◁ ◣
         *   ■
         *   ■
         *   ▽
         */
    });

    it('should turn tail on turns', () => {
        const snake = new Snake({ length: 3 });
        /**
         * ◁ ■ ▶
         */

        snake.turn(TurnDirection.RIGHT);
        /**
         * ◹ ■ ▶
         */

        snake.move();
        /**
         * △
         * ◥ ▶
         */

        snake.move();
        /**
         * △
         * ■
         * ◥
         */

        expect(snake.body).toEqual([
            Segment.HEAD,
            Segment.STRAIGHT,
            Segment.TAIL_LEFT
        ]);
    });

    it("should not change it's tile while feeding", () => {
        const snake = new Snake({ length: 3 });

        snake.turn(TurnDirection.RIGHT);
        snake.move();
        snake.move();
        /**
         * △
         * ■
         * ◥
         */

        snake.move(true);
        expect(snake.body).toEqual([
            Segment.HEAD,
            Segment.STRAIGHT,
            Segment.STRAIGHT,
            Segment.TAIL_LEFT
        ]);
    })

    it('should make complex moves', () => {
        const snake = new Snake({ length: 7 });
        /**
         * ◁ ■ ■ ■ ■ ■ ▶
         */

        snake.turn(TurnDirection.RIGHT);
        snake.move();
        snake.move();
        snake.move();
        /**
         * △
         * ■
         * ■
         * ◥ ■ ■ ▶
         */
        expect(snake.body).toEqual([
            Segment.HEAD,
            Segment.STRAIGHT,
            Segment.STRAIGHT,
            Segment.TURN_LEFT,
            Segment.STRAIGHT,
            Segment.STRAIGHT,
            Segment.TAIL
        ]);

        snake.turn(TurnDirection.LEFT);
        snake.move();
        /**
         * ◁ ◣
         *   ■
         *   ■
         *   ◥ ■ ▶
         */
        expect(snake.body).toEqual([
            Segment.HEAD,
            Segment.TURN_RIGHT,
            Segment.STRAIGHT,
            Segment.STRAIGHT,
            Segment.TURN_LEFT,
            Segment.STRAIGHT,
            Segment.TAIL,
        ]);

        snake.turn(TurnDirection.LEFT);
        snake.move();
        /**
         * ◢ ◣
         * ▽ ■
         *   ■
         *   ◥ ▶
         */
        expect(snake.body).toEqual([
            Segment.HEAD,
            Segment.TURN_RIGHT,
            Segment.TURN_RIGHT,
            Segment.STRAIGHT,
            Segment.STRAIGHT,
            Segment.TURN_LEFT,
            Segment.TAIL
        ]);

        snake.turn(TurnDirection.RIGHT);
        snake.move();
        /**
         *   ◢ ◣
         * ◁ ◤ ■
         *     ■
         *     ◥
         */
        expect(snake.body).toEqual([
            Segment.HEAD,
            Segment.TURN_LEFT,
            Segment.TURN_RIGHT,
            Segment.TURN_RIGHT,
            Segment.STRAIGHT,
            Segment.STRAIGHT,
            Segment.TAIL_LEFT
        ]);
    });

    it('should detect potential collision', () => {
        const snake = new Snake({ length: 12 });

        snake.turn(TurnDirection.LEFT);
        snake.move();
        snake.move();

        snake.turn(TurnDirection.LEFT);
        snake.move();
        snake.move();

        snake.turn(TurnDirection.LEFT);
        snake.move();
        /**
         * ◢ ■ ■ ■ ■ ■ ▶
         * ■   △
         * ◥ ■ ◤
         */
        expect(() => snake.move()).toThrow(expect.objectContaining({
            collisionIndex: 7
        }));

        snake.turn(TurnDirection.RIGHT);
        snake.move();
        snake.turn(TurnDirection.LEFT);
        /**
         * ◢ ■ ■ ■ ■ ▶
         * ■   ◢ ◸
         * ◥ ■ ◤
         */
        expect(() => snake.move()).toThrow(expect.objectContaining({
            collisionIndex: 9
        }));
    });
});