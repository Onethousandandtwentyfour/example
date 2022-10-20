import Queue from "./queue.js";
import Node from "./node.js";

const minSize = 10;
//0 路障类型 1 起始点  2 可用类型 3 已被访问
const gridStatusEnum = {
  obstacle: 0,
  point: 1,
  available: 2,
  visited: 3,
};

export default class Maze {
  row = minSize;
  col = minSize;
  parentNode = null; //挂载迷宫的父级节点
  gridStatus = []; //数组中的每一项  0 路障类型 1 起始点  2 可用类型 3 已被访问
  domNodes = []; //domNodes
  current = [0, 0]; //起点

  constructor(parentNode, row = minSize, col = minSize) {
    this.parentNode = parentNode;
    this.init(row, col);
  }
  //生成地图
  init(row = minSize, col = minSize) {
    this.reset();
    this.row = row;
    this.col = col;
    const gridStatus = [];
    const domNodes = [];
    for (let i = 0; i < row; i++) {
      gridStatus[i] = [];
      domNodes[i] = [];
      for (let j = 0; j < col; j++) {
        gridStatus[i][j] = gridStatusEnum.available;
        domNodes[i].push(h(i, j));
      }
    }
    this.gridStatus = gridStatus;
    this.domNodes = domNodes;
    this.render();
  }
  //重置迷宫状态
  reset() {
    this.gridStatus = [];
  }
  //随机障碍物
  randomObstacle(count = 1) {
    //擦除之前的格子&重新创建
    this.init(this.row, this.col);
    //创建新障碍数据
    for (let i = 0; i < count; i++) {
      let { row, col } = this.getRandom(this.gridStatus);
      this.gridStatus[row][col] = gridStatusEnum.obstacle;
      this.domNodes[row][col].classList.add("obstacle");
    }
  }
  getRandom(existStatus) {
    let row = Math.floor(Math.random() * this.row),
      col = Math.floor(Math.random() * this.col);
    if (row === this.row) row = this.row - 1;
    if (col === this.col) col = this.col - 1;
    //去重
    if (
      [gridStatusEnum.obstacle, gridStatusEnum.point].includes(
        existStatus[row][col]
      )
    ) {
      let random = this.getRandom(existStatus);
      row = random.row;
      col = random.col;
    }
    return { row, col };
  }
  //生成doms
  render() {
    this.parentNode.innerHTML = "";
    const grid = document.createElement("div");
    grid.classList.add("grid-container");
    grid.style.cssText = `grid-template-columns: repeat(${this.col},1fr);grid-template-rows: repeat(${this.row},1fr);`;
    this.setStartAndEnd();
    const nodes = [];
    this.domNodes.forEach((item) => {
      nodes.push(...item);
    });
    grid.append(...nodes);
    this.parentNode.append(grid);
  }
  //设置起点、终点
  setStartAndEnd() {
    this.current = [0, 0];
    this.domNodes[0][0].classList.add("start");
    this.gridStatus[0][0] = gridStatusEnum.point;
    this.domNodes[this.row - 1][this.col - 1].classList.add("end");
    this.gridStatus[this.row - 1][this.col - 1] = gridStatusEnum.point;
  }
  //获取最短路径
  getShortestPath(showTips = false) {
    if (!this.BFS(this.current, [this.row - 1, this.col - 1], showTips)) {
      alert("无通过路线");
    }
  }
  //广度优先算法
  BFS(from, to, showTips) {
    let flag = false,
      current,
      queue = new Queue(),
      gridStatus = JSON.parse(JSON.stringify(this.gridStatus));

    const move = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ];
    //路线记录
    queue.push(new Node(from[0], from[1], null));

    //横向查找有效子节点
    const bfs = () => {
      current = queue.shift(0);
      //找到终点
      if (current.x == to[0] && current.y == to[1]) {
        flag = true;
        if (showTips) {
          this.showTips(current);
        }
        return true;
      }
      //current点位的上下左右
      for (let i = 0; i < move.length; i++) {
        let x = Math.min(current.x + move[i][1], this.row - 1),
          y = Math.min(current.y + move[i][0], this.col - 1);
        if (x < 0 || y < 0) {
          continue;
        } else if (
          [gridStatusEnum.available, gridStatusEnum.point].includes(
            gridStatus[x][y]
          )
        ) {
          queue.push(new Node(x, y, current));
          gridStatus[x][y] = gridStatusEnum.visited;
        }
      }
      if (queue.size() <= 0 && !flag) {
        return;
      }
      return bfs();
    };
    return bfs();
  }
  //深度优先算法
  DFS(formPoint, endPoint) {}
  //绘制路线图
  showTips(node = null) {
    if (!node) return;
    let parent = node;
    while (parent != null) {
      this.domNodes[parent.x][parent.y].classList.add("yellow");
      parent = parent.parent;
    }
  }
  //角色移动
  roleMove(target = [0, 0]) {
    const current = this.current;
    let x = Math.min(current[0] + target[1], this.row - 1),
      y = Math.min(current[1] + target[0], this.col - 1);
    if (gridStatusEnum.point == this.gridStatus[x][y]) {
      console.log("");
      alert("you win");
    } else if (gridStatusEnum.available == this.gridStatus[x][y]) {
      this.domNodes[current[0]][current[1]].classList.remove("start");
      this.domNodes[x][y].classList.add("start");
      this.current = [x, y];
    }
  }
}

//utils
function h(row, col, className = "grid") {
  const div = document.createElement("div");
  div.classList.add(className);
  div.setAttribute("data-row", row);
  div.setAttribute("data-col", col);
  return div;
}
