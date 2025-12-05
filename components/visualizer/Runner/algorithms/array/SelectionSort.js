export class SelectionSort {
  constructor(runner) {
    this.runner = runner;
  }

  async run() {
    const n = this.runner.array.length;

    for (let i = 0; i < n - 1 && this.runner.isPlaying; i++) {
      let minIdx = i;
      this.runner.current = i;
      this.runner.updateMessage(`Cherche minimum depuis index ${i}`);
      this.runner.updateUI();
      await this.runner.sleep(600);

      for (let j = i + 1; j < n && this.runner.isPlaying; j++) {
        this.runner.comparing = j;
        this.runner.updateUI();
        await this.runner.sleep(400);

        if (this.runner.array[j] < this.runner.array[minIdx]) {
          minIdx = j;
        }
      }

      if (minIdx !== i) {
        [this.runner.array[i], this.runner.array[minIdx]] = [this.runner.array[minIdx], this.runner.array[i]];
        this.runner.updateMessage(`Échange ${this.runner.array[i]} à position ${i}`);
        this.runner.updateUI();
        await this.runner.sleep(600);
      }

      this.runner.sortedIndices.push(i);
    }

    this.runner.sortedIndices.push(n - 1);
    this.runner.current = -1;
    this.runner.comparing = -1;
    this.runner.updateMessage('✓ Tri terminé!');
    this.runner.updateUI();
  }
}

