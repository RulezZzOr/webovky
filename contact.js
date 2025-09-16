document.addEventListener('DOMContentLoaded', function () {
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const phone = document.getElementById('phone').value;
      const message = document.getElementById('message').value;

      if (name && email && message) {
        formStatus.innerHTML = '<p class="text-green-600">Thank you for your message! We will get back to you soon.</p>';
        contactForm.reset();
      } else {
        formStatus.innerHTML = '<p class="text-red-600">Please fill out all required fields.</p>';
      }
    });
  }
});