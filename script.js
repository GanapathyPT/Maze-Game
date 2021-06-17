// no of rows and cols of the grid
const ROWS = 20;
const COLS = 35;
const START = [0, 0];
const END = [ROWS - 1, COLS - 1];

// DOM manipulation variables
const outerBox = document.querySelector(".outer__box");

// varaibles related to game logic
const grid = [];

/**
 * Initialize the grid (creates the grid in DOM)
 */
function init() {
  Array(ROWS)
    .fill(0)
    .forEach((_, rowIndex) => {
      const row = document.createElement("div");
      row.classList.add("flex");
      grid.push([]);

      Array(COLS)
        .fill(0)
        .forEach((_, colIndex) => {
          const cell = new Cell(rowIndex, colIndex);
          // adding cell to DOM
          cell.create(row);
          grid[rowIndex].push(cell);
        });

      outerBox.appendChild(row);
    });
}

/**
 * Creates a Maze with DFS algorithm
 */
function createMaze() {
  const stack = [];
  const [startX, startY] = START;
  const [endX, endY] = END;
  // Choose the initial cell, mark it as visited
  grid[startX][startY].visited = true;
  grid[startX][startY].borderLeft = false;
  grid[endX][endY].borderRight = false;
  stack.push(grid[startX][startY]);

  // While the stack is not empty
  while (stack.length != 0) {
    const current = stack.pop();
    // calculating all neighbors of the current cell
    current.calcNeighbors(grid, ROWS, COLS);
    // if current cell has unvisited neighbors
    if (current.neighbors.some((neighbor) => !neighbor.visited)) {
      stack.push(current);
      // get a random neighbor and remove the wall between current and that neightbor
      const randomNeighbor = current.getRandomNeighbor();
      current.removeWall(randomNeighbor);
      // random neighbor is now visited and pushed to stack
      randomNeighbor.visited = true;
      stack.push(randomNeighbor);
    }
  }
}

/**
 * Update cell borders
 */
function drawGrid() {
  grid.forEach((row) => {
    row.forEach((cell) => {
      cell.draw();
    });
  });
}

// Initialize the grid on DOM for the first time
// Creating the Maze using DFS
// Drawing the Maze on to the DOM
init();
createMaze();
drawGrid();
