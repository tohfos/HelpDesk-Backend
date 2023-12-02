class Queue {
    constructor() {
      this.queue = [];
    }
  
    add(item) {
      this.queue.push(item);
    }
  
    pop() {
      return this.queue.shift();
    }
  
    size() {
      return this.queue.length;
    }
  }
  module.exports=Queue;