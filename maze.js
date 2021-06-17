class Cell {
  constructor(row, col) {
    this.row = row;
    this.col = col;

    this.borderLeft = true;
    this.borderRight = true;
    this.borderTop = true;
    this.borderBottom = true;

    this.visited = false;
  }

  $sleep(ms) {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        clearTimeout(timeout);
        resolve();
      }, ms);
    });
  }

  create(element) {
    const cell = document.createElement("div");
    cell.className = "box border-2 border-gray-900";
    cell.id = `${this.row}__${this.col}`;
    element.appendChild(cell);
  }

  async draw() {
    await this.$sleep(this.row * this.col * 10);
    const element = document.getElementById(`${this.row}__${this.col}`);
    if (!this.borderLeft) element.classList.add("border-l-0");
    if (!this.borderRight) element.classList.add("border-r-0");
    if (!this.borderTop) element.classList.add("border-t-0");
    if (!this.borderBottom) element.classList.add("border-b-0");
  }

  getNeighbors(grid, ROWS, COLS) {
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

  getRandomNeighbor() {
    const randomIndex = Math.floor(Math.random() * this.neighbors.length);
    if (
      this.neighbors.some((neighbor) => !neighbor.visited) &&
      !this.neighbors[randomIndex].visited
    )
      return this.neighbors[randomIndex];
    return this.getRandomNeighbor();
  }

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
