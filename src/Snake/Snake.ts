import {CollisionError} from "../errors.ts";
import {Direction, TurnDirection} from "../types.ts";
import {BodySegment, HeadSegment, Segment, SnakeSettings, TailSegment} from "./types.ts";
import {getNewDirection} from "../direction.ts";

const MIN_SNAKE_LENGTH = 3;

class Snake {
    readonly #settings: SnakeSettings = {
        length: 5
    }
    readonly #directionHead = {
        [TurnDirection.LEFT]: Segment.HEAD_LEFT,
        [TurnDirection.RIGHT]: Segment.HEAD_RIGHT,
    }
    readonly #segmentHead: Record<HeadSegment, BodySegment> = {
        [Segment.HEAD]: Segment.STRAIGHT,
        [Segment.HEAD_LEFT]: Segment.TURN_RIGHT,
        [Segment.HEAD_RIGHT]: Segment.TURN_LEFT
    }
    readonly #segmentTail: Record<BodySegment, TailSegment> = {
        [Segment.STRAIGHT]: Segment.TAIL,
        [Segment.TURN_LEFT]: Segment.TAIL_LEFT,
        [Segment.TURN_RIGHT]: Segment.TAIL_RIGHT,
    }
    static directions = [Direction.UP, Direction.LEFT, Direction.DOWN, Direction.RIGHT];
    #body: Array<Segment>;

    constructor(props: Partial<SnakeSettings> = {}) {
        this.#settings = {
            ...this.#settings,
            ...props
        }

        const snakeLength = Math.max(this.#settings.length, MIN_SNAKE_LENGTH);
        this.#body = [Segment.HEAD, ...(new Array(snakeLength - 2).fill(Segment.STRAIGHT)), Segment.TAIL];
    }

    get body() {
        return this.#body
    }

    move(feed: boolean = false) {
        const head = this.body[0] as HeadSegment;
        const preTail = this.body[this.body.length - 2] as BodySegment;

        const postHead = this.#segmentHead[head];
        const tail = this.#segmentTail[preTail];

        const body = [Segment.HEAD, postHead, ...this.#body.slice(1, -2)]
        if (feed) {
            body.push(...this.#body.slice(-2));
        } else {
            body.push(tail)
        }
        this.#validate(body);

        this.#body = body;
    }

    turn(direction: TurnDirection) {
        const head = this.#directionHead[direction];
        this.#body = [head, ...this.#body.slice(1)];
    }

    #validate(snake: Array<Segment>) {
        const result: Array<Array<Number | undefined>> = [[]];
        let x = 0, y = 0, width = 1, height = 1;
        let direction = Direction.RIGHT;

        for (let i = 0; i < snake.length; i++) {
            if (result[x][y] !== undefined) {
                throw new CollisionError(i - 1);
            }
            const segment = snake[i];
            result[x][y] = i;
            const newDirection = this.getDirectionAfterSegment(direction, segment);
            let newX = x, newY = y;
            if ([Direction.LEFT, Direction.RIGHT].includes(newDirection)) {
                newX += newDirection === Direction.LEFT ? -1 : 1;
            }
            if ([Direction.UP, Direction.DOWN].includes(newDirection)) {
                newY += newDirection === Direction.UP ? -1 : 1
            }

            if (newX < 0) {
                result.unshift(Array(height).fill(undefined));
                newX = 0;
                width += 1;
            }

            if (newX >= width) {
                result.push(Array(height).fill(undefined));
                width += 1;
            }

            if (newY < 0) {
                result.forEach((column) => column.unshift(undefined));
                newY = 0;
                height += 1;
            }

            if (newY >= height) {
                result.forEach((column) => column.push(undefined));
                height += 1;
            }

            direction = newDirection;
            x = newX;
            y = newY;
        }

        return result;
    }

    private getDirectionAfterSegment (direction: Direction, segment: Segment): Direction {
        if ([Segment.TURN_LEFT, Segment.TURN_RIGHT].includes(segment)) {
            const turn = segment === Segment.TURN_RIGHT ? TurnDirection.RIGHT : TurnDirection.LEFT;
            return getNewDirection(direction, turn);
        }
        return direction;
    }
}

export default Snake;