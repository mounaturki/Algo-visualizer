const templatePromise = Promise.all([
  fetch(new URL('./Navbar.html', import.meta.url)).then((response) =>
    response.text(),
  ),
  fetch(new URL('./Navbar.css', import.meta.url)).then((response) =>
    response.text(),
  ),
]).then(([html, css]) => {
  const template = document.createElement('template');
  template.innerHTML = `<style>${css}</style>${html}`;
  return template;
});

class VisualizerNavbar extends HTMLElement {
  constructor() {
    super();
    this.handleBack = this.handleBack.bind(this);
    this.handleDemo = this.handleDemo.bind(this);
    this.attachShadow({ mode: 'open' });
    this.renderPromise = templatePromise.then((template) => {
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      this.backButton = this.shadowRoot.querySelector('[data-action="home"]');
      this.demoButton = this.shadowRoot.querySelector('[data-action="open-demo"]');
    });
  }

  connectedCallback() {
    this.renderPromise.then(() => {
      this.backButton?.addEventListener('click', this.handleBack);
      this.demoButton?.addEventListener('click', this.handleDemo);
    });
  }

  disconnectedCallback() {
    this.backButton?.removeEventListener('click', this.handleBack);
    this.demoButton?.removeEventListener('click', this.handleDemo);
  }

  handleBack() {
    window.location.href = 'main.html';
  }

  handleDemo() {
    const grid = document.querySelector('algorithm-grid');
    grid?.scrollIntoView({ behavior: 'smooth' });
  }
}

customElements.define('visualizer-navbar', VisualizerNavbar);

