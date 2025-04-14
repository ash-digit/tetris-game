import "./style.scss";
const ROWS = 20;
const COLS = 10;
let time = 1000;
let score: number = 0;
let isPaused: boolean = false;
function createEmptyPlayfield() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}
let playfield = createEmptyPlayfield();

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
  ], // Z
  [
    [0, 1, 1],
    [1, 1, 0],
  ], // S
  [
    [1, 1, 1],
    [1, 0, 0],
  ], // L
  [
    [1, 1, 1],
    [0, 0, 1],
  ], // J
];
let reset = document.getElementById("reset");
reset?.addEventListener("click", () => {
  console.log("clicked");
  restartGame();
});
let currentPiece = generateNewPiece();

const playfieldDiv = document.querySelector(".playfield")!;
const pauseAndContinue = document.getElementById("pause-continue");
pauseAndContinue?.addEventListener("click", () => {
  if (isPaused) {
    isPaused = false;
    pauseAndContinue.innerHTML = "Pause";
  } else {
    isPaused = true;
    pauseAndContinue.innerHTML = "Continue";
  }
});

function restartGame() {
  playfield = createEmptyPlayfield();
  currentPiece = generateNewPiece();
  isPaused = false;
  score = 0;
  render();
}

function generateNewPiece() {
  const randomIndex = Math.floor(Math.random() * SHAPES.length);
  const shape = SHAPES[randomIndex];
  return {
    shape,
    x: Math.floor((COLS - shape[0].length) / 2),
    y: 0,
  };
}
//hasCollision can check if a tetris shape would bump into (walls, floor or other locked pieaces)
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

//lockPiece permanently adds the current falling piece to the playfield
function lockPiece(piece: typeof currentPiece, matrix: number[][]) {
  const { shape, x, y } = piece;
  //looping through every cell in the shape matrix
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      //checking if this part of the shape is filled with value of 1
      if (shape[row][col]) {
        matrix[y + row][x + col] = shape[row][col]; //taking the filled cell of the shape, copy it to the palyfield
      }
    }
  }
}
//clearLines scans the rows from bottom to top so rows can shift after being cleared
function clearLines(matrix: number[][]) {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (matrix[row].every((cell) => cell !== 0)) {
      matrix.splice(row, 1); //removeing the row filled with 1s
      matrix.unshift(Array(COLS).fill(0)); //adding a new array filld with 0s to the beginning of playfield
      score += 100;
      row++; // recheck current row
    }
  }
  console.log(score);
}
function render() {
  playfieldDiv.innerHTML = ""; //wiping the screen clean
  //loop through every row and column of the playfield grid (row by row)
  for (let row = 0; row < ROWS; row++) {
    // 0 to 19(19 included)
    for (let col = 0; col < COLS; col++) {
      // 0 to 9(9 included)
      const cell = document.createElement("div");
      cell.className = "cell";
      if (playfield[row][col]) cell.classList.add("filled");

      const inPiece =
        row >= currentPiece.y && //the current row is bellow or equal to the top of the piece
        row < currentPiece.y + currentPiece.shape.length && //the current row is above the bottom of the piece
        col >= currentPiece.x && //the current column is to the right or at the left edge of the piece
        col < currentPiece.x + currentPiece.shape[0].length; //the current column is to the left of the right edge of the piece

      if (
        inPiece &&
        currentPiece.shape[row - currentPiece.y]?.[col - currentPiece.x] //is this part of the shape filled?
      ) {
        cell.classList.add("active");
      }

      playfieldDiv.appendChild(cell);
    }
  }
}
//rotates a piece by 90 degrees clockwise
function rotatePiece() {
  const shape = currentPiece.shape;
  const rows = shape.length;
  const cols = shape[0].length;

  const rotated: number[][] = [];

  for (let col = 0; col < cols; col++) {
    const newRow: number[] = [];
    for (let row = rows - 1; row >= 0; row--) {
      newRow.push(shape[row][col]);
    }
    rotated.push(newRow);
  }
  // Keep a copy of the original shape in case the rotation causes a collision
  const originalShape = currentPiece.shape;
  currentPiece.shape = rotated;

  if (hasCollision(currentPiece, playfield)) {
    // Revert back if the rotated piece would collide
    currentPiece.shape = originalShape;
  }
}

function update() {
  if (isPaused) {
    return;
  } else {
    currentPiece.y++; //falling down effect
    //Did the shape hit the bottom or another locked-in piece on the playfield after falling?
    if (hasCollision(currentPiece, playfield)) {
      currentPiece.y--; //undo the move
      lockPiece(currentPiece, playfield); //copy the corresponding positions in the playfield matrix
      clearLines(playfield);
      currentPiece = generateNewPiece(); //after locking the old piece, it generates a new random piece to fall next

      //again, check if the newly generated piece immediately colides, if yes ====> the game ends
      if (hasCollision(currentPiece, playfield)) {
        alert("Game Over!");
        //location.reload();
      }
    }
    render();
  }
}
//listening to the a, s, d, and w keydown events to move the currentPiece around
document.addEventListener("keydown", (e) => {
  if (e.key === "a" && !isPaused) {
    currentPiece.x--;
    if (hasCollision(currentPiece, playfield)) currentPiece.x++;
  } else if (e.key === "d" && !isPaused) {
    currentPiece.x++;
    if (hasCollision(currentPiece, playfield)) currentPiece.x--;
  } else if (e.key === "s" && !isPaused) {
    currentPiece.y++;
    if (hasCollision(currentPiece, playfield)) currentPiece.y--;
  } else if (e.key === "w" && !isPaused) {
    rotatePiece();
  }
  render(); //after handling the movement, we re-render the  playfieldDiv
});

setInterval(update, time);
render();
