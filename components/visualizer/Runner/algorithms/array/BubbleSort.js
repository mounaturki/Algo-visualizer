export class BubbleSort {
  constructor(runner) {
    this.runner = runner;
  }

  async run() {
    const n = this.runner.array.length;

    for (let i = 0; i < n - 1 && this.runner.isPlaying; i++) {
      for (let j = 0; j < n - i - 1 && this.runner.isPlaying; j++) {
        this.runner.current = j;
        this.runner.comparing = j + 1;
        this.runner.updateMessage(`Comparaison: ${this.runner.array[j]} vs ${this.runner.array[j + 1]}`);
        this.runner.updateUI();
        await this.runner.sleep(600);

        if (this.runner.array[j] > this.runner.array[j + 1]) {
          [this.runner.array[j], this.runner.array[j + 1]] = [this.runner.array[j + 1], this.runner.array[j]];
          this.runner.updateMessage(`Échange: ${this.runner.array[j + 1]} ↔ ${this.runner.array[j]}`);
          this.runner.updateUI();
          await this.runner.sleep(600);
        }
      }
      this.runner.sortedIndices.push(n - i - 1);
    }

    this.runner.sortedIndices = Array.from({length: n}, (_, i) => i);
    this.runner.current = -1;
    this.runner.comparing = -1;
    this.runner.updateMessage('✓ Tri terminé!');
    this.runner.updateUI();
  }
}

