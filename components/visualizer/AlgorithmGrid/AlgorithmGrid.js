const templatePromise = Promise.all([
  fetch(new URL('./AlgorithmGrid.html', import.meta.url)).then((response) =>
    response.text(),
  ),
  fetch(new URL('./AlgorithmGrid.css', import.meta.url)).then((response) =>
    response.text(),
  ),
]).then(([html, css]) => {
  const template = document.createElement('template');
  template.innerHTML = `<style>${css}</style>${html}`;
  return template;
});

class AlgorithmGrid extends HTMLElement {
  constructor() {
    super();
    this.handleSelect = this.handleSelect.bind(this);
    this.attachShadow({ mode: 'open' });
    this.renderPromise = templatePromise.then((template) => {
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      this.cards = Array.from(this.shadowRoot.querySelectorAll('button[data-algo]'));
    });
  }

  connectedCallback() {
    this.renderPromise.then(() => {
      this.cards.forEach((card) => card.addEventListener('click', this.handleSelect));
    });
  }

  disconnectedCallback() {
    this.cards.forEach((card) => card.removeEventListener('click', this.handleSelect));
  }

  handleSelect(event) {
    const algo = event.currentTarget.dataset.algo;
    alert(`Visualisation "${algo}" en cours de préparation ✨`);
  }
}

customElements.define('algorithm-grid', AlgorithmGrid);

