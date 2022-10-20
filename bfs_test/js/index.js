import Maze from "./maze.js";
const inputRowNode = document.querySelector(".input-row"),
  inputColNode = document.querySelector(".input-col"),
  resetBtn = document.querySelector(".reset-btn"),
  initBtn = document.querySelector(".init-btn"),
  searchBtn = document.querySelector(".search-btn"),
  randomBtn = document.querySelector(".random-btn"),
  tableNode = document.querySelector(".table"),
  iconBtn = document.querySelectorAll(".icon-btn"),
  btnUp = document.querySelector(".btn.up"),
  btnDown = document.querySelector(".btn.down"),
  btnLeft = document.querySelector(".btn.left"),
  btnRight = document.querySelector(".btn.right");

const minSize = 10,
  maxSize = 40;

function uodateTableSize(row = minSize, col = minSize) {
  tableNode.style.cssText = `--xy_ratio:${(row * 1) / (col * 1)}`;
}
//迷宫实例
const maze = new Maze(tableNode);
const inputChange = (ev) => {
  const val = ev.target.value ? ev.target.value * 1 : 0;
  if (val > maxSize) {
    ev.target.value = maxSize;
  } else if (val < minSize) {
    ev.target.value = minSize;
  }
};
//绑定事件
inputRowNode.onchange = inputChange;
inputColNode.onchange = inputChange;
iconBtn.forEach((item) => {
  item.addEventListener("click", (ev) => {
    const { key, val } = ev.target.dataset;
    let node = null,
      temp = minSize;
    if ("row" == key) {
      node = inputRowNode;
    } else {
      node = inputColNode;
    }
    temp = node.value * 1 + val * 1;
    if (temp <= maxSize && temp >= minSize) {
      node.value = temp;
    }
  });
});
initBtn.addEventListener("click", () => {
  const row = inputRowNode.value * 1,
    col = inputColNode.value * 1;
  if (row <= maxSize && row >= minSize && col <= maxSize && col >= minSize) {
    uodateTableSize(row, col);
    maze.init(row, col);
  } else {
    alert("行、列参数无效");
  }
});
resetBtn.addEventListener("click", () => {
  inputRowNode.value = minSize;
  inputColNode.value = minSize;
  uodateTableSize(minSize, minSize);
  maze.init(minSize, minSize);
});
searchBtn.addEventListener("click", () => {
  // bfs
  maze.getShortestPath(true);
});
randomBtn.addEventListener("click", () => {
  maze.randomObstacle(
    Math.floor((1 * inputRowNode.value * inputColNode.value) / 4)
  );
});
btnUp.addEventListener("click", () => {
  console.log("上移");
  maze.roleMove([0, -1]);
});
btnDown.addEventListener("click", () => {
  console.log("下移");
  maze.roleMove([0, 1]);
});
btnLeft.addEventListener("click", () => {
  console.log("左移");
  maze.roleMove([-1, 0]);
});
btnRight.addEventListener("click", () => {
  console.log("右移");
  maze.roleMove([1, 0]);
});
