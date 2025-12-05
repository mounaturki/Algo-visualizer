export class StackLinkedList {
  constructor(runner) {
    this.runner = runner;
  }

  async run() {
    const stack = [];
    
    this.runner.updateStackUI(stack, null, 'Linked List Stack: Taille dynamique');
    await this.runner.sleep(1500);
    
    for (let i = 1; i <= 6 && this.runner.isPlaying; i++) {
      stack.push(i * 10);
      this.runner.updateStackUI(stack, null, `Push(${i * 10})... Taille: ${stack.length}`);
      await this.runner.sleep(900);
    }
    
    this.runner.updateStackUI(stack, null, '✓ Avantages: Taille dynamique | Inconvénients: Plus de mémoire');
    await this.runner.sleep(1500);
  }
}

