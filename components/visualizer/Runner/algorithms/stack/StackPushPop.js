export class StackPushPop {
  constructor(runner) {
    this.runner = runner;
  }

  async run() {
    const capacity = 5;
    const stack = [];
    
    this.runner.updateStackUI(stack, capacity, 'Stack Push & Pop: Démonstration LIFO');
    await this.runner.sleep(1500);
    
    for (let i = 1; i <= 4 && this.runner.isPlaying; i++) {
      const value = i * 10;
      stack.push(value);
      this.runner.updateStackUI(stack, capacity, `Push(${value}) ▶ Size: ${stack.length}/${capacity}`);
      await this.runner.sleep(1000);
    }
    
    this.runner.updateStackUI(stack, capacity, '✓ Pile prête! Maintenant: Pop ↓');
    await this.runner.sleep(1500);
    
    while (stack.length > 0 && this.runner.isPlaying) {
      const value = stack.pop();
      this.runner.updateStackUI(stack, capacity, `Pop(${value}) ◀ Size: ${stack.length}/${capacity}`);
      await this.runner.sleep(1000);
    }
    
    this.runner.updateStackUI([], capacity, '✓ Pile vide! Push & Pop terminés');
  }
}

