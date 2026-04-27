/**
 * DİNAMİK SPOR KULÜBÜ - Admin Panel (Yeni)
 * ==========================================
 * Tek bir "İçerik" koleksiyonu üzerinden duyuru/etkinlik/haber/video yönetimi.
 * Veri kaynağı: Firestore (window.FB).
 */

'use strict';

// ========================================
// SABITLER
// ========================================
const KATEGORI_AD = {
  genel: 'Genel',
  'bilek-guresi': 'Bilek Güreşi',
  dalgiclik: 'Dalgıçlık',
  erkek: 'Dinamik Erkek',
  kiz: 'Dinamik Kız'
};

const TIP_AD = {
  duyuru: 'Duyuru',
  etkinlik: 'Etkinlik',
  haber: 'Haber',
  video: 'Video'
};

const TIP_IKON = {
  duyuru: '📢',
  etkinlik: '📅',
  haber: '📰',
  video: '▶'
};

const COLLECTION = 'icerik';

// ========================================
// UTILS
// ========================================
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const escapeHtml = (s = '') => String(s)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

const formatDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
};

const todayISO = () => new Date().toISOString().slice(0, 10);

// ========================================
// TOAST
// ========================================
const toast = (mesaj, tip = 'success') => {
  const c = $('#toasts');
  if (!c) return;
  const t = document.createElement('div');
  t.className = `toast ${tip}`;
  t.textContent = mesaj;
  c.appendChild(t);
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transition = 'opacity 200ms';
    setTimeout(() => t.remove(), 200);
  }, 3000);
};

// ========================================
// STATE
// ========================================
const state = {
  tumu: [],
  filtre: { tip: 'all', kat: 'all', durum: 'all' },
  duzenleId: null
};

// ========================================
// FIREBASE HELPERS
// ========================================
const waitFirebase = () => {
  if (window.FB?.ready) return Promise.resolve();
  return new Promise((resolve) => {
    const i = setInterval(() => {
      if (window.FB?.ready) { clearInterval(i); resolve(); }
    }, 50);
  });
};

const fetchAll = async () => {
  await waitFirebase();
  const { db, collection, getDocs } = window.FB;
  const snap = await getDocs(collection(db, COLLECTION));
  const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  // Tarihe göre sırala (en yeni üstte). orderBy server-side bazen 400 atıyor, client-side daha sağlam.
  items.sort((a, b) => {
    const da = a.tarih || '';
    const db_ = b.tarih || '';
    if (da === db_) return 0;
    return da > db_ ? -1 : 1;
  });
  console.log(`📡 ${items.length} içerik yüklendi`);
  return items;
};

const saveItem = async (id, data) => {
  await waitFirebase();
  const { db, doc, setDoc, addDoc, collection, serverTimestamp } = window.FB;
  const payload = { ...data, guncellendi: serverTimestamp() };
  if (id) {
    await setDoc(doc(db, COLLECTION, id), payload, { merge: true });
    return id;
  } else {
    payload.olusturuldu = serverTimestamp();
    const ref = await addDoc(collection(db, COLLECTION), payload);
    return ref.id;
  }
};

const deleteItem = async (id) => {
  await waitFirebase();
  const { db, doc, deleteDoc } = window.FB;
  await deleteDoc(doc(db, COLLECTION, id));
};

// ========================================
// NAVIGATION
// ========================================
const switchSection = (id) => {
  $$('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.section === id));
  $$('.section').forEach(s => s.classList.toggle('active', s.id === `section-${id}`));
  if (id === 'icerik') renderIcerik();
  if (id === 'dashboard') renderDashboard();
};

// ========================================
// DASHBOARD
// ========================================
const renderDashboard = () => {
  const items = state.tumu;
  const yayindaki = items.filter(i => i.yayinda !== false);
  const son30Gun = new Date(Date.now() - 30 * 24 * 3600 * 1000);
  const buAy = items.filter(i => i.olusturuldu?.toDate?.() >= son30Gun);
  const oneCikan = items.filter(i => i.oneCikar);

  $('#stat-total').textContent = items.length;
  $('#stat-yayin').textContent = yayindaki.length;
  $('#stat-ay').textContent = buAy.length;
  $('#stat-feat').textContent = oneCikan.length;

  const recent = items.slice(0, 5);
  const cont = $('#dashboard-recent');
  if (!recent.length) {
    cont.innerHTML = `<div class="empty-state"><h3>Henüz içerik yok</h3><p>İçerik bölümünden ekle.</p></div>`;
    return;
  }
  cont.innerHTML = recent.map(itemCardHTML).join('');
  bindCardActions(cont);
};

// ========================================
// İÇERİK LİSTESİ
// ========================================
const filteredItems = () => {
  const { tip, kat, durum } = state.filtre;
  return state.tumu.filter(i => {
    if (tip !== 'all' && i.tip !== tip) return false;
    if (kat !== 'all' && i.kategori !== kat) return false;
    if (durum === 'yayin' && i.yayinda === false) return false;
    if (durum === 'taslak' && i.yayinda !== false) return false;
    return true;
  });
};

const itemCardHTML = (i) => {
  const tipBadge = `<span class="badge tip-${i.tip}">${TIP_IKON[i.tip] || ''} ${TIP_AD[i.tip] || i.tip}</span>`;
  const katBadge = `<span class="badge kat">${KATEGORI_AD[i.kategori] || i.kategori}</span>`;
  const durumBadge = i.yayinda === false
    ? '<span class="badge draft">Taslak</span>'
    : '<span class="badge live">Yayında</span>';
  const featBadge = i.oneCikar ? '<span class="badge featured">⭐ Öne Çıkan</span>' : '';
  const thumb = i.gorsel
    ? `<img src="${escapeHtml(i.gorsel)}" alt="" loading="lazy">`
    : (TIP_IKON[i.tip] || '·');

  return `
    <div class="content-card" data-id="${i.id}">
      <div class="content-thumb">${thumb}</div>
      <div class="content-body">
        <h3>${escapeHtml(i.baslik || '(başlıksız)')}</h3>
        <div class="content-meta">
          ${tipBadge}
          ${katBadge}
          ${durumBadge}
          ${featBadge}
          <span>· ${formatDate(i.tarih)}</span>
        </div>
      </div>
      <div class="content-actions">
        <button class="btn btn-ghost" data-act="edit" data-id="${i.id}">Düzenle</button>
        <button class="btn btn-danger" data-act="del" data-id="${i.id}">Sil</button>
      </div>
    </div>
  `;
};

const renderIcerik = () => {
  const cont = $('#icerik-list');
  const list = filteredItems();
  if (!list.length) {
    cont.innerHTML = `
      <div class="empty-state">
        <h3>Sonuç yok</h3>
        <p>${state.tumu.length === 0 ? 'Henüz içerik eklenmemiş. Sağ üstten "Yeni İçerik" ile başla.' : 'Filtreleri değiştir veya yeni içerik ekle.'}</p>
      </div>`;
    return;
  }
  cont.innerHTML = list.map(itemCardHTML).join('');
  bindCardActions(cont);
};

const bindCardActions = (root) => {
  $$('button[data-act]', root).forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      if (btn.dataset.act === 'edit') openEdit(id);
      if (btn.dataset.act === 'del') confirmDelete(id);
    });
  });
};

// ========================================
// MODAL / FORM
// ========================================
const modal = {
  open() { $('#modal-icerik').classList.add('open'); document.body.style.overflow = 'hidden'; },
  close() { $('#modal-icerik').classList.remove('open'); document.body.style.overflow = ''; }
};

const setToggle = (button, on) => button.classList.toggle('on', !!on);
const getToggle = (selector) => $(selector).classList.contains('on');

const updateConditionalFields = (tip) => {
  $$('[data-show-when]').forEach(el => {
    const show = el.dataset.showWhen === tip;
    el.style.display = show ? '' : 'none';
  });
};

const openNew = () => {
  state.duzenleId = null;
  $('#modal-title').textContent = 'Yeni İçerik';
  $('#form-submit-btn').textContent = 'Yayınla';
  const form = $('#form-icerik');
  form.reset();
  form.elements.id.value = '';
  form.elements.tarih.value = todayISO();
  form.elements.tip.value = 'duyuru';
  setToggle($('#t-yayin'), true);
  setToggle($('#t-feat'), false);
  updateConditionalFields('duyuru');
  modal.open();
};

const openEdit = (id) => {
  const item = state.tumu.find(x => x.id === id);
  if (!item) return;
  state.duzenleId = id;
  $('#modal-title').textContent = 'İçeriği Düzenle';
  $('#form-submit-btn').textContent = 'Güncelle';
  const form = $('#form-icerik');
  form.reset();
  form.elements.id.value = id;
  form.elements.tip.value = item.tip || 'duyuru';
  form.elements.kategori.value = item.kategori || 'genel';
  form.elements.baslik.value = item.baslik || '';
  form.elements.kisaMetin.value = item.kisaMetin || '';
  form.elements.tamMetin.value = item.tamMetin || '';
  form.elements.gorsel.value = item.gorsel || '';
  form.elements.tarih.value = item.tarih || todayISO();
  if (form.elements.saat) form.elements.saat.value = item.saat || '';
  if (form.elements.konum) form.elements.konum.value = item.konum || '';
  if (form.elements.videoId) form.elements.videoId.value = item.videoId || '';
  setToggle($('#t-yayin'), item.yayinda !== false);
  setToggle($('#t-feat'), !!item.oneCikar);
  updateConditionalFields(item.tip || 'duyuru');
  modal.open();
};

const submitForm = async (e) => {
  e.preventDefault();
  const form = e.target;
  const fd = new FormData(form);
  const id = fd.get('id') || null;

  const data = {
    tip: fd.get('tip'),
    kategori: fd.get('kategori'),
    baslik: (fd.get('baslik') || '').trim(),
    kisaMetin: (fd.get('kisaMetin') || '').trim(),
    tamMetin: (fd.get('tamMetin') || '').trim(),
    gorsel: (fd.get('gorsel') || '').trim(),
    tarih: fd.get('tarih') || todayISO(),
    yayinda: getToggle('#t-yayin'),
    oneCikar: getToggle('#t-feat')
  };

  // Tip'e bağlı alanlar
  if (data.tip === 'etkinlik') {
    data.saat = (fd.get('saat') || '').trim();
    data.konum = (fd.get('konum') || '').trim();
  }
  if (data.tip === 'video') {
    data.videoId = (fd.get('videoId') || '').trim();
  }

  if (!data.baslik) {
    toast('Başlık zorunlu', 'error');
    return;
  }

  const btn = $('#form-submit-btn');
  const original = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Kaydediliyor…';

  try {
    const newId = await saveItem(id, data);
    toast(id ? 'Güncellendi' : 'Eklendi', 'success');
    modal.close();
    await refresh();
  } catch (err) {
    console.error(err);
    toast('Kayıt başarısız: ' + err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = original;
  }
};

const confirmDelete = async (id) => {
  const item = state.tumu.find(x => x.id === id);
  const baslik = item?.baslik || 'bu içerik';
  if (!confirm(`"${baslik}" silinecek. Emin misin?`)) return;
  try {
    await deleteItem(id);
    toast('Silindi', 'success');
    await refresh();
  } catch (err) {
    console.error(err);
    toast('Silme başarısız: ' + err.message, 'error');
  }
};

// ========================================
// REFRESH
// ========================================
const refresh = async () => {
  try {
    state.tumu = await fetchAll();
    renderDashboard();
    renderIcerik();
  } catch (err) {
    console.error('Veri çekme hatası:', err);
    toast('Veriler yüklenemedi: ' + err.message, 'error');
  }
};

// ========================================
// INIT
// ========================================
const init = async () => {
  // Sidebar
  $$('.nav-item').forEach(b => b.addEventListener('click', () => switchSection(b.dataset.section)));

  // Yeni içerik butonu
  $('#btn-yeni-icerik').addEventListener('click', openNew);

  // Modal close
  $$('[data-close]').forEach(el => el.addEventListener('click', () => modal.close()));
  $('#modal-icerik').addEventListener('click', (e) => {
    if (e.target.id === 'modal-icerik') modal.close();
  });

  // Form submit
  $('#form-icerik').addEventListener('submit', submitForm);

  // Toggle butonları
  $$('button[data-toggle]').forEach(t => {
    t.addEventListener('click', () => t.classList.toggle('on'));
  });

  // Tip değişikliği — koşullu alanlar
  $('#form-icerik').elements.tip.addEventListener('change', (e) => {
    updateConditionalFields(e.target.value);
  });

  // Filtre chips
  $$('#tip-chips .chip').forEach(c => {
    c.addEventListener('click', () => {
      $$('#tip-chips .chip').forEach(x => x.classList.remove('active'));
      c.classList.add('active');
      state.filtre.tip = c.dataset.filterTip;
      renderIcerik();
    });
  });
  $('#filter-kat').addEventListener('change', (e) => {
    state.filtre.kat = e.target.value;
    renderIcerik();
  });
  $('#filter-durum').addEventListener('change', (e) => {
    state.filtre.durum = e.target.value;
    renderIcerik();
  });

  await refresh();
};

document.addEventListener('DOMContentLoaded', init);
