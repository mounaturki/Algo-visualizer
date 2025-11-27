import '../Navbar/Navbar.js';
import '../AlgorithmGrid/AlgorithmGrid.js';

const templatePromise = Promise.all([
  fetch(new URL('./AppShell.html', import.meta.url)).then((response) =>
    response.text(),
  ),
  fetch(new URL('./AppShell.css', import.meta.url)).then((response) =>
    response.text(),
  ),
]).then(([html, css]) => {
  const template = document.createElement('template');
  template.innerHTML = `<style>${css}</style>${html}`;
  return template;
});

class VisualizerApp extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    templatePromise.then((template) => {
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    });
  }
}

customElements.define('visualizer-app', VisualizerApp);

