import './style.css'
import {Application, Container, Graphics, GraphicsContext} from 'pixi.js';
import Board, {Cell} from "./Board/Board.ts";
import {Direction} from "./types.ts";

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

const tileColor = 0x888888;
const lightColor = 0x808080;
const darkColor = 0x222222;
const width = 10;
const height = 20;
const brickSize = 23;
const strokeSize = 2;
const segmentSize = 16;

const lightBrick = new GraphicsContext();
lightBrick.rect(2, 2, 19, 19).stroke({ width: 2, color: lightColor });
lightBrick.rect(7, 7, 9, 9).fill(lightColor);

const darkBrick = new GraphicsContext();
darkBrick.rect(2, 2, 19, 19).stroke({ width: 2, color: darkColor });
darkBrick.rect(7, 7, 9, 9).fill(darkColor);

const frame = new Graphics();
frame.rect(strokeSize * 2, strokeSize * 2, brickSize * width + strokeSize * 2, brickSize * height + strokeSize * 2).stroke({ width: strokeSize, color: darkColor });

const app = new Application();
await app.init({ antialias: true, resizeTo: window, backgroundColor: tileColor });
const root = document.querySelector<HTMLDivElement>('#app')!;
root.appendChild(app.canvas);

const board = new Container();
board.zIndex = 1;
app.stage.addChild(board);

const getBrickPosition = (x: number, y: number) => {
  return {
    x: x * brickSize + strokeSize * 3,
    y: (height - y - 1) * brickSize + strokeSize * 3
  }
}

app.stage.scale = 1;

const renderBaseComponents = () => {
  app.stage.addChild(frame);

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const brick = new Graphics(lightBrick);
      const { x, y } = getBrickPosition(i, j);
      brick.x = x
      brick.y = y;
      app.stage.addChild(brick);
    }
  }
}

renderBaseComponents();

const game = new Board({ width: 10, height: 20 });
game.onRender = (boardState) => {
  board.removeChildren();

  boardState.forEach((column, i) =>
    column.forEach((cell, j) => {
      if (cell === Cell.SNAKE || cell === Cell.FOOD) {
        const brick = new Graphics(darkBrick);
        const { x, y } = getBrickPosition(i, j);
        brick.x = x;
        brick.y = y;
        board.addChild(brick);
      }
    })
  )
}
game.play();

document.addEventListener('keyup', (event) => {
  const codeMap: Record<string, Direction> = {
    'ArrowUp': Direction.UP,
    'ArrowDown': Direction.DOWN,
    'ArrowLeft': Direction.LEFT,
    'ArrowRight': Direction.RIGHT
  }

  const direction = codeMap[event.code];
  if (direction !== undefined) {
    game.turn(direction);
  }
});