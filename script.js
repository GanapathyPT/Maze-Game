// no of rows and cols of the grid
const ROWS = 20;
const COLS = 35;
const START = [Math.floor(Math.random() * ROWS), 0];
const END = [Math.floor(Math.random() * ROWS), COLS - 1];

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

let drawing = false;
let lastVisitedCell = null;
const visitedCells = [];

window.addEventListener("mousedown", () => {
  drawing = !drawing;
});

window.addEventListener("mousemove", (e) => {
  // do nothing is drawing doesn't start
  if (!drawing) return;

  const x = e.pageX;
  const y = e.pageY;
  element = document.elementFromPoint(x, y);

  // if not cell do nothing
  if (!element.id.includes("__")) return;

  const [row, col] = element.id.split("__");
  const cell = grid[row][col];

  // for first cell clicked
  if (lastVisitedCell === null && cell === grid[START[0]][START[1]]) {
    lastVisitedCell = cell;
    visitedCells.push(cell);
    element.classList.add("bg-blue-400");
    return;
  }

  // if the  cell is already visited do nothing
  if (visitedCells.includes(cell)) return;

  cell.calcNeighbors(grid);

  if (!cell.neighbors.includes(lastVisitedCell)) return;

  if (cell.checkValidNeighbor(lastVisitedCell)) {
    element.classList.add("bg-blue-400");

    lastVisitedCell = cell;
    visitedCells.push(cell);
  }
});
