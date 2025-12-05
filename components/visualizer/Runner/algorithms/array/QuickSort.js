export class QuickSort {
  constructor(runner) {
    this.runner = runner;
  }

  async run() {
    await this.quickSortHelper(0, this.runner.array.length - 1);
    this.runner.sortedIndices = Array.from({length: this.runner.array.length}, (_, i) => i);
    this.runner.updateMessage('✓ Tri terminé!');
    this.runner.updateUI();
  }

  async quickSortHelper(low, high) {
    if (!this.runner.isPlaying || low >= high) return;

    const pi = await this.quickSortPartition(low, high);
    await this.quickSortHelper(low, pi - 1);
    await this.quickSortHelper(pi + 1, high);
  }

  async quickSortPartition(low, high) {
    const pivot = this.runner.array[high];
    let i = low - 1;

    for (let j = low; j < high && this.runner.isPlaying; j++) {
      this.runner.current = j;
      this.runner.comparing = high;
      this.runner.updateMessage(`Comparaison: ${this.runner.array[j]} vs pivot ${pivot}`);
      this.runner.updateUI();
      await this.runner.sleep(600);

      if (this.runner.array[j] < pivot) {
        i++;
        if (i !== j) {
          [this.runner.array[i], this.runner.array[j]] = [this.runner.array[j], this.runner.array[i]];
          this.runner.updateUI();
          await this.runner.sleep(600);
        }
      }
    }

    [this.runner.array[i + 1], this.runner.array[high]] = [this.runner.array[high], this.runner.array[i + 1]];
    this.runner.updateUI();
    await this.runner.sleep(600);
    return i + 1;
  }
}

