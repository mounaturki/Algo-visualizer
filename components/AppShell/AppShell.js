import '../Navbar/Navbar.js';
import '../HeroSection/HeroSection.js';
import '../FeaturesSection/FeaturesSection.js';
import '../MissionSection/MissionSection.js';
import '../FAQSection/FAQSection.js';
import '../QuestionsSection/QuestionsSection.js';
import '../CTASection/CTASection.js';
import '../FooterSection/FooterSection.js';
import '../ContactModal/ContactModal.js';

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

class AppShell extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    templatePromise.then((template) => {
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    });
  }
}

customElements.define('algo-app', AppShell);

