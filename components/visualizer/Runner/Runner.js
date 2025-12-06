import {
  ALGORITHMS,
  LinearSearch,
  BinarySearch,
  BubbleSort,
  SelectionSort,
  InsertionSort,
  MergeSort,
  QuickSort,
  HeapSort,
  StackPushPop,
  StackPeek,
  StackIsEmpty,
  StackIsFull,
  StackPostfix,
  StackPrefix,
  StackArray,
  StackLinkedList,
  QueueEnqueueDequeue,
  LinkedListInsertion,
  
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
    } else if (this.currentAlgo.startsWith('queue-')) {
      this.initializeQueue();
    } else if (this.currentAlgo.startsWith('linked-list-')) {
      this.initializeLinkedList();
    } else if (this.currentAlgo.startsWith('binary-tree-')) {
      this.initializeTree();
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

  initializeQueue() {
    this.updateQueueUI([], 6, 'Cliquez sur Play pour commencer');
  }

  initializeLinkedList() {
    this.updateLinkedListUI([], 'Cliquez sur Play pour commencer');
  }

  initializeTree() {
    const tree = {
      value: 1,
      left: {
        value: 2,
        left: { value: 4, left: null, right: null },
        right: { value: 5, left: null, right: null }
      },
      right: {
        value: 3,
        left: { value: 6, left: null, right: null },
        right: { value: 7, left: null, right: null }
      }
    };
    this.updateBinaryTreeUI(tree, 'Cliquez sur Play pour commencer');
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

  updateQueueUI(queue, capacity = null, message = '') {
    const canvas = this.shadowRoot.getElementById('canvas');
    canvas.innerHTML = '';

    const visualization = document.createElement('div');
    visualization.className = 'queue-visualization';

    const queueDisplay = document.createElement('div');
    queueDisplay.className = 'queue-display';

    if (queue.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'queue-empty-state';
      emptyState.innerHTML = '<div style="font-size: 48px;">📭</div><div>File vide</div>';
      queueDisplay.appendChild(emptyState);
    } else {
      queue.forEach((value, idx) => {
        const item = document.createElement('div');
        item.className = 'queue-item';
        item.setAttribute('data-index', idx);
        item.textContent = value;
        if (idx === 0) {
          item.classList.add('front');
        }
        if (idx === queue.length - 1) {
          item.classList.add('rear');
        }
        queueDisplay.appendChild(item);
      });
    }

    visualization.appendChild(queueDisplay);

    const stats = document.createElement('div');
    stats.style.display = 'flex';
    stats.style.gap = '20px';
    stats.style.justifyContent = 'center';

    const statSize = document.createElement('div');
    statSize.className = 'queue-stat';
    statSize.innerHTML = `<div class="queue-stat-label">Taille</div><div class="queue-stat-value">${queue.length}</div>`;
    stats.appendChild(statSize);

    if (capacity) {
      const statCapacity = document.createElement('div');
      statCapacity.className = 'queue-stat';
      statCapacity.innerHTML = `<div class="queue-stat-label">Capacité</div><div class="queue-stat-value">${capacity}</div>`;
      stats.appendChild(statCapacity);
    }

    visualization.appendChild(stats);

    const messageBox = document.createElement('div');
    messageBox.className = 'message-box';
    messageBox.id = 'message-box';
    messageBox.textContent = message;
    visualization.appendChild(messageBox);

    canvas.appendChild(visualization);
  }

  updateLinkedListUI(list, message = '') {
    const canvas = this.shadowRoot.getElementById('canvas');
    canvas.innerHTML = '';

    const visualization = document.createElement('div');
    visualization.className = 'linkedlist-visualization';

    const listDisplay = document.createElement('div');
    listDisplay.className = 'linkedlist-display';

    if (list.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'linkedlist-empty-state';
      emptyState.innerHTML = '<div style="font-size: 48px;">📭</div><div>Liste vide</div>';
      listDisplay.appendChild(emptyState);
      } else {
      list.forEach((value, idx) => {
        const node = document.createElement('div');
        node.className = 'linkedlist-node';
        node.innerHTML = `
          <div class="node-value">${value}</div>
          ${idx < list.length - 1 ? '<div class="node-arrow">→</div>' : '<div class="node-arrow">null</div>'}
        `;
        listDisplay.appendChild(node);
      });
    }

    visualization.appendChild(listDisplay);

    const messageBox = document.createElement('div');
    messageBox.className = 'message-box';
    messageBox.id = 'message-box';
    messageBox.textContent = message;
    visualization.appendChild(messageBox);

    canvas.appendChild(visualization);
  }

  updateBinaryTreeUI(tree, message = '') {
    const canvas = this.shadowRoot.getElementById('canvas');
    canvas.innerHTML = '';

    const visualization = document.createElement('div');
    visualization.className = 'tree-visualization';

    const treeDisplay = document.createElement('div');
    treeDisplay.className = 'tree-display';
    treeDisplay.innerHTML = this.renderTree(tree);

    visualization.appendChild(treeDisplay);

    const messageBox = document.createElement('div');
    messageBox.className = 'message-box';
    messageBox.id = 'message-box';
    messageBox.textContent = message;
    visualization.appendChild(messageBox);

    canvas.appendChild(visualization);
  }

  renderTree(node, level = 0) {
    if (!node) return '';
    
    const indent = '&nbsp;'.repeat(level * 4);
    let html = `<div class="tree-node" style="margin-left: ${level * 40}px;">`;
    html += `<div class="node-value">${node.value}</div>`;
    
    if (node.left || node.right) {
      html += '<div class="tree-children">';
      if (node.left) {
        html += this.renderTree(node.left, level + 1);
      }
      if (node.right) {
        html += this.renderTree(node.right, level + 1);
      }
      html += '</div>';
    }
    
    html += '</div>';
    return html;
  }

  updateGraphUI(graph, visited, queue, result, currentNode = null, levels = {}, nodePositions = {}, message = '') {
    const canvas = this.shadowRoot.getElementById('canvas');
    canvas.innerHTML = '';

    const visualization = document.createElement('div');
    visualization.className = 'graph-visualization';

    // Créer SVG pour le graphe avec arêtes
    const svgContainer = document.createElement('div');
    svgContainer.className = 'graph-svg-container';
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.className = 'graph-svg';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.minHeight = '400px';
    
    // Dessiner les arêtes
    const edges = new Set();
    Object.keys(graph).forEach(nodeStr => {
      const node = Number(nodeStr);
      const neighbors = graph[nodeStr];
      neighbors.forEach(neighbor => {
        const edgeKey = [Math.min(node, neighbor), Math.max(node, neighbor)].join('-');
        if (!edges.has(edgeKey)) {
          edges.add(edgeKey);
          const pos1 = nodePositions[node] || { x: 50, y: 50 };
          const pos2 = nodePositions[neighbor] || { x: 50, y: 50 };
          
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', pos1.x);
          line.setAttribute('y1', pos1.y);
          line.setAttribute('x2', pos2.x);
          line.setAttribute('y2', pos2.y);
          line.setAttribute('stroke', '#cbd5e1');
          line.setAttribute('stroke-width', '0.5');
          line.setAttribute('opacity', '0.6');
          
          // Colorier les arêtes vers les nœuds visités
          if (visited.has(node) && visited.has(neighbor)) {
            line.setAttribute('stroke', '#22c55e');
            line.setAttribute('stroke-width', '1');
            line.setAttribute('opacity', '0.8');
          }
          
          svg.appendChild(line);
        }
      });
    });
    
    // Dessiner les nœuds
    const nodes = Object.keys(graph).map(Number);
    nodes.forEach(node => {
      const pos = nodePositions[node] || { x: 50, y: 50 };
      
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', pos.x);
      circle.setAttribute('cy', pos.y);
      circle.setAttribute('r', '4');
      
      let fillColor = '#94a3b8'; // Non visité
      if (currentNode === node) {
        fillColor = '#3b82f6'; // Actuel
        circle.setAttribute('r', '5.5');
      } else if (visited.has(node)) {
        fillColor = '#22c55e'; // Visité
      } else if (queue.includes(node)) {
        fillColor = '#f59e0b'; // Dans la file
      }
      
      circle.setAttribute('fill', fillColor);
      circle.setAttribute('stroke', '#fff');
      circle.setAttribute('stroke-width', '0.5');
      circle.classList.add('graph-svg-node');
      if (currentNode === node) circle.classList.add('current');
      if (visited.has(node)) circle.classList.add('visited');
      if (queue.includes(node)) circle.classList.add('in-queue');
      
      svg.appendChild(circle);
      
      // Texte du nœud
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', pos.x);
      text.setAttribute('y', pos.y + 6.5);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('font-size', '3');
      text.setAttribute('font-weight', '700');
      text.setAttribute('fill', currentNode === node ? '#fff' : '#18288D');
      text.textContent = node;
      svg.appendChild(text);
      
      // Niveau du nœud
      const nodeKey = node.toString();
      const level = levels[node] !== undefined ? levels[node] : (levels[nodeKey] !== undefined ? levels[nodeKey] : undefined);
      if (level !== undefined) {
        const levelText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        levelText.setAttribute('x', pos.x);
        levelText.setAttribute('y', pos.y - 6);
        levelText.setAttribute('text-anchor', 'middle');
        levelText.setAttribute('font-size', '2');
        levelText.setAttribute('fill', '#64748b');
        levelText.textContent = `L${level}`;
        svg.appendChild(levelText);
      }
    });
    
    svgContainer.appendChild(svg);
    visualization.appendChild(svgContainer);

    // Affichage des nœuds en liste aussi (pour mobile)
    const graphDisplay = document.createElement('div');
    graphDisplay.className = 'graph-display';
    
    nodes.forEach(node => {
      const nodeEl = document.createElement('div');
      nodeEl.className = 'graph-node';
      if (currentNode === node) {
        nodeEl.classList.add('current');
      }
      if (visited.has(node)) {
        nodeEl.classList.add('visited');
      }
      if (queue.includes(node)) {
        nodeEl.classList.add('in-queue');
      }
      
      let label = node.toString();
      const nodeKey = node.toString();
      if (levels[nodeKey] !== undefined || levels[node] !== undefined) {
        const level = levels[nodeKey] !== undefined ? levels[nodeKey] : levels[node];
        label += ` (L${level})`;
      }
      nodeEl.textContent = label;
      graphDisplay.appendChild(nodeEl);
    });

    visualization.appendChild(graphDisplay);

    // Informations détaillées
    const info = document.createElement('div');
    info.className = 'graph-info';
    
    const levelGroups = {};
    Object.keys(levels).forEach(nodeStr => {
      const node = Number(nodeStr);
      const lvl = levels[nodeStr] !== undefined ? levels[nodeStr] : levels[node];
      if (lvl !== undefined) {
        if (!levelGroups[lvl]) levelGroups[lvl] = [];
        levelGroups[lvl].push(node);
      }
    });
    
    let levelInfo = '';
    Object.keys(levelGroups).sort((a, b) => Number(a) - Number(b)).forEach(lvl => {
      levelInfo += `<div><strong>Niveau ${lvl}:</strong> ${levelGroups[lvl].join(', ')}</div>`;
    });
    
    info.innerHTML = `
      <div><strong>Nœud actuel:</strong> ${currentNode !== null ? currentNode : 'Aucun'}</div>
      <div><strong>Visités:</strong> [${Array.from(visited).join(', ')}]</div>
      <div><strong>File:</strong> [${queue.join(', ')}]</div>
      <div><strong>Ordre:</strong> ${result.join(' → ')}</div>
      ${levelInfo ? `<div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e2e8f0;">${levelInfo}</div>` : ''}
    `;
    visualization.appendChild(info);

    const messageBox = document.createElement('div');
    messageBox.className = 'message-box';
    messageBox.id = 'message-box';
    messageBox.innerHTML = message.replace(/\n/g, '<br>');
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
      'heap-sort': HeapSort,
      'stack-push-pop': StackPushPop,
      'stack-peek': StackPeek,
      'stack-is-empty': StackIsEmpty,
      'stack-is-full': StackIsFull,
      'stack-postfix': StackPostfix,
      'stack-prefix': StackPrefix,
      'stack-array': StackArray,
      'stack-linked-list': StackLinkedList,
      'queue-enqueue-dequeue': QueueEnqueueDequeue,
      'linked-list-insertion': LinkedListInsertion
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
    } else if (this.currentAlgo.startsWith('queue-')) {
      this.initializeQueue();
    } else if (this.currentAlgo.startsWith('linked-list-')) {
      this.initializeLinkedList();
    } else {
      this.initializeArray();
    }
  }
}

customElements.define('algorithm-runner', AlgorithmRunner);
