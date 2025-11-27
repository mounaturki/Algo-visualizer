const templatePromise = Promise.all([
  fetch(new URL('./QuestionsSection.html', import.meta.url)).then((response) =>
    response.text(),
  ),
  fetch(new URL('./QuestionsSection.css', import.meta.url)).then((response) =>
    response.text(),
  ),
]).then(([html, css]) => {
  const template = document.createElement('template');
  template.innerHTML = `<style>${css}</style>${html}`;
  return template;
});

class QuestionsSection extends HTMLElement {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.attachShadow({ mode: 'open' });
    this.renderPromise = templatePromise.then((template) => {
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      this.button = this.shadowRoot.querySelector('button');
    });
  }

  connectedCallback() {
    this.renderPromise.then(() => {
      this.button?.addEventListener('click', this.handleClick);
    });
  }

  disconnectedCallback() {
    this.button?.removeEventListener('click', this.handleClick);
  }

  handleClick() {
    window.dispatchEvent(new CustomEvent('algo:open-contact'));
  }
}

customElements.define('algo-questions', QuestionsSection);

