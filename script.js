// no of rows and cols of the grid
const ROWS = 18;
const COLS = 25;

// DOM manipulation variables
const outerBox = document.querySelector(".outer__box");

/**
 * Initialize the grid (creates the grid in DOM)
 */
function init() {
  Array(ROWS)
    .fill(0)
    .forEach((_, rowIndex) => {
      const row = document.createElement("div");
      row.classList.add("flex");

      Array(COLS)
        .fill(0)
        .forEach((_, colIndex) => {
          const col = document.createElement("div");
          col.className = "box border-2 border-gray-900";
          col.id = `${rowIndex}__${colIndex}`;
          row.appendChild(col);
        });

      outerBox.appendChild(row);
    });
}

// Initialize the grid on DOM for the first time
init();
