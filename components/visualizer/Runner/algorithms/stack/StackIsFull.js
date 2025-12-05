export class StackIsFull {
  constructor(runner) {
    this.runner = runner;
  }

  async run() {
    const capacity = 5;
    const stack = [];
    
    this.runner.updateStackUI(stack, capacity, 'Is Full: Vérification capacité');
    await this.runner.sleep(1500);
    
    for (let i = 1; i <= capacity && this.runner.isPlaying; i++) {
      stack.push(i * 10);
      this.runner.updateStackUI(stack, capacity, `Push(${i * 10})... Taille: ${stack.length}/${capacity}`);
      await this.runner.sleep(800);
    }
    
    this.runner.updateStackUI(stack, capacity, stack.length === capacity ? '✓ Pile PLEINE' : '✗ De l\'espace disponible');
    await this.runner.sleep(1500);
  }
}

