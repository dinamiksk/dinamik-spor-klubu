/**
 * DİNAMİK SPOR KULÜBÜ — Site Geneli Ayarlar (public)
 * ===================================================
 * Admin → Ayarlar sekmesinde kaydedilen `ayarlar/site` dökümanını
 * Firestore REST API ile çeker (public read, SDK gerekmez) ve sayfadaki
 * iletişim/sosyal/marka bilgilerini günceller.
 *
 * Sağlamlık:
 *  - Firestore'a ulaşılamazsa HİÇBİR ŞEY değişmez (fallback = sayfanın gömülü değerleri).
 *  - Bir değer admin'de DEĞİŞTİRİLMEDİYSE (varsayılansa) o değere DOKUNULMAZ → orijinal
 *    tasarım/biçim korunur.
 *  - Link/kart İÇERİĞİNE asla dokunulmaz; yalnız href güncellenir. Görünür metin sadece
 *    "yaprak" elemanlarda (ikon/buton içermeyen) ve tam eşleşmeyle değiştirilir.
 *
 * Kullanım: her public sayfaya  <script src="site-ayarlar.js" defer></script>
 * (alt sayfalarda yol: ../../site-ayarlar.js)
 */
(function () {
  'use strict';
  var PROJECT = 'dinamik-spor-klubu';
  var API_KEY = 'AIzaSyB80zNjJBMG0wr_QnK15vlcjXwjajKy-rk';
  var URL = 'https://firestore.googleapis.com/v1/projects/' + PROJECT +
            '/databases/(default)/documents/ayarlar/site?key=' + API_KEY;

  // Gömülü varsayılanlar (HTML'deki sabit değerler) — "değişti mi?" karşılaştırması için
  var DEF_TEL    = '+905397293232';                 // sadeleştirilmiş ('+' + rakam)
  var DEF_MAIL   = 'akdenizdinamiksk@gmail.com';
  var DEF_MARKA  = 'Akdeniz Dinamik Spor Kulübü';
  var DEF_SLOGAN = "İman. Disiplin. Spor. 2010'dan beri Antalya'da gençleri güçlü bireyler olarak yetiştiriyoruz.";

  function qsa(sel) { try { return Array.prototype.slice.call(document.querySelectorAll(sel)); } catch (e) { return []; } }

  // Bir eleman "yaprak" mı? (element çocuğu yok veya yalnızca <br>)
  // Zengin kartlara (ikon+yazı+buton içeren <a>) DOKUNMAMAK için kullanılır.
  function isLeaf(el) {
    for (var i = 0; i < el.children.length; i++) {
      if (el.children[i].tagName !== 'BR') return false;
    }
    return true;
  }

  function apply(s) {
    try {
      var telHref  = s.telefon ? s.telefon.replace(/[^\d+]/g, '') : '';
      var waDigits = s.telefon ? s.telefon.replace(/\D/g, '') : '';
      var telChanged  = !!s.telefon && telHref !== DEF_TEL;
      var mailChanged = !!s.eposta && s.eposta !== DEF_MAIL;

      // 1) HREF'ler — yalnız attribute güncellenir; eleman İÇERİĞİNE asla dokunulmaz.
      qsa('a[href]').forEach(function (a) {
        var h = a.getAttribute('href') || '';
        if (s.telefon && h.indexOf('tel:') === 0) a.setAttribute('href', 'tel:' + telHref);
        else if (s.telefon && h.indexOf('wa.me/') !== -1) a.setAttribute('href', 'https://wa.me/' + waDigits);
        else if (s.eposta && h.indexOf('mailto:') === 0) a.setAttribute('href', 'mailto:' + s.eposta);
        else if (s.igKiz && h.indexOf('instagram.com/dinamiksk.kiz') !== -1) a.setAttribute('href', s.igKiz);
        else if (s.igBilek && h.indexOf('instagram.com/antalyabilekguresi') !== -1) a.setAttribute('href', s.igBilek);
        else if (s.igRota && h.indexOf('instagram.com/rotaantalya') !== -1) a.setAttribute('href', s.igRota);
        else if (s.ig && h.indexOf('instagram.com/dinamiksk') !== -1) a.setAttribute('href', s.ig);
        else if (s.youtube && h.indexOf('youtube.com/@') !== -1) a.setAttribute('href', s.youtube);
      });

      // 2) GÖRÜNÜR DEĞERLER — yalnız "yaprak" elemanlarda, TAM eşleşmeyle ve yalnız değiştiyse.
      if (telChanged || mailChanged) {
        qsa('span, p, strong, b, a, div, td, li, h1, h2, h3').forEach(function (el) {
          if (!isLeaf(el)) return;
          var norm = (el.textContent || '').replace(/\s/g, '');   // \s, &nbsp; (U+00A0) dahil
          if (telChanged && norm === DEF_TEL) { el.textContent = s.telefon; return; }
          if (mailChanged && norm === DEF_MAIL) { el.textContent = s.eposta; return; }
        });
      }
      // data-site kancaları (varsa)
      if (s.telefon) qsa('[data-site="telefon"]').forEach(function (el) { el.textContent = s.telefon; });
      if (s.eposta)  qsa('[data-site="eposta"]').forEach(function (el) { el.textContent = s.eposta; });

      // 3) Slogan (yalnız değiştiyse)
      if (s.slogan && s.slogan !== DEF_SLOGAN) {
        qsa('.footer-brand p, [data-site="slogan"]').forEach(function (el) { el.textContent = s.slogan; });
      }

      // 4) Marka — telif metnindeki varsayılan adı değiştir (yalnız değiştiyse)
      if (s.marka && s.marka !== DEF_MARKA) {
        qsa('.footer-bottom p').forEach(function (p) {
          if (p.textContent.indexOf(DEF_MARKA) !== -1) {
            p.textContent = p.textContent.replace(DEF_MARKA, s.marka);
          }
        });
        qsa('[data-site="marka"]').forEach(function (el) { el.textContent = s.marka; });
      }
    } catch (e) {
      if (window.console) console.warn('site-ayarlar uygulanamadı:', e);
    }
  }

  function unwrap(fields) {
    var out = {};
    Object.keys(fields || {}).forEach(function (k) {
      var v = fields[k];
      out[k] = ('stringValue' in v) ? v.stringValue
             : ('integerValue' in v) ? v.integerValue
             : ('booleanValue' in v) ? v.booleanValue
             : '';
    });
    return out;
  }

  function load() {
    if (!window.fetch) return;
    fetch(URL, { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { if (d && d.fields) apply(unwrap(d.fields)); })
      .catch(function () { /* yoksay — fallback gömülü değerler */ });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();
