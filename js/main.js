(function () {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Mobile nav */
  const toggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (toggle && navMenu) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
      navMenu.classList.toggle('is-open', !open);
    });

    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
        navMenu.classList.remove('is-open');
      });
    });
  }

  /* Smooth scroll */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* Scroll reveal */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReduced) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
  }

  /* FAQ accordion — one open at a time */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      faqItems.forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });

  /* Email signup (demo — no backend) */
  const form = document.querySelector('.updates-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const note = form.querySelector('.updates-note');
      if (input && note) {
        note.textContent = "Thanks — we'll be in touch when there's news to share.";
        note.style.color = 'var(--accent-text)';
        input.value = '';
      }
    });
  }

  /* Features demo — tap card speaks word via system voice */
  const tapCard = document.querySelector('.features-tap-card');
  if (tapCard) {
    const tapImage = tapCard.querySelector('.features-tap-card-image');
    const word = tapCard.dataset.speak || 'Puzzle';
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function playTapAnimation() {
      if (prefersReduced || !tapImage) return;
      tapCard.classList.remove('is-tapped');
      void tapImage.offsetWidth;
      tapCard.classList.add('is-tapped');
    }

    tapImage?.addEventListener('animationend', () => {
      tapCard.classList.remove('is-tapped');
    });

    tapCard.addEventListener('click', () => {
      playTapAnimation();

      if (!('speechSynthesis' in window)) return;

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.92;
      utterance.pitch = 1.28;

      tapCard.classList.add('is-speaking');
      utterance.onend = () => tapCard.classList.remove('is-speaking');
      utterance.onerror = () => tapCard.classList.remove('is-speaking');

      window.speechSynthesis.speak(utterance);
    });
  }
})();
