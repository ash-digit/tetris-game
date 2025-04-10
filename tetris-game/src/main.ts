import "./style.scss";
const ROWS = 20;
const COLS = 10;

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
function update() {
  currentPiece.y++; //falling down effect
  //Did the shape hit the bottom or another locked-in piece on the playfield after falling?
  if (hasCollision(currentPiece, playfield)) {
    currentPiece.y--; //undo the move
    lockPiece(currentPiece, playfield); //copy the corresponding positions in the playfield matrix
    //clearLines(playfield); //next step after the rotatePiece function
    currentPiece = generateNewPiece(); //after locking the old piece, it generates a new random piece to fall next

    //again, check if the newly generated piece immediately colides, if yes ====> the game ends
    if (hasCollision(currentPiece, playfield)) {
      alert("Game Over!");
      //location.reload();
    }
  }
  render();
}
//listening to the a, s, d, and w keydown events to move the currentPiece around
document.addEventListener("keydown", (e) => {
  if (e.key === "a") {
    currentPiece.x--;
    if (hasCollision(currentPiece, playfield)) currentPiece.x++;
  } else if (e.key === "d") {
    currentPiece.x++;
    if (hasCollision(currentPiece, playfield)) currentPiece.x--;
  } else if (e.key === "s") {
    currentPiece.y++;
    if (hasCollision(currentPiece, playfield)) currentPiece.y--;
  } else if (e.key === "w") {
    //rotatePiece();the next praiority is working on rotatePeice function
  }
  render(); //after handling the movement, we re-render the  playfieldDiv
});

setInterval(update, 1000);
render();
