import "./style.scss";

const rows: number = 20;
const cols: number = 10;

// Empty playfield
const playfield_matrix: number[][] = Array.from({ length: rows }, () =>
  Array(cols).fill(0)
);

console.log(playfield_matrix);

const playfield = document.querySelector(".playfield");

for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.classList.add("playable");

    playfield?.appendChild(cell);
  }
}
