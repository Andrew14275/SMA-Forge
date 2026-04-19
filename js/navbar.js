/* ================================================
   SMA FORGE — navbar.js
   Handles: scroll effect, mobile menu,
            active link, scroll reveal observer
   ================================================ */

(function () {
  'use strict';

  /* ---------- THEME TOGGLE ---------- */
  const html        = document.documentElement;
  const themeToggle = document.querySelector('[data-theme-toggle]');

  // Default to dark mode
  let currentTheme = 'dark';
  html.setAttribute('data-theme', currentTheme);

  function setThemeIcon(theme) {
    if (!themeToggle) return;
    if (theme === 'dark') {
      themeToggle.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round"
             stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="5"/>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42
                   M18.36 18.36l1.42 1.42M1 12h2M21 12h2
                   M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>`;
      themeToggle.setAttribute('aria-label', 'Switch to light mode');
    } else {
      themeToggle.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round"
             stroke-linejoin="round" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3
                   7 7 0 0 0 21 12.79z"/>
        </svg>`;
      themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    }
  }

  setThemeIcon(currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', currentTheme);
      setThemeIcon(currentTheme);
    });
  }

  /* ---------- NAVBAR SCROLL EFFECT ---------- */
  const navbar = document.querySelector('.navbar');

  function handleScroll() {
    if (!navbar) return;
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run once on load

  /* ---------- MOBILE MENU ---------- */
  const hamburger  = document.querySelector('.navbar__hamburger');
  const mobileMenu = document.querySelector('.navbar__mobile');
  let   menuOpen   = false;

  function toggleMenu(force) {
    menuOpen = force !== undefined ? force : !menuOpen;

    if (!hamburger || !mobileMenu) return;

    if (menuOpen) {
      mobileMenu.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      hamburger.setAttribute('aria-label', 'Close menu');
      // Animate hamburger to X
      const spans = hamburger.querySelectorAll('span');
      if (spans[0]) spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      if (spans[1]) spans[1].style.opacity   = '0';
      if (spans[2]) spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Open menu');
      const spans = hamburger.querySelectorAll('span');
      if (spans[0]) spans[0].style.transform = '';
      if (spans[1]) spans[1].style.opacity   = '';
      if (spans[2]) spans[2].style.transform = '';
    }
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => toggleMenu());
  }

  // Close menu when a mobile link is clicked
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });
  }

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (menuOpen && navbar && !navbar.contains(e.target) &&
        mobileMenu && !mobileMenu.contains(e.target)) {
      toggleMenu(false);
    }
  });

  /* ---------- ACTIVE NAV LINK ---------- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.navbar__links a, .navbar__mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage ||
       (currentPage === '' && href === 'index.html') ||
       (currentPage === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---------- SCROLL REVEAL ---------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Unobserve after reveal so it doesn't re-trigger
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  function initReveal() {
    document.querySelectorAll('[data-reveal]').forEach(el => {
      revealObserver.observe(el);
    });
  }

  // Init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReveal);
  } else {
    initReveal();
  }

  /* ---------- SMOOTH SCROLL FOR ANCHOR LINKS ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        toggleMenu(false);
      }
    });
  });

})();