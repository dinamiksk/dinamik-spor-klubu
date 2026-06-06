/**
 * DİNAMİK SPOR KULÜBÜ - Main JavaScript
 * ========================================
 */


// ========================================
// HEADER & NAVIGATION
// ========================================
class Header {
  constructor() {
    this.header = document.querySelector('.header');
    this.mobileToggle = document.querySelector('.mobile-toggle');
    this.nav = document.querySelector('.nav');

    if (this.header) {
      this.init();
    }
  }

  init() {
    window.addEventListener('scroll', () => this.onScroll());
    if (this.mobileToggle) {
      this.mobileToggle.addEventListener('click', () => this.toggleMobile());
    }

    // Close mobile menu when clicking a link or the CTA
    document.querySelectorAll('.nav .nav-link, .nav .nav-cta').forEach(link => {
      link.addEventListener('click', () => this.closeMobile());
    });

    // Close mobile menu on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.nav?.classList.contains('open')) {
        this.closeMobile();
      }
    });

    // Close mobile menu when resizing back to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && this.nav?.classList.contains('open')) {
        this.closeMobile();
      }
    });

    // Set active nav link
    this.setActiveLink();
  }

  onScroll() {
    if (window.scrollY > 50) {
      this.header.classList.add('scrolled');
    } else {
      this.header.classList.remove('scrolled');
    }
  }

  toggleMobile() {
    const willOpen = !this.nav.classList.contains('open');
    this.mobileToggle.classList.toggle('open', willOpen);
    this.nav.classList.toggle('open', willOpen);
    document.body.classList.toggle('nav-locked', willOpen);
  }

  closeMobile() {
    this.mobileToggle?.classList.remove('open');
    this.nav?.classList.remove('open');
    document.body.classList.remove('nav-locked');
  }

  setActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }
}

// ========================================
// SCROLL ANIMATIONS
// ========================================
class ScrollAnimations {
  constructor() {
    this.elements = document.querySelectorAll('.animate-on-scroll');
    if (this.elements.length) {
      this.init();
    }
  }

  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    this.elements.forEach(el => observer.observe(el));
  }
}

// ========================================
// TOAST NOTIFICATIONS
// ========================================
const Toast = {
  container: null,

  init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  },

  show(message, type = 'success') {
    this.init();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icon = type === 'success'
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';

    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-message">${message}</span>
    `;

    this.container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideInRight 0.3s ease-out reverse';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
};

// ========================================
// MODAL
// ========================================
class Modal {
  constructor(modalEl) {
    if (!modalEl) return;
    this.modal = modalEl;
    this.backdrop = modalEl.closest('.modal-backdrop');
    this.closeBtn = modalEl.querySelector('.modal-close');

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    if (this.backdrop) {
      this.backdrop.addEventListener('click', (e) => {
        if (e.target === this.backdrop) this.close();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.backdrop?.classList.contains('open')) {
        this.close();
      }
    });
  }

  open() {
    this.backdrop?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.backdrop?.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// ========================================
// IMAGE GALLERY LIGHTBOX
// ========================================
class Lightbox {
  constructor() {
    this.lightbox = document.getElementById('lightbox');
    this.lightboxImg = document.getElementById('lightbox-img');

    if (this.lightbox) {
      this.init();
    }
  }

  init() {
    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img) {
          this.lightboxImg.src = img.src;
          this.lightbox.classList.add('open');
        }
      });
    });

    this.lightbox?.addEventListener('click', (e) => {
      if (e.target === this.lightbox || e.target.closest('.lightbox-close')) {
        this.close();
      }
    });
  }

  close() {
    this.lightbox?.classList.remove('open');
  }
}

// ========================================
// STATS COUNTER ANIMATION
// ========================================
class StatsCounter {
  constructor() {
    this.counters = document.querySelectorAll('.stat-number[data-count]');
    if (this.counters.length) {
      this.init();
    }
  }

  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    this.counters.forEach(counter => observer.observe(counter));
  }

  animate(el) {
    const target = parseInt(el.dataset.count);
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * easeOut);

      el.textContent = current.toLocaleString('tr-TR');

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  }
}

// ========================================
// FORM VALIDATION
// ========================================
const FormValidator = {
  validate(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');

    inputs.forEach(input => {
      this.clearError(input);

      if (!input.value.trim()) {
        this.showError(input, 'Bu alan zorunludur');
        isValid = false;
      } else if (input.type === 'email' && !this.isEmail(input.value)) {
        this.showError(input, 'Geçerli bir e-posta adresi girin');
        isValid = false;
      }
    });

    return isValid;
  },

  showError(input, message) {
    input.classList.add('form-error');
    const errorEl = document.createElement('div');
    errorEl.className = 'form-error-message';
    errorEl.textContent = message;
    input.parentNode.appendChild(errorEl);
    input.addEventListener('input', () => this.clearError(input), { once: true });
  },

  clearError(input) {
    input.classList.remove('form-error');
    const errorEl = input.parentNode.querySelector('.form-error-message');
    if (errorEl) errorEl.remove();
  },

  isEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
};

// ========================================
// FILE PREVIEW
// ========================================
class FilePreview {
  constructor(inputEl) {
    this.input = inputEl;
    this.display = inputEl.parentNode.querySelector('.file-preview');
    if (this.input && this.display) {
      this.init();
    }
  }

  init() {
    this.input.addEventListener('change', () => this.preview());
  }

  preview() {
    const file = this.input.files[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.display.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-width: 200px; border-radius: 8px;">`;
      };
      reader.readAsDataURL(file);
    } else {
      this.display.innerHTML = `<span>${file.name}</span>`;
    }
  }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================
const Utils = {
  formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  },

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  truncate(str, length = 100) {
    if (str.length <= length) return str;
    return str.substring(0, length) + '...';
  },

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
};

// ========================================
// SMOOTH SCROLL
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;

    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ========================================
// PARALLAX EFFECT (Hero)
// ========================================
function initParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * 0.3;
    hero.style.setProperty('--parallax-offset', `${rate}px`);
  });
}

// ========================================
// OTOMATİK YIL HESABI (Kuruluş: 2010)
// ========================================
const FOUNDING_YEAR = 2010;

function updateYearsActive() {
  const years = new Date().getFullYear() - FOUNDING_YEAR;
  // Statik metinler (hero / misyon-vizyon istatistikleri)
  document.querySelectorAll('[data-years-since]').forEach(el => {
    el.textContent = years;
  });
  // Animasyonlu sayaçların hedefini güncelle (StatsCounter okumadan önce)
  document.querySelectorAll('.stat-number[data-count-years]').forEach(el => {
    el.dataset.count = years;
  });
}

// ========================================
// AÇILIŞ EKRANI (LOADING SCREEN) — yalnızca ana sayfa
// ========================================
function initLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  const loadingGlow = document.getElementById('loading-glow');
  const loadingCursor = document.getElementById('loading-cursor');
  const loadingLogo = document.getElementById('loading-logo');
  const loadingText = document.getElementById('loading-text');
  const loadingBarContainer = document.getElementById('loading-bar-container');
  const loadingBarFill = document.getElementById('loading-bar-fill');
  const loadingPercent = document.getElementById('loading-percent');

  if (!loadingScreen) return;

  let mouseX = 50, mouseY = 50, cursorX = 50, cursorY = 50, animationFrame;

  document.addEventListener('mousemove', (e) => {
    const rect = document.body.getBoundingClientRect();
    mouseX = ((e.clientX - rect.left) / rect.width) * 100;
    mouseY = ((e.clientY - rect.top) / rect.height) * 100;
    if (loadingGlow) {
      loadingGlow.style.background = `radial-gradient(circle at ${mouseX}% ${mouseY}%, rgba(26,95,168,0.15) 0%, rgba(240,125,0,0.08) 50%, transparent 70%)`;
    }
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.12;
    cursorY += (mouseY - cursorY) * 0.12;
    if (loadingCursor) {
      loadingCursor.style.left = `${cursorX}%`;
      loadingCursor.style.top = `${cursorY}%`;
    }
    animationFrame = requestAnimationFrame(animateCursor);
  }
  animateCursor();

  setTimeout(() => { if (loadingLogo) loadingLogo.classList.add('animate'); }, 100);
  setTimeout(() => { if (loadingText) loadingText.classList.add('animate'); }, 400);
  setTimeout(() => { if (loadingBarContainer) loadingBarContainer.classList.add('animate'); }, 500);

  let progress = 0;
  const loadingInterval = setInterval(() => {
    const increment = Math.floor(Math.random() * 5) + 1;
    progress = Math.min(progress + increment, 100);
    if (loadingBarFill) loadingBarFill.style.width = `${progress}%`;
    if (loadingPercent) loadingPercent.textContent = `${progress}%`;

    if (progress >= 100) {
      clearInterval(loadingInterval);
      setTimeout(() => {
        document.body.classList.remove('loading');
        window.scrollTo(0, 0);
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
          loadingScreen.style.display = 'none';
          cancelAnimationFrame(animationFrame);
        }, 500);
      }, 400);
    }
  }, 80);

  document.body.classList.add('loading');
}

// ========================================
// INIT
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  // Açılış ekranını başlat (yalnızca ana sayfada #loading-screen mevcut)
  initLoadingScreen();

  // Kuruluştan bu yana geçen yılı otomatik hesapla (her yeni yılda kendini günceller)
  updateYearsActive();

  // Initialize components
  new Header();
  new ScrollAnimations();
  new Lightbox();
  new StatsCounter();
  initParallax();

  // Initialize file previews
  document.querySelectorAll('.file-input').forEach(input => {
    new FilePreview(input);
  });

  // Initialize all modals
  document.querySelectorAll('.modal-backdrop').forEach(modalEl => {
    const m = modalEl.querySelector('.modal');
    if (m) new Modal(m);
  });
});

// Export for use in admin panel
window.DinamikSK = {
  Toast,
  Modal,
  FormValidator,
  Utils
};