/**
 * M. Kiruthika - Portfolio Interaction Script
 * Features:
 * - Sticky navigation & active link scrollspy
 * - Mobile navigation menu toggle
 * - Floating Back-To-Top button
 * - Certificate Lightbox modal with keyboard & touch accessibility
 * - Interactive contact form handling
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Element Selectors ---
  const navbar = document.querySelector('.navbar');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTopBtn = document.querySelector('.back-to-top');
  const sections = document.querySelectorAll('section[id]');
  const certCards = document.querySelectorAll('.cert-card');
  const lightboxModal = document.querySelector('.lightbox-modal');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxTitle = document.querySelector('.lightbox-title');
  const lightboxIssuer = document.querySelector('.lightbox-issuer-text');
  const lightboxClose = document.querySelector('.lightbox-close');
  const contactForm = document.querySelector('#contactForm');
  const formStatus = document.querySelector('#formStatus');

  // --- Mobile Menu Toggle ---
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close menu when clicking any nav link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- Active Nav Link on Scroll (Scrollspy) ---
  const updateActiveNavLink = () => {
    const scrollY = window.pageYOffset;
    const headerOffset = 120;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - headerOffset;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  // --- Back to Top Button Visibility ---
  const handleScroll = () => {
    updateActiveNavLink();

    if (window.pageYOffset > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  // Initial check
  handleScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- Smooth Scrolling for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerHeight = navbar.offsetHeight || 76;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - (headerHeight + 10);

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Set focus for accessibility
        targetElement.setAttribute('tabindex', '-1');
        targetElement.focus({ preventScroll: true });
      }
    });
  });

  // --- Certificate Lightbox Modal ---
  const openLightbox = (card) => {
    const img = card.querySelector('.cert-img');
    const title = card.querySelector('.cert-title')?.textContent || 'Certificate';
    const issuer = card.querySelector('.cert-issuer')?.textContent || '';

    if (img && lightboxModal) {
      lightboxImg.src = img.src;
      lightboxImg.alt = title;
      lightboxTitle.textContent = title;
      if (lightboxIssuer) {
        lightboxIssuer.textContent = issuer;
      }
      lightboxModal.classList.add('active');
      lightboxModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      lightboxClose.focus();
    }
  };

  const closeLightbox = () => {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      lightboxModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      lightboxImg.src = '';
    }
  };

  certCards.forEach((card) => {
    card.addEventListener('click', () => openLightbox(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(card);
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // --- Contact Form Handling ---
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.querySelector('#senderName')?.value.trim();
      const email = document.querySelector('#senderEmail')?.value.trim();
      const subject = document.querySelector('#messageSubject')?.value.trim();
      const message = document.querySelector('#messageBody')?.value.trim();

      if (!name || !email || !message) {
        if (formStatus) {
          formStatus.textContent = 'Please fill in all required fields.';
          formStatus.className = 'form-status error';
          formStatus.style.display = 'block';
        }
        return;
      }

      // Format mailto link
      const mailtoUrl = `mailto:kiruthika0005@gmail.com?subject=${encodeURIComponent(
        subject || `Portfolio Inquiry from ${name}`
      )}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;

      if (formStatus) {
        formStatus.innerHTML = `<strong>Thank you, ${name}!</strong> Your inquiry has been prepared. Opening your email client to send to <em>kiruthika0005@gmail.com</em>...`;
        formStatus.className = 'form-status success';
        formStatus.style.display = 'block';
      }

      // Open mailto link after slight delay
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 700);

      contactForm.reset();
    });
  }
});
