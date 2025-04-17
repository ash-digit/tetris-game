import "./style.scss";
const ROWS = 20;
const COLS = 10;
let time = 500;
let score: number = 0;
let isPaused: boolean = false;
let speed = 1;
function createEmptyPlayfield() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}
let playfield = createEmptyPlayfield();
let intervalId: number | undefined;
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

const upcomingPieces: number[][][] = [];

function fillUpcomingPieces() {
  while (upcomingPieces.length < 3) {
    const randomIndex = Math.floor(Math.random() * SHAPES.length);
    const shape = SHAPES[randomIndex];
    upcomingPieces.push(shape);
  }
}
let speedometer = document.querySelector("#speedometer");
let fasterBtn = document.querySelector("#faster");
let slowerBtn = document.querySelector("#slower");
fasterBtn?.addEventListener("click", () => {
  if (time > 120) {
    clearInterval(intervalId);
    time -= 20;
    speed += 1;
    speedometer!.innerHTML = " " + speed.toString();
    console.log("time ---->", time);
    intervalId = setInterval(update, time);
  }
});
slowerBtn?.addEventListener("click", () => {
  if (time < 500) {
    clearInterval(intervalId);
    time += 20;
    speed -= 1;
    speedometer!.innerHTML = " " + speed.toString();
    console.log("time ---->", time);
    intervalId = setInterval(update, time);
  }
});
const playfieldDiv = document.querySelector(".playfield")!;

//renderNextPieces will run in generateNewPiece right after fillUpcomingPieces function call
//so we can see the next 3 pieces in the DOM
function renderNextPieces() {
  const container = document.getElementById("nextPieces");
  if (!container) return;
  container.innerHTML = ""; // clear old previews
  upcomingPieces.forEach((shape) => {
    //looping through shapes in the upcommingPieces arr
    const preview = document.createElement("div");
    preview.className = "preview-piece";
    const width = shape[0].length;
    preview.style.gridTemplateColumns = `repeat(${width}, 32px)`;
    shape.forEach((row) => {
      row.forEach((cell) => {
        const cellDiv = document.createElement("div");
        cellDiv.className = "cell";
        if (cell) cellDiv.classList.add("filled"); //if cell has the value of 1 the class filled would be added
        preview.appendChild(cellDiv);
      });
    });

    container.appendChild(preview);
  });
}
const pauseAndContinue = document.getElementById("pause-continue");
pauseAndContinue?.addEventListener("click", () => {
  if (isPaused) {
    isPaused = false;
    pauseAndContinue.innerHTML = "PAUSE";
  } else {
    isPaused = true;
    pauseAndContinue.innerHTML = "CONTINUE";
  }
});

let reset = document.getElementById("reset");
reset?.addEventListener("click", () => {
  pauseAndContinue!.innerHTML = "PAUSE";
  restartGame();
});

let currentPiece = generateNewPiece();

function restartGame() {
  playfield = createEmptyPlayfield();
  currentPiece = generateNewPiece();
  isPaused = false;
  score = 0;
  updateScore(score);

  render();
}

function generateNewPiece() {
  fillUpcomingPieces();
  const shape = upcomingPieces.shift();
  fillUpcomingPieces();
  renderNextPieces();
  return {
    shape,
    x: Math.floor((COLS - shape![0].length) / 2),
    y: 0,
  };
}
//hasCollision can check if a tetris shape would bump into (walls, floor or other locked pieaces)
function hasCollision(piece: typeof currentPiece, matrix: number[][]): boolean {
  const { shape, x, y } = piece;
  for (let row = 0; row < shape!.length; row++) {
    // shape is a 2D array so we need a nested loop
    for (let col = 0; col < shape![row].length; col++) {
      if (shape![row][col] === 0) continue;
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
function updateScore(score: number) {
  let scoreCounter = document.querySelector("#counter");
  if (!scoreCounter) return;

  scoreCounter.innerHTML = score.toString();
}
//lockPiece permanently adds the current falling piece to the playfield
function lockPiece(piece: typeof currentPiece, matrix: number[][]) {
  const { shape, x, y } = piece;
  //looping through every cell in the shape matrix
  for (let row = 0; row < shape!.length; row++) {
    for (let col = 0; col < shape![row].length; col++) {
      //checking if this part of the shape is filled with value of 1
      if (shape![row][col]) {
        matrix[y + row][x + col] = shape![row][col]; //taking the filled cell of the shape, copy it to the palyfield
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
      updateScore(score);
      row++; // recheck current row
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
        row < currentPiece.y + currentPiece.shape!.length && //the current row is above the bottom of the piece
        col >= currentPiece.x && //the current column is to the right or at the left edge of the piece
        col < currentPiece.x + currentPiece.shape![0].length; //the current column is to the left of the right edge of the piece

      if (
        inPiece &&
        currentPiece.shape![row - currentPiece.y]?.[col - currentPiece.x] //is this part of the shape filled?
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
  const rows = shape!.length;
  const cols = shape![0].length;

  const rotated: number[][] = [];

  for (let col = 0; col < cols; col++) {
    const newRow: number[] = [];
    for (let row = rows - 1; row >= 0; row--) {
      newRow.push(shape![row][col]);
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

intervalId = setInterval(update, time);
render();
