import './style.css'
import Snake, {Segment} from "./Snake";
import {Direction, TurnDirection} from "./types.ts";
import {getNewDirection} from "./direction.ts";


const root = document.querySelector<HTMLDivElement>('#app')!;

const scoreElement = document.createElement('div');
scoreElement.id = 'score';

root.appendChild(scoreElement);

let score = 0;

const size = {
    width: 30,
    height: 20
}

for (let i = 0; i < size.height; i++) {
    const row = document.createElement('div');
    row.classList.add('row');
    for (let j = 0; j < size.width; j++) {
        const cell = document.createElement('div');
        cell.id = `cell-${i}-${j}`;
        cell.classList.add('cell');
        row.appendChild(cell);
    }
    root.appendChild(row);
}

const snake = new Snake({ length : 3 });
const head = {
    x: 10,
    y: 8
};
let snakeDirection = Direction.UP;
const food: { x: number, y: number } = { x: 0, y: 0 };
let rotation = 0;

const getSegmentDirection = (segment: Segment) => {
    switch (segment) {
        case Segment.TURN_LEFT:
        case Segment.HEAD_RIGHT:
            return TurnDirection.LEFT;
        case Segment.TURN_RIGHT:
        case Segment.HEAD_LEFT:
            return TurnDirection.RIGHT;
    }
}

const eraseBoard = () => {
    document.querySelectorAll('.cell').forEach((cell) => cell.classList.remove('snake', 'food'));
}

const generateFood = () => {
    food.x = Math.floor(Math.random() * size.width)
    food.y = Math.floor(Math.random() * size.height)
}
const drawSnake = () => {
    eraseBoard();

    scoreElement.innerText = score.toString();

    let x = head.x, y = head.y;
    let direction = snakeDirection;

    for (let i = 0; i < snake.body.length; i++) {
        document.querySelector(`#cell-${y}-${x}`)!.classList.add('snake');

        const segment = snake.body[i];
        const turn = getSegmentDirection(segment);
        const newDirection: Direction = turn !== undefined ? getNewDirection(direction, turn) : direction;

        let newX = x, newY = y;

        if ([Direction.LEFT, Direction.RIGHT].includes(newDirection)) {
            newX += newDirection === Direction.LEFT ? 1 : -1;
        }
        if ([Direction.UP, Direction.DOWN].includes(newDirection)) {
            newY += newDirection === Direction.UP ? 1 : -1
        }

        x = newX;
        y = newY;
        direction = newDirection;
    }

    document.querySelector(`#cell-${food.y}-${food.x}`)!.classList.add('food');
    root.style.transform = `rotate(${rotation}deg)`;
}

const getCorrectPosition = (position: number, limit: number) => {
    if (position < 0) {
        return limit + position;
    }
    if (position >= limit) {
        return position - limit;
    }
    return position;
}

const updateHeadPosition = (xDiff: number, yDiff: number) => {
    head.x = getCorrectPosition(head.x + xDiff, size.width);
    head.y = getCorrectPosition(head.y + yDiff, size.height);
}

const makeMove = () => {
    if (snakeDirection === Direction.UP) {
        updateHeadPosition(0, -1);
    }
    if (snakeDirection === Direction.DOWN) {
        updateHeadPosition(0, 1);
    }
    if (snakeDirection === Direction.LEFT) {
        updateHeadPosition(-1, 0);
    }
    if (snakeDirection === Direction.RIGHT) {
        updateHeadPosition(1, 0);
    }

    const feed = head.x === food.x && head.y === food.y;

    console.log('FEED', feed)
    if (feed) {
        score++;
        generateFood();
    }

    snake.move(feed ? 3 : 0);
    drawSnake();
}

setInterval(makeMove, 300);

generateFood();

document.addEventListener('keyup', (event) => {
    if (event.code === 'ArrowLeft') {
        snake.turn(TurnDirection.LEFT);
        snakeDirection = getNewDirection(snakeDirection, TurnDirection.LEFT);
        rotation += 90;
        drawSnake();
    }

    if (event.code === 'ArrowRight') {
        snake.turn(TurnDirection.RIGHT);
        snakeDirection = getNewDirection(snakeDirection, TurnDirection.RIGHT);
        rotation -= 90;
        drawSnake();
    }
});
