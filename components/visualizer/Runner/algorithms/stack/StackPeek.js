export class StackPeek {
  constructor(runner) {
    this.runner = runner;
  }

  async run() {
    const stack = [10, 20, 30, 40];
    
    this.runner.updateStackUI(stack, 5, 'Stack Peek: Consultation du sommet');
    await this.runner.sleep(1500);
    
    for (let i = 0; i < stack.length && this.runner.isPlaying; i++) {
      const tempStack = stack.slice(0, i + 1);
      this.runner.updateStackUI(tempStack, 5, `Parcours... (élément: ${tempStack[i]})`);
      await this.runner.sleep(500);
    }
    
    this.runner.updateStackUI(stack, 5, `✓ Peek: Sommet = ${stack[stack.length - 1]} (sans modification)`);
    await this.runner.sleep(1500);
    
    this.runner.updateStackUI(stack, 5, '✓ Pile inchangée! Peek terminé');
  }
}

