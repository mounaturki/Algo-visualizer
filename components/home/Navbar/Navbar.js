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
    this.handleScrollSpy = this.handleScrollSpy.bind(this);

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

      // ⭐ Scroll Spy actif
      window.addEventListener('scroll', this.handleScrollSpy);
      // first load update
      this.handleScrollSpy();
    });
  }

  disconnectedCallback() {
    this.cta?.removeEventListener('click', this.handleNavigate);
    this.navLinks.forEach((link) =>
      link.removeEventListener('click', this.handleAnchorClick),
    );

    window.removeEventListener('scroll', this.handleScrollSpy);
  }

  handleNavigate() {
    window.location.href = 'visualizer.html';
  }

  handleAnchorClick(event) {
    event.preventDefault();
    const target = event.currentTarget.dataset.target;
    if (!target) return;

    // ⭐ Active visuel sur clic
    this.navLinks.forEach(link => link.classList.remove('active'));
    event.currentTarget.classList.add('active');

    if (target === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const rootNode = this.getRootNode();
    const scope = rootNode instanceof ShadowRoot ? rootNode : document;

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

  // ⭐ Scroll Spy — détecte section visible
  handleScrollSpy() {
    const sections = [];

    this.navLinks.forEach(link => {
      const target = link.dataset.target;
      if (!target || target === "home") return;

      const section =
        document.querySelector(`#${target}`) ||
        document.querySelector(`[data-section="${target}"]`);

      if (section) {
        sections.push({ link, section });
      }
    });

    let visibleLink = null;

    sections.forEach(({ link, section }) => {
      const rect = section.getBoundingClientRect();
      const inView =
        rect.top <= window.innerHeight * 0.35 &&
        rect.bottom >= window.innerHeight * 0.35;

      if (inView) visibleLink = link;
    });

    // Reset all
    this.navLinks.forEach(link => link.classList.remove('active'));

    if (visibleLink) {
      visibleLink.classList.add('active');
    } else {
      // sinon → Accueil
      const home = this.navLinks.find(l => l.dataset.target === "home");
      home?.classList.add('active');
    }
  }
}

customElements.define('algo-navbar', AlgoNavbar);
