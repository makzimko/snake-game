import Snake, {Segment} from "../Snake";
import { Direction, TurnDirection } from "../types.ts";
import {getDirectionTurn, getNewDirection, oppositeDirections} from "../direction.ts";
import {CollisionError} from "../errors.ts";

export enum Cell {
  FREE,
  SNAKE,
  FOOD
}

export enum CrashCause {
  COLLISION,
  SIDE
}

type BoardSettings = {
  width: number,
  height: number,
  speed: number,
  startX: number,
  startY: number,
  startDirection: Direction,
  snakeLength?: number,
}

class Board {
  readonly #settings: BoardSettings = {
    width: 10,
    height: 20,
    speed: 500,
    startX: 0,
    startY: 0,
    startDirection: Direction.UP,
    snakeLength: 3,
  }
  readonly #snake: Snake;

  #snakeHead: {
    x: number,
    y: number,
  };
  #foodPosition: {
    x: number,
    y: number
  } = {
    x: 0,
    y: 0,
  };
  #snakeDirection: Direction;
  #playInterval?: ReturnType<typeof setInterval>;
  readonly #headUpdate: Record<Direction, [number, number]> = {
    [Direction.UP]: [0, 1],
    [Direction.DOWN]: [0, -1],
    [Direction.LEFT]: [-1, 0],
    [Direction.RIGHT]: [1, 0],
  };
  #turnQueue: Direction[] = [];

  onRender?: (board: Cell[][]) => void;
  onCrash?: (cause: CrashCause) => void;

  constructor(props: Partial<BoardSettings> = {}) {
    this.#settings = {
      ...this.#settings,
      ...props,
    };
    this.#snake = new Snake({ length: this.#settings.snakeLength });

    const { startX, startY, startDirection } = this.#settings;

    this.#snakeHead = {
      x: startX,
      y: startY
    };
    this.#snakeDirection = startDirection;
    this.generateFood();
  }

  play() {
    this.updateBoard();
    this.#playInterval = setInterval(this.makeMove.bind(this), this.#settings.speed)
  }

  pause() {
    clearInterval(this.#playInterval);
  }

  private finish(cause: CrashCause) {
    this.pause();
    if (this.onCrash) {
      this.onCrash(cause);
    }
  }

  turn(direction: Direction) {
    const lastDirection = this.#turnQueue[this.#turnQueue.length - 1] || this.#snakeDirection;
    const turn = getDirectionTurn(lastDirection, direction);

    if (turn === undefined) {
      return false;
    }

    this.#turnQueue.push(direction);
  }

  private getSegmentDirection (segment: Segment) {
    switch (segment) {
      case Segment.TURN_LEFT:
      case Segment.HEAD_RIGHT:
        return TurnDirection.LEFT;
      case Segment.TURN_RIGHT:
      case Segment.HEAD_LEFT:
        return TurnDirection.RIGHT;
    }
  }

  private generateFood() {
    this.#foodPosition.x = Math.floor(Math.random() * this.#settings.width);
    this.#foodPosition.y = Math.floor(Math.random() * this.#settings.height);
  }

  private getEmptyBoard() {
    const { width, height } = this.#settings;
    return Array.from({ length: width }, () => Array(height).fill(Cell.FREE));
  }

  private makeMove() {
    if (this.#turnQueue.length > 0) {
      const direction = this.#turnQueue.shift()!;
      const turn = getDirectionTurn(this.#snakeDirection, direction);
      this.#snakeDirection = direction;

      if (turn !== undefined) {
        this.#snake.turn(turn);
      }
    }

    const [xDiff, yDiff] = this.#headUpdate[this.#snakeDirection];

    try {
      this.updateHeadPosition(xDiff, yDiff);

      const feed = this.#snakeHead.x === this.#foodPosition.x && this.#snakeHead.y === this.#foodPosition.y;
      if (feed) {
        this.generateFood();
      }
      this.#snake.move(feed ? 1 : 0);
      this.updateBoard();
    } catch (e) {
      if (e instanceof CollisionError) {
        this.finish(CrashCause.COLLISION);
      } else {
        this.finish(CrashCause.SIDE);
      }
    }
  }

  private updateHeadPosition (xDiff: number, yDiff: number) {
    const { x, y } = this.#snakeHead;
    const newX = x + xDiff;
    const newY = y + yDiff;

    if (newX < 0 || newX >= this.#settings.width  || newY < 0 || newY >= this.#settings.height) {
      throw Error('Side crash');
    }

    this.#snakeHead = {
      x: x + xDiff,
      y: y + yDiff
    };
  }

  private updateBoard() {
    const board = this.getEmptyBoard();

    board[this.#foodPosition.x][this.#foodPosition.y] = Cell.FOOD;

    let { x, y } = this.#snakeHead;
    let direction = oppositeDirections[this.#snakeDirection];

    for (let i = 0; i < this.#snake.body.length; i++) {
      if (board[x] && board[x].length) {
        board[x][y] = Cell.SNAKE;
      }

      const segment = this.#snake.body[i];
      const turn = this.getSegmentDirection(segment);
      const newDirection = turn !== undefined ? getNewDirection(direction, turn): direction;

      let newX = x, newY = y;
      if ([Direction.LEFT, Direction.RIGHT].includes(newDirection)) {
        newX += newDirection === Direction.LEFT ? -1 : 1;
      }
      if ([Direction.UP, Direction.DOWN].includes(newDirection)) {
        newY += newDirection === Direction.UP ? 1 : -1;
      }

      x = newX;
      y = newY;
      direction = newDirection;
    }

    if (this.onRender) {
      this.onRender(board);
    }
  }
}

export default Board;