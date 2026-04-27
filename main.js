/**
 * DİNAMİK SPOR KULÜBÜ - Main JavaScript
 * ========================================
 */


// ========================================
// DATA STORE (LocalStorage)
// ========================================
const DB = {
  key: 'dinamikSK_db',

  getData() {
    const data = localStorage.getItem(this.key);
    if (data) return JSON.parse(data);
    return this.initDefault();
  },

  setData(data) {
    localStorage.setItem(this.key, JSON.stringify(data));
  },

  initDefault() {
    const defaultData = {
      duyurular: [
        {
          id: '1',
          baslik: 'Yeni Sezon Bilek Güreşi Antrenmanları Başlıyor',
          icerik: '2024-2025 sezonu için bilek güreşi antrenmanlarımız 15 Eylül itibarıyla başlıyor. Tüm üyelerimiz katılabilir.',
          tarih: '2024-09-01',
          gorunum: true,
          oncelik: 'high'
        },
        {
          id: '2',
          baslik: 'Antalya Bilek Güreşi Turnuvası Düzenleniyor',
          icerik: 'Bu yıl ilk kez düzenleyeceğimiz turnuvamıza tüm illerden katılım bekliyoruz. Başvurular devam ediyor.',
          tarih: '2024-09-15',
          gorunum: true,
          oncelik: 'medium'
        },
        {
          id: '3',
          baslik: 'Hatıra Ormanı Projemiz Genişliyor',
          icerik: '500 fidan hedefimize ulaştık! Şimdi yeni hedefimiz 1000 fidan. Katkıda bulunmak isteyenler iletişime geçebilir.',
          tarih: '2024-08-20',
          gorunum: true,
          oncelik: 'low'
        }
      ],
      sporlar: [
        {
          id: '1',
          baslik: 'Bilek Güreşi',
          altBaslik: 'Gücün Sessiz Dili',
          aciklama: 'Antalya\'nın önde gelen bilek güreşi kulübü olarak, üyelerimize güç, disiplin ve kararlılık kazandırıyoruz.',
          gorsel: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&q=80',
          tur: 'spor',
          zorluk: 'Orta-Yüksek',
          ekipman: 'Bilek güreşi masası, kayış, eldiven'
        },
        {
          id: '2',
          baslik: 'Dalgıçlık',
          altBaslik: 'Sınırlarını Keşfet',
          aciklama: 'Profesyonel eğitmenlerimiz eşliğinde hem açık su hem havuz dalışı eğitimleri veriyoruz.',
          gorsel: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
          tur: 'spor',
          zorluk: 'Orta',
          ekipman: 'Dalış seti, yüzgeç, maske, tüp'
        }
      ],
      faaliyetler: [
        {
          id: '1',
          baslik: 'Kamp Faaliyetleri',
          kisaAciklama: 'Doğayla iç içe, değerlerle dolu kamplar.',
          icerik: 'Yılda dört mevsim farklı lokasyonlarda kamplar düzenliyoruz.',
          tarih: '2024-10-05',
          konum: 'Beydağları, Antalya',
          gorunum: true,
          gorsel: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80'
        },
        {
          id: '2',
          baslik: 'Atölye Çalışmaları',
          kisaAciklama: 'El becerileri ve disiplin.',
          icerik: 'Haftalık atölye çalışmalarımızla üyelerimizin el becerilerini geliştiriyoruz.',
          tarih: '2024-10-12',
          konum: 'Kulüp Merkezi',
          gorunum: true,
          gorsel: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&q=80'
        },
        {
          id: '3',
          baslik: 'Fidan Dikimi',
          kisaAciklama: 'Geleceği yeşertiyoruz.',
          icerik: 'Hatıra Ormanı projemiz kapsamında fidan dikimi faaliyetlerimiz devam ediyor.',
          tarih: '2024-10-20',
          konum: 'Kepez, Antalya',
          gorunum: true,
          gorsel: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80'
        }
      ],
      vefa: [
        {
          id: '0',
          isim: 'Ahmet Yılmaz',
          foto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
          donem: '2023 - Devam Ediyor',
          rol: 'Başkan',
          aciklama: 'Dinamik Spor Kulübü\'nün bugünlere gelmesinde liderlik rolü üstlenen başkanımız.',
          tur: 'mevcut',
          oncelik: 1
        },
        {
          id: '1',
          isim: 'Mehmet Kaya',
          foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
          donem: '2018 - 2023',
          rol: 'Başkan',
          aciklama: 'Kulübümüzün ENP vizyonunu şekillendiren dönemin başkanı.',
          tur: 'gecmis',
          oncelik: 2
        },
        {
          id: '2',
          isim: 'Ali Demir',
          foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
          donem: '2015 - 2018',
          rol: 'Başkan',
          aciklama: 'Kurumsal yapının temellerini atan kurucu başkan.',
          tur: 'gecmis',
          oncelik: 3
        },
        {
          id: '3',
          isim: 'Fatma Öztürk',
          foto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
          donem: '2020 - Devam Ediyor',
          rol: 'Kıdemli Eğitmen',
          aciklama: 'Bilek güreşi eğitimlerimizin mimarı.',
          tur: 'vefa',
          oncelik: 1
        },
        {
          id: '4',
          isim: 'Hüseyin Aydın',
          foto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
          donem: '2010 - Devam Ediyor',
          rol: 'Kurucu Üye',
          aciklama: 'Kulübümüzün temelini atan kurucu üyemiz.',
          tur: 'vefa',
          oncelik: 2
        }
      ],
      projeler: [
        {
          id: '1',
          baslik: 'Geleceğin Koruyucuları',
          altBaslik: 'Gençlik Gelişim Programı',
          aciklama: '15-25 yaş arası gençleri kapsayan kapsamlı gelişim programı. Karakter eğitimi, liderlik ve spor bir arada.',
          gorsel: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80',
          durum: 'devam',
          ilerleme: 75
        },
        {
          id: '2',
          baslik: 'Mavi Derinlikler',
          altBaslik: 'Dalış Eğitim Projesi',
          aciklama: 'Üyelerimize profesyonel dalış eğitimi vererek farklı dünyaları keşfetmelerini sağlıyoruz.',
          gorsel: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&q=80',
          durum: 'devam',
          ilerleme: 60
        },
        {
          id: '3',
          baslik: 'Yeşil Gelecek',
          altBaslik: 'Fidan Dikim Harekatı',
          aciklama: '1000 fidan hedefimizle doğayı ve geleceği koruma projemiz.',
          gorsel: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&q=80',
          durum: 'devam',
          ilerleme: 50
        },
        {
          id: '4',
          baslik: 'Karakter İnşaatı',
          altBaslik: 'Değerler Eğitim Programı',
          aciklama: 'İman, ahlak ve disiplin odaklı eğitim programımız.',
          gorsel: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800&q=80',
          durum: 'tamamlandi',
          ilerleme: 100
        }
      ],
      bagis: {
        toplamFidan: 523,
        toplamKisi: 87,
        hedef: 1000
      },
      kizlarHaberler: [
        {
          id: '1',
          baslik: 'Kızlar Bilek Güreşi Turnuvası',
          kisaAciklama: 'Bu ay düzenleyeceğimiz turnuvaya tüm kız üyelerimizi bekliyoruz.',
          tarih: '2024-10-15',
          gorsel: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80'
        },
        {
          id: '2',
          baslik: 'Yeni Antrenman Programı',
          kisaAciklama: 'Kız üyelerimize özel hazırlanan yeni antrenman programı açıklandı.',
          tarih: '2024-09-28',
          gorsel: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80'
        }
      ],
      siteAyarlari: {
        kulupAdi: 'Dinamik Spor Kulübü',
        slogan: 'İman. Disiplin. Spor.',
        telefon: '+90 242 123 45 67',
        eposta: 'info@dinamikspor.org',
        adres: 'Antalya, Türkiye',
        instagram: 'https://instagram.com/dinamikspor'
      },
      heroBadges: [
        {
          id: 'badge1',
          icon: '🌟',
          title: 'Dinamik SK Kız',
          sub: 'Yeni Program',
          position: 'a',
          visible: true
        },
        {
          id: 'badge2',
          icon: '🎯',
          title: 'Hatıra Ormanı',
          sub: '1000+ Fidan',
          position: 'b',
          visible: true
        },
        {
          id: 'badge3',
          icon: '🏆',
          title: 'Şampiyon',
          sub: 'Türkiye 2024',
          position: 'c',
          visible: true
        }
      ]
    };
    this.setData(defaultData);
    return defaultData;
  }
};

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

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => this.closeMobile());
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
    this.mobileToggle.classList.toggle('open');
    this.nav.classList.toggle('open');
  }

  closeMobile() {
    this.mobileToggle?.classList.remove('open');
    this.nav?.classList.remove('open');
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
// INIT
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize loading screen first
  initLoadingScreen();

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
    new Modal(modalEl.querySelector('.modal'));
  });
});

// ========================================
// LOADING SCREEN
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

  // Mouse tracking for glow and cursor
  let mouseX = 50;
  let mouseY = 50;
  let cursorX = 50;
  let cursorY = 50;
  let animationFrame;

  document.addEventListener('mousemove', (e) => {
    const rect = document.body.getBoundingClientRect();
    mouseX = ((e.clientX - rect.left) / rect.width) * 100;
    mouseY = ((e.clientY - rect.top) / rect.height) * 100;

    // Update glow position
    if (loadingGlow) {
      loadingGlow.style.background = `radial-gradient(circle at ${mouseX}% ${mouseY}%, rgba(26,95,168,0.15) 0%, rgba(240,125,0,0.08) 50%, transparent 70%)`;
    }
  });

  // Smooth cursor following with lerp
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

  // Start animations after a short delay
  setTimeout(() => {
    if (loadingLogo) loadingLogo.classList.add('animate');
  }, 100);

  setTimeout(() => {
    if (loadingText) loadingText.classList.add('animate');
  }, 400);

  setTimeout(() => {
    if (loadingBarContainer) loadingBarContainer.classList.add('animate');
  }, 500);

  // Loading progress
  let progress = 0;
  const loadingInterval = setInterval(() => {
    const increment = Math.floor(Math.random() * 5) + 1;
    progress = Math.min(progress + increment, 100);

    if (loadingBarFill) {
      loadingBarFill.style.width = `${progress}%`;
    }
    if (loadingPercent) {
      loadingPercent.textContent = `${progress}%`;
    }

    if (progress >= 100) {
      clearInterval(loadingInterval);

      // Wait then hide loading screen
      setTimeout(() => {
        // Önce sayfayı düzelt (overflow:hidden kalkarken scroll sıfırlanmış olsun)
        document.body.classList.remove('loading');
        window.scrollTo(0, 0);

        // Sonra ekranı fade et — ekran açılırken doğru pozisyon görünür
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transition = 'opacity 0.5s ease';

        setTimeout(() => {
          loadingScreen.style.display = 'none';
          cancelAnimationFrame(animationFrame);
        }, 500);
      }, 400);
    }
  }, 80);

  // Mark body as loading
  document.body.classList.add('loading');
}

// Export for use in admin panel
window.DinamikSK = {
  DB,
  Toast,
  Modal,
  FormValidator,
  Utils
};