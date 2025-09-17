document.addEventListener('DOMContentLoaded', () => {
  const forms = [
    {
      form: document.getElementById('contact-form'),
      status: document.getElementById('form-status'),
      messages: {
        success: 'Děkujeme za zprávu! Ozveme se vám co nejdříve.',
        error: 'Vyplňte prosím všechna povinná pole.',
      },
    },
    {
      form: document.getElementById('contact-form-en'),
      status: document.getElementById('form-status-en'),
      messages: {
        success: 'Thank you for your message! We will be in touch shortly.',
        error: 'Please fill in all required fields.',
      },
    },
  ];

  forms.forEach(({ form, status, messages }) => {
    if (!form) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const nameField = form.querySelector('input[name="name"], #name, #name-en');
      const emailField = form.querySelector('input[name="email"], #email, #email-en');
      const messageField = form.querySelector('textarea[name="message"], #message, #message-en');

      const name = nameField ? nameField.value.trim() : '';
      const email = emailField ? emailField.value.trim() : '';
      const message = messageField ? messageField.value.trim() : '';

      if (name && email && message) {
        if (status) {
          status.textContent = messages.success;
          status.classList.remove('error');
        }
        form.reset();
      } else {
        if (status) {
          status.textContent = messages.error;
          status.classList.add('error');
        }
      }
    });
  });
});
