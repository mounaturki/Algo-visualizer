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
    this.handleHamburgerClick = this.handleHamburgerClick.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.menuOpen = false;

    this.attachShadow({ mode: 'open' });
    this.renderPromise = templatePromise.then((template) => {
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      this.cta = this.shadowRoot.querySelector('[data-route="visualizer"]');
      this.navLinks = Array.from(
        this.shadowRoot.querySelectorAll('.nav-link[data-target]'),
      );
      this.hamburger = this.shadowRoot.querySelector('.hamburger');
      this.navMenu = this.shadowRoot.querySelector('.nav-menu');
    });
  }

  connectedCallback() {
    this.renderPromise.then(() => {
      this.cta?.addEventListener('click', this.handleNavigate);
      this.navLinks.forEach((link) =>
        link.addEventListener('click', this.handleAnchorClick),
      );

      this.hamburger?.addEventListener('click', this.handleHamburgerClick);
      this.hamburger?.addEventListener('keydown', (e) => this.handleHamburgerKeyDown(e));
      this.navLinks.forEach((link) =>
        link.addEventListener('click', this.closeMenu),
      );

      window.addEventListener('scroll', this.handleScrollSpy);
      window.addEventListener('resize', this.closeMenu);
      this.handleScrollSpy();
    });
  }

  disconnectedCallback() {
    this.cta?.removeEventListener('click', this.handleNavigate);
    this.navLinks.forEach((link) => {
      link.removeEventListener('click', this.handleAnchorClick);
      link.removeEventListener('click', this.closeMenu);
    });

    this.hamburger?.removeEventListener('click', this.handleHamburgerClick);
    this.hamburger?.removeEventListener('keydown', (e) => this.handleHamburgerKeyDown(e));
    window.removeEventListener('scroll', this.handleScrollSpy);
    window.removeEventListener('resize', this.closeMenu);
  }

  handleNavigate() {
    this.closeMenu();
    window.location.href = 'visualizer.html';
  }

  handleHamburgerClick() {
    this.menuOpen = !this.menuOpen;
    this.hamburger?.setAttribute('aria-expanded', this.menuOpen.toString());
    this.navMenu?.setAttribute('aria-hidden', (!this.menuOpen).toString());
  }

  handleHamburgerKeyDown(event) {
    const key = event.key || event.keyCode;
    if (key === 'Enter' || key === ' ' || key === 'Spacebar' || key === 13 || key === 32) {
      event.preventDefault();
      this.handleHamburgerClick();
    }
  }

  closeMenu() {
    this.menuOpen = false;
    this.hamburger?.setAttribute('aria-expanded', 'false');
    this.navMenu?.setAttribute('aria-hidden', 'true');
  }

  handleAnchorClick(event) {
    event.preventDefault();
    const target = event.currentTarget.dataset.target;
    if (!target) return;

    this.navLinks.forEach(link => {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    });
    event.currentTarget.classList.add('active');
    event.currentTarget.setAttribute('aria-current', 'true');

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

    this.navLinks.forEach(link => {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    });

    if (visibleLink) {
      visibleLink.classList.add('active');
      visibleLink.setAttribute('aria-current', 'true');
    } else {
      const home = this.navLinks.find(l => l.dataset.target === "home");
      home?.classList.add('active');
      home?.setAttribute('aria-current', 'true');
    }
  }
}

customElements.define('algo-navbar', AlgoNavbar);
