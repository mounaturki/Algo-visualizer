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

class AlgoNavbar extends HTMLElement {
  constructor() {
    super();
    this.handleNavigate = this.handleNavigate.bind(this);
    this.handleAnchorClick = this.handleAnchorClick.bind(this);
    this.attachShadow({ mode: 'open' });
    this.renderPromise = templatePromise.then((template) => {
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      this.cta = this.shadowRoot.querySelector('[data-route="visualizer"]');
      this.navLinks = Array.from(
        this.shadowRoot.querySelectorAll('.nav-link[data-target]'),
      );
    });
  }

  connectedCallback() {
    this.renderPromise.then(() => {
      this.cta?.addEventListener('click', this.handleNavigate);
      this.navLinks.forEach((link) =>
        link.addEventListener('click', this.handleAnchorClick),
      );
    });
  }

  disconnectedCallback() {
    this.cta?.removeEventListener('click', this.handleNavigate);
    this.navLinks.forEach((link) =>
      link.removeEventListener('click', this.handleAnchorClick),
    );
  }

  handleNavigate() {
    window.location.href = 'visualizer.html';
  }

  handleAnchorClick(event) {
    event.preventDefault();
    const target = event.currentTarget.dataset.target;
    if (!target) {
      return;
    }

    if (target === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const rootNode = this.getRootNode();
    const scope =
      rootNode instanceof ShadowRoot ? rootNode : document;

    const sectionById = scope.querySelector(`#${target}`);
    if (sectionById) {
      sectionById.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    const sectionByData = scope.querySelector(
      `[data-section="${target}"]`,
    );
    sectionByData?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

customElements.define('algo-navbar', AlgoNavbar);

