// Ceylon Odyssey Travels — interactions
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const header = document.querySelector('.site-header');
  const backToTop = document.getElementById('backToTop');
  const modal = document.getElementById('bookingModal');
  const modalText = document.getElementById('modalText');
  const modalWhatsApp = document.getElementById('modalWhatsApp');
  const modalClose = document.getElementById('modalClose');
  const modalContact = document.getElementById('modalContact');

  // Replace this demo number with the business's real WhatsApp number (country code, no + or spaces).
  const WHATSAPP_NUMBER = '94771234567';

  if (window.lucide) lucide.createIcons();
  document.getElementById('year').textContent = new Date().getFullYear();

  function closeMenu() {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
    menuToggle.innerHTML = '<i data-lucide="menu"></i>';
    if (window.lucide) lucide.createIcons();
  }

  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    menuToggle.innerHTML = isOpen ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
    if (window.lucide) lucide.createIcons();
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', event => {
    const clickedMenuToggle = event.composedPath().includes(menuToggle);
    if (!navLinks.contains(event.target) && !clickedMenuToggle) closeMenu();
  });

  function updateScrollUI() {
    const scrolled = window.scrollY > 40;
    header.classList.toggle('scrolled', scrolled);
    backToTop.classList.toggle('visible', window.scrollY > 500);
  }
  window.addEventListener('scroll', updateScrollUI, { passive: true });
  updateScrollUI();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Highlight the current section in the navigation.
  const sections = document.querySelectorAll('main section[id]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: '-35% 0px -55% 0px' });
  sections.forEach(section => observer.observe(section));

  function openBooking(packageName) {
    modalText.textContent = packageName
      ? `Great choice. Send us a message about the ${packageName} and we'll help tailor the details to your dates and interests.`
      : 'Tell us a little about your plans and we will help you create a journey around Sri Lanka.';
    const message = packageName
      ? `Hello Ceylon Odyssey Travels, I am interested in the ${packageName}. Please share more details.`
      : 'Hello Ceylon Odyssey Travels, I would like to plan a trip to Sri Lanka.';
    modalWhatsApp.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  }
  function closeBooking() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.book-button').forEach(button => {
    button.addEventListener('click', () => openBooking(button.dataset.package));
  });
  document.getElementById('whatsappFloat').addEventListener('click', event => {
    // Keep the anchor's normal WhatsApp navigation behavior.
  });
  modalClose.addEventListener('click', closeBooking);
  modal.addEventListener('click', event => {
    if (event.target === modal) closeBooking();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modal.classList.contains('open')) closeBooking();
  });
  modalContact.addEventListener('click', () => {
    closeBooking();
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    window.setTimeout(() => document.getElementById('name').focus(), 450);
  });

  // Static-hosting friendly form: opens a prefilled email draft instead of pretending to save data.
  document.getElementById('contactForm').addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const subject = `Travel enquiry from ${data.get('name')}`;
    const body = [
      `Name: ${data.get('name')}`,
      `Email: ${data.get('email')}`,
      `Interested in: ${data.get('interest') || 'Not specified'}`,
      '',
      'Trip details:',
      data.get('message') || 'Not provided'
    ].join('\n');
    window.location.href = `mailto:hello@ceylonodysseytravels.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
});
