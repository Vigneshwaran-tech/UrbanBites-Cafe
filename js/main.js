/* ========================================
   UrbanBites Café - JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- Basic image performance optimization ---
  const pageImages = document.querySelectorAll('img');
  pageImages.forEach((img, index) => {
    if (!img.hasAttribute('decoding')) {
      img.setAttribute('decoding', 'async');
    }
    // Keep first content image eager, lazy-load the rest.
    if (index > 0 && !img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
  });

  // --- Navbar scroll effect ---
  const navbar = document.getElementById('navbar');
  if (navbar && !navbar.classList.contains('scrolled')) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  // --- Mobile hamburger menu ---
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      }
    });
  }

  // --- Menu tab filtering ---
  const menuTabs = document.querySelectorAll('.menu-tab[data-category]');
  const menuCards = document.querySelectorAll('.menu-card[data-category]');

  menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      menuTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.dataset.category;

      menuCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = '';
          setTimeout(() => card.classList.add('visible'), 50);
        } else {
          card.style.display = 'none';
          card.classList.remove('visible');
        }
      });
    });
  });

  // --- Gallery tab filtering ---
  const galleryTabs = document.querySelectorAll('.menu-tab[data-gallery]');
  const galleryItems = document.querySelectorAll('.gallery-item[data-gallery]');

  galleryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      galleryTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.dataset.gallery;

      galleryItems.forEach(item => {
        if (category === 'all' || item.dataset.gallery === category) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });

      // Reset the span-2 on first visible item
      const grid = document.getElementById('galleryGrid');
      if (grid) {
        galleryItems.forEach(item => item.style.gridRow = '');
        const visibleItems = Array.from(galleryItems).filter(
          item => item.style.display !== 'none'
        );
        if (visibleItems.length > 0) {
          visibleItems[0].style.gridRow = 'span 2';
        }
      }
    });
  });

  // --- Gallery lightbox ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  if (lightbox && lightboxImg) {
    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img) {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt;
          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  // --- Scroll animations (fade-up) ---
  const fadeElements = document.querySelectorAll('.fade-up');

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => observer.observe(el));

  // --- Reservation form handling ---
  const reservationForm = document.getElementById('reservationForm');
  if (reservationForm) {
    // Set minimum date to today
    const dateInput = document.getElementById('resDate');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.setAttribute('min', today);
    }

    reservationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('resName').value.trim();
      const phone = document.getElementById('resPhone').value.trim();
      const date = document.getElementById('resDate').value;
      const time = document.getElementById('resTime').value;
      const guests = document.getElementById('resGuests').value;
      const occasion = document.getElementById('resOccasion').value;
      const note = document.getElementById('resNote').value.trim();

      // Build WhatsApp message
      let message = `Hi UrbanBites! I'd like to reserve a table.\n\n`;
      message += `Name: ${name}\n`;
      message += `Phone: ${phone}\n`;
      message += `Date: ${date}\n`;
      message += `Time: ${time}\n`;
      message += `Guests: ${guests}\n`;
      if (occasion) message += `Occasion: ${occasion}\n`;
      if (note) message += `Note: ${note}\n`;

      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/15551234567?text=${encodedMessage}`, '_blank', 'noopener,noreferrer');

      showToast('Reservation request sent! We\'ll confirm via WhatsApp.');
      reservationForm.reset();
    });
  }

  // --- Contact form handling ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contactName').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const subject = document.getElementById('contactSubject').value;
      const message = document.getElementById('contactMessage').value.trim();

      let whatsappMsg = `Hi UrbanBites! I'm reaching out via your website.\n\n`;
      whatsappMsg += `Name: ${name}\n`;
      whatsappMsg += `Email: ${email}\n`;
      whatsappMsg += `Subject: ${subject}\n`;
      whatsappMsg += `Message: ${message}\n`;

      const encodedMsg = encodeURIComponent(whatsappMsg);
      window.open(`https://wa.me/15551234567?text=${encodedMsg}`, '_blank', 'noopener,noreferrer');

      showToast('Message sent! We\'ll get back to you shortly.');
      contactForm.reset();
    });
  }

  // --- Toast notification ---
  function showToast(message) {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      background: #1a1a2e;
      color: #fff;
      padding: 16px 32px;
      border-radius: 8px;
      font-family: 'Poppins', sans-serif;
      font-size: 0.9rem;
      z-index: 3000;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      animation: toastIn 0.3s ease;
    `;

    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // Add toast animation
  const toastStyle = document.createElement('style');
  toastStyle.textContent = `
    @keyframes toastIn {
      from { opacity: 0; transform: translateX(-50%) translateY(20px); }
      to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
  `;
  document.head.appendChild(toastStyle);

});
