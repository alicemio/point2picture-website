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

  /* Email signup via Formspree — emails you on each submission */
  const form = document.querySelector('.updates-form');
  if (form) {
    const note = form.querySelector('.updates-note');
    const submitBtn = form.querySelector('button[type="submit"]');
    const defaultNote = note?.textContent || '';
    const isConfigured = form.action.includes('formspree.io/f/')
      && !form.action.includes('REPLACE_WITH_YOUR_FORM_ID');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const input = form.querySelector('input[type="email"]');
      if (!input || !note) return;

      if (!isConfigured) {
        note.textContent = 'Signup is not configured yet. Add your Formspree form ID to index.html.';
        note.style.color = 'var(--icon-coral)';
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Joining…';
      }

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });

        if (!response.ok) {
          throw new Error('Signup failed');
        }

        note.textContent = "Thanks — you're on the list. We'll be in touch when there's news to share.";
        note.style.color = 'var(--accent-text)';
        input.value = '';
      } catch {
        note.textContent = 'Something went wrong. Please try again in a moment.';
        note.style.color = 'var(--icon-coral)';
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Join the List';
        }
      }
    });
  }

  /* Features demo — tap card speaks word via system voice */
  const tapCard = document.querySelector('.features-tap-card');
  if (tapCard && 'speechSynthesis' in window) {
    const tapImage = tapCard.querySelector('.features-tap-card-image');
    const word = tapCard.dataset.speak || 'Puzzle';
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let cachedVoice = null;
    let isSpeaking = false;

    function cacheVoice() {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return false;
      cachedVoice = voices.find((voice) => voice.lang.startsWith('en')) || voices[0];
      return true;
    }

    function loadVoices() {
      if (cacheVoice()) return;
      window.speechSynthesis.addEventListener('voiceschanged', cacheVoice, { once: true });
    }

    loadVoices();

    const primeObserver = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        loadVoices();
        primeObserver.disconnect();
      },
      { rootMargin: '120px', threshold: 0 }
    );
    primeObserver.observe(tapCard);

    function playTapAnimation() {
      if (prefersReduced || !tapImage) return;
      tapCard.classList.remove('is-tapped');
      void tapImage.offsetWidth;
      tapCard.classList.add('is-tapped');
    }

    tapImage?.addEventListener('animationend', () => {
      tapCard.classList.remove('is-tapped');
    });

    function speakWord() {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        isSpeaking = false;
      }

      const startSpeaking = () => {
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'en-US';
        utterance.rate = 0.92;
        utterance.pitch = 1.28;
        if (cachedVoice) utterance.voice = cachedVoice;

        isSpeaking = true;
        tapCard.classList.add('is-speaking');
        utterance.onend = () => {
          isSpeaking = false;
          tapCard.classList.remove('is-speaking');
        };
        utterance.onerror = () => {
          isSpeaking = false;
          tapCard.classList.remove('is-speaking');
        };

        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }

        window.speechSynthesis.speak(utterance);
      };

      if (cacheVoice()) {
        startSpeaking();
        return;
      }

      window.speechSynthesis.addEventListener(
        'voiceschanged',
        () => {
          cacheVoice();
          startSpeaking();
        },
        { once: true }
      );
    }

    function handleActivate() {
      playTapAnimation();
      loadVoices();
      speakWord();
    }

    tapCard.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      handleActivate();
    });

    tapCard.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      handleActivate();
    });
  }
})();
