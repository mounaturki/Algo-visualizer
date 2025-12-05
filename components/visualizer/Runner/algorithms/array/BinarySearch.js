export class BinarySearch {
  constructor(runner) {
    this.runner = runner;
  }

  async run() {
    this.runner.array.sort((a, b) => a - b);
    this.runner.renderArray();
    
    const target = this.runner.array[Math.floor(Math.random() * this.runner.array.length)];
    this.runner.updateMessage(`Recherche binaire (tableau trié): chercher ${target}`);
    await this.runner.sleep(1000);

    this.runner.left = 0;
    this.runner.right = this.runner.array.length - 1;

    while (this.runner.left <= this.runner.right && this.runner.isPlaying) {
      this.runner.mid = Math.floor((this.runner.left + this.runner.right) / 2);
      this.runner.updateMessage(`Vérification: mid=${this.runner.array[this.runner.mid]} (gauche=${this.runner.left}, droite=${this.runner.right})`);
      this.runner.updateUI();
      await this.runner.sleep(800);

      if (this.runner.array[this.runner.mid] === target) {
        this.runner.foundIndex = this.runner.mid;
        this.runner.updateMessage(`✓ Trouvé ${target} à l'index ${this.runner.mid}`);
        this.runner.updateUI();
        await this.runner.sleep(1500);
        return;
      } else if (this.runner.array[this.runner.mid] < target) {
        this.runner.left = this.runner.mid + 1;
      } else {
        this.runner.right = this.runner.mid - 1;
      }
    }

    this.runner.updateMessage(`✗ ${target} non trouvé`);
    this.runner.current = -1;
    this.runner.updateUI();
  }
}

