const templatePromise = Promise.all([
  fetch(new URL('./Runner.html', import.meta.url)).then((r) => r.text()),
  fetch(new URL('./Runner.css', import.meta.url)).then((r) => r.text()),
]).then(([html, css]) => {
  const template = document.createElement('template');
  template.innerHTML = `<style>${css}</style>${html}`;
  return template;
});

const ALGORITHMS = {
  'linear-search': {
    title: 'Recherche Linéaire',
    what: 'Parcourt chaque élément un par un jusqu\'à trouver la valeur recherchée.',
    how: ['Commencer par le premier élément', 'Vérifier si égal à la cible', 'Si non, passer au suivant', 'Continuer jusqu\'à trouver ou fin'],
    steps: ['Initialiser pointeur', 'Comparer avec cible', 'Avancer le pointeur', 'Répéter'],
    complexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' }
  },
  'binary-search': {
    title: 'Recherche Binaire',
    what: 'Divise la liste en deux à chaque itération pour trouver l\'élément efficacement.',
    how: ['La liste doit être triée', 'Calculer mid = (left + right) / 2', 'Si arr[mid] == target, trouvé', 'Sinon diviser l\'espace', 'Répéter jusqu\'à trouvé'],
    steps: ['Initialiser left et right', 'Calculer mid', 'Comparer arr[mid]', 'Diviser l\'espace', 'Répéter'],
    complexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)' }
  },
  'bubble-sort': {
    title: 'Tri à Bulles',
    what: 'Compare les éléments adjacents et les échange si nécessaire. Les plus grands « remontent ».',
    how: ['Comparer deux éléments adjacents', 'Si mal ordonnés, les échanger', 'Passer au couple suivant', 'Continuer jusqu\'à la fin', 'Recommencer pour le prochain passage'],
    steps: ['Initialiser deux pointeurs', 'Comparer arr[j] et arr[j+1]', 'Échanger si nécessaire', 'Incrémenter j', 'Passer au prochain passage'],
    complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' }
  },
  'selection-sort': {
    title: 'Tri par Sélection',
    what: 'Trouve le plus petit élément et le place au début, puis répète pour le reste.',
    how: ['Trouver le minimum dans le tableau non trié', 'Échanger avec le premier élément non trié', 'Avancer la limite du tableau trié', 'Répéter'],
    steps: ['Pour chaque position i', 'Trouver le minimum', 'Échanger arr[i] avec minimum', 'Continuer jusqu\'à la fin'],
    complexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' }
  },
  'insertion-sort': {
    title: 'Tri par Insertion',
    what: 'Insère chaque élément à sa bonne place dans la partie triée du tableau.',
    how: ['Commencer par le deuxième élément', 'Le comparer avec les éléments triés', 'Insérer à la bonne place', 'Décaler les autres éléments'],
    steps: ['Pour chaque élément', 'Comparer avec éléments triés', 'Insérer à bonne place', 'Décaler les autres'],
    complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' }
  },
  'merge-sort': {
    title: 'Tri Fusion',
    what: 'Divise le tableau en deux, trie chaque moitié, puis les fusionne.',
    how: ['Diviser le tableau en deux moitiés', 'Récursivement trier chaque moitié', 'Fusionner les deux moitiés triées', 'Répéter jusqu\'à un seul élément'],
    steps: ['Diviser en deux', 'Trier moitié gauche', 'Trier moitié droite', 'Fusionner', 'Répéter'],
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' }
  },
  'quick-sort': {
    title: 'Tri Rapide',
    what: 'Choisit un pivot et partitionne le tableau en deux parties, puis trie récursivement.',
    how: ['Choisir un pivot', 'Partitionner autour du pivot', 'Éléments < pivot à gauche, > pivot à droite', 'Récursivement trier les partitions'],
    steps: ['Choisir pivot', 'Partitionner', 'Trier gauche', 'Trier droite', 'Combiner'],
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)' }
  },
  'stack-push-pop': {
    title: 'Push & Pop',
    what: 'Démontre les opérations de base d\'une pile: ajouter et retirer du sommet.',
    how: ['Push: Ajouter un élément au sommet', 'Pop: Retirer l\'élément du sommet', 'LIFO: Last In First Out'],
    steps: ['Push 4 éléments', 'Observer la pile grandir', 'Pop tous les éléments', 'Observer la pile se vider'],
    complexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(n)' }
  },
  'stack-peek': {
    title: 'Peek',
    what: 'Consulter l\'élément au sommet de la pile sans le retirer.',
    how: ['Accéder au sommet', 'Retourner la valeur', 'Ne pas modifier la pile'],
    steps: ['Initialiser pile', 'Consulter sommet', 'La pile reste inchangée'],
    complexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)' }
  },
  'stack-is-empty': {
    title: 'Is Empty',
    what: 'Vérifier si la pile est vide.',
    how: ['Vérifier si le sommet == -1', 'Si oui, la pile est vide', 'Sinon, elle contient des éléments'],
    steps: ['Vérifier état', 'Ajouter éléments', 'Vérifier à nouveau', 'Retirer tous les éléments'],
    complexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)' }
  },
  'stack-is-full': {
    title: 'Is Full',
    what: 'Vérifier si la pile a atteint sa capacité maximale.',
    how: ['Vérifier si longueur == capacité', 'Si oui, la pile est pleine', 'Sinon, il y a de la place'],
    steps: ['Vérifier état initial', 'Remplir la pile', 'Vérifier la capacité', 'Essayer d\'ajouter'],
    complexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)' }
  },
  'stack-postfix': {
    title: 'Postfix Notation',
    what: 'Évalue une expression en notation polonaise inversée (RPN).',
    how: ['Parcourir de gauche à droite', 'Si opérande: push', 'Si opérateur: pop deux opérandes, calculer, push résultat'],
    steps: ['Initialiser pile', 'Traiter chaque token', 'Pousser opérandes', 'Calculer opérateurs'],
    complexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' }
  },
  'stack-prefix': {
    title: 'Prefix Notation',
    what: 'Évalue une expression en notation polonaise (préfixe).',
    how: ['Parcourir de droite à gauche', 'Si opérande: push', 'Si opérateur: pop deux, calculer, push résultat'],
    steps: ['Inverser la chaîne', 'Traiter chaque token', 'Pousser opérandes', 'Calculer opérateurs'],
    complexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' }
  },
  'stack-array': {
    title: 'Using Array',
    what: 'Implémentation de pile avec tableau statique à taille fixe.',
    how: ['Utiliser un tableau de taille fixe', 'Maintenir un pointeur top', 'Push: ajouter à arr[top]', 'Pop: retirer arr[top]'],
    steps: ['Créer tableau statique', 'Initialiser top = -1', 'Démontrer push/pop', 'Vérifier overflow'],
    complexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(n)' }
  },
  'stack-linked-list': {
    title: 'Using Linked List',
    what: 'Implémentation de pile avec liste chaînée à taille dynamique.',
    how: ['Utiliser des nœuds chaînés', 'Maintenir un pointeur head', 'Push: créer nouveau nœud', 'Pop: supprimer head'],
    steps: ['Créer liste vide', 'Initialiser head = null', 'Démontrer push/pop', 'Montrer flexibilité'],
    complexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(n)' }
  }
};

class AlgorithmRunner extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.array = [];
    this.current = -1;
    this.comparing = -1;
    this.foundIndex = null;
    this.sortedIndices = [];
    this.mid = -1;
    this.left = -1;
    this.right = -1;
    this.isPlaying = false;
    this.currentAlgo = null;
    this.stack = [];
    this.stackCapacity = 8;
    this.speed = 1;
  }

  async connectedCallback() {
    const template = await templatePromise;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    
    this.canvas = this.shadowRoot.getElementById('canvas');
    const backBtn = this.shadowRoot.getElementById('back');
    const playBtn = this.shadowRoot.getElementById('play');
    const pauseBtn = this.shadowRoot.getElementById('pause');
    const resetBtn = this.shadowRoot.getElementById('reset');
    const stepBtn = this.shadowRoot.getElementById('step');
    const generateBtn = this.shadowRoot.getElementById('generate');
    const speedSlider = this.shadowRoot.getElementById('speed');

    backBtn.onclick = () => window.location.href = 'visualizer.html';
    playBtn.onclick = () => this.play();
    pauseBtn.onclick = () => this.pause();
    resetBtn.onclick = () => this.reset();
    stepBtn.onclick = () => this.step();
    generateBtn.onclick = () => this.generateNewArray();
    speedSlider.onchange = (e) => this.speed = parseFloat(e.target.value);

    const algo = this.getAttribute('algo');
    this.currentAlgo = algo;
    this.initializeAlgorithm();
  }

  initializeAlgorithm() {
    const algo = ALGORITHMS[this.currentAlgo];
    
    this.shadowRoot.getElementById('runner-title').textContent = algo.title;
    this.shadowRoot.getElementById('runner-desc').textContent = `Visualisation interactive de ${algo.title}`;
    this.shadowRoot.getElementById('algo-what').textContent = algo.what;
    
    const howList = this.shadowRoot.getElementById('algo-how');
    howList.innerHTML = '';
    algo.how.forEach(step => {
      const li = document.createElement('li');
      li.textContent = step;
      howList.appendChild(li);
    });

    const stepsList = this.shadowRoot.getElementById('algo-steps');
    stepsList.innerHTML = '';
    algo.steps.forEach(step => {
      const li = document.createElement('li');
      li.textContent = step;
      stepsList.appendChild(li);
    });

    const complexityDiv = this.shadowRoot.getElementById('algo-complexity');
    complexityDiv.innerHTML = `
      <div style="display: grid; gap: 8px;">
        <div><strong>Meilleur:</strong> ${algo.complexity.best}</div>
        <div><strong>Moyen:</strong> ${algo.complexity.average}</div>
        <div><strong>Pire:</strong> ${algo.complexity.worst}</div>
        <div><strong>Espace:</strong> ${algo.complexity.space}</div>
      </div>
    `;

    if (this.currentAlgo.startsWith('stack-')) {
      this.initializeStack();
    } else {
      this.initializeArray();
    }
  }

  initializeArray() {
    this.array = Array.from({length: 12}, () => Math.floor(Math.random() * 100) + 1);
    this.current = -1;
    this.comparing = -1;
    this.foundIndex = null;
    this.sortedIndices = [];
    this.mid = -1;
    this.left = 0;
    this.right = this.array.length - 1;
    this.renderArray();
  }

  initializeStack() {
    this.stack = [];
    this.stackCapacity = 5;
    this.updateStackUI(this.stack, this.stackCapacity, 'Cliquez sur Play pour commencer');
  }

  renderArray() {
    const container = document.createElement('div');
    container.className = 'array-container';

    const arrayDiv = document.createElement('div');
    arrayDiv.className = 'array';

    this.array.forEach((val) => {
      const item = document.createElement('div');
      item.className = 'array-item';
      item.innerHTML = `<div class="value">${val}</div><div class="index"></div><div class="pointer"></div>`;
      arrayDiv.appendChild(item);
    });

    const messageBox = document.createElement('div');
    messageBox.className = 'message-box';
    messageBox.id = 'message-box';
    messageBox.textContent = 'Cliquez sur Play pour commencer';

    container.appendChild(arrayDiv);
    container.appendChild(messageBox);

    this.canvas.innerHTML = '';
    this.canvas.appendChild(container);
  }

  updateUI() {
    const items = this.shadowRoot.querySelectorAll('.array-item');
    items.forEach((el, idx) => {
      el.classList.remove('active', 'comparing', 'found', 'sorted', 'left-bound', 'right-bound', 'mid-point', 'in-range');
      const pointer = el.querySelector('.pointer');
      pointer.textContent = '';
      
      if (this.foundIndex === idx) {
        el.classList.add('found');
        pointer.textContent = '✓';
      } else if (this.sortedIndices.includes(idx)) {
        el.classList.add('sorted');
      } else if (this.current === idx) {
        el.classList.add('active');
        pointer.textContent = '👆';
      } else if (this.comparing === idx) {
        el.classList.add('comparing');
        pointer.textContent = '⚡';
      } else if (idx === this.mid && this.currentAlgo === 'binary-search') {
        el.classList.add('mid-point');
        pointer.textContent = '🎯';
      } else if (idx === this.left && this.currentAlgo === 'binary-search') {
        el.classList.add('left-bound');
        pointer.textContent = 'L';
      } else if (idx === this.right && this.currentAlgo === 'binary-search') {
        el.classList.add('right-bound');
        pointer.textContent = 'R';
      } else if (idx >= this.left && idx <= this.right && this.currentAlgo === 'binary-search') {
        el.classList.add('in-range');
      }
      
      el.querySelector('.value').textContent = this.array[idx];
      el.style.height = Math.max(60, this.array[idx] * 3) + 'px';
    });
  }

  updateMessage(msg) {
    const messageBox = this.shadowRoot.getElementById('message-box');
    if (messageBox) {
      messageBox.textContent = msg;
    }
  }

  updateStackUI(stack, capacity = null, message = '') {
    const canvas = this.shadowRoot.getElementById('canvas');
    canvas.innerHTML = '';

    const visualization = document.createElement('div');
    visualization.className = 'stack-visualization';

    const stackDisplay = document.createElement('div');
    stackDisplay.className = 'stack-display';

    if (stack.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'stack-empty-state';
      emptyState.innerHTML = '<div style="font-size: 48px;">📭</div><div>Pile vide</div>';
      stackDisplay.appendChild(emptyState);
    } else {
      stack.forEach((value, idx) => {
        const item = document.createElement('div');
        item.className = 'stack-item';
        item.setAttribute('data-index', idx);
        item.textContent = value;
        if (idx === stack.length - 1) {
          item.classList.add('active');
          const pointer = document.createElement('div');
          pointer.className = 'stack-pointer';
          pointer.textContent = 'TOP ↓';
          stackDisplay.insertAdjacentElement('afterbegin', pointer);
        }
        stackDisplay.appendChild(item);
      });
    }

    visualization.appendChild(stackDisplay);

    const stats = document.createElement('div');
    stats.style.display = 'flex';
    stats.style.gap = '20px';
    stats.style.justifyContent = 'center';

    const statSize = document.createElement('div');
    statSize.className = 'stack-stat';
    statSize.innerHTML = `<div class="stack-stat-label">Taille</div><div class="stack-stat-value">${stack.length}</div>`;
    stats.appendChild(statSize);

    if (capacity) {
      const statCapacity = document.createElement('div');
      statCapacity.className = 'stack-stat';
      statCapacity.innerHTML = `<div class="stack-stat-label">Capacité</div><div class="stack-stat-value">${capacity}</div>`;
      stats.appendChild(statCapacity);

      const statUsage = document.createElement('div');
      statUsage.className = 'stack-stat';
      const usage = ((stack.length / capacity) * 100).toFixed(0);
      statUsage.innerHTML = `<div class="stack-stat-label">Utilisation</div><div class="stack-stat-value">${usage}%</div>`;
      stats.appendChild(statUsage);
    }

    visualization.appendChild(stats);

    const messageBox = document.createElement('div');
    messageBox.className = 'message-box';
    messageBox.id = 'message-box';
    messageBox.textContent = message;
    visualization.appendChild(messageBox);

    canvas.appendChild(visualization);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms * (2 - this.speed)));
  }

  async play() {
    if (this.isPlaying) return;
    this.isPlaying = true;

    switch (this.currentAlgo) {
      case 'linear-search': await this.runLinearSearch(); break;
      case 'binary-search': await this.runBinarySearch(); break;
      case 'bubble-sort': await this.runBubbleSort(); break;
      case 'selection-sort': await this.runSelectionSort(); break;
      case 'insertion-sort': await this.runInsertionSort(); break;
      case 'merge-sort': await this.runMergeSort(); break;
      case 'quick-sort': await this.runQuickSort(); break;
      case 'stack-push-pop': await this.runStackPushPop(); break;
      case 'stack-peek': await this.runStackPeek(); break;
      case 'stack-is-empty': await this.runStackIsEmpty(); break;
      case 'stack-is-full': await this.runStackIsFull(); break;
      case 'stack-postfix': await this.runStackPostfix(); break;
      case 'stack-prefix': await this.runStackPrefix(); break;
      case 'stack-array': await this.runStackArray(); break;
      case 'stack-linked-list': await this.runStackLinkedList(); break;
    }

    this.isPlaying = false;
  }

  pause() {
    this.isPlaying = false;
  }

  reset() {
    this.isPlaying = false;
    this.initializeAlgorithm();
  }

  async step() {
    // Placeholder for step functionality
  }

  generateNewArray() {
    if (this.currentAlgo.startsWith('stack-')) {
      this.initializeStack();
    } else {
      this.initializeArray();
    }
  }

  // ARRAY ALGORITHMS
  async runLinearSearch() {
    const target = this.array[Math.floor(Math.random() * this.array.length)];
    this.updateMessage(`Recherche linéaire: chercher ${target}`);
    await this.sleep(1000);

    for (let i = 0; i < this.array.length && this.isPlaying; i++) {
      this.current = i;
      this.updateMessage(`Vérification index ${i}: ${this.array[i]}`);
      this.updateUI();
      await this.sleep(600);

      if (this.array[i] === target) {
        this.foundIndex = i;
        this.updateMessage(`✓ Trouvé ${target} à l'index ${i}`);
        this.updateUI();
        await this.sleep(1500);
        return;
      }
    }

    this.updateMessage(`✗ ${target} non trouvé`);
    this.current = -1;
    this.updateUI();
  }

  async runBinarySearch() {
    this.array.sort((a, b) => a - b);
    this.renderArray();
    
    const target = this.array[Math.floor(Math.random() * this.array.length)];
    this.updateMessage(`Recherche binaire (tableau trié): chercher ${target}`);
    await this.sleep(1000);

    this.left = 0;
    this.right = this.array.length - 1;

    while (this.left <= this.right && this.isPlaying) {
      this.mid = Math.floor((this.left + this.right) / 2);
      this.updateMessage(`Vérification: mid=${this.array[this.mid]} (gauche=${this.left}, droite=${this.right})`);
      this.updateUI();
      await this.sleep(800);

      if (this.array[this.mid] === target) {
        this.foundIndex = this.mid;
        this.updateMessage(`✓ Trouvé ${target} à l'index ${this.mid}`);
        this.updateUI();
        await this.sleep(1500);
        return;
      } else if (this.array[this.mid] < target) {
        this.left = this.mid + 1;
      } else {
        this.right = this.mid - 1;
      }
    }

    this.updateMessage(`✗ ${target} non trouvé`);
    this.current = -1;
    this.updateUI();
  }

  async runBubbleSort() {
    const n = this.array.length;

    for (let i = 0; i < n - 1 && this.isPlaying; i++) {
      for (let j = 0; j < n - i - 1 && this.isPlaying; j++) {
        this.current = j;
        this.comparing = j + 1;
        this.updateMessage(`Comparaison: ${this.array[j]} vs ${this.array[j + 1]}`);
        this.updateUI();
        await this.sleep(600);

        if (this.array[j] > this.array[j + 1]) {
          [this.array[j], this.array[j + 1]] = [this.array[j + 1], this.array[j]];
          this.updateMessage(`Échange: ${this.array[j + 1]} ↔ ${this.array[j]}`);
          this.updateUI();
          await this.sleep(600);
        }
      }
      this.sortedIndices.push(n - i - 1);
    }

    this.sortedIndices = Array.from({length: n}, (_, i) => i);
    this.current = -1;
    this.comparing = -1;
    this.updateMessage('✓ Tri terminé!');
    this.updateUI();
  }

  async runSelectionSort() {
    const n = this.array.length;

    for (let i = 0; i < n - 1 && this.isPlaying; i++) {
      let minIdx = i;
      this.current = i;
      this.updateMessage(`Cherche minimum depuis index ${i}`);
      this.updateUI();
      await this.sleep(600);

      for (let j = i + 1; j < n && this.isPlaying; j++) {
        this.comparing = j;
        this.updateUI();
        await this.sleep(400);

        if (this.array[j] < this.array[minIdx]) {
          minIdx = j;
        }
      }

      if (minIdx !== i) {
        [this.array[i], this.array[minIdx]] = [this.array[minIdx], this.array[i]];
        this.updateMessage(`Échange ${this.array[i]} à position ${i}`);
        this.updateUI();
        await this.sleep(600);
      }

      this.sortedIndices.push(i);
    }

    this.sortedIndices.push(n - 1);
    this.current = -1;
    this.comparing = -1;
    this.updateMessage('✓ Tri terminé!');
    this.updateUI();
  }

  async runInsertionSort() {
    for (let i = 1; i < this.array.length && this.isPlaying; i++) {
      const key = this.array[i];
      let j = i - 1;

      this.current = i;
      this.updateMessage(`Insertion de ${key}`);
      this.updateUI();
      await this.sleep(600);

      while (j >= 0 && this.array[j] > key && this.isPlaying) {
        this.comparing = j;
        this.array[j + 1] = this.array[j];
        this.updateMessage(`Décale ${this.array[j]} à droite`);
        this.updateUI();
        await this.sleep(600);
        j--;
      }

      this.array[j + 1] = key;
      this.sortedIndices = Array.from({length: i + 1}, (_, idx) => idx);
      this.updateUI();
      await this.sleep(600);
    }

    this.sortedIndices = Array.from({length: this.array.length}, (_, i) => i);
    this.current = -1;
    this.updateMessage('✓ Tri terminé!');
    this.updateUI();
  }

  async runMergeSort() {
    await this.mergeSortHelper(0, this.array.length - 1);
    this.sortedIndices = Array.from({length: this.array.length}, (_, i) => i);
    this.updateMessage('✓ Tri terminé!');
    this.updateUI();
  }

  async mergeSortHelper(left, right) {
    if (!this.isPlaying || left >= right) return;

    const mid = Math.floor((left + right) / 2);
    await this.mergeSortHelper(left, mid);
    await this.mergeSortHelper(mid + 1, right);
    await this.mergeSortMerge(left, mid, right);
  }

  async mergeSortMerge(left, mid, right) {
    const leftArr = this.array.slice(left, mid + 1);
    const rightArr = this.array.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length && this.isPlaying) {
      this.current = left + i;
      this.comparing = mid + 1 + j;
      this.updateUI();
      await this.sleep(600);

      if (leftArr[i] <= rightArr[j]) {
        this.array[k++] = leftArr[i++];
      } else {
        this.array[k++] = rightArr[j++];
      }
    }

    while (i < leftArr.length && this.isPlaying) {
      this.array[k++] = leftArr[i++];
      this.updateUI();
      await this.sleep(400);
    }

    while (j < rightArr.length && this.isPlaying) {
      this.array[k++] = rightArr[j++];
      this.updateUI();
      await this.sleep(400);
    }
  }

  async runQuickSort() {
    await this.quickSortHelper(0, this.array.length - 1);
    this.sortedIndices = Array.from({length: this.array.length}, (_, i) => i);
    this.updateMessage('✓ Tri terminé!');
    this.updateUI();
  }

  async quickSortHelper(low, high) {
    if (!this.isPlaying || low >= high) return;

    const pi = await this.quickSortPartition(low, high);
    await this.quickSortHelper(low, pi - 1);
    await this.quickSortHelper(pi + 1, high);
  }

  async quickSortPartition(low, high) {
    const pivot = this.array[high];
    let i = low - 1;

    for (let j = low; j < high && this.isPlaying; j++) {
      this.current = j;
      this.comparing = high;
      this.updateMessage(`Comparaison: ${this.array[j]} vs pivot ${pivot}`);
      this.updateUI();
      await this.sleep(600);

      if (this.array[j] < pivot) {
        i++;
        if (i !== j) {
          [this.array[i], this.array[j]] = [this.array[j], this.array[i]];
          this.updateUI();
          await this.sleep(600);
        }
      }
    }

    [this.array[i + 1], this.array[high]] = [this.array[high], this.array[i + 1]];
    this.updateUI();
    await this.sleep(600);
    return i + 1;
  }

  // STACK ALGORITHMS
  async runStackPushPop() {
    const capacity = 5;
    const stack = [];
    
    this.updateStackUI(stack, capacity, 'Stack Push & Pop: Démonstration LIFO');
    await this.sleep(1500);
    
    for (let i = 1; i <= 4 && this.isPlaying; i++) {
      const value = i * 10;
      stack.push(value);
      this.updateStackUI(stack, capacity, `Push(${value}) ▶ Size: ${stack.length}/${capacity}`);
      await this.sleep(1000);
    }
    
    this.updateStackUI(stack, capacity, '✓ Pile prête! Maintenant: Pop ↓');
    await this.sleep(1500);
    
    while (stack.length > 0 && this.isPlaying) {
      const value = stack.pop();
      this.updateStackUI(stack, capacity, `Pop(${value}) ◀ Size: ${stack.length}/${capacity}`);
      await this.sleep(1000);
    }
    
    this.updateStackUI([], capacity, '✓ Pile vide! Push & Pop terminés');
  }

  async runStackPeek() {
    const stack = [10, 20, 30, 40];
    
    this.updateStackUI(stack, 5, 'Stack Peek: Consultation du sommet');
    await this.sleep(1500);
    
    for (let i = 0; i < stack.length && this.isPlaying; i++) {
      const tempStack = stack.slice(0, i + 1);
      this.updateStackUI(tempStack, 5, `Parcours... (élément: ${tempStack[i]})`);
      await this.sleep(500);
    }
    
    this.updateStackUI(stack, 5, `✓ Peek: Sommet = ${stack[stack.length - 1]} (sans modification)`);
    await this.sleep(1500);
    
    this.updateStackUI(stack, 5, '✓ Pile inchangée! Peek terminé');
  }

  async runStackIsEmpty() {
    const stack = [];
    
    this.updateStackUI(stack, 5, 'Is Empty: Vérification pile vide');
    await this.sleep(1500);
    
    this.updateStackUI(stack, 5, stack.length === 0 ? '✓ Pile VIDE (isEmpty = true)' : '✗ Pile NON VIDE');
    await this.sleep(1500);
    
    const newStack = [];
    for (let i = 1; i <= 3 && this.isPlaying; i++) {
      newStack.push(i * 10);
      this.updateStackUI(newStack, 5, `Push(${i * 10})... Taille: ${newStack.length}`);
      await this.sleep(800);
    }
    
    this.updateStackUI(newStack, 5, '✗ Pile NON VIDE (isEmpty = false)');
    await this.sleep(1500);
  }

  async runStackIsFull() {
    const capacity = 5;
    const stack = [];
    
    this.updateStackUI(stack, capacity, 'Is Full: Vérification capacité');
    await this.sleep(1500);
    
    for (let i = 1; i <= capacity && this.isPlaying; i++) {
      stack.push(i * 10);
      this.updateStackUI(stack, capacity, `Push(${i * 10})... Taille: ${stack.length}/${capacity}`);
      await this.sleep(800);
    }
    
    this.updateStackUI(stack, capacity, stack.length === capacity ? '✓ Pile PLEINE' : '✗ De l\'espace disponible');
    await this.sleep(1500);
  }

  async runStackPostfix() {
    const expression = '5 3 + 2 *';
    const tokens = expression.split(' ');
    const stack = [];
    
    this.updateStackUI(stack, 10, `Évaluation Postfix: ${expression} = ?`);
    await this.sleep(1500);
    
    for (const token of tokens) {
      if (!this.isPlaying) break;
      
      const num = parseInt(token);
      
      if (!isNaN(num)) {
        stack.push(num);
        this.updateStackUI(stack, 10, `Push(${num}) | Opérande`);
        await this.sleep(900);
      } else {
        const b = stack.pop();
        const a = stack.pop();
        let result;
        
        if (token === '+') result = a + b;
        else if (token === '-') result = a - b;
        else if (token === '*') result = a * b;
        else if (token === '/') result = Math.floor(a / b);
        
        stack.push(result);
        this.updateStackUI(stack, 10, `Opérateur: ${a} ${token} ${b} = ${result}`);
        await this.sleep(1200);
      }
    }
    
    this.updateStackUI(stack, 10, `✓ Résultat Final: ${stack[0]}`);
    await this.sleep(1500);
  }

  async runStackPrefix() {
    const expression = '* + 5 3 2';
    const tokens = expression.split(' ').reverse();
    const stack = [];
    
    this.updateStackUI(stack, 10, `Évaluation Prefix: ${expression} = ?`);
    await this.sleep(1500);
    
    for (const token of tokens) {
      if (!this.isPlaying) break;
      
      const num = parseInt(token);
      
      if (!isNaN(num)) {
        stack.push(num);
        this.updateStackUI(stack, 10, `Push(${num}) | Opérande`);
        await this.sleep(900);
      } else {
        const a = stack.pop();
        const b = stack.pop();
        let result;
        
        if (token === '+') result = a + b;
        else if (token === '-') result = a - b;
        else if (token === '*') result = a * b;
        else if (token === '/') result = Math.floor(a / b);
        
        stack.push(result);
        this.updateStackUI(stack, 10, `Opérateur: ${a} ${token} ${b} = ${result}`);
        await this.sleep(1200);
      }
    }
    
    this.updateStackUI(stack, 10, `✓ Résultat Final: ${stack[0]}`);
    await this.sleep(1500);
  }

  async runStackArray() {
    const capacity = 5;
    const stack = [];
    
    this.updateStackUI(stack, capacity, 'Array Stack: Taille fixe');
    await this.sleep(1500);
    
    for (let i = 1; i <= capacity && this.isPlaying; i++) {
      stack.push(i * 10);
      this.updateStackUI(stack, capacity, `Push(${i * 10})... Taille: ${stack.length}/${capacity}`);
      await this.sleep(800);
    }
    
    this.updateStackUI(stack, capacity, '✓ Avantages: Accès rapide O(1) | Inconvénients: Taille fixe');
    await this.sleep(1500);
  }

  async runStackLinkedList() {
    const stack = [];
    
    this.updateStackUI(stack, null, 'Linked List Stack: Taille dynamique');
    await this.sleep(1500);
    
    for (let i = 1; i <= 6 && this.isPlaying; i++) {
      stack.push(i * 10);
      this.updateStackUI(stack, null, `Push(${i * 10})... Taille: ${stack.length}`);
      await this.sleep(900);
    }
    
    this.updateStackUI(stack, null, '✓ Avantages: Taille dynamique | Inconvénients: Plus de mémoire');
    await this.sleep(1500);
  }
}

class UnionFind {
  constructor(n) {
    this.parent = Array.from({length: n}, (_, i) => i);
    this.rank = new Array(n).fill(0);
  }

  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x, y) {
    const px = this.find(x);
    const py = this.find(y);
    
    if (px === py) return false;
    
    if (this.rank[px] < this.rank[py]) {
      this.parent[px] = py;
    } else if (this.rank[px] > this.rank[py]) {
      this.parent[py] = px;
    } else {
      this.parent[py] = px;
      this.rank[px]++;
    }
    return true;
  }
}

customElements.define('algorithm-runner', AlgorithmRunner);
