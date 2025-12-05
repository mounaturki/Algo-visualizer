export class MergeSort {
  constructor(runner) {
    this.runner = runner;
  }

  async run() {
    await this.mergeSortHelper(0, this.runner.array.length - 1);
    this.runner.sortedIndices = Array.from({length: this.runner.array.length}, (_, i) => i);
    this.runner.updateMessage('✓ Tri terminé!');
    this.runner.updateUI();
  }

  async mergeSortHelper(left, right) {
    if (!this.runner.isPlaying || left >= right) return;

    const mid = Math.floor((left + right) / 2);
    await this.mergeSortHelper(left, mid);
    await this.mergeSortHelper(mid + 1, right);
    await this.mergeSortMerge(left, mid, right);
  }

  async mergeSortMerge(left, mid, right) {
    const leftArr = this.runner.array.slice(left, mid + 1);
    const rightArr = this.runner.array.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length && this.runner.isPlaying) {
      this.runner.current = left + i;
      this.runner.comparing = mid + 1 + j;
      this.runner.updateUI();
      await this.runner.sleep(600);

      if (leftArr[i] <= rightArr[j]) {
        this.runner.array[k++] = leftArr[i++];
      } else {
        this.runner.array[k++] = rightArr[j++];
      }
    }

    while (i < leftArr.length && this.runner.isPlaying) {
      this.runner.array[k++] = leftArr[i++];
      this.runner.updateUI();
      await this.runner.sleep(400);
    }

    while (j < rightArr.length && this.runner.isPlaying) {
      this.runner.array[k++] = rightArr[j++];
      this.runner.updateUI();
      await this.runner.sleep(400);
    }
  }
}

