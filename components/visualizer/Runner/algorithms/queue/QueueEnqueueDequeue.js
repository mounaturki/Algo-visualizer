export class QueueEnqueueDequeue {
  constructor(runner) {
    this.runner = runner;
  }

  async run() {
    const capacity = 6;
    const queue = [];
    
    this.runner.updateQueueUI(queue, capacity, 'Queue Enqueue & Dequeue: Démonstration FIFO');
    await this.runner.sleep(1500);
    
    // Enqueue
    for (let i = 1; i <= 5 && this.runner.isPlaying; i++) {
      const value = i * 10;
      queue.push(value);
      this.runner.updateQueueUI(queue, capacity, `Enqueue(${value}) ▶ Size: ${queue.length}/${capacity}`);
      await this.runner.sleep(1000);
    }
    
    this.runner.updateQueueUI(queue, capacity, '✓ File prête! Maintenant: Dequeue ↓');
    await this.runner.sleep(1500);
    
    // Dequeue
    while (queue.length > 0 && this.runner.isPlaying) {
      const value = queue.shift();
      this.runner.updateQueueUI(queue, capacity, `Dequeue(${value}) ◀ Size: ${queue.length}/${capacity}`);
      await this.runner.sleep(1000);
    }
    
    this.runner.updateQueueUI([], capacity, '✓ File vide! Enqueue & Dequeue terminés');
  }
}
