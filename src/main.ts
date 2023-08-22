import "./style.css";

const app = document.querySelector<HTMLDivElement>("#app");

const shapes = [
  {
    name: "square",
    shape: [
      [1, 1],
      [1, 1],
    ],
  },
  {
    name: "line",
    shape: [[1, 1, 1, 1]],
  },
  {
    name: "L",
    shape: [
      [1, 0],
      [1, 0],
      [1, 1],
    ],
  },
  {
    name: "T",
    shape: [
      [1, 1, 1],
      [0, 1, 0],
    ],
  },
];

const gridFillArray = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 0
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 0
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 2
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 3
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 4
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 5
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 6
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 7
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 8
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 9
];

function createGrid() {
  const grid = document.createElement("div");
  for (let i = 0; i < 10; i++) {
    grid.classList.add("grid");
    const row = document.createElement("div");
    row.classList.add("row");
    for (let u = 0; u < 10; u++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      row.appendChild(cell);
    }
    grid.appendChild(row);
  }
  return grid;
}

function getShape() {
  const shapeIndex = Math.floor(Math.random() * shapes.length);
  const shapeToInsert = shapes[shapeIndex].shape;
  return shapeToInsert;
}

const currentShape = {
  position: {
    row: 0,
    cell: 0,
  },
  previousPosition: {
    row: 0,
    cell: 0,
  },
  shape: [] as number[][],

  isMoveLocked: false,
  isFirstFrameAfterMoving: false,
};

function removePrevFrame(i: number, u: number) {
  if (
    i + currentShape.position?.row - 1 > 9 ||
    i + currentShape.position?.row - 1 < 0
  ) {
    return;
  }

  // console.log(u);
  gridFillArray[i + currentShape.position?.row - 1][
    currentShape.position.cell + u
  ] = 0;

  if (currentShape.isFirstFrameAfterMoving) {
    gridFillArray[i + currentShape.position?.row - 1][
      currentShape.previousPosition.cell + u
    ] = 0;
  }
}
function animateShape(shape: number[][]) {
  currentShape.shape = shape;
  const shapeLength = shape.length;
  const shapeWidth = shape[0].length;
  // console.log(currentShape.position?.cell);
  for (let i = shapeLength - 1; i >= 0; i--) {
    if (i + currentShape.position?.row > 9) {
      return false;
    }
    let isRowFilled = false;
    for (let u = 0; u < shapeWidth; u++) {
      if (
        gridFillArray[i + currentShape.position?.row][
          currentShape.position?.cell + u
        ] === 1
      ) {
        isRowFilled = true;
        break;
      }
    }
    if (!isRowFilled) {
      for (let u = 0; u < shapeWidth; u++) {
        removePrevFrame(i, u);
        gridFillArray[i + currentShape.position?.row][
          currentShape.position?.cell + u
        ] = shape[i][u];
      }
    } else {
      return false;
    }
  }

  currentShape.position.row += 1;
  currentShape.isMoveLocked = false;
  currentShape.isFirstFrameAfterMoving = false;
  // console.log(gridFillArray);
  return true;
}

let shape: number[][] = getShape();

document.addEventListener("keydown", (e) => {
  if (currentShape.isMoveLocked) return;
  // console.log(e.key);
  if (e.key === "ArrowRight") {
    currentShape.previousPosition.cell = currentShape.position.cell;
    currentShape.position.cell += 1;
    currentShape.isFirstFrameAfterMoving = true;
    currentShape.isMoveLocked = true;
  }
  if (e.key === "ArrowLeft") {
    currentShape.previousPosition.cell = currentShape.position.cell;
    currentShape.position.cell -= 1;
    currentShape.isFirstFrameAfterMoving = true;
    currentShape.isMoveLocked = true;
  }
});

setInterval(() => {
  const isAnimating = animateShape(shape);
  if (!isAnimating) {
    shape = getShape();
    currentShape.position.row = 0;
    currentShape.position.cell = 0;
  }
  for (let i = 0; i < gridFillArray.length; i++) {
    for (let u = 0; u < gridFillArray[i].length; u++) {
      if (gridFillArray[i][u] === 1) {
        const cell = document.querySelector<HTMLDivElement>(
          `.row:nth-child(${i + 1}) .cell:nth-child(${u + 1})`
        );
        cell?.classList.add("filled");
      } else {
        const cell = document.querySelector<HTMLDivElement>(
          `.row:nth-child(${i + 1}) .cell:nth-child(${u + 1})`
        );
        cell?.classList.remove("filled");
      }
    }
  }
}, 1000);

const grid = createGrid();
app?.appendChild(grid);
