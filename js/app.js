/**
 * Core Application Interactions
 * Dhruv Kumar Portfolio
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initScrollSpy();
  initCopyButtons();
});

/* ==========================================================================
   Theme Management (Dark / Light)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (!themeToggleBtn) return;

  // Retrieve saved preference or check system
  const savedTheme = localStorage.getItem('dhruv_portfolio_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'dark'); // default dark

  document.documentElement.setAttribute('data-theme', initialTheme);
  updateThemeIcon(initialTheme);

  themeToggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('dhruv_portfolio_theme', next);
    updateThemeIcon(next);
  });
}

function updateThemeIcon(theme) {
  const icon = document.getElementById('theme-icon');
  if (!icon) return;
  if (theme === 'light') {
    icon.textContent = '🌙'; // Click to switch to dark
    icon.setAttribute('aria-label', 'Switch to dark mode');
  } else {
    icon.textContent = '☀️'; // Click to switch to light
    icon.setAttribute('aria-label', 'Switch to light mode');
  }
}

/* ==========================================================================
   Mobile Menu Toggle
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const navLinks = document.getElementById('nav-links');
  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const isOpen = navLinks.classList.contains('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
    toggleBtn.textContent = isOpen ? '✕' : '☰';
  });

  // Close menu when clicking a link
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.textContent = '☰';
    });
  });
}

/* ==========================================================================
   Scroll Spy & Navbar State
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  window.addEventListener('scroll', () => {
    let scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  });
}

/* ==========================================================================
   Copy Email & Toast Notification
   ========================================================================== */
function initCopyButtons() {
  const copyBtn = document.getElementById('copy-email-btn');
  const toast = document.getElementById('toast-notice');

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const email = 'dhruv01112004@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('✓ Email address copied to clipboard!');
      }).catch(() => {
        showToast('Email: ' + email);
      });
    });
  }
}

function showToast(message) {
  let toast = document.getElementById('toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}
