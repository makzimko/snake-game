import Board, {Cell, CrashCause} from "./Board.ts";
import {Direction} from "../types.ts";

describe('Board', () => {
  const setup = (settings?: ConstructorParameters<typeof Board>[0]) => {
    const board = new Board(settings);
    board.onRender = jest.fn();
    board.onCrash = jest.fn();

    const getRender = (render: number) => {
      return (board.onRender as jest.Mock).mock.calls[render][0] as Cell[][];
    }

    return { board, getRender };
  };

  const getSnakeSize = (render: Cell[][]) => render.flat().filter((cell) => cell === Cell.SNAKE).length;

  it(`should call render callback only after game start and don't call on pause`, () => {
    jest.useFakeTimers();
    const { board  }  = setup();

    expect(board.onRender).not.toHaveBeenCalled();

    board.play();
    expect(board.onRender).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(500);
    expect(board.onRender).toHaveBeenCalledTimes(2);

    board.pause();

    jest.advanceTimersByTime(500);
    expect(board.onRender).toHaveBeenCalledTimes(2);
  });

  it('should create board with given size', () => {
    const settings = {
      width: 20,
      height: 30
    }
    const { board, getRender } = setup(settings);
    board.play();

    expect(board.onRender).toHaveBeenCalledTimes(1);

    const render = getRender(0);
    expect(render).toHaveLength(settings.width);
    expect(render[0]).toHaveLength(settings.height);
  });

  it('should should update board with given speed', () => {
    jest.useFakeTimers();

    const { board } = setup({ speed: 100 });
    board.play();

    jest.advanceTimersByTime(99);
    expect(board.onRender).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(1);
    expect(board.onRender).toHaveBeenCalledTimes(2);

    jest.advanceTimersByTime(100);
    expect(board.onRender).toHaveBeenCalledTimes(3);

    jest.useRealTimers();
  });

  it('should start game with snake with given length and start position', () => {
    const settings = {
      startX: 3,
      startY: 4,
      snakeLength: 5
    };
    const { board, getRender } = setup(settings);
    board.play();

    const render = getRender(0);

    expect(render[settings.startX][settings.startY]).toBe(Cell.SNAKE);

    const snakeSize = getSnakeSize(render);
    expect(snakeSize).toBe(settings.snakeLength);
  });

  it('should move snake into given direction', () => {
    jest.useFakeTimers();

    const settings = {
      startDirection: Direction.RIGHT
    };
    const { board, getRender } = setup(settings);
    board.play();

    jest.advanceTimersByTime(2000);
    expect.assertions(26);
    expect(board.onRender).toHaveBeenCalledTimes(5);

    [
      [1, 0, 0, 0, 0],
      [1, 1, 0, 0, 0],
      [1, 1, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 1, 1]
    ].forEach((move, renderNumber) => {
      const render = getRender(renderNumber);

      move.forEach((cell, x) => {
        expect(render[x][0]).toBe(cell ? Cell.SNAKE : Cell.FREE)
      });
    });

    jest.useRealTimers();
  });

  it('should make turns one by one', () => {
    jest.useFakeTimers();

    const { board, getRender } = setup();
    board.play();

    board.turn(Direction.RIGHT);
    board.turn(Direction.UP);
    board.turn(Direction.RIGHT);

    jest.advanceTimersByTime(2000);

    const render1 = getRender(2);
    expect(render1[0][0]).toBe(Cell.SNAKE);
    expect(render1[1][0]).toBe(Cell.SNAKE);
    expect(render1[1][1]).toBe(Cell.SNAKE);

    const render2 = getRender(3);
    expect(render2[0][0]).not.toBe(Cell.SNAKE)
    expect(render2[1][0]).toBe(Cell.SNAKE);
    expect(render2[1][1]).toBe(Cell.SNAKE);
    expect(render2[2][1]).toBe(Cell.SNAKE);

    const render3 = getRender(4);
    expect(render3[1][0]).not.toBe(Cell.SNAKE);
    expect(render3[1][1]).toBe(Cell.SNAKE);
    expect(render3[2][1]).toBe(Cell.SNAKE);
    expect(render3[3][1]).toBe(Cell.SNAKE);

    jest.useRealTimers();
  });

  it('should not make turn in opposite direction', () => {
    jest.useFakeTimers();

    const { board, getRender } = setup();
    board.play();

    board.turn(Direction.DOWN);

    jest.advanceTimersByTime(1500);

    const render = getRender(3);

    expect(render[0].slice(0, 4)).toEqual([
      Cell.FREE,
      Cell.SNAKE,
      Cell.SNAKE,
      Cell.SNAKE,
    ]);
  });

  it('should increase snake size on feed', () => {
    jest.useFakeTimers();

    const { board, getRender } = setup();
    board.play();

    const foodPosition = getRender(0).reduce((acc, column, x) => {
      const foodIndex = column.indexOf(Cell.FOOD);
      if (foodIndex < 0) {
        return acc;
      }
      return {
        x,
        y: foodIndex
      }
    }, { x: 0, y: 0 });

    jest.advanceTimersByTime(500 * foodPosition.y);

    board.turn(Direction.RIGHT);

    jest.advanceTimersByTime(500 * foodPosition.x);

    const initialSnakeSize = getSnakeSize(getRender(foodPosition.x + foodPosition.y - 1));

    expect(getSnakeSize(getRender(foodPosition.x + foodPosition.y))).toBe(initialSnakeSize + 1);

    jest.useRealTimers();
  });

  it('should call crash callback on side crash', () => {
    jest.useFakeTimers();

    const { board } = setup();
    board.play();

    jest.advanceTimersByTime(1000);
    expect(board.onCrash).not.toHaveBeenCalled();

    board.turn(Direction.LEFT);
    jest.advanceTimersByTime(500);

    expect(board.onCrash).toHaveBeenCalledWith(CrashCause.SIDE);

    jest.useRealTimers();
  });

  it('should call crash callback on collision', () => {
    jest.useFakeTimers();

    const { board } = setup({ snakeLength: 10, startDirection: Direction.RIGHT });
    board.onCrash = jest.fn();

    board.play();
    jest.advanceTimersByTime(1000);

    board.turn(Direction.UP);
    jest.advanceTimersByTime(1000);

    board.turn(Direction.LEFT);
    jest.advanceTimersByTime(1000);

    expect(board.onCrash).not.toHaveBeenCalled();

    board.turn(Direction.DOWN);
    jest.advanceTimersByTime(1000);

    expect(board.onCrash).toHaveBeenCalledWith(CrashCause.COLLISION);

    jest.useRealTimers();
  });
});