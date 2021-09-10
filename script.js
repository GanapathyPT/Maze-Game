// no of rows and cols of the grid
const ROWS = 20;
const COLS = 35;

// DOM manipulation variables
const outerBox = document.querySelector(".outer__box");
const model = document.getElementById("model");
const modelText = document.getElementById("modelText");
const modelBtn = document.getElementById("modelBtn");

const boxBGColor = "bg-purple-900";
const MODEL_CLOSE_DELAY = 3000;

/**
 * Initialize the grid (creates the grid in DOM)
 */
function createGrid() {
  // varaibles related to game logic
  const grid = [];
  document.documentElement.style.setProperty("--rows", ROWS);
  document.documentElement.style.setProperty("--cols", COLS);

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

  return grid;
}

/**
 * Creates a Maze with DFS algorithm
 */
function createMaze(grid) {
  const stack = [];
  const [startX, startY] = [Math.floor(Math.random() * ROWS), 0];
  const [endX, endY] = [Math.floor(Math.random() * ROWS), COLS - 1];
  START = [startX, startY];
  END = [endX, endY];

  const startCell = document.getElementById(`${startX}__${startY}`);
  const startRect = startCell.getBoundingClientRect();

  const startEndClasses = "fixed text-3xl font-semibold text-white";

  const startElement = document.createElement("p");
  startElement.innerText = "START 🐇";
  startElement.id = "gameStart";
  startElement.className = startEndClasses;
  startElement.style.top = `calc(${startRect.top}px - .5rem)`;
  startElement.style.left = `calc(${startRect.left}px - 10rem)`;
  document.body.appendChild(startElement);

  const endCell = document.getElementById(`${endX}__${endY}`);
  const endRect = endCell.getBoundingClientRect();

  const endElement = document.createElement("p");
  endElement.innerText = "FINISH 🏁";
  endElement.id = "gameFinish";
  endElement.className = startEndClasses;
  endElement.style.top = `calc(${endRect.top}px - .5rem)`;
  endElement.style.left = `calc(${endRect.left}px + 3rem)`;
  document.body.appendChild(endElement);

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

  return {
    start: [startX, startY],
    end: [endX, endY],
  };
}

const removeMaze = () => {
  outerBox.innerHTML = "";
  document.getElementById("gameStart").remove();
  document.getElementById("gameFinish").remove();
};

const clearPath = () => {
  Array(ROWS)
    .fill(0)
    .forEach((_, rowIndex) => {
      Array(COLS)
        .fill(0)
        .forEach((_, colIndex) => {
          const element = document.getElementById(`${rowIndex}__${colIndex}`);
          element.classList.remove(boxBGColor);
        });
    });
};

/**
 * Update cell borders
 */
function drawGrid(grid) {
  grid.forEach((row) => {
    row.forEach((cell) => {
      cell.draw();
    });
  });
}

let listener;
// init function
const init = () => {
  openModel("Press Enter to Restart the game", undefined, undefined, true);
  const grid = createGrid();
  const { start, end } = createMaze(grid);
  drawGrid(grid);
  listener = window.addEventListener("mousemove", (e) =>
    mouseMoveListener(e, grid, start, end)
  );
};
init();

// last cell visited in the path
let lastVisitedCell = null;
// list of all visited cells
const visitedCells = [];
// var to check if game is over or not
let gameOver = false;

const restartGame = () => {
  lastVisitedCell = null;
  visitedCells.length = 0;
  gameOver = false;

  clearPath();
};
window.addEventListener("keydown", (e) => {
  if (e.code === "Enter") restartGame();
});

const createNewGame = () => {
  window.removeEventListener("mousemove", listener);
  window.location.reload();
};

/**
 * on mouse move showing the path
 */
function mouseMoveListener(e, grid, start, end) {
  // game is over do nothing
  if (gameOver) return;

  // x and y positions acording to page width and height
  const x = e.pageX;
  const y = e.pageY;
  // element the current pointer is locating
  const element = document.elementFromPoint(x, y);

  // if not cell do nothing
  if (!element.id.includes("__")) return;

  // getting the elements row and col value and with that getting its cell object
  const [row, col] = element.id.split("__");
  const cell = grid[row][col];

  // for first cell clicked
  if (lastVisitedCell === null && cell === grid[start[0]][start[1]]) {
    lastVisitedCell = cell;
    visitedCells.push(cell);
    element.classList.add(boxBGColor);
    return;
  }

  // if the  cell is already visited do nothing
  if (visitedCells.includes(cell)) return;

  // calculating the cells neighbors (optional)
  cell.calcNeighbors(grid);

  // if it is already visited do nothing
  if (!cell.neighbors.includes(lastVisitedCell)) return;

  // gameover will be changed if there is no valid moves
  if (gameOver) return;

  // if it is valid cell according to last visited cell then proceed
  if (cell.checkValidNeighbor(lastVisitedCell)) {
    element.classList.add(boxBGColor);

    // changing the last visited cell as current cell and adding it to visited cells array
    lastVisitedCell = cell;
    visitedCells.push(cell);

    if (cell === grid[end[0]][end[1]]) {
      openModel("You Won", "New Game", createNewGame, false);
      gameOver = true;
    }

    const validNeighbors = [];
    cell.neighbors.forEach((neighbor) => {
      if (cell.checkValidNeighbor(neighbor) && !visitedCells.includes(neighbor))
        validNeighbors.push(neighbor);
    });
    if (validNeighbors.length === 0) {
      openModel("You Lost", "Restart", restartGame, false);
      gameOver = true;
    }
  }
}

// model related
function openModel(modelHeading, modelBtnText, modelBtnCallback, close) {
  if (modelHeading === undefined) return;

  outerBox.classList.add("overlay");
  modelText.innerText = modelHeading;

  if (modelBtnText === undefined) modelBtn.classList.add("hidden");
  if (typeof modelBtnCallback === "function")
    modelBtn.onclick = () => {
      modelBtnCallback();
      closeModel();
    };
  modelBtn.innerText = modelBtnText;

  model.classList.remove("hidden");
  if (close) setTimeout(closeModel, MODEL_CLOSE_DELAY);
}

function closeModel() {
  modelText.innerText = "";
  modelBtn.classList.remove("hidden");
  modelBtn.innerText = "";
  outerBox.classList.remove("overlay");
  model.classList.add("hidden");
}
