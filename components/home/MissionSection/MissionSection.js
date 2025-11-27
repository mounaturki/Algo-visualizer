const templatePromise = Promise.all([
  fetch(new URL('./MissionSection.html', import.meta.url)).then((response) =>
    response.text(),
  ),
  fetch(new URL('./MissionSection.css', import.meta.url)).then((response) =>
    response.text(),
  ),
]).then(([html, css]) => {
  const template = document.createElement('template');
  template.innerHTML = `<style>${css}</style>${html}`;
  return template;
});

class MissionSection extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    templatePromise.then((template) => {
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    });
  }
}

customElements.define('algo-mission', MissionSection);

