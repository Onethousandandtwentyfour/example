export default class Queue {
  list = [];

  contructor() {}

  push(elem) {
    this.list.push(elem);
    return true;
  }

  shift() {
    return this.list.shift();
  }

  size() {
    return this.list.length;
  }
}
