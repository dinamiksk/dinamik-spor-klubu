# Dinamik Spor Kulübü - Web Sitesi Spesifikasyonu

## 1. Konsept & Vizyon

Antalya merkezli, değerler odaklı bir spor kulübünün dijital yüzü. İman, disiplin ve sporu bir araya getiren bu kulüp için "gücün sessizliği" hissiyatını veren, karanlık ama sıcak, güçlü ama erişilebilir bir tasarım dili. Ziyaretçi siteye girdiğinde bir yolculuğa çıktığını hissetmeli - tıpkı ENP'nin "sonsuzluğa giden yol" felsefesi gibi.

## 2. Tasarım Dili

### Estetik Yön
"Karanlıkta Parlayan Değerler" - Koyu zemin üzerinde altın/mavi vurgular, keskin geometrik formlar, izcilik/kamp estetiği ile modern spor hissinin birleşimi.

### Renk Paleti

#### Ana Tema (Ana Sayfa, Genel)
| Renk | Hex | Kullanım |
|------|-----|----------|
| Primary | `#1a61ac` | Logo, ana vurgu |
| Primary Light | `#2a7ad4` | Hover durumları |
| Primary Dark | `#134785` | Aktif durumlar |
| Secondary | `#c9a227` | Altın vurgu |
| Secondary Light | `#dbb74a` | Hover |
| Accent | `#e85d04` | Turuncu, CTA |
| Accent Light | `#ff7a2a` | Hover |

#### Altın-Krem Tema (Branşlar, Sporlar)
| Renk | Hex | Kullanım |
|------|-----|----------|
| Gold | `#b8975a` | Ana vurgu |
| Gold Light | `#d4b87a` | Hover |
| Gold Dark | `#8a6f3e` | Kenar çizgileri |
| Cream | `#faf8f5` | Arka plan |
| Cream Dark | `#f0ece5` | Kart arka plan |

#### Bordo-Pembe Tema (Kızlar)
| Renk | Hex | Kullanım |
|------|-----|----------|
| Bordo Dark | `#2D0B1A` | Ana arka plan |
| Bordo Mid | `#3D1B2A` | Alternatif section |
| Bordo Light | `#4a2030` | Kartlar |
| Pink Accent | `#D3617D` | Vurgu, butonlar |
| Pink Light | `#E8809E` | Hover |

#### Yeşil-Altın Tema (ENP, Hatıra Ormanı)
| Renk | Hex | Kullanım |
|------|-----|----------|
| ENP Green | `#1a3a1a` | Ana arka plan |
| ENP Green Mid | `#2d5a2d` | Hover |
| ENP Green Bright | `#4a8a3a` | Başarı vurgusu |
| ENP Gold | `#c8a84b` | Altın vurgu |
| ENP Gold Light | `#e8c86a` | Hover |

#### Koyu Tema (Genel Arka Plan)
| Renk | Hex | Kullanım |
|------|-----|----------|
| BG Dark | `#080808` | Sayfa arka plan |
| BG Surface | `#111111` | Section arka plan |
| BG Elevated | `#1a1a1a` | Kart arka plan |
| BG Card | `#141414` | İç içe kartlar |
| Text Primary | `#f5f5f5` | Ana metin |
| Text Secondary | `#a0a0a0` | Açıklama metni |
| Text Muted | `#6a6a6a` | Placeholder |
| Border | `#2a2a2a` | Kart kenarları |
| Border Light | `#3a3a3a` | İç kenarlar |

### Tipografi

#### Font Aileleri
```css
/* Govde fontu */
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

/* Baslik fontu */
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');

/* Sans font (Basliklar, label) */
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;600;700&display=swap');

/* Display font (Buyuk basliklar) */
@import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');

/* Baslik font (Bebas benzeri) */
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
```

#### Font Değişkenleri
```css
--font-display: 'Instrument Serif', serif;
--font-body: 'DM Sans', sans-serif;
--font-sans: 'Barlow Condensed', sans-serif;
--font-display-alt: 'Anton', sans-serif;
--font-display-bold: 'Bebas Neue', sans-serif;
```

#### Tipografi Skalası
| Element | Font | Size | Letter-spacing |
|---------|------|------|----------------|
| h1 | display | clamp(2.5rem, 5vw, 4rem) | -0.02em |
| h2 | display | clamp(2rem, 4vw, 3rem) | -0.01em |
| h3 | display | clamp(1.5rem, 3vw, 2rem) | 0 |
| Display XL | alt | clamp(4rem, 9vw, 8.5rem) | -0.01em |
| Body | body | 16px | 0 |
| Label | sans | 0.68rem | 0.15em |

### Mekansal Sistem
- 8px grid sistemi
- Section padding: 80px-120px dikey
- Container max-width: 1200px
- Kart border-radius: 8px-12px
- Buton border-radius: 8px

### Hareket Felsefesi
- Scroll-triggered fade-in animasyonları (IntersectionObserver)
- Hover'da kartların hafif yükselişi (translateY -4px)
- Geçişler: 300ms ease-out
- Staggered animasyonlar (100ms delay between items)
- Kart hover'da altın bar efekti (scaleX)

---

## 3. Bileşenler

### 3.1 Kartlar

#### Standart Kart
```css
.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: all 0.3s ease;
}
.card:hover {
  border-color: var(--secondary);
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}
.card-image {
  aspect-ratio: 4/3;
  object-fit: cover;
}
.card-body { padding: var(--space-lg); }
.card-title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  margin-bottom: var(--space-sm);
}
.card-text {
  font-size: 0.9rem;
  color: var(--text-secondary);
}
```

#### Altın Kenar Kart (Branşlar)
```css
.card-gold {
  background: white;
  border: 1px solid var(--border);
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25,0.8,0.25,1);
}
.card-gold::before {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 2px;
  background: var(--gold);
  transform: scaleX(0);
  transition: transform 0.4s cubic-bezier(0.25,0.8,0.25,1);
}
.card-gold:hover {
  transform: translateY(-4px);
  border-color: rgba(184,151,90,0.25);
  box-shadow: 0 12px 40px rgba(0,0,0,0.06);
}
.card-gold:hover::before { transform: scaleX(1); }

.bk-icon {
  width: 44px; height: 44px;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 1.2rem;
}
.bk-icon svg {
  width: 36px; height: 36px;
  stroke: var(--gold);
  fill: none;
  stroke-width: 1.2;
}
.bk-name {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--yazi);
  margin-bottom: 0.6rem;
}
.bk-tag {
  display: inline-block;
  background: var(--cream);
  color: var(--yazi-gri);
  padding: 0.3rem 0.8rem;
  border-radius: 2px;
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  border: 1px solid var(--border);
  transition: all 0.3s;
}
.card-gold:hover .bk-tag {
  background: var(--gold);
  color: var(--koyu);
  border-color: var(--gold);
}
```

#### Bordo Kart (Kızlar)
```css
.card-bordo {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(211,97,125,0.3);
  border-left: 2px solid var(--pink-accent);
  border-radius: 4px;
  padding: 1.5rem;
  transition: all 0.3s;
}
.card-bordo:hover {
  background: rgba(255,255,255,0.05);
  transform: translateX(4px);
}
```

#### ENP Proje Kartı
```css
.card-enp {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(200,168,75,0.12);
  padding: 32px 28px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
}
.card-enp::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 2px;
  background: var(--enp-gold);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s;
}
.card-enp:hover {
  background: rgba(200,168,75,0.08);
  border-color: rgba(200,168,75,0.35);
  transform: translateY(-3px);
}
.card-enp:hover::after { transform: scaleX(1); }

.enp-project-cat {
  font-family: var(--font-sans);
  font-size: 0.68rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--enp-gold);
  margin-bottom: 12px;
}
.enp-project-name {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.4rem;
  letter-spacing: 0.05em;
  color: white;
  margin-bottom: 10px;
  line-height: 1.1;
}
```

### 3.2 Butonlar

```css
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: 0.78rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.9rem 1.8rem;
  border-radius: var(--radius-md);
  transition: all 0.3s ease;
  text-decoration: none;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background: var(--secondary);
  color: var(--bg-dark);
}
.btn-primary:hover {
  background: var(--secondary-light);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(184,151,90,0.25);
}

.btn-outline {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid rgba(255,255,255,0.15);
}
.btn-outline:hover {
  border-color: var(--secondary);
  color: var(--secondary);
}

.btn-gold {
  background: var(--gold);
  color: var(--bg-dark);
}
.btn-gold:hover {
  background: var(--gold-light);
}

.btn-bordo {
  background: var(--pink-accent);
  color: var(--text-light);
}
.btn-bordo:hover {
  background: var(--pink-light);
}

.btn-enp {
  background: var(--enp-gold);
  color: var(--enp-green);
}
.btn-enp:hover {
  background: var(--enp-gold-light);
}
```

### 3.3 Section Yapısı

```css
.section { padding: var(--space-4xl) 0; }
.section-dark { background: var(--bg-surface); }
.section-elevated { background: var(--bg-elevated); }
.section-bordo {
  background: linear-gradient(160deg, #2D0B1A 0%, #3D1B2A 100%);
}
.section-enp { background: var(--enp-green); }
```

### 3.4 Section Header

```css
.section-header {
  text-align: center;
  max-width: 700px;
  margin: 0 auto var(--space-3xl);
}
.section-tag {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-sans);
  font-size: 0.68rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--secondary);
  margin-bottom: var(--space-md);
}
.section-tag::before,
.section-tag::after {
  content: '';
  width: 24px;
  height: 1px;
  background: var(--secondary);
  opacity: 0.5;
}
.section-title {
  font-family: var(--font-display);
  font-size: clamp(2.2rem, 4.5vw, 3.8rem);
  line-height: 1.1;
  margin-bottom: var(--space-md);
}
.section-desc {
  font-size: 1rem;
  line-height: 1.8;
  color: var(--text-secondary);
}
```

### 3.5 Grid Sistemi

```css
.grid {
  display: grid;
  gap: var(--space-lg);
}
.grid-2 { grid-template-columns: repeat(2, 1fr); }
.grid-3 { grid-template-columns: repeat(3, 1fr); }
.grid-4 { grid-template-columns: repeat(4, 1fr); }

@media (max-width: 1024px) {
  .grid-4 { grid-template-columns: repeat(2, 1fr); }
  .grid-3 { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
  .grid-4, .grid-3, .grid-2 { grid-template-columns: 1fr; }
}
```

---

## 4. Özelleştirilmiş Bölümler

### 4.1 Hero Section

```css
.hero {
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  background: var(--bg-dark);
  overflow: hidden;
}
.hero-bg {
  position: absolute;
  inset: 0;
  /* Radial gradient overlays */
}
.hero-content {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-lg);
  padding-top: 80px;
}
.hero-title {
  font-family: var(--font-display-alt);
  font-size: clamp(4rem, 9vw, 8.5rem);
  line-height: 0.9;
  text-transform: uppercase;
}
.hero-subtitle {
  font-size: 1.1rem;
  line-height: 1.7;
  color: rgba(255,255,255,0.78);
  max-width: 560px;
}
.hero-stats {
  display: flex;
  gap: 3rem;
  margin-top: 3.5rem;
  padding-top: 2.5rem;
  border-top: 1px solid rgba(255,255,255,0.06);
}
.hstat-num {
  font-family: var(--font-display);
  font-size: 2.8rem;
  color: white;
  line-height: 1;
}
.hstat-lbl {
  font-family: var(--font-sans);
  font-size: 0.62rem;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.3);
}
```

### 4.2 Aktif Branşlar (Altın-Krem Tema)

**Renkler:**
- Arka plan: Krem (`#faf8f5`)
- Kart: Beyaz
- Vurgu: Altın (`#b8975a`)

**Kart Yapısı:**
- İkon (36x36, stroke altın)
- Başlık (Instrument Serif, 1.5rem)
- Açıklama
- Tag (krem → altın hover'da)

### 4.3 Kızlar İçin (Bordo-Pembe Tema)

**Renkler:**
- Gradient: `#1a080f` → `#2a0d1a` → `#1a0a10`
- Vurgu: Bordo (`#a84460`) ve Pembe (`#D3617D`)

**Section Alternasyonu:**
- `#2D0B1A` (koyu)
- `#3D1B2A` (açık)

**Kart:**
- `rgba(255,255,255,0.03)` arka plan
- `rgba(211,97,125,0.07)` border
- Sol kenar: 2px pembe border

### 4.4 ENP Bölümü (Yeşil-Altın Tema)

**Renkler:**
- Arka plan: `#1a3a1a` (koyu yeşil)
- Vurgu: Altın (`#c8a84b`)

**Desen (Opsiyonel):**
```css
background:
  repeating-linear-gradient(
    45deg,
    transparent,
    transparent 40px,
    rgba(200,168,75,0.03) 40px,
    rgba(200,168,75,0.03) 41px
  );
```

### 4.5 Hatıra Ormanı (Geliştirilmiş)

**Mevcut Sorun:** Sadece gradient + background image

**Geliştirilmiş Seçenekler:**

#### Seçenek A: SVG Pattern (Statik)
```css
#hatira-ormani {
  background:
    linear-gradient(180deg, rgba(5,15,5,0.9) 0%, rgba(15,35,15,0.92) 50%, rgba(10,25,10,0.88) 100%),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath d='M30 5 Q35 15 30 25 Q25 15 30 5' fill='rgba(200,168,75,0.08)'/%3E%3C/svg%3E") repeat;
  position: relative;
}
```

#### Seçenek B: Animated Particles (Yaprak)
```css
#hatira-ormani {
  background: linear-gradient(180deg, #050f05 0%, #0f230f 50%, #0a1a0a 100%);
  position: relative;
  overflow: hidden;
}

.leaf-particle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: radial-gradient(circle, rgba(200,168,75,0.6) 0%, transparent 70%);
  border-radius: 50%;
  animation: leafFloat 8s ease-in-out infinite;
}

@keyframes leafFloat {
  0%, 100% {
    transform: translateY(0) translateX(0) rotate(0deg);
    opacity: 0.3;
  }
  25% {
    transform: translateY(-30px) translateX(10px) rotate(90deg);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-15px) translateX(-5px) rotate(180deg);
    opacity: 0.4;
  }
  75% {
    transform: translateY(-40px) translateX(15px) rotate(270deg);
    opacity: 0.6;
  }
}
```

#### Seçenek C: Parallax Katman
```css
#hatira-ormani {
  position: relative;
  background: #050f05;
}
#hatira-ormani::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(5,15,5,0.85) 0%, rgba(15,35,15,0.9) 100%);
  z-index: 1;
}
.orman-layer {
  position: absolute;
  inset: 0;
  background-size: cover;
  opacity: 0.15;
}
.orman-content {
  position: relative;
  z-index: 2;
}
```

### 4.6 Başkanlar Timeline

```css
.baskan-timeline {
  position: relative;
  max-width: 900px;
  margin: 0 auto;
}
.baskan-timeline::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0; bottom: 0;
  width: 1px;
  background: linear-gradient(to bottom, transparent, var(--gold) 20%, var(--gold) 80%, transparent);
  transform: translateX(-50%);
}
.baskan-item {
  display: grid;
  grid-template-columns: 1fr 60px 1fr;
  align-items: center;
  margin-bottom: 3rem;
}
.baskan-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--gold);
  box-shadow: 0 0 0 3px rgba(184,151,90,0.15), 0 0 16px rgba(184,151,90,0.3);
}
.aktif-baskan .baskan-dot {
  width: 16px; height: 16px;
  box-shadow: 0 0 0 4px rgba(184,151,90,0.2), 0 0 20px rgba(184,151,90,0.4);
}
.baskan-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 4px;
  padding: 1.75rem;
  border-top: 2px solid rgba(184,151,90,0.4);
}
.aktif-baskan .baskan-card {
  border-top-color: var(--gold);
  background: rgba(184,151,90,0.04);
}
```

---

## 5. Animasyonlar

### 5.1 Scroll Reveal
```css
.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.8s cubic-bezier(0.25,0.8,0.25,1),
              transform 0.8s cubic-bezier(0.25,0.8,0.25,1);
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
.reveal.delay-1 { transition-delay: 0.12s; }
.reveal.delay-2 { transition-delay: 0.24s; }
.reveal.delay-3 { transition-delay: 0.36s; }
.reveal.delay-4 { transition-delay: 0.48s; }
```

### 5.2 Hover Efektleri
```css
/* Kart hover */
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.15);
}

/* Link underline animasyonu */
.link-animated {
  position: relative;
}
.link-animated::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0; right: 0;
  height: 1px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}
.link-animated:hover::after {
  transform: scaleX(1);
}

/* Button hover */
.btn:hover {
  transform: translateY(-2px);
}
```

### 5.3 Loading Animasyonu
```css
#loader {
  position: fixed;
  inset: 0;
  background: var(--bg-dark);
  z-index: 99997;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.8s ease, visibility 0.8s ease;
}
#loader.hidden {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}
.loader-bar {
  height: 1px;
  background: var(--secondary);
  animation: loaderFill 1.5s ease forwards;
}
@keyframes loaderFill {
  0% { width: 0%; }
  100% { width: 100%; }
}
```

---

## 6. Navbar

```css
nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 3rem;
  background: rgba(8,8,8,0.9);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(184,151,90,0.12);
  transition: all 0.4s ease;
}
nav.scrolled {
  height: 64px;
  box-shadow: 0 2px 40px rgba(0,0,0,0.3);
}
.nav-link {
  font-family: var(--font-sans);
  font-size: 0.78rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.6);
  text-decoration: none;
  padding: 0.5rem 1rem;
  position: relative;
  transition: color 0.25s;
}
.nav-link::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 50%; right: 50%;
  height: 1px;
  background: var(--secondary);
  transition: all 0.35s ease;
}
.nav-link:hover {
  color: rgba(255,255,255,0.95);
}
.nav-link:hover::after {
  left: 1rem; right: 1rem;
}
.nav-link.active {
  color: var(--secondary);
}
```

---

## 7. Responsive Breakpoints

```css
/* Tablet */
@media (max-width: 1024px) {
  .hero-title {
    font-size: clamp(3rem, 7vw, 5rem);
  }
  .section {
    padding: var(--space-3xl) var(--space-lg);
  }
}

/* Mobil */
@media (max-width: 768px) {
  .hero {
    min-height: auto;
    padding: 120px 0 80px;
  }
  .hero-title {
    font-size: clamp(2.5rem, 10vw, 4rem);
  }
  .grid-2, .grid-3, .grid-4 {
    grid-template-columns: 1fr;
  }
  nav {
    padding: 0 1.5rem;
  }
}
```

---

## 8. Sayfa Listesi

| Sayfa | Dosya | Tema | Durum |
|-------|-------|------|-------|
| Ana Sayfa | index.html | Koyu | Mevcut |
| Spor Dalları | sporlar.html | Altın-Krem | Mevcut |
| ENP | enp.html | Yeşil-Altın | Mevcut |
| Vefa | vefa.html | Koyu | Mevcut |
| Kızlar | kizlar.html | Bordo-Pembe | Mevcut |
| Hatıra Ormanı | orman.html | Yeşil-Altın | Geliştirilecek |
| Duyurular | duyurular.html | Koyu | Mevcut |
| İletişim | iletisim.html | Koyu | Mevcut |
| Admin | admin.html | Koyu | Mevcut |

---

## 9. Yapılacaklar

### Öncelik 1 (Token tasarrufu için küçük adımlar)
- [ ] **styles.css güncelle** - Yeni renk değişkenlerini ekle
- [ ] **index.html hero** - clamp() başlıkları uygula
- [ ] **sporlar.html** - Altın kart hover efektini uygula
- [ ] **kizlar.html** - Bordo gradient section'ları kontrol et
- [ ] **orman.html** - Hatıra ormanı pattern/particle sistemi

### Öncelik 2
- [ ] ENP kart hover altın bar efekti
- [ ] Başkanlar timeline animasyonları
- [ ] Scroll reveal animasyonları

### Öncelik 3
- [ ] Responsive test (375px - 1440px)
- [ ] Lighthouse optimizasyonu
- [ ] SEO kontrolü

---

## 10. Referanslar

| Kaynak | Öğe | Durum |
|--------|-----|-------|
| Akdeniz Dinamik v3 | Altın-Krem tema, timeline | İncelendi |
| Dinamik SK Kızlar | Bordo-pembe gradient | İncelendi |
| Nine-to-Five (awwwards) | clamp() başlıklar, minimal grid | İncelendi |
| Hatıra Ormanı | Pattern/particle sistemi | Geliştirilecek |

---

## 11. Teknik Yaklaşım

### Teknoloji Stack
- Vanilla HTML5, CSS3, JavaScript (ES6+)
- LocalStorage for data persistence (admin panel)
- No frameworks, no build tools

### Dosya Yapısı
```
dinamik-spor-klubu/
├── index.html
├── enp.html
├── sporlar.html
├── vefa.html
├── kizlar.html
├── orman.html
├── duyurular.html
├── iletisim.html
├── admin.html
├── styles.css (global stiller)
├── main.js (ana JavaScript)
└── admin.js (admin panel JavaScript)
```

### Veri Modeli (LocalStorage)
```javascript
{
  duyurular: [{ id, baslik, icerik, tarih, gorunum, siralama }],
  sporlar: [{ id, baslik, aciklama, gorsel, tur, zorluk }],
  faaliyetler: [{ id, baslik, tarih, konum, icerik, gorunum }],
  vefa: [{ id, isim, foto, donem, rol, aciklama, tur }],
  projeler: [{ id, baslik, aciklama, gorsel, durum }]
}
```

### SEO
- Semantic HTML
- Meta tags (description, keywords, OG)
- JSON-LD for Organization
- Canonical URLs
