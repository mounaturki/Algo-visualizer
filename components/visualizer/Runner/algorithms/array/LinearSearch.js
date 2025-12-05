export class LinearSearch {
  constructor(runner) {
    this.runner = runner;
  }

  async run() {
    const target = this.runner.array[Math.floor(Math.random() * this.runner.array.length)];
    this.runner.updateMessage(`Recherche linéaire: chercher ${target}`);
    await this.runner.sleep(1000);

    for (let i = 0; i < this.runner.array.length && this.runner.isPlaying; i++) {
      this.runner.current = i;
      this.runner.updateMessage(`Vérification index ${i}: ${this.runner.array[i]}`);
      this.runner.updateUI();
      await this.runner.sleep(600);

      if (this.runner.array[i] === target) {
        this.runner.foundIndex = i;
        this.runner.updateMessage(`✓ Trouvé ${target} à l'index ${i}`);
        this.runner.updateUI();
        await this.runner.sleep(1500);
        return;
      }
    }

    this.runner.updateMessage(`✗ ${target} non trouvé`);
    this.runner.current = -1;
    this.runner.updateUI();
  }
}

