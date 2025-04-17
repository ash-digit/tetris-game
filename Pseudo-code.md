# Tetris Game - Pseudocode

## 1. Game Overview

In this game, Tetromino pieces fall from the top of the screen.the player can control the pieces by rotating them and moving them left, right or down. The goal is to complete full rows, which will then be cleared from the screen. The game ends when the pieces stack up to the top of the screen/frame.

---

## Plan for building the Game

### HTML / CSS (SCSS)

- **HTML structure**: Create the grid container, display the score, and provide basic UI elements (like a "Restart" button).

- **SCSS( CSS )**: Style the grid and the Tetrominoes, ensuring responsiveness for different screen sizes (Desktop for the start)

### TypeScript

- **Game Loop**: The game runs in intervals (every 500 milliseconds OR any other durations for different dificulty levels) to drop pieces and chek for full lines.
- **Piece Movement**: Pieces can move left, right, and rotate with key presses. The movement is bound by the grid's boundaries.
- **Collision Detection**: Ensure the pieces do not overlap with the walls or other locked pieces.
- **Locking Pieces**: Once a piece can't move anymore, it locks in place and the next piece is spawned.
- **Line Clearing**: If a row is completely filled, it gets cleared and the rows above it shift down.
- **Score**: Increase score based on the number of rows cleared.
- **Game Over**: The game ends when a new piece can't be spawned due to the grid being full.

---

## 3. Features to Include

1. **Game Loop**: Run the game and move pieces down at regular intervals.
2. **Piece Spawning**: Randomly select a Tetromino and spawn it at the top.
3. **Piece Movement**: Move the piece left, right, or down using the keyboard.
4. **Piece Rotation**: Rotate the piece 90 degrees when pressing the space key.
5. **Collision Detection**: Detect when a piece hits the wall or other locked pieces.
6. **Piece Locking**: Once a piece can't move further, lock it in place.
7. **Line Clearing**: Detect and clear full lines, shifting the remaining rows down.
8. **Score**: Track the player's score and display it.
9. **Game Over**: End the game when the top row is blocked.
10. **Restart**: Provide a restart option after game over.

---

## Tetris Game - How I Am Planning on Building It

### 1. Set Up the Project

- **Initialize HTML structure**: Create a simple HTML page (`index.html`) with a container for the game grid, score, and any necessary UI elements (like a restart button).
- **Grid Layout**: The game grid will be represented by a matrix (10x20) in TypeScript, but visually, it will be displayed using SCSS as a grid with square div elements.
- **Game Styles**: The styles for the grid, Tetromino shapes, and other UI elements will be written in **SCSS**.
- **TypeScript Setup**: The game logic (movement, collision, clearing lines, etc.) will be written in **TypeScript** and linked to the HTML via a script tag.

---

### 2. Create and Set Up the Game Grid

- **Grid Representation**: A 2D array (10 columns x 20 rows) will be used to represent the game grid, where each cell can either be empty (0) or filled (1).
- **Grid Display**: Use **divs** to display the grid visually on the screen. Each `div` will correspond to a cell in the 2D array, and the game pieces (Tetrominoes) will fill these cells.

---

### 3. Handle Tetromino Creation and Rotation

- **Tetromino Shapes**: Define the shapes (I, O, T, S, Z, L, J) as 4x4 matrices (or arrays of coordinates) that can be rotated. Each shape will have four possible orientations.
- **Shape Rotation**: The rotation logic will be based on a rotation matrix that will adjust the coordinates of the current Tetromino based on its rotation state.
- **Randomized Piece Selection**: When a new piece spawns, randomly choose one of the seven Tetromino shapes.

---

### 4. Game Loop and Piece Movement

- **Move Down Mechanism**: The game will run in intervals (every 500 milliseconds OR any other durations for different dificulty levels), moving the current Tetromino down the grid. Each loop will also check for collisions, line clearing, and piece locking.
- **Player Input**: Allow the player to move the current piece left, right, and rotate using keyboard events (arrow keys for left, right, down, and space for rotating).
- **Piece Locking**: Once a piece collides with the bottom of the grid or another locked piece, it will "lock" into place, and a new piece will spawn.

---

### 5. Collision Detection

- **Wall and Floor Collision**: Each time the piece moves (or rotates), check if it collides with the walls or the already locked pieces on the grid. If a collision is detected, prevent the move.
- **Other Piece Collision**: If the piece touches another locked piece while moving down, lock it in place.

---

### 6. Line Clearing

- **Full Line Detection**: After each piece locks in place, check if any row is completely filled with blocks.
- **Clear Full Lines**: If a row is full, clear it and shift all the rows above it down by one. Increase the player’s score based on the number of lines cleared.

---

### 7. Game Over and Restart

- **Game Over**: If a new piece cannot spawn (because the top rows are filled), the game will be over.
- **Restart**: Provide an option for the player to restart the game and try again.
