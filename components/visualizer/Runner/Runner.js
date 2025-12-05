import {
  ALGORITHMS,
  LinearSearch,
  BinarySearch,
  BubbleSort,
  SelectionSort,
  InsertionSort,
  MergeSort,
  QuickSort,
  StackPushPop,
  StackPeek,
  StackIsEmpty,
  StackIsFull,
  StackPostfix,
  StackPrefix,
  StackArray,
  StackLinkedList
} from './algorithms/index.js';

const templatePromise = Promise.all([
  fetch(new URL('./Runner.html', import.meta.url)).then((r) => r.text()),
  fetch(new URL('./Runner.css', import.meta.url)).then((r) => r.text()),
]).then(([html, css]) => {
  const template = document.createElement('template');
  template.innerHTML = `<style>${css}</style>${html}`;
  return template;
});

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
    const stepBtn = this.shadowRoot.getElementById('step');
    const generateBtn = this.shadowRoot.getElementById('generate');
    const speedSlider = this.shadowRoot.getElementById('speed');

    backBtn.onclick = () => window.location.href = 'visualizer.html';
    playBtn.onclick = () => this.play();
    pauseBtn.onclick = () => this.pause();
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

    const algorithmMap = {
      'linear-search': LinearSearch,
      'binary-search': BinarySearch,
      'bubble-sort': BubbleSort,
      'selection-sort': SelectionSort,
      'insertion-sort': InsertionSort,
      'merge-sort': MergeSort,
      'quick-sort': QuickSort,
      'stack-push-pop': StackPushPop,
      'stack-peek': StackPeek,
      'stack-is-empty': StackIsEmpty,
      'stack-is-full': StackIsFull,
      'stack-postfix': StackPostfix,
      'stack-prefix': StackPrefix,
      'stack-array': StackArray,
      'stack-linked-list': StackLinkedList
    };

    const AlgorithmClass = algorithmMap[this.currentAlgo];
    if (AlgorithmClass) {
      const algorithm = new AlgorithmClass(this);
      await algorithm.run();
    }

    this.isPlaying = false;
  }

  pause() {
    this.isPlaying = false;
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
}

customElements.define('algorithm-runner', AlgorithmRunner);
