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
    this.submitBtn = this.shadowRootRef.querySelector('#submit-btn');
    this.btnText = this.shadowRootRef.querySelector('.btn-text');
    this.btnLoading = this.shadowRootRef.querySelector('.btn-loading');
    this.formMessage = this.shadowRootRef.querySelector('#form-message');

    this.errorElements = {
      name: this.shadowRootRef.querySelector('#name-error'),
      email: this.shadowRootRef.querySelector('#email-error'),
      subject: this.shadowRootRef.querySelector('#subject-error'),
      message: this.shadowRootRef.querySelector('#message-error')
    };

    // éléments de la popup de succès
    this.successPopup = this.shadowRootRef.querySelector('.success-popup');
    this.successPopupClose = this.shadowRootRef.querySelector('.success-popup-close');
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
      if (this.successPopupClose) {
        this.successPopupClose.addEventListener('click', () => {
          this.successPopup.classList.remove('active');
          this.close(); // ferme aussi la modale principale
        });
      }
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
      if (this.successPopupClose) {
        this.successPopupClose.removeEventListener('click', () => {
          this.successPopup.classList.remove('active');
          this.close();
        });
      }
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

  clearErrors() {
    Object.values(this.errorElements).forEach((el) => {
      if (!el) return;
      el.textContent = '';
      el.classList.remove('show');
    });
  }

  showError(field, message) {
    const el = this.errorElements[field];
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
  }

  validateForm() {
    let valid = true;
    const name = this.form.name.value.trim();
    const email = this.form.email.value.trim();
    const subject = this.form.subject.value.trim();
    const message = this.form.message.value.trim();

    if (!name) {
      this.showError('name', 'Le nom est requis.');
      valid = false;
    }
    if (!email) {
      this.showError('email', 'L’email est requis.');
      valid = false;
    }
    if (!subject) {
      this.showError('subject', 'Le sujet est requis.');
      valid = false;
    }
    if (!message) {
      this.showError('message', 'Le message est requis.');
      valid = false;
    }
    return valid;
  }

  setLoading(isLoading) {
    if (!this.submitBtn) return;
    this.submitBtn.disabled = isLoading;
    if (isLoading) {
      this.btnText.style.display = 'none';
      this.btnLoading.style.display = 'flex';
    } else {
      this.btnText.style.display = 'flex';
      this.btnLoading.style.display = 'none';
    }
  }

  showMessage(text, type = 'success') {
    if (!this.formMessage) return;
    this.formMessage.textContent = text;
    this.formMessage.className = 'form-message ' + type;
    this.formMessage.style.display = 'block';
  }

  handleSubmit(event) {
    event.preventDefault();

    this.clearErrors();

    if (!this.validateForm()) {
      return;
    }

    this.setLoading(true);

    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData.entries());

    // simulation d’appel API
    setTimeout(() => {
      console.log('Form submitted:', data);
      this.showMessage('Merci pour ton message ! Nous te répondrons bientôt.', 'success');
      this.form.reset();
      this.setLoading(false);

      // Affiche la popup de succès
      if (this.successPopup) {
        this.successPopup.classList.add('active');
      }
    }, 2000);
  }

  open() {
    this.modal?.classList.add('active');
  }

  close() {
    this.modal?.classList.remove('active');
  }
}

customElements.define('algo-contact-modal', ContactModal);
