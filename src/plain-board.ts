import './style.css'
import Board, {Cell, CrashCause} from "./Board/Board.ts";
import {Direction} from "./types.ts";


const root = document.querySelector<HTMLDivElement>('#app')!;

const scoreElement = document.createElement('div');
scoreElement.id = 'score';

root.appendChild(scoreElement);

const size = {
    width: 10,
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
    root.prepend(row);
}

const classMap: Record<Cell, string> = {
    [Cell.SNAKE]: 'snake',
    [Cell.FOOD]: 'food',
    [Cell.FREE]: 'free'
};

const keyDirection: Record<string, Direction> | undefined = {
    'ArrowUp': Direction.UP,
    'ArrowDown': Direction.DOWN,
    'ArrowLeft': Direction.LEFT,
    'ArrowRight': Direction.RIGHT,
}

const game = new Board();
game.onRender = (board) => {
    board.forEach((column, x) =>
        column.forEach((cell, y) => {
            const element = document.querySelector(`#cell-${y}-${x}`);
            if (element) {
                element.className = classMap[cell];
                element.classList.add('cell')
            }
        })
    );
};

game.onCrash = (cause) => {
    switch (cause) {
        case CrashCause.COLLISION:
            alert('collision');
            break;
        default:
            alert('something happened')
    }
}



document.addEventListener('keyup', (event) => {
    const direction = keyDirection[event.code];
    if (direction !== undefined) {
        game.turn(direction);
    }
})

game.play();