/* ============================================================
   SAHADAN — Sosyal Akış Modülü
   Dummy veri + render + etkileşim. Firestore'a hazır model.
   ============================================================ */

(function () {
  'use strict';

  // ============================================================
  // BRANŞ KONFİGÜRASYONU
  // ============================================================
  const KAYNAKLAR = {
    kiz: {
      ad: 'Dinamik Kız',
      adKisa: 'Kız',
      slogan: 'Yoldaşlardan',
      vurgu: 'kareler.',
      kullanici: '@dinamikspor',
      tip: 'instagram',
      sayfa: '/dinamik-calismalar/kiz/index.html#sahadan',
      sayfaRel: 'dinamik-calismalar/kiz/index.html#sahadan',
      numara: '01',
      ikon: igIcon(),
    },
    erkek: {
      ad: 'Dinamik Erkek',
      adKisa: 'Erkek',
      slogan: 'Sahadan',
      vurgu: 'anlar.',
      kullanici: '@dinamikspor',
      tip: 'instagram',
      sayfa: '/dinamik-calismalar/erkek/index.html#sahadan',
      sayfaRel: 'dinamik-calismalar/erkek/index.html#sahadan',
      numara: '02',
      ikon: igIcon(),
    },
    bilek: {
      ad: 'Bilek Güreşi',
      adKisa: 'Bilek',
      slogan: 'Masadan',
      vurgu: 'kareler.',
      kullanici: '@dinamikspor',
      tip: 'instagram',
      sayfa: '/sporlar/bilek-guresi/index.html#sahadan',
      sayfaRel: 'sporlar/bilek-guresi/index.html#sahadan',
      numara: '03',
      ikon: igIcon(),
    },
    dalis: {
      ad: 'Tüplü Dalış',
      adKisa: 'Dalış',
      slogan: 'Sudan',
      vurgu: 'sahneler.',
      kullanici: '@dinamikspor',
      tip: 'youtube',
      sayfa: '/sporlar/dalgiclik/index.html#sahadan',
      sayfaRel: 'sporlar/dalgiclik/index.html#sahadan',
      numara: '04',
      ikon: ytIcon(),
    },
  };

  // ============================================================
  // DUMMY VERİ — Firestore koleksiyonu `feed` ile uyumlu
  // Otomasyon devreye girince sadece bu listeyi Firestore çağrısı değiştirir.
  // ============================================================
  const DUMMY_FEED = [
    // ── KIZ ──────────────────────────────────────
    { id: 'kz1', kaynak: 'kiz',   tip: 'instagram', tarih: gun(-2),  thumbnail: pic('kiz-1', 600, 750), metin: 'Hatıra Ormanı için ilk fidanlarımızı diktik. Toprağa değen her el, geleceğe atılan bir tohum.', hashtagler: ['#hatiraormani','#dinamikkiz'], permalink: '#', one_cikar: true,  medyaTipi: 'image' },
    { id: 'kz2', kaynak: 'kiz',   tip: 'instagram', tarih: gun(-5),  thumbnail: pic('kiz-2', 500, 500), metin: 'Sohbet halkamızdan: "Cesaret, korkmamak değil — korkuya rağmen yürümektir."', hashtagler: ['#sohbethalkasi'], permalink: '#', one_cikar: false, medyaTipi: 'image' },
    { id: 'kz3', kaynak: 'kiz',   tip: 'instagram', tarih: gun(-8),  thumbnail: pic('kiz-3', 600, 600), metin: 'Bahar kampımızdan kısa bir kesit. Doğa ve kardeşlik bir arada.', hashtagler: ['#dinamikkamp','#bahar'], permalink: '#', one_cikar: false, medyaTipi: 'video' },
    { id: 'kz4', kaynak: 'kiz',   tip: 'instagram', tarih: gun(-12), thumbnail: pic('kiz-4', 500, 600), metin: 'Liderlerimizle birlikte hazırladığımız aylık okuma listesi yayında. Linkten ulaşabilirsiniz.', hashtagler: ['#kitap','#okuma'], permalink: '#', one_cikar: false, medyaTipi: 'image' },
    { id: 'kz5', kaynak: 'kiz',   tip: 'instagram', tarih: gun(-15), thumbnail: pic('kiz-5', 600, 800), metin: 'Anneler Günü programımızdan unutulmaz bir an. Her annenin elini öpüyoruz.', hashtagler: ['#annelergunu'], permalink: '#', one_cikar: false, medyaTipi: 'image' },
    { id: 'kz6', kaynak: 'kiz',   tip: 'instagram', tarih: gun(-19), thumbnail: pic('kiz-6', 500, 500), metin: 'Hafta sonu doğa yürüyüşümüz: temiz hava, derin nefes ve kalpleri ısıtan sohbetler.', hashtagler: ['#doga'], permalink: '#', one_cikar: false, medyaTipi: 'image' },
    { id: 'kz7', kaynak: 'kiz',   tip: 'instagram', tarih: gun(-24), thumbnail: pic('kiz-7', 600, 700), metin: 'Sahabe hanımların hayatlarından kesitler — bu hafta Ümmü Süleym Validemiz.', hashtagler: ['#sahabe'], permalink: '#', one_cikar: false, medyaTipi: 'image' },
    { id: 'kz8', kaynak: 'kiz',   tip: 'instagram', tarih: gun(-30), thumbnail: pic('kiz-8', 500, 500), metin: 'Dinamik Kız atölyesi: el sanatları ve tasarım çalışmamızdan bir görüntü.', hashtagler: ['#atolye'], permalink: '#', one_cikar: false, medyaTipi: 'image' },
    { id: 'kz9', kaynak: 'kiz',   tip: 'instagram', tarih: gun(-38), thumbnail: pic('kiz-9', 600, 600), metin: 'Liderim Hilali Gördüm: Ramazan girişinde gökyüzünü birlikte izledik.', hashtagler: ['#hilal','#ramazan'], permalink: '#', one_cikar: false, medyaTipi: 'image' },

    // ── ERKEK ────────────────────────────────────
    { id: 'er1', kaynak: 'erkek', tip: 'instagram', tarih: gun(-1),  thumbnail: pic('er-1', 600, 750), metin: 'Bu hafta sonu kampımızdan: ateş, semaver ve yıldızların altında derin sohbetler.', hashtagler: ['#dinamikkamp'], permalink: '#', one_cikar: true,  medyaTipi: 'image' },
    { id: 'er2', kaynak: 'erkek', tip: 'instagram', tarih: gun(-4),  thumbnail: pic('er-2', 500, 500), metin: 'Liderim İtikaftayım programı için gönüllü olan kardeşlerimizle ilk toplantı yapıldı.', hashtagler: ['#itikaf','#ramazan'], permalink: '#', one_cikar: false, medyaTipi: 'image' },
    { id: 'er3', kaynak: 'erkek', tip: 'instagram', tarih: gun(-7),  thumbnail: pic('er-3', 600, 600), metin: 'Hatıra Ormanı projemizde 250 fidanımız toprağa kavuştu. Her biri bir hatıra.', hashtagler: ['#hatiraormani'], permalink: '#', one_cikar: false, medyaTipi: 'video' },
    { id: 'er4', kaynak: 'erkek', tip: 'instagram', tarih: gun(-11), thumbnail: pic('er-4', 500, 700), metin: 'Pazar buluşmamızdan: futbol, simit, çay ve kıymetli sohbetler.', hashtagler: ['#pazaribahar'], permalink: '#', one_cikar: false, medyaTipi: 'image' },
    { id: 'er5', kaynak: 'erkek', tip: 'instagram', tarih: gun(-14), thumbnail: pic('er-5', 600, 800), metin: 'Sahabe hayatlarından dersler — bu hafta Hz. Ali Efendimiz.', hashtagler: ['#sahabe'], permalink: '#', one_cikar: false, medyaTipi: 'image' },
    { id: 'er6', kaynak: 'erkek', tip: 'instagram', tarih: gun(-18), thumbnail: pic('er-6', 500, 500), metin: 'Doğa yürüyüşümüzde yol arkadaşlarımızla bahar manzaralarına şahitlik ettik.', hashtagler: ['#doga'], permalink: '#', one_cikar: false, medyaTipi: 'image' },
    { id: 'er7', kaynak: 'erkek', tip: 'instagram', tarih: gun(-23), thumbnail: pic('er-7', 600, 700), metin: 'Bir genç kardeşimizin sözleri: "Buraya geldikten sonra hayata bakışım değişti."', hashtagler: ['#tanikliklar'], permalink: '#', one_cikar: false, medyaTipi: 'image' },
    { id: 'er8', kaynak: 'erkek', tip: 'instagram', tarih: gun(-29), thumbnail: pic('er-8', 500, 500), metin: 'Liderim Hilali Gördüm — Ramazan ayı girişinde birlikte hilal gözlemi.', hashtagler: ['#hilal'], permalink: '#', one_cikar: false, medyaTipi: 'image' },
    { id: 'er9', kaynak: 'erkek', tip: 'instagram', tarih: gun(-36), thumbnail: pic('er-9', 600, 600), metin: 'Kış kampımızdan unutulmaz bir kare. Kar, ateş, kardeşlik.', hashtagler: ['#kiskampi'], permalink: '#', one_cikar: false, medyaTipi: 'image' },

    // ── BİLEK GÜREŞİ ─────────────────────────────
    { id: 'bg1', kaynak: 'bilek', tip: 'instagram', tarih: gun(-3),  thumbnail: pic('bg-1', 600, 800), metin: 'İl turnuvasından gümüş madalya! Tebrikler kardeşim, alın teri boşa gitmedi.', hashtagler: ['#turnuva','#gumus'], permalink: '#', one_cikar: true,  medyaTipi: 'image' },
    { id: 'bg2', kaynak: 'bilek', tip: 'instagram', tarih: gun(-6),  thumbnail: pic('bg-2', 500, 500), metin: 'Bilek antrenmanından kısa bir video: top-roll tekniği üzerine çalışma.', hashtagler: ['#teknik'], permalink: '#', one_cikar: false, medyaTipi: 'video' },
    { id: 'bg3', kaynak: 'bilek', tip: 'instagram', tarih: gun(-10), thumbnail: pic('bg-3', 600, 600), metin: 'Yeni kayıtlar başladı. 70+ kg kategoride birlikte çalışmaya hazır mısınız?', hashtagler: ['#kayit'], permalink: '#', one_cikar: false, medyaTipi: 'image' },
    { id: 'bg4', kaynak: 'bilek', tip: 'instagram', tarih: gun(-13), thumbnail: pic('bg-4', 500, 700), metin: 'Akşam antrenmanı sonrası takım fotoğrafı. Aynı masa, aynı yürek.', hashtagler: ['#takim'], permalink: '#', one_cikar: false, medyaTipi: 'image' },
    { id: 'bg5', kaynak: 'bilek', tip: 'instagram', tarih: gun(-17), thumbnail: pic('bg-5', 600, 750), metin: 'Sporcumuzun hocayla birebir teknik çalışması: hook ve top-roll geçişleri.', hashtagler: ['#hook','#teknik'], permalink: '#', one_cikar: false, medyaTipi: 'video' },
    { id: 'bg6', kaynak: 'bilek', tip: 'instagram', tarih: gun(-22), thumbnail: pic('bg-6', 500, 500), metin: 'Yeni ağırlıklarımız geldi. Antrenman donanımı seviye atladı.', hashtagler: ['#donanim'], permalink: '#', one_cikar: false, medyaTipi: 'image' },
    { id: 'bg7', kaynak: 'bilek', tip: 'instagram', tarih: gun(-27), thumbnail: pic('bg-7', 600, 600), metin: 'Bölge şampiyonasında bronz madalyamız! Mücadeleyi sonuna kadar verdin.', hashtagler: ['#bronz'], permalink: '#', one_cikar: false, medyaTipi: 'image' },
    { id: 'bg8', kaynak: 'bilek', tip: 'instagram', tarih: gun(-33), thumbnail: pic('bg-8', 500, 700), metin: 'Antrenman sonrası dinlenme: kardeşlik, çay ve sohbet.', hashtagler: ['#kardeslik'], permalink: '#', one_cikar: false, medyaTipi: 'image' },
    { id: 'bg9', kaynak: 'bilek', tip: 'instagram', tarih: gun(-41), thumbnail: pic('bg-9', 600, 800), metin: 'Yeni başlayanlara: temel duruş ve tutuş üzerine 5 dakikalık özet.', hashtagler: ['#yenibaslangic'], permalink: '#', one_cikar: false, medyaTipi: 'video' },

    // ── TÜPLÜ DALIŞ (YouTube) ────────────────────
    // Not: 'dalis' kaynağı tek yerde (dalgıçlık sayfası) kullanılır ve oraya
    // gerçek YouTube videoları API'den canlı yüklenir. Bu yüzden burada
    // sahte/placeholder kayıt tutulmaz — API gecikse/başarısız olsa bile
    // hatalı videoların görünmesini önler.
  ];

  // ============================================================
  // YARDIMCILAR
  // ============================================================
  function gun(offset) {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d;
  }

  function pic(seed, w, h) {
    return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
  }

  function igIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>';
  }

  function ytIcon() {
    return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1C4.5 20.5 12 20.5 12 20.5s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8z"/><polygon points="9.6 15.6 16 12 9.6 8.4" fill="#000"/></svg>';
  }

  function dateLabel(d) {
    const now = new Date();
    const diff = Math.floor((now - d) / 86400000);
    if (diff < 1)  return 'BUGÜN';
    if (diff < 2)  return 'DÜN';
    if (diff < 7)  return diff + ' GÜN ÖNCE';
    if (diff < 30) return Math.floor(diff / 7) + ' HAFTA ÖNCE';
    if (diff < 60) return 'GEÇEN AY';
    return Math.floor(diff / 30) + ' AY ÖNCE';
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }

  // ============================================================
  // RENDER — kart
  // ============================================================
  function renderCard(post, kaynak) {
    const k = KAYNAKLAR[kaynak];
    const isVideo = post.medyaTipi === 'video';
    const tipLabel = post.tip === 'youtube' ? 'YouTube' : 'Instagram';
    const tipClass = post.tip === 'youtube' ? 'shd-card__type--yt' : 'shd-card__type--ig';
    const videoAttr = post.videoId ? ` data-shd-video-id="${escapeHtml(post.videoId)}"` : '';

    return `
      <a class="shd-card" href="${escapeHtml(post.permalink)}" target="_blank" rel="noopener" aria-label="${escapeHtml(post.metin.slice(0, 80))}" data-shd-card="${escapeHtml(post.id)}"${videoAttr}>
        <div class="shd-card__media" style="background-image:url('${escapeHtml(post.thumbnail)}')"></div>
        <div class="shd-card__overlay"></div>
        <div class="shd-card__type ${tipClass}">${k.ikon}<span>${tipLabel}</span></div>
        ${isVideo ? '<div class="shd-card__play"><svg width="22" height="22" viewBox="0 0 24 24" fill="white"><polygon points="9 6 19 12 9 18"/></svg></div>' : ''}
        <div class="shd-card__ext"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17l10-10M9 7h8v8"/></svg></div>
        <div class="shd-card__body">
          <div class="shd-card__date">${dateLabel(post.tarih)}</div>
          <p class="shd-card__caption">${escapeHtml(post.metin)}</p>
        </div>
      </a>`;
  }

  // ============================================================
  // RENDER — şerit (ana sayfa)
  // ============================================================
  function renderBand(kaynak, posts) {
    const k = KAYNAKLAR[kaynak];
    const cards = posts.slice(0, 9).map(p => renderCard(p, kaynak)).join('');
    const sayi = posts.length;

    return `
      <article class="shd-band shd-band--${kaynak} shd-reveal" data-shd-kaynak="${kaynak}">
        <div class="shd-band__head">
          <div class="shd-band__head-text">
            <div class="shd-band__num">${k.numara}</div>
            <div class="shd-band__source">
              <span class="shd-band__source-icon" style="display:inline-flex;width:14px;height:14px;">${k.ikon}</span>
              ${k.kullanici}
            </div>
            <h3 class="shd-band__name">${k.slogan} <em>${k.vurgu}</em></h3>
            <div class="shd-band__meta">
              <span class="shd-band__count">${sayi}</span> paylaşım · son güncelleme bugün
            </div>
          </div>
          <a href="${escapeHtml(k.sayfaRel)}" class="shd-band__cta">
            ${k.adKisa} Sayfasına Git
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
        <div class="shd-band__rail-wrap">
          <div class="shd-band__rail" data-shd-rail>
            ${cards}
          </div>
        </div>
      </article>`;
  }

  // ============================================================
  // RENDER — bento (branş sayfaları)
  // ============================================================
  function renderBento(kaynak, posts) {
    const visible = posts.slice(0, 8);
    const hidden  = posts.slice(8);

    const visibleCells = visible.map(p => renderBentoCell(p, kaynak, false)).join('');
    const hiddenCells  = hidden.map(p => renderBentoCell(p, kaynak, true)).join('');

    return `
      <div class="shd-bento" data-shd-bento>
        ${visibleCells}
        ${hiddenCells}
      </div>
      ${hidden.length > 0 ? `
        <div class="shd-bento__more">
          <button class="shd-bento__more-btn" data-shd-bento-more aria-expanded="false">
            <span class="shd-bento__more-label">Daha Fazla Göster</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
          </button>
        </div>` : ''}
    `;
  }

  function renderBentoCell(post, kaynak, hidden) {
    const k = KAYNAKLAR[kaynak];
    const isVideo = post.medyaTipi === 'video';
    const tipLabel = post.tip === 'youtube' ? 'YouTube' : 'Instagram';
    const tipClass = post.tip === 'youtube' ? 'shd-card__type--yt' : 'shd-card__type--ig';
    const cls = 'shd-cell' + (hidden ? ' shd-cell--hidden' : '');
    const videoAttr = post.videoId ? ` data-shd-video-id="${escapeHtml(post.videoId)}"` : '';

    return `
      <a class="${cls}" href="${escapeHtml(post.permalink)}" target="_blank" rel="noopener" data-shd-card="${escapeHtml(post.id)}"${videoAttr}>
        <div class="shd-card__media" style="background-image:url('${escapeHtml(post.thumbnail)}')"></div>
        <div class="shd-card__overlay"></div>
        <div class="shd-card__type ${tipClass}">${k.ikon}<span>${tipLabel}</span></div>
        ${isVideo ? '<div class="shd-card__play"><svg width="22" height="22" viewBox="0 0 24 24" fill="white"><polygon points="9 6 19 12 9 18"/></svg></div>' : ''}
        <div class="shd-card__ext"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17l10-10M9 7h8v8"/></svg></div>
        <div class="shd-card__body">
          <div class="shd-card__date">${dateLabel(post.tarih)}</div>
          <p class="shd-card__caption">${escapeHtml(post.metin)}</p>
        </div>
      </a>`;
  }

  // ============================================================
  // ETKİLEŞİM — Otomatik kayma + hover pause
  // ============================================================
  function attachAutoScroll(rail) {
    if (!rail) return;
    let paused = false;
    let dir = 1;
    let raf = null;

    const tick = () => {
      if (!paused && rail.scrollWidth > rail.clientWidth) {
        rail.scrollLeft += 0.4 * dir;
        const max = rail.scrollWidth - rail.clientWidth;
        if (rail.scrollLeft >= max - 1) dir = -1;
        if (rail.scrollLeft <= 1)       dir = 1;
      }
      raf = requestAnimationFrame(tick);
    };

    rail.addEventListener('mouseenter', () => paused = true);
    rail.addEventListener('mouseleave', () => paused = false);
    rail.addEventListener('touchstart', () => paused = true,  { passive: true });
    rail.addEventListener('touchend',   () => setTimeout(() => paused = false, 1500), { passive: true });

    // Sayfa görünürlüğünü kontrol et
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !raf) {
        raf = requestAnimationFrame(tick);
      } else if (!entry.isIntersecting && raf) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    }, { threshold: 0.05 });
    obs.observe(rail);
  }

  // ============================================================
  // ETKİLEŞİM — Bento "daha fazla" toggle
  // ============================================================
  function attachBentoMore(scope) {
    scope.querySelectorAll('[data-shd-bento-more]').forEach(btn => {
      btn.addEventListener('click', () => {
        const bento = btn.closest('.shd-section, .sahadan, body').querySelector('[data-shd-bento]');
        if (!bento) return;
        const expanded = bento.classList.toggle('is-expanded');
        btn.setAttribute('aria-expanded', String(expanded));
        const label = btn.querySelector('.shd-bento__more-label');
        if (label) label.textContent = expanded ? 'Daha Az Göster' : 'Daha Fazla Göster';
      });
    });
  }

  // ============================================================
  // ETKİLEŞİM — Reveal animasyonu
  // ============================================================
  function attachReveal(scope) {
    const els = scope.querySelectorAll('.shd-reveal');
    if (!('IntersectionObserver' in window) || els.length === 0) {
      els.forEach(el => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    els.forEach(el => io.observe(el));
  }

  // ============================================================
  // VERİ ERİŞİMİ
  // ============================================================
  function getPosts(kaynak) {
    return DUMMY_FEED
      .filter(p => p.kaynak === kaynak)
      .sort((a, b) => b.tarih - a.tarih);
  }

  // ============================================================
  // MOUNT — Ana sayfa şeritleri
  // ============================================================
  function mountBands(container) {
    const liste = (container.dataset.shdBands || 'kiz,erkek,bilek,dalis').split(',').map(s => s.trim());
    const wrap = container.querySelector('.sahadan__bands') || (() => {
      const w = document.createElement('div');
      w.className = 'sahadan__bands';
      container.appendChild(w);
      return w;
    })();

    wrap.innerHTML = liste.map(k => renderBand(k, getPosts(k))).join('');

    // Otomatik kayma her şerit için
    wrap.querySelectorAll('[data-shd-rail]').forEach(rail => attachAutoScroll(rail));
    // Reveal animasyonu
    attachReveal(wrap);
  }

  // ============================================================
  // MOUNT — Branş sayfası bento
  // ============================================================
  function mountBento(container) {
    const kaynak = container.dataset.shdSource;
    if (!kaynak || !KAYNAKLAR[kaynak]) {
      console.warn('[Sahadan] Geçersiz kaynak:', kaynak);
      return;
    }
    const posts = getPosts(kaynak);
    container.innerHTML = renderBento(kaynak, posts);
    attachBentoMore(container);
    attachReveal(container);
  }

  // ============================================================
  // INIT
  // ============================================================
  function init() {
    document.querySelectorAll('.sahadan').forEach(el => mountBands(el));
    document.querySelectorAll('[data-shd-source]').forEach(el => mountBento(el));
    document.querySelectorAll('.shd-section').forEach(s => attachReveal(s));
  }

  // ============================================================
  // setSource — Kaynak verisini dışarıdan güncelle (YouTube API, Firestore vs.)
  // posts: Array<{ id, tip, tarih, thumbnail, metin, hashtagler, permalink, one_cikar, medyaTipi, videoId? }>
  // ============================================================
  function setSource(kaynak, posts) {
    if (!KAYNAKLAR[kaynak]) {
      console.warn('[Sahadan] setSource — geçersiz kaynak:', kaynak);
      return;
    }
    // Eski kayıtları kaldır
    for (let i = DUMMY_FEED.length - 1; i >= 0; i--) {
      if (DUMMY_FEED[i].kaynak === kaynak) DUMMY_FEED.splice(i, 1);
    }
    // Yenileri ekle
    posts.forEach(p => {
      DUMMY_FEED.push({
        kaynak,
        tip: p.tip || 'instagram',
        medyaTipi: p.medyaTipi || 'image',
        ...p,
      });
    });
    // Etkilenen DOM'ları yeniden render et
    document.querySelectorAll(`[data-shd-source="${kaynak}"]`).forEach(el => mountBento(el));
    document.querySelectorAll('.sahadan').forEach(el => {
      const liste = (el.dataset.shdBands || 'kiz,erkek,bilek,dalis').split(',').map(s => s.trim());
      if (liste.includes(kaynak)) mountBands(el);
    });
  }

  // ============================================================
  // PUBLIC API
  // ============================================================
  window.Sahadan = {
    init,
    mountBands,
    mountBento,
    setSource,
    getPosts,
    KAYNAKLAR,
    _data: DUMMY_FEED,  // sadece debug
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
