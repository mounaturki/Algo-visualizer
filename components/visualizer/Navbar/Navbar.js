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
    this.handleScroll = this.handleScroll.bind(this);
    this.handleIntersection = this.handleIntersection.bind(this);
    this.attachShadow({ mode: 'open' });
    this.renderPromise = templatePromise.then((template) => {
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      this.backButton = this.shadowRoot.querySelector('[data-action="home"]');
      this.demoButton = this.shadowRoot.querySelector('[data-action="open-demo"]');
      this.nav = this.shadowRoot.querySelector('nav');
    });
    this.observer = null;
  }

  connectedCallback() {
    this.renderPromise.then(() => {
      this.backButton?.addEventListener('click', this.handleBack);
      this.demoButton?.addEventListener('click', this.handleDemo);
      window.addEventListener('scroll', this.handleScroll, { passive: true });
      this.setupIntersectionObserver();
    });
  }

  disconnectedCallback() {
    this.backButton?.removeEventListener('click', this.handleBack);
    this.demoButton?.removeEventListener('click', this.handleDemo);
    window.removeEventListener('scroll', this.handleScroll);
    this.observer?.disconnect();
  }

  handleBack() {
    window.location.href = 'main.html';
  }

  handleDemo() {
    const grid = document.querySelector('algorithm-grid');
    grid?.scrollIntoView({ behavior: 'smooth' });
  }

  handleScroll() {
    const scrolled = window.scrollY > 10;
    this.nav?.classList.toggle('is-scrolled', scrolled);
  }

  setupIntersectionObserver() {
    const sections = document.querySelectorAll('algorithm-grid .card');
    if (!sections.length) {
      return;
    }

    this.observer = new IntersectionObserver(this.handleIntersection, {
      root: null,
      threshold: 0.3,
    });

    sections.forEach((section) => this.observer.observe(section));
  }

  handleIntersection(entries) {
    entries.forEach((entry) => {
      entry.target.classList.toggle('visible', entry.isIntersecting);
    });
  }
}

customElements.define('visualizer-navbar', VisualizerNavbar);

