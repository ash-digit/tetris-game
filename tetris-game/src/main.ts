import "./style.scss";
const ROWS = 20;
const COLS = 10;

const createPlayfield = function () {
  const playfield = document.querySelector(".playfield");
  playfield!.innerHTML = "";
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.classList.add("playable");

      playfield?.appendChild(cell);
    }
  }
};

setInterval(createPlayfield, 500);

//----------------

const playfield: number[][] = Array.from({ length: ROWS }, () =>
  Array(COLS).fill(0)
);

const SHAPES = [
  [[1, 1, 1, 1]], // I
  [
    [1, 1],
    [1, 1],
  ], // O
  [
    [0, 1, 0],
    [1, 1, 1],
  ], // T
  [
    [1, 1, 0],
    [0, 1, 1],
  ], // S
  [
    [0, 1, 1],
    [1, 1, 0],
  ], // Z
  [
    [1, 1, 1],
    [1, 0, 0],
  ], // J
  [
    [1, 1, 1],
    [0, 0, 1],
  ], // L
];

let currentPiece = generateNewPiece();

const playfieldDiv = document.querySelector(".playfield")!;

function generateNewPiece() {
  const randomIndex = Math.floor(Math.random() * SHAPES.length);
  const shape = SHAPES[randomIndex];
  return {
    shape,
    x: Math.floor((COLS - shape[0].length) / 2),
    y: 0,
  };
}

function hasCollision(piece: typeof currentPiece, matrix: number[][]): boolean {
  const { shape, x, y } = piece;
  for (let row = 0; row < shape.length; row++) {
    // shape is a 2D array so we need a nested loop
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col] === 0) continue;
      const newY = y + row; //position of the little square on Y axis
      const newX = x + col; // position of the little square on X axis
      if (
        newY >= ROWS || // checks for bottom?
        newX < 0 || // checks for left wall?
        newX >= COLS || //checks for right wall?
        matrix[newY]?.[newX] //already occupied by a locked piece?
      ) {
        return true; //collision detected
      }
    }
  }
  return false; //no collision
}
