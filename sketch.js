function make2DArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}
let cols = 10;
let rows = 10;
let resolution = 20;
let isAnimating = false;
let fps = "10";
let h = 600;
let w = 600;
let generation = 0;

function setup() {
  var myCanvas = createCanvas(h, w);
  myCanvas.parent("gridContainer");
  cols = width / resolution;
  rows = height / resolution;
  grid = make2DArray(cols, rows);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = 0;
    }
  }

  let canvas = select("canvas");

  canvas.mouseMoved(drawing);

  let startButton = select("#startButton");
  startButton.mousePressed(startDrawing);
  let stopButton = select("#stopButton");
  stopButton.mousePressed(stopDrawing);
  let resetButton = select("#resetButton");
  resetButton.mousePressed(resetDrawing);
}

function draw() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * resolution;
      let y = j * resolution;
      if (grid[i][j] == 1) {
        fill(123, 34, 100);
        rect(x, y, resolution - 1, resolution - 1);
      } else {
        fill(255);
        strokeWeight(0.25);
        rect(x, y, resolution - 1, resolution - 1);
      }
    }
  }
  if (isAnimating) {
    frameRate(Number(fps));
    generation++;
    document.getElementById("stats").innerHTML = "generation: " + generation;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let x = i * resolution;
        let y = j * resolution;
        if (grid[i][j] == 1) {
          fill(123, 34, 100);
          rect(x, y, resolution - 1, resolution - 1);
        } else {
          fill(255);
          rect(x, y, resolution - 1, resolution - 1);
        }
      }
    }
    let next = make2DArray(cols, rows);
    // Next Generation...
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let state = grid[i][j];
        // Live neighbors...
        let sum = 0;
        let neighbors = countNeighbors(grid, i, j);
        if (state == 0 && neighbors == 3) {
          next[i][j] = 1;
        } else if (state == 1 && (neighbors < 2 || neighbors > 3)) {
          next[i][j] = 0;
        } else {
          next[i][j] = state;
        }
      }
    }
    grid = next;
  }
}

function countNeighbors(grid, x, y) {
  let sum = 0;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      let col = (x + i + cols) % cols;
      let row = (y + j + rows) % rows;

      sum += grid[col][row];
    }
  }
  sum -= grid[x][y];
  return sum;
}

// GRID COLORING WITH MOUSE
function mousePressed() {
  if (!isAnimating) {
    let i = floor(mouseX / resolution);
    let j = floor(mouseY / resolution);

    isDrawing = true;

    if (i >= 0 && i < cols && j >= 0 && j < rows) {
      grid[i][j] = 1 - grid[i][j];
    }
  }
}

// BUTTONS
function startDrawing() {
  isAnimating = !isAnimating;
}

function stopDrawing() {
  isAnimating = false;
}

function resetDrawing() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = 0;
    }
  }
  generation = 0;
  document.getElementById("stats").innerHTML = "generation: " + generation;
  isAnimating = false;
}

// SETTINGS
document.addEventListener("DOMContentLoaded", function () {
  var slider = document.getElementById("fps-slider");

  var fpsValue = document.getElementById("fps-value");

  slider.addEventListener("input", function () {
    fpsValue.textContent = slider.value;
    fps = parseInt(slider.value);
  });
});

// FOR MULTIPLE LIVING CELLS ON HOLDING MOUSE BUTTON

function mouseReleased() {
  isDrawing = false;
}

function drawing() {
  if (isDrawing && !isAnimating) {
    let i = floor(mouseX / resolution);
    let j = floor(mouseY / resolution);

    if (i >= 0 && i < cols && j >= 0 && j < rows) {
      grid[i][j] = 1;
    }
  }
}
