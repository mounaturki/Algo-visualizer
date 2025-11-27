const templatePromise = Promise.all([
  fetch(new URL('./CTASection.html', import.meta.url)).then((response) =>
    response.text(),
  ),
  fetch(new URL('./CTASection.css', import.meta.url)).then((response) =>
    response.text(),
  ),
]).then(([html, css]) => {
  const template = document.createElement('template');
  template.innerHTML = `<style>${css}</style>${html}`;
  return template;
});

class CTASection extends HTMLElement {
  constructor() {
    super();
    this.handleNavigate = this.handleNavigate.bind(this);
    this.attachShadow({ mode: 'open' });
    this.renderPromise = templatePromise.then((template) => {
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      this.cta = this.shadowRoot.querySelector('a');
    });
  }

  connectedCallback() {
    this.renderPromise.then(() => {
      this.cta?.addEventListener('click', this.handleNavigate);
    });
  }

  disconnectedCallback() {
    this.cta?.removeEventListener('click', this.handleNavigate);
  }

  handleNavigate(event) {
    event.preventDefault();
    window.location.href = 'visualizer.html';
  }
}

customElements.define('algo-cta', CTASection);

