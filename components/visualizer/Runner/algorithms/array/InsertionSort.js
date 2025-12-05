export class InsertionSort {
  constructor(runner) {
    this.runner = runner;
  }

  async run() {
    for (let i = 1; i < this.runner.array.length && this.runner.isPlaying; i++) {
      const key = this.runner.array[i];
      let j = i - 1;

      this.runner.current = i;
      this.runner.updateMessage(`Insertion de ${key}`);
      this.runner.updateUI();
      await this.runner.sleep(600);

      while (j >= 0 && this.runner.array[j] > key && this.runner.isPlaying) {
        this.runner.comparing = j;
        this.runner.array[j + 1] = this.runner.array[j];
        this.runner.updateMessage(`Décale ${this.runner.array[j]} à droite`);
        this.runner.updateUI();
        await this.runner.sleep(600);
        j--;
      }

      this.runner.array[j + 1] = key;
      this.runner.sortedIndices = Array.from({length: i + 1}, (_, idx) => idx);
      this.runner.updateUI();
      await this.runner.sleep(600);
    }

    this.runner.sortedIndices = Array.from({length: this.runner.array.length}, (_, i) => i);
    this.runner.current = -1;
    this.runner.updateMessage('✓ Tri terminé!');
    this.runner.updateUI();
  }
}

