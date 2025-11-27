const templatePromise = Promise.all([
  fetch(new URL('./FAQSection.html', import.meta.url)).then((response) =>
    response.text(),
  ),
  fetch(new URL('./FAQSection.css', import.meta.url)).then((response) =>
    response.text(),
  ),
]).then(([html, css]) => {
  const template = document.createElement('template');
  template.innerHTML = `<style>${css}</style>${html}`;
  return template;
});

class FAQSection extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    templatePromise.then((template) => {
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    });
  }
}

customElements.define('algo-faq', FAQSection);

