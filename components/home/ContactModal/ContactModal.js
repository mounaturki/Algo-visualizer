const templatePromise = Promise.all([
  fetch(new URL('./ContactModal.html', import.meta.url)).then((response) =>
    response.text(),
  ),
  fetch(new URL('./ContactModal.css', import.meta.url)).then((response) =>
    response.text(),
  ),
]).then(([html, css]) => {
  const template = document.createElement('template');
  template.innerHTML = `<style>${css}</style>${html}`;
  return template;
});

class ContactModal extends HTMLElement {
  constructor() {
    super();
    this.handleBackdrop = this.handleBackdrop.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOpenEvent = this.handleOpenEvent.bind(this);

    this.shadowRootRef = this.attachShadow({ mode: 'open' });
    this.renderPromise = templatePromise.then((template) => {
      this.shadowRootRef.appendChild(template.content.cloneNode(true));
      this.cacheElements();
    });
  }

  cacheElements() {
    this.modal = this.shadowRootRef.querySelector('.modal');
    this.closeButton = this.shadowRootRef.querySelector('.modal-close');
    this.form = this.shadowRootRef.querySelector('form');
  }

  connectedCallback() {
    this.renderPromise.then(() => {
      if (this.listenersBound) {
        return;
      }
      window.addEventListener('algo:open-contact', this.handleOpenEvent);
      this.modal.addEventListener('click', this.handleBackdrop);
      this.closeButton.addEventListener('click', this.handleClose);
      this.form.addEventListener('submit', this.handleSubmit);
      this.listenersBound = true;
    });
  }

  disconnectedCallback() {
    this.renderPromise.then(() => {
      if (!this.listenersBound) {
        return;
      }
      window.removeEventListener('algo:open-contact', this.handleOpenEvent);
      this.modal.removeEventListener('click', this.handleBackdrop);
      this.closeButton.removeEventListener('click', this.handleClose);
      this.form.removeEventListener('submit', this.handleSubmit);
      this.listenersBound = false;
    });
  }

  handleOpenEvent() {
    this.open();
  }

  handleBackdrop(event) {
    if (event.target === this.modal) {
      this.close();
    }
  }

  handleClose() {
    this.close();
  }

  handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData.entries());

    console.log('Form submitted:', data);
    alert('Merci pour ton message ! Nous te répondrons bientôt.');

    this.form.reset();
    this.close();
  }

  open() {
    this.modal?.classList.add('active');
  }

  close() {
    this.modal?.classList.remove('active');
  }
}

customElements.define('algo-contact-modal', ContactModal);

