export class LinkedListInsertion {
  constructor(runner) {
    this.runner = runner;
  }

  async run() {
    const list = [];
    
    this.runner.updateLinkedListUI(list, 'Liste Chaînée - Insertion: Création de la liste');
    await this.runner.sleep(1500);
    
    // Insertion au début
    this.runner.updateMessage('Insertion au début: 10');
    list.unshift(10);
    this.runner.updateLinkedListUI(list, 'Insertion au début: 10');
    await this.runner.sleep(1000);
    
    // Insertion au début
    this.runner.updateMessage('Insertion au début: 20');
    list.unshift(20);
    this.runner.updateLinkedListUI(list, 'Insertion au début: 20');
    await this.runner.sleep(1000);
    
    // Insertion à la fin
    this.runner.updateMessage('Insertion à la fin: 30');
    list.push(30);
    this.runner.updateLinkedListUI(list, 'Insertion à la fin: 30');
    await this.runner.sleep(1000);
    
    // Insertion à la fin
    this.runner.updateMessage('Insertion à la fin: 40');
    list.push(40);
    this.runner.updateLinkedListUI(list, 'Insertion à la fin: 40');
    await this.runner.sleep(1000);
    
    // Insertion au milieu (position 2)
    this.runner.updateMessage('Insertion au milieu (position 2): 25');
    list.splice(2, 0, 25);
    this.runner.updateLinkedListUI(list, 'Insertion au milieu (position 2): 25');
    await this.runner.sleep(1000);
    
    this.runner.updateLinkedListUI(list, '✓ Liste complète! Insertion terminée');
    await this.runner.sleep(1500);
  }
}
