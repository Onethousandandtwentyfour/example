export default class Node {
  x = 0; //x坐标
  y = 0; //y坐标
  parent = null; //父级节点Node

  constructor(x, y, parent) {
    this.x = x;
    this.y = y;
    this.parent = parent;
  }
}
