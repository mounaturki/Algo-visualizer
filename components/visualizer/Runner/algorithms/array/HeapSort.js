export class HeapSort {
  constructor(runner) {
    this.runner = runner;
  }

  async run() {
    const n = this.runner.array.length;
    this.runner.updateMessage('Construction du tas max...');
    await this.runner.sleep(1000);

    // Construire le tas max
    for (let i = Math.floor(n / 2) - 1; i >= 0 && this.runner.isPlaying; i--) {
      await this.heapify(n, i);
    }

    // Extraire les éléments un par un
    for (let i = n - 1; i > 0 && this.runner.isPlaying; i--) {
      this.runner.updateMessage(`Extraction du maximum: ${this.runner.array[0]}`);
      [this.runner.array[0], this.runner.array[i]] = [this.runner.array[i], this.runner.array[0]];
      this.runner.sortedIndices.push(i);
      this.runner.updateUI();
      await this.runner.sleep(800);

      await this.heapify(i, 0);
    }

    this.runner.sortedIndices.push(0);
    this.runner.current = -1;
    this.runner.comparing = -1;
    this.runner.updateMessage('✓ Tri terminé!');
    this.runner.updateUI();
  }

  async heapify(n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    this.runner.current = i;
    if (left < n) this.runner.comparing = left;
    this.runner.updateMessage(`Heapify: Comparaison nœud ${i} avec enfants`);
    this.runner.updateUI();
    await this.runner.sleep(600);

    if (left < n && this.runner.array[left] > this.runner.array[largest]) {
      largest = left;
    }

    if (right < n) {
      this.runner.comparing = right;
      this.runner.updateUI();
      await this.runner.sleep(400);
    }

    if (right < n && this.runner.array[right] > this.runner.array[largest]) {
      largest = right;
    }

    if (largest !== i) {
      this.runner.updateMessage(`Échange: ${this.runner.array[i]} ↔ ${this.runner.array[largest]}`);
      [this.runner.array[i], this.runner.array[largest]] = [this.runner.array[largest], this.runner.array[i]];
      this.runner.updateUI();
      await this.runner.sleep(600);
      await this.heapify(n, largest);
    }
  }
}
