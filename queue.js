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
  
  top() {
    if (this.queue.length === 0) {
        return undefined; // or any other appropriate value to indicate an empty queue
    }
    return this.queue[0];
}
}
  module.exports=Queue;