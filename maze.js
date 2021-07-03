/**
 * Represents each Cell of the Grid
 */
function Cell(row, col) {
  //  row and col of the cell
  this.row = row;
  this.col = col;

  // boders visibble of the cell
  this.borderLeft = true;
  this.borderRight = true;
  this.borderTop = true;
  this.borderBottom = true;

  // for algorithm
  this.visited = false;

  /**
   * sleep for certain amount of time to execute
   * @param ms -> no of millisecond to sleep
   */
  this.$sleep = function (ms) {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        clearTimeout(timeout);
        resolve();
      }, ms);
    });
  };

  /**
   * create the cell on DOM
   * @param element -> element to append the cell
   */
  this.create = function (element) {
    const cell = document.createElement("div");
    cell.className = "box border-2 border-white transition-colors";
    cell.id = `${this.row}__${this.col}`;
    // initially hiding the cell
    cell.style.opacity = 0;
    element.appendChild(cell);
  };

  /**
   * update the cell borders on DOM
   */
  this.draw = async function () {
    await this.$sleep(Math.floor(Math.random() * 1000) + 1);
    const element = document.getElementById(`${this.row}__${this.col}`);
    element.style.opacity = 1;
    if (!this.borderLeft) element.classList.add("border-l-0");
    if (!this.borderRight) element.classList.add("border-r-0");
    if (!this.borderTop) element.classList.add("border-t-0");
    if (!this.borderBottom) element.classList.add("border-b-0");
  };

  /**
   * calculate the neighbors of given cell
   * @param grid -> whole grid 2D array
   */
  this.calcNeighbors = function (grid) {
    const ROWS = grid.length;
    const COLS = grid[0].length;

    const neighbors = [];
    // left
    if (this.col > 0) neighbors.push(grid[this.row][this.col - 1]);
    // right
    if (this.col < COLS - 1) neighbors.push(grid[this.row][this.col + 1]);
    // top
    if (this.row > 0) neighbors.push(grid[this.row - 1][this.col]);
    // bottom
    if (this.row < ROWS - 1) neighbors.push(grid[this.row + 1][this.col]);
    this.neighbors = neighbors;
  };

  /**
   * getting a random unvisited neighbor
   */
  this.getRandomNeighbor = function () {
    const randomIndex = Math.floor(Math.random() * this.neighbors.length);
    if (
      this.neighbors.some((neighbor) => !neighbor.visited) &&
      !this.neighbors[randomIndex].visited
    )
      return this.neighbors[randomIndex];
    return this.getRandomNeighbor();
  };

  this.checkValidNeighbor = function (cell) {
    if (!this.borderTop) {
      if (this.row === cell.row + 1 && this.col === cell.col) {
        return true;
      }
    }
    if (!this.borderLeft) {
      if (this.row === cell.row && this.col === cell.col + 1) {
        return true;
      }
    }
    if (!this.borderRight) {
      if (this.row === cell.row && this.col === cell.col - 1) {
        return true;
      }
    }
    if (!this.borderBottom) {
      if (this.row === cell.row - 1 && this.col === cell.col) {
        return true;
      }
    }

    return false;
  };

  /**
   * remove the common wall between the current and given cell
   * @param cell -> cell to remove the common wall
   */
  this.removeWall = function (cell) {
    //   left
    if (this.row === cell.row && this.col === cell.col + 1) {
      this.borderLeft = false;
      cell.borderRight = false;
    }
    // right
    else if (this.row === cell.row && this.col === cell.col - 1) {
      this.borderRight = false;
      cell.borderLeft = false;
    }
    // top
    else if (this.row === cell.row + 1 && this.col === cell.col) {
      this.borderTop = false;
      cell.borderBottom = false;
    }
    // bottom
    else if (this.row === cell.row - 1 && this.col === cell.col) {
      this.borderBottom = false;
      cell.borderTop = false;
    }
  };
}
