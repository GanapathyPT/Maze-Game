/**
 * Represents each Cell of the Grid
 */
class Cell {
  constructor(row, col) {
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
  }

  /**
   * sleep for certain amount of time to execute
   * @param ms -> no of millisecond to sleep
   */
  $sleep(ms) {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        clearTimeout(timeout);
        resolve();
      }, ms);
    });
  }

  /**
   * create the cell on DOM
   * @param element -> element to append the cell
   */
  create(element) {
    const cell = document.createElement("div");
    cell.className = "box border-2 border-gray-900";
    cell.id = `${this.row}__${this.col}`;
    // initially hiding the cell
    cell.style.display = "none";
    element.appendChild(cell);
  }

  /**
   * update the cell borders on DOM
   */
  async draw() {
    await this.$sleep(this.row * this.col * 5);
    const element = document.getElementById(`${this.row}__${this.col}`);
    element.style.display = "block";
    if (!this.borderLeft) element.classList.add("border-l-0");
    if (!this.borderRight) element.classList.add("border-r-0");
    if (!this.borderTop) element.classList.add("border-t-0");
    if (!this.borderBottom) element.classList.add("border-b-0");
  }

  /**
   * calculate the neighbors of given cell
   * @param grid -> whole grid 2D array
   */
  calcNeighbors(grid) {
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
  }

  /**
   * getting a random unvisited neighbor
   */
  getRandomNeighbor() {
    const randomIndex = Math.floor(Math.random() * this.neighbors.length);
    if (
      this.neighbors.some((neighbor) => !neighbor.visited) &&
      !this.neighbors[randomIndex].visited
    )
      return this.neighbors[randomIndex];
    return this.getRandomNeighbor();
  }

  /**
   * remove the common wall between the current and given cell
   * @param cell -> cell to remove the common wall
   */
  removeWall(cell) {
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
  }
}
