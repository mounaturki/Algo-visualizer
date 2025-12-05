export class StackIsEmpty {
  constructor(runner) {
    this.runner = runner;
  }

  async run() {
    const stack = [];
    
    this.runner.updateStackUI(stack, 5, 'Is Empty: Vérification pile vide');
    await this.runner.sleep(1500);
    
    this.runner.updateStackUI(stack, 5, stack.length === 0 ? '✓ Pile VIDE (isEmpty = true)' : '✗ Pile NON VIDE');
    await this.runner.sleep(1500);
    
    const newStack = [];
    for (let i = 1; i <= 3 && this.runner.isPlaying; i++) {
      newStack.push(i * 10);
      this.runner.updateStackUI(newStack, 5, `Push(${i * 10})... Taille: ${newStack.length}`);
      await this.runner.sleep(800);
    }
    
    this.runner.updateStackUI(newStack, 5, '✗ Pile NON VIDE (isEmpty = false)');
    await this.runner.sleep(1500);
  }
}

