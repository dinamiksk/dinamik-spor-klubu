/**
 * DİNAMİK SPOR KULÜBÜ - Admin Panel JavaScript
 * ==============================================
 */

// ========================================
// ADMIN PANEL CONTROLLER
// ========================================
class AdminPanel {
  constructor() {
    this.currentSection = 'dashboard';
    this.data = DinamikSK.DB.getData();
    this.init();
  }

  init() {
    this.bindEvents();
    this.renderStats();
    this.renderSection('duyurular');
  }

  bindEvents() {
    // Sidebar navigation
    document.querySelectorAll('.admin-nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const section = item.dataset.section;
        this.switchSection(section);
      });
    });

    // Mobile sidebar toggle
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', () => {
        document.querySelector('.admin-sidebar').classList.toggle('open');
      });
    }

    // Modal forms
    document.querySelectorAll('.add-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.dataset.modal;
        this.openModal(modalId);
      });
    });

    // Form submissions
    document.querySelectorAll('.admin-form').forEach(form => {
      form.addEventListener('submit', (e) => this.handleFormSubmit(e));
    });
  }

  switchSection(section) {
    // Update nav active state
    document.querySelectorAll('.admin-nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.section === section);
    });

    // Update section visibility
    document.querySelectorAll('.admin-section').forEach(sec => {
      sec.classList.toggle('active', sec.id === `section-${section}`);
    });

    this.currentSection = section;
    this.renderSection(section);
  }

  renderSection(section) {
    const sectionEl = document.getElementById(`section-${section}`);
    if (!sectionEl) return;

    switch(section) {
      case 'dashboard':
        this.renderDashboard();
        break;
      case 'duyurular':
        this.renderDuyurular(sectionEl);
        break;
      case 'sporlar':
        this.renderSporlar(sectionEl);
        break;
      case 'faaliyetler':
        this.renderFaaliyetler(sectionEl);
        break;
      case 'vefa':
        this.renderVefa(sectionEl);
        break;
      case 'projeler':
        this.renderProjeler(sectionEl);
        break;
      case 'kizlar':
        this.renderKizlar(sectionEl);
        break;
      case 'galeri':
        this.renderGaleri(sectionEl);
        break;
      case 'videolar':
        this.renderVideolar(sectionEl);
        break;
      case 'etkinlikler':
        this.renderEtkinlikler(sectionEl);
        break;
      case 'ayarlar':
        this.renderAyarlar(sectionEl);
        break;
    }
  }

  // ========================================
  // DASHBOARD
  // ========================================
  renderDashboard() {
    const stats = {
      duyurular: this.data.duyurular?.length || 0,
      sporlar: this.data.sporlar?.length || 0,
      faaliyetler: this.data.faaliyetler?.length || 0,
      vefa: this.data.vefa?.length || 0,
      projeler: this.data.projeler?.length || 0,
      bagis: this.data.bagis?.toplamFidan || 0
    };

    document.querySelector('[data-stat="duyurular"]').textContent = stats.duyurular;
    document.querySelector('[data-stat="sporlar"]').textContent = stats.sporlar;
    document.querySelector('[data-stat="faaliyetler"]').textContent = stats.faaliyetler;
    document.querySelector('[data-stat="projeler"]').textContent = stats.projeler;
    document.querySelector('[data-stat="fidan"]').textContent = stats.bagis;
  }

  // ========================================
  // DUYURULAR CRUD
  // ========================================
  renderDuyurular(container) {
    const tbody = container.querySelector('tbody');
    if (!tbody) return;

    const duyurular = this.data.duyurular || [];

    if (duyurular.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center" style="padding: 48px;">
            <p style="color: var(--text-muted);">Henüz duyuru eklenmemiş.</p>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = duyurular.map(item => `
      <tr>
        <td>${DinamikSK.Utils.truncate(item.baslik, 40)}</td>
        <td>${DinamikSK.Utils.formatDate(item.tarih)}</td>
        <td><span class="card-badge ${item.oncelik === 'high' ? '' : item.oncelik === 'medium' ? 'in-progress' : 'completed'}">${item.oncelik === 'high' ? 'Yüksek' : item.oncelik === 'medium' ? 'Normal' : 'Düşük'}</span></td>
        <td>${item.gorunum ? '<span style="color:#22c55e">Aktif</span>' : '<span style="color:#ef4444">Pasif</span>'}</td>
        <td>
          <div class="table-actions">
            <button class="edit-btn" onclick="admin.editItem('duyurular', '${item.id}')">Düzenle</button>
            <button class="delete-btn" onclick="admin.deleteItem('duyurular', '${item.id}')">Sil</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  async handleDuyuruForm(form) {
    const formData = new FormData(form);
    const id = formData.get('id');

    const item = {
      id: id || DinamikSK.Utils.generateId(),
      baslik: formData.get('baslik'),
      icerik: formData.get('icerik'),
      tarih: formData.get('tarih'),
      gorunum: formData.get('gorunum') === 'on',
      oncelik: formData.get('oncelik') || 'medium'
    };

    if (id) {
      const index = this.data.duyurular.findIndex(d => d.id === id);
      if (index !== -1) this.data.duyurular[index] = item;
    } else {
      this.data.duyurular.push(item);
    }

    DinamikSK.DB.setData(this.data);

    if (window.FB?.ready) {
      try {
        const { db, doc, setDoc, serverTimestamp } = window.FB;
        await setDoc(doc(db, "duyurular", item.id), {
          baslik: item.baslik,
          icerik: item.icerik,
          tarih: item.tarih,
          gorunum: item.gorunum,
          oncelik: item.oncelik,
          guncellendi: serverTimestamp()
        });
        console.log("✅ Firestore'a yazıldı:", item.id);
      } catch (e) {
        console.error("❌ Firestore yazma hatası:", e);
        DinamikSK.Toast.show("Bulut kaydı başarısız (lokalde kaydedildi)", "error");
      }
    }

    DinamikSK.Toast.show(id ? 'Duyuru güncellendi!' : 'Duyuru eklendi!');
    this.closeModal('modal-duyuru');
    this.renderSection('duyurular');
  }

  // ========================================
  // SPORLAR CRUD
  // ========================================
  renderSporlar(container) {
    const tbody = container.querySelector('tbody');
    if (!tbody) return;

    const sporlar = this.data.sporlar?.filter(s => s.tur === 'spor') || [];

    if (sporlar.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" class="text-center" style="padding: 48px;">
            <p style="color: var(--text-muted);">Henüz spor dalı eklenmemiş.</p>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = sporlar.map(item => `
      <tr>
        <td>${item.baslik}</td>
        <td>${item.zorluk}</td>
        <td>${item.ekipman ? DinamikSK.Utils.truncate(item.ekipman, 30) : '-'}</td>
        <td>
          <div class="table-actions">
            <button class="edit-btn" onclick="admin.editItem('sporlar', '${item.id}')">Düzenle</button>
            <button class="delete-btn" onclick="admin.deleteItem('sporlar', '${item.id}')">Sil</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  handleSporForm(form) {
    const formData = new FormData(form);
    const id = formData.get('id');

    // Handle image upload
    let gorsel = formData.get('mevcut-gorsel') || '';
    const gorselFile = formData.get('gorsel');
    if (gorselFile && gorselFile.name) {
      // In a real app, you'd upload to a server. Here we use base64 for demo.
      gorsel = 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&q=80';
    }

    const item = {
      id: id || DinamikSK.Utils.generateId(),
      baslik: formData.get('baslik'),
      altBaslik: formData.get('altBaslik'),
      aciklama: formData.get('aciklama'),
      gorsel: gorsel,
      tur: 'spor',
      zorluk: formData.get('zorluk'),
      ekipman: formData.get('ekipman')
    };

    if (id) {
      const index = this.data.sporlar.findIndex(s => s.id === id);
      if (index !== -1) this.data.sporlar[index] = item;
    } else {
      this.data.sporlar.push(item);
    }

    DinamikSK.DB.setData(this.data);
    DinamikSK.Toast.show(id ? 'Spor dalı güncellendi!' : 'Spor dalı eklendi!');
    this.closeModal('modal-spor');
    this.renderSection('sporlar');
  }

  // ========================================
  // FAALİYETLER CRUD
  // ========================================
  renderFaaliyetler(container) {
    const tbody = container.querySelector('tbody');
    if (!tbody) return;

    const faaliyetler = this.data.faaliyetler || [];

    if (faaliyetler.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center" style="padding: 48px;">
            <p style="color: var(--text-muted);">Henüz faaliyet eklenmemiş.</p>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = faaliyetler.map(item => `
      <tr>
        <td>${item.baslik}</td>
        <td>${DinamikSK.Utils.formatDate(item.tarih)}</td>
        <td>${item.konum}</td>
        <td>${item.gorunum ? '<span style="color:#22c55e">Aktif</span>' : '<span style="color:#ef4444">Pasif</span>'}</td>
        <td>
          <div class="table-actions">
            <button class="edit-btn" onclick="admin.editItem('faaliyetler', '${item.id}')">Düzenle</button>
            <button class="delete-btn" onclick="admin.deleteItem('faaliyetler', '${item.id}')">Sil</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  handleFaaliyetForm(form) {
    const formData = new FormData(form);
    const id = formData.get('id');

    const item = {
      id: id || DinamikSK.Utils.generateId(),
      baslik: formData.get('baslik'),
      kisaAciklama: formData.get('kisaAciklama'),
      icerik: formData.get('icerik'),
      tarih: formData.get('tarih'),
      konum: formData.get('konum'),
      gorunum: formData.get('gorunum') === 'on',
      gorsel: formData.get('mevcut-gorsel') || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80'
    };

    if (id) {
      const index = this.data.faaliyetler.findIndex(f => f.id === id);
      if (index !== -1) this.data.faaliyetler[index] = item;
    } else {
      this.data.faaliyetler.push(item);
    }

    DinamikSK.DB.setData(this.data);
    DinamikSK.Toast.show(id ? 'Faaliyet güncellendi!' : 'Faaliyet eklendi!');
    this.closeModal('modal-faaliyet');
    this.renderSection('faaliyetler');
  }

  // ========================================
  // VEFA CRUD
  // ========================================
  renderVefa(container) {
    const tbody = container.querySelector('tbody');
    if (!tbody) return;

    const vefa = this.data.vefa || [];

    if (vefa.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center" style="padding: 48px;">
            <p style="color: var(--text-muted);">Henüz kişi eklenmemiş.</p>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = vefa.map(item => `
      <tr>
        <td>${item.isim}</td>
        <td>${item.rol}</td>
        <td>${item.donem}</td>
        <td><span class="card-badge">${item.tur === 'mevcut' ? 'Mevcut' : item.tur === 'gecmis' ? 'Geçmiş' : 'Vefa'}</span></td>
        <td>
          <div class="table-actions">
            <button class="edit-btn" onclick="admin.editItem('vefa', '${item.id}')">Düzenle</button>
            <button class="delete-btn" onclick="admin.deleteItem('vefa', '${item.id}')">Sil</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  handleVefaForm(form) {
    const formData = new FormData(form);
    const id = formData.get('id');

    // Fotoğraf: hidden input'tan al (base64 veya URL olarak set edilmiş olabilir)
    const foto = document.getElementById('vefa-mevcut-foto').value || '';

    const item = {
      id: id || DinamikSK.Utils.generateId(),
      isim: formData.get('isim'),
      foto: foto,
      donem: formData.get('donem'),
      rol: formData.get('rol'),
      aciklama: formData.get('aciklama'),
      tur: formData.get('tur'),
      oncelik: parseInt(formData.get('oncelik')) || 0
    };

    if (id) {
      const index = this.data.vefa.findIndex(v => v.id === id);
      if (index !== -1) this.data.vefa[index] = item;
    } else {
      this.data.vefa.push(item);
    }

    DinamikSK.DB.setData(this.data);
    DinamikSK.Toast.show(id ? 'Vefa kaydı güncellendi!' : 'Vefa kaydı eklendi!');
    this.closeModal('modal-vefa');
    this.renderSection('vefa');
  }

  // ========================================
  // PROJELER CRUD
  // ========================================
  renderProjeler(container) {
    const tbody = container.querySelector('tbody');
    if (!tbody) return;

    const projeler = this.data.projeler || [];

    if (projeler.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center" style="padding: 48px;">
            <p style="color: var(--text-muted);">Henüz proje eklenmemiş.</p>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = projeler.map(item => `
      <tr>
        <td>${item.baslik}</td>
        <td>${item.altBaslik || '-'}</td>
        <td><span class="card-badge ${item.durum === 'tamamlandi' ? 'completed' : item.durum === 'devam' ? 'in-progress' : 'planned'}">${item.durum === 'tamamlandi' ? 'Tamamlandı' : item.durum === 'devam' ? 'Devam' : 'Plan'}</span></td>
        <td>${item.ilerleme || 0}%</td>
        <td>
          <div class="table-actions">
            <button class="edit-btn" onclick="admin.editItem('projeler', '${item.id}')">Düzenle</button>
            <button class="delete-btn" onclick="admin.deleteItem('projeler', '${item.id}')">Sil</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  handleProjeForm(form) {
    const formData = new FormData(form);
    const id = formData.get('id');

    const item = {
      id: id || DinamikSK.Utils.generateId(),
      baslik: formData.get('baslik'),
      altBaslik: formData.get('altBaslik'),
      aciklama: formData.get('aciklama'),
      gorsel: formData.get('mevcut-gorsel') || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80',
      durum: formData.get('durum'),
      ilerleme: parseInt(formData.get('ilerleme')) || 0
    };

    if (id) {
      const index = this.data.projeler.findIndex(p => p.id === id);
      if (index !== -1) this.data.projeler[index] = item;
    } else {
      this.data.projeler.push(item);
    }

    DinamikSK.DB.setData(this.data);
    DinamikSK.Toast.show(id ? 'Proje güncellendi!' : 'Proje eklendi!');
    this.closeModal('modal-proje');
    this.renderSection('projeler');
  }

  // ========================================
  // KIZLAR HABERLER CRUD
  // ========================================
  renderKizlar(container) {
    const tbody = container.querySelector('tbody');
    if (!tbody) return;

    const haberler = this.data.kizlarHaberler || [];

    if (haberler.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" class="text-center" style="padding: 48px;">
            <p style="color: var(--text-muted);">Henüz haber eklenmemiş.</p>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = haberler.map(item => `
      <tr>
        <td>${DinamikSK.Utils.truncate(item.baslik, 40)}</td>
        <td>${DinamikSK.Utils.formatDate(item.tarih)}</td>
        <td>
          <div class="table-actions">
            <button class="edit-btn" onclick="admin.editItem('kizlarHaberler', '${item.id}')">Düzenle</button>
            <button class="delete-btn" onclick="admin.deleteItem('kizlarHaberler', '${item.id}')">Sil</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  handleKizlarForm(form) {
    const formData = new FormData(form);
    const id = formData.get('id');

    const item = {
      id: id || DinamikSK.Utils.generateId(),
      baslik: formData.get('baslik'),
      kisaAciklama: formData.get('kisaAciklama'),
      tarih: formData.get('tarih'),
      gorsel: formData.get('mevcut-gorsel') || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80'
    };

    if (id) {
      const index = this.data.kizlarHaberler.findIndex(h => h.id === id);
      if (index !== -1) this.data.kizlarHaberler[index] = item;
    } else {
      this.data.kizlarHaberler.push(item);
    }

    DinamikSK.DB.setData(this.data);
    DinamikSK.Toast.show(id ? 'Haber güncellendi!' : 'Haber eklendi!');
    this.closeModal('modal-kizlar');
    this.renderSection('kizlar');
  }

  // ========================================
  // AYARLAR
  // ========================================
  renderAyarlar(container) {
    const ayarlar = this.data.siteAyarlari || {};

    const genel = container.querySelector('[data-form-type="ayarlar"]');
    if (genel) {
      genel.querySelector('[name="kulupAdi"]').value = ayarlar.kulupAdi || '';
      genel.querySelector('[name="slogan"]').value = ayarlar.slogan || '';
      genel.querySelector('[name="telefon"]').value = ayarlar.telefon || '';
      genel.querySelector('[name="eposta"]').value = ayarlar.eposta || '';
      genel.querySelector('[name="adres"]').value = ayarlar.adres || '';
      genel.querySelector('[name="instagram"]').value = ayarlar.instagram || '';
    }

    const ytForm = container.querySelector('[data-form-type="youtube"]');
    if (ytForm) {
      ytForm.querySelector('[name="ytApiKey"]').value = ayarlar.ytApiKey || '';
      ytForm.querySelector('[name="ytKanal"]').value = ayarlar.ytKanal || '@scuba.team.antalya';
      ytForm.querySelector('[name="ytVideoSayisi"]').value = ayarlar.ytVideoSayisi || 9;
    }

    // Hero Badge List
    this.renderHeroBadgeList();

    // Add badge button
    const addBtn = document.getElementById('add-badge-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.addHeroBadge());
    }
  }

  renderHeroBadgeList() {
    const container = document.getElementById('hero-badge-list');
    if (!container) return;

    const badges = this.data.heroBadges || [];

    if (badges.length === 0) {
      container.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 24px;">Henüz badge yok. "Badge Ekle" butonuna tıklayın.</p>';
      return;
    }

    container.innerHTML = badges.map((badge, index) => `
      <div class="badge-edit-item" style="background: var(--bg-elevated); padding: 16px; border-radius: 8px; border: 1px solid var(--border);" data-badge-id="${badge.id}">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 44px; height: 44px; background: rgba(201,162,39,0.15); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.4rem;">
              ${badge.icon}
            </div>
            <div>
              <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px;">Badge ${index + 1}</div>
              <div style="font-size: 0.8rem; color: ${badge.visible ? 'var(--text-secondary)' : 'var(--text-muted)'};">
                ${badge.visible ? 'Aktif' : 'Gizli'}
              </div>
            </div>
          </div>
          <button type="button" class="btn-delete-badge" data-id="${badge.id}" style="background: rgba(239,68,68,0.1); border: none; color: #ef4444; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 0.75rem;">
            Sil
          </button>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr 100px auto; gap: 12px; align-items: center;">
          <div>
            <input type="text" class="form-input badge-title" data-id="${badge.id}" value="${badge.title}" placeholder="Başlık" style="width: 100%;">
          </div>
          <div>
            <input type="text" class="form-input badge-sub" data-id="${badge.id}" value="${badge.sub}" placeholder="Alt başlık" style="width: 100%;">
          </div>
          <div>
            <select class="form-select badge-icon-select" data-id="${badge.id}" style="width: 100%;">
              <option value="🌟" ${badge.icon === '🌟' ? 'selected' : ''}>🌟</option>
              <option value="🎯" ${badge.icon === '🎯' ? 'selected' : ''}>🎯</option>
              <option value="🏆" ${badge.icon === '🏆' ? 'selected' : ''}>🏆</option>
              <option value="🔥" ${badge.icon === '🔥' ? 'selected' : ''}>🔥</option>
              <option value="💪" ${badge.icon === '💪' ? 'selected' : ''}>💪</option>
              <option value="⭐" ${badge.icon === '⭐' ? 'selected' : ''}>⭐</option>
              <option value="🌲" ${badge.icon === '🌲' ? 'selected' : ''}>🌲</option>
              <option value="❤️" ${badge.icon === '❤️' ? 'selected' : ''}>❤️</option>
              <option value="🎉" ${badge.icon === '🎉' ? 'selected' : ''}>🎉</option>
              <option value="💯" ${badge.icon === '💯' ? 'selected' : ''}>💯</option>
            </select>
          </div>
          <label class="form-checkbox" style="margin: 0; white-space: nowrap;">
            <input type="checkbox" class="badge-visible" data-id="${badge.id}" ${badge.visible ? 'checked' : ''}>
            Aktif
          </label>
        </div>
      </div>
    `).join('');

    // Bind badge events
    container.querySelectorAll('.badge-title, .badge-sub, .badge-icon-select, .badge-visible').forEach(input => {
      input.addEventListener('change', () => this.handleBadgeChange());
      input.addEventListener('input', () => this.handleBadgeChange());
    });

    // Bind delete buttons
    container.querySelectorAll('.btn-delete-badge').forEach(btn => {
      btn.addEventListener('click', () => this.deleteHeroBadge(btn.dataset.id));
    });
  }

  handleBadgeChange() {
    const container = document.getElementById('hero-badge-list');
    if (!container) return;

    container.querySelectorAll('.badge-edit-item').forEach(item => {
      const titleInput = item.querySelector('.badge-title');
      const subInput = item.querySelector('.badge-sub');
      const iconSelect = item.querySelector('.badge-icon-select');
      const visibleCheckbox = item.querySelector('.badge-visible');

      const id = titleInput.dataset.id;
      const badge = this.data.heroBadges.find(b => b.id === id);

      if (badge) {
        badge.title = titleInput.value;
        badge.sub = subInput.value;
        badge.icon = iconSelect.value;
        badge.visible = visibleCheckbox.checked;
      }
    });

    DinamikSK.DB.setData(this.data);
  }

  addHeroBadge() {
    const newId = 'badge_' + Date.now();
    const positions = ['a', 'b', 'c', 'd', 'e', 'f'];
    const usedPositions = this.data.heroBadges.map(b => b.position);
    const availablePosition = positions.find(p => !usedPositions.includes(p)) || 'a';

    const newBadge = {
      id: newId,
      icon: '🌟',
      title: 'Yeni Badge',
      sub: 'Alt başlık',
      position: availablePosition,
      visible: true
    };

    this.data.heroBadges.push(newBadge);
    DinamikSK.DB.setData(this.data);
    this.renderHeroBadgeList();
    DinamikSK.Toast.show('Yeni badge eklendi!');
  }

  deleteHeroBadge(id) {
    if (!confirm('Bu badge\'i silmek istediğinizden emin misiniz?')) return;

    this.data.heroBadges = this.data.heroBadges.filter(b => b.id !== id);
    DinamikSK.DB.setSetData(this.data);
    this.renderHeroBadgeList();
    DinamikSK.Toast.show('Badge silindi!');
  }

  handleAyarlarForm(form) {
    const formData = new FormData(form);

    this.data.siteAyarlari = {
      kulupAdi: formData.get('kulupAdi'),
      slogan: formData.get('slogan'),
      telefon: formData.get('telefon'),
      eposta: formData.get('eposta'),
      adres: formData.get('adres'),
      instagram: formData.get('instagram')
    };

    DinamikSK.DB.setData(this.data);
    DinamikSK.Toast.show('Ayarlar kaydedildi!');
  }

  handleBagisForm(form) {
    const formData = new FormData(form);

    this.data.bagis = {
      toplamFidan: parseInt(formData.get('toplamFidan')) || 0,
      toplamKisi: parseInt(formData.get('toplamKisi')) || 0,
      hedef: parseInt(formData.get('hedef')) || 1000
    };

    DinamikSK.DB.setData(this.data);
    DinamikSK.Toast.show('Bağış istatistikleri güncellendi!');
  }

  // ========================================
  // CRUD OPERATIONS
  // ========================================
  editItem(type, id) {
    let item;
    let modalId;

    switch(type) {
      case 'duyurular':
        item = this.data.duyurular.find(d => d.id === id);
        modalId = 'modal-duyuru';
        break;
      case 'sporlar':
        item = this.data.sporlar.find(s => s.id === id);
        modalId = 'modal-spor';
        break;
      case 'faaliyetler':
        item = this.data.faaliyetler.find(f => f.id === id);
        modalId = 'modal-faaliyet';
        break;
      case 'vefa':
        item = this.data.vefa.find(v => v.id === id);
        modalId = 'modal-vefa';
        break;
      case 'projeler':
        item = this.data.projeler.find(p => p.id === id);
        modalId = 'modal-proje';
        break;
      case 'kizlarHaberler':
        item = this.data.kizlarHaberler.find(h => h.id === id);
        modalId = 'modal-kizlar';
        break;
      case 'galeri':
        item = (this.data.galeri || []).find(g => g.id === id);
        modalId = 'modal-galeri';
        break;
      case 'videolar':
        item = (this.data.videolar || []).find(v => v.id === id);
        modalId = 'modal-video';
        break;
      case 'etkinlikler':
        item = (this.data.etkinlikler || []).find(e => e.id === id);
        modalId = 'modal-etkinlik';
        break;
    }

    if (item && modalId) {
      this.populateForm(modalId, item);

      // Vefa: düzenlemede fotoğrafı yükle
      if (type === 'vefa' && item.foto) {
        resetVefaFotoUI();
        document.getElementById('vefa-mevcut-foto').value = item.foto;
        showVefaPreview(item.foto);
      }

      this.openModal(modalId);
    }
  }

  async deleteItem(type, id) {
    if (!confirm('Bu kaydı silmek istediğinizden emin misiniz?')) return;

    if (type === 'duyurular' && window.FB?.ready) {
      try {
        const { db, doc, deleteDoc } = window.FB;
        await deleteDoc(doc(db, "duyurular", id));
        console.log("🗑️ Firestore'dan silindi:", id);
      } catch (e) {
        console.error("❌ Firestore silme hatası:", e);
      }
    }


    switch(type) {
      case 'duyurular':
        this.data.duyurular = this.data.duyurular.filter(d => d.id !== id);
        break;
      case 'sporlar':
        this.data.sporlar = this.data.sporlar.filter(s => s.id !== id);
        break;
      case 'faaliyetler':
        this.data.faaliyetler = this.data.faaliyetler.filter(f => f.id !== id);
        break;
      case 'vefa':
        this.data.vefa = this.data.vefa.filter(v => v.id !== id);
        break;
      case 'projeler':
        this.data.projeler = this.data.projeler.filter(p => p.id !== id);
        break;
      case 'kizlarHaberler':
        this.data.kizlarHaberler = this.data.kizlarHaberler.filter(h => h.id !== id);
        break;
      case 'galeri':
        this.data.galeri = (this.data.galeri || []).filter(g => g.id !== id);
        break;
      case 'videolar':
        this.data.videolar = (this.data.videolar || []).filter(v => v.id !== id);
        break;
      case 'etkinlikler':
        this.data.etkinlikler = (this.data.etkinlikler || []).filter(e => e.id !== id);
        break;
    }

    DinamikSK.DB.setData(this.data);
    DinamikSK.Toast.show('Kayıt silindi!');
    this.renderSection(this.currentSection);
    this.renderStats();
  }

  populateForm(modalId, item) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    Object.keys(item).forEach(key => {
      const input = modal.querySelector(`[name="${key}"]`);
      const hiddenInput = modal.querySelector(`[name="mevcut-${key}"]`);

      if (input) {
        if (input.type === 'checkbox') {
          input.checked = item[key];
        } else {
          input.value = item[key];
        }
      }

      if (hiddenInput && item[key]) {
        hiddenInput.value = item[key];
      }
    });
  }

  // ========================================
  // MODAL HELPERS
  // ========================================
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.closest('.modal-backdrop').classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.closest('.modal-backdrop').classList.remove('open');
      document.body.style.overflow = '';
      modal.querySelector('form')?.reset();
    }
  }

  // ========================================
  // FORM HANDLER DISPATCH
  // ========================================
  handleFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formType = form.dataset.formType;

    switch(formType) {
      case 'duyuru':
        this.handleDuyuruForm(form);
        break;
      case 'spor':
        this.handleSporForm(form);
        break;
      case 'faaliyet':
        this.handleFaaliyetForm(form);
        break;
      case 'vefa':
        this.handleVefaForm(form);
        break;
      case 'proje':
        this.handleProjeForm(form);
        break;
      case 'kizlar':
        this.handleKizlarForm(form);
        break;
      case 'ayarlar':
        this.handleAyarlarForm(form);
        break;
      case 'bagis':
        this.handleBagisForm(form);
        break;
      case 'galeri':
        this.handleGaleriForm(form);
        break;
      case 'video':
        this.handleVideoForm(form);
        break;
      case 'etkinlik':
        this.handleEtkinlikForm(form);
        break;
      case 'youtube':
        this.handleYoutubeAyarForm(form);
        break;
    }
  }

  // ========================================
  // GALERİ CRUD
  // ========================================
  renderGaleri(container) {
    const tbody = container.querySelector('#galeri-tbody');
    if (!tbody) return;

    const galeri = (this.data.galeri || []).sort((a, b) => (a.sira || 0) - (b.sira || 0));

    if (galeri.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center" style="padding:48px;"><p style="color:var(--text-muted);">Henüz fotoğraf eklenmemiş.</p></td></tr>`;
      return;
    }

    const kategoriLabels = { kesif: 'Keşif', reklam: 'Reklam', egitim: 'Eğitim', sisad: 'SİSAD' };

    tbody.innerHTML = galeri.map(item => `
      <tr>
        <td><img src="${item.url}" alt="${item.baslik || ''}" style="width:60px;height:40px;object-fit:cover;border-radius:4px;background:#222;"></td>
        <td>${DinamikSK.Utils.truncate(item.baslik || '—', 35)}</td>
        <td><span class="card-badge">${kategoriLabels[item.kategori] || item.kategori}</span></td>
        <td>${item.sira || 0}</td>
        <td>
          <div class="table-actions">
            <button class="edit-btn" onclick="admin.editItem('galeri', '${item.id}')">Düzenle</button>
            <button class="delete-btn" onclick="admin.deleteItem('galeri', '${item.id}')">Sil</button>
          </div>
        </td>
      </tr>
    `).join('');

    // Kategori filtre butonları
    container.querySelectorAll('[data-kategori]').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('[data-kategori]').forEach(b => b.classList.remove('aktif-filtre'));
        btn.classList.add('aktif-filtre');
        const kat = btn.dataset.kategori;
        tbody.querySelectorAll('tr').forEach((tr, i) => {
          if (kat === 'tumu') { tr.style.display = ''; return; }
          tr.style.display = galeri[i]?.kategori === kat ? '' : 'none';
        });
      });
    });
  }

  handleGaleriForm(form) {
    const fd = new FormData(form);
    const id = fd.get('id');

    let videoId = fd.get('url') || '';

    const item = {
      id: id || DinamikSK.Utils.generateId(),
      url: videoId,
      baslik: fd.get('baslik') || '',
      aciklama: fd.get('aciklama') || '',
      kategori: fd.get('kategori'),
      genis: fd.get('genis') === 'on',
      sira: parseInt(fd.get('sira')) || 0
    };

    if (!this.data.galeri) this.data.galeri = [];

    if (id) {
      const idx = this.data.galeri.findIndex(g => g.id === id);
      if (idx !== -1) this.data.galeri[idx] = item;
    } else {
      this.data.galeri.push(item);
    }

    DinamikSK.DB.setData(this.data);
    DinamikSK.Toast.show(id ? 'Fotoğraf güncellendi!' : 'Fotoğraf eklendi!');
    this.closeModal('modal-galeri');
    this.renderSection('galeri');
  }

  // ========================================
  // VİDEOLAR CRUD
  // ========================================
  renderVideolar(container) {
    const tbody = container.querySelector('#video-tbody');
    if (!tbody) return;

    const videolar = this.data.videolar || [];

    if (videolar.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center" style="padding:48px;"><p style="color:var(--text-muted);">Henüz video eklenmemiş.</p></td></tr>`;
    } else {
      tbody.innerHTML = videolar.map(item => `
        <tr>
          <td>${DinamikSK.Utils.truncate(item.baslik, 40)}</td>
          <td><a href="https://youtu.be/${item.videoId}" target="_blank" style="color:var(--accent);font-size:0.82rem;">${item.videoId}</a></td>
          <td>${item.kategori || 'genel'}</td>
          <td>${item.oneCikar ? '<span style="color:#22c55e">Evet</span>' : '<span style="color:var(--text-muted)">Hayır</span>'}</td>
          <td>
            <div class="table-actions">
              <button class="edit-btn" onclick="admin.editItem('videolar', '${item.id}')">Düzenle</button>
              <button class="delete-btn" onclick="admin.deleteItem('videolar', '${item.id}')">Sil</button>
            </div>
          </td>
        </tr>
      `).join('');
    }

    // YouTube API çekme butonu
    const ytBtn = document.getElementById('yt-cek-btn');
    if (ytBtn && !ytBtn._bound) {
      ytBtn._bound = true;
      ytBtn.addEventListener('click', () => this.fetchYoutubeVideos());
    }
  }

  handleVideoForm(form) {
    const fd = new FormData(form);
    const id = fd.get('id');

    let rawId = (fd.get('videoId') || '').trim();
    // YouTube URL'den ID ayıkla
    const ytMatch = rawId.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
    const videoId = ytMatch ? ytMatch[1] : rawId;

    const item = {
      id: id || DinamikSK.Utils.generateId(),
      videoId,
      baslik: fd.get('baslik'),
      aciklama: fd.get('aciklama') || '',
      kategori: fd.get('kategori') || 'genel',
      oneCikar: fd.get('oneCikar') === 'on'
    };

    if (!this.data.videolar) this.data.videolar = [];

    if (id) {
      const idx = this.data.videolar.findIndex(v => v.id === id);
      if (idx !== -1) this.data.videolar[idx] = item;
    } else {
      this.data.videolar.push(item);
    }

    DinamikSK.DB.setData(this.data);
    DinamikSK.Toast.show(id ? 'Video güncellendi!' : 'Video eklendi!');
    this.closeModal('modal-video');
    this.renderSection('videolar');
  }

  async fetchYoutubeVideos() {
    const ayarlar = this.data.siteAyarlari || {};
    const apiKey = ayarlar.ytApiKey;
    const kanal = ayarlar.ytKanal || '@scuba.team.antalya';
    const sayi = ayarlar.ytVideoSayisi || 9;

    if (!apiKey) {
      DinamikSK.Toast.show('Önce Ayarlar bölümüne YouTube API Key girin!', 'error');
      return;
    }

    const btn = document.getElementById('yt-cek-btn');
    if (btn) btn.textContent = 'Çekiliyor...';

    try {
      // Kanal handle'dan channel ID al
      const handleClean = kanal.replace('@', '');
      const chRes = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${handleClean}&key=${apiKey}`);
      const chData = await chRes.json();
      const channelId = chData.items?.[0]?.id;

      if (!channelId) throw new Error('Kanal bulunamadı');

      // Son videoları çek
      const searchRes = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=${sayi}&order=date&type=video&key=${apiKey}`);
      const searchData = await searchRes.json();

      if (!searchData.items?.length) throw new Error('Video bulunamadı');

      if (!this.data.videolar) this.data.videolar = [];

      let eklendi = 0;
      searchData.items.forEach(v => {
        const videoId = v.id.videoId;
        const zatenVar = this.data.videolar.some(x => x.videoId === videoId);
        if (!zatenVar) {
          this.data.videolar.push({
            id: DinamikSK.Utils.generateId(),
            videoId,
            baslik: v.snippet.title,
            aciklama: v.snippet.description?.slice(0, 120) || '',
            kategori: 'genel',
            oneCikar: true
          });
          eklendi++;
        }
      });

      DinamikSK.DB.setData(this.data);
      DinamikSK.Toast.show(`${eklendi} yeni video eklendi!`);
      this.renderSection('videolar');
    } catch (err) {
      DinamikSK.Toast.show('Hata: ' + err.message, 'error');
    } finally {
      if (btn) btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:6px;vertical-align:-2px;"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>Kanaldan Videoları Çek`;
    }
  }

  // ========================================
  // ETKİNLİKLER CRUD
  // ========================================
  renderEtkinlikler(container) {
    const tbody = container.querySelector('#etkinlik-tbody');
    if (!tbody) return;

    const etkinlikler = (this.data.etkinlikler || []).sort((a, b) => new Date(a.tarih) - new Date(b.tarih));

    if (etkinlikler.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding:48px;"><p style="color:var(--text-muted);">Henüz etkinlik eklenmemiş.</p></td></tr>`;
      return;
    }

    const turLabels = { dalis: 'Dalış', egitim: 'Eğitim', sisad: 'SİSAD', sosyal: 'Sosyal', yarisma: 'Yarışma' };
    const bugun = new Date(); bugun.setHours(0,0,0,0);

    tbody.innerHTML = etkinlikler.map(item => {
      const etkinlikTarih = new Date(item.tarih);
      const gecti = etkinlikTarih < bugun;
      return `
        <tr>
          <td>${DinamikSK.Utils.truncate(item.baslik, 35)}</td>
          <td>${DinamikSK.Utils.formatDate(item.tarih)}${item.saat ? ' ' + item.saat : ''}</td>
          <td>${item.konum || '—'}</td>
          <td><span class="card-badge">${turLabels[item.tur] || item.tur}</span></td>
          <td>${gecti ? '<span style="color:var(--text-muted)">Geçti</span>' : item.gorunum ? '<span style="color:#22c55e">Aktif</span>' : '<span style="color:#ef4444">Pasif</span>'}</td>
          <td>
            <div class="table-actions">
              <button class="edit-btn" onclick="admin.editItem('etkinlikler', '${item.id}')">Düzenle</button>
              <button class="delete-btn" onclick="admin.deleteItem('etkinlikler', '${item.id}')">Sil</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  handleEtkinlikForm(form) {
    const fd = new FormData(form);
    const id = fd.get('id');

    const item = {
      id: id || DinamikSK.Utils.generateId(),
      baslik: fd.get('baslik'),
      aciklama: fd.get('aciklama') || '',
      tarih: fd.get('tarih'),
      saat: fd.get('saat') || '',
      konum: fd.get('konum') || '',
      bolum: fd.get('bolum') || 'genel',
      tur: fd.get('tur') || 'dalis',
      kontenjan: parseInt(fd.get('kontenjan')) || 0,
      gorunum: fd.get('gorunum') === 'on'
    };

    if (!this.data.etkinlikler) this.data.etkinlikler = [];

    if (id) {
      const idx = this.data.etkinlikler.findIndex(e => e.id === id);
      if (idx !== -1) this.data.etkinlikler[idx] = item;
    } else {
      this.data.etkinlikler.push(item);
    }

    DinamikSK.DB.setData(this.data);
    DinamikSK.Toast.show(id ? 'Etkinlik güncellendi!' : 'Etkinlik eklendi!');
    this.closeModal('modal-etkinlik');
    this.renderSection('etkinlikler');
  }

  handleYoutubeAyarForm(form) {
    const fd = new FormData(form);
    if (!this.data.siteAyarlari) this.data.siteAyarlari = {};
    this.data.siteAyarlari.ytApiKey = fd.get('ytApiKey') || '';
    this.data.siteAyarlari.ytKanal = fd.get('ytKanal') || '@scuba.team.antalya';
    this.data.siteAyarlari.ytVideoSayisi = parseInt(fd.get('ytVideoSayisi')) || 9;
    DinamikSK.DB.setData(this.data);
    DinamikSK.Toast.show('YouTube ayarları kaydedildi!');
  }

  renderStats() {
    this.data = DinamikSK.DB.getData();
    this.renderDashboard();
  }
}

// ========================================
// VEFA FOTOĞRAF UI
// ========================================
function initVefaFotoUI() {

  /* Tab geçişi */
  document.querySelectorAll('.vefa-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.vefa-tab').forEach(t => {
        t.style.background = 'transparent';
        t.style.color = 'rgba(255,255,255,0.3)';
        t.classList.remove('active');
      });
      btn.style.background = 'rgba(255,255,255,0.05)';
      btn.style.color = 'rgba(255,255,255,0.65)';
      btn.classList.add('active');

      const tab = btn.dataset.tab;
      document.getElementById('vefa-tab-upload').style.display = tab === 'upload' ? '' : 'none';
      document.getElementById('vefa-tab-url').style.display    = tab === 'url'    ? '' : 'none';
    });
  });

  /* Dosya seç butonu */
  const secBtn = document.getElementById('vefa-foto-sec');
  const fileInput = document.getElementById('vefa-foto-file');
  if (secBtn && fileInput) {
    secBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        // Görseli canvas üzerinde yeniden boyutlandır (max 800px, kalite 0.82)
        // Bu sayede dosya boyutundan bağımsız olarak localStorage'a sığar
        const img = new Image();
        img.onload = () => {
          const MAX = 800;
          let w = img.width, h = img.height;
          if (w > MAX || h > MAX) {
            if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
            else       { w = Math.round(w * MAX / h); h = MAX; }
          }
          const canvas = document.createElement('canvas');
          canvas.width = w; canvas.height = h;
          canvas.getContext('2d').drawImage(img, 0, 0, w, h);
          const compressed = canvas.toDataURL('image/jpeg', 0.82);
          document.getElementById('vefa-mevcut-foto').value = compressed;
          showVefaPreview(compressed);
          secBtn.textContent = '✓ ' + file.name;
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  /* URL ile ekleme */
  const urlEkleBtn = document.getElementById('vefa-url-ekle');
  if (urlEkleBtn) {
    urlEkleBtn.addEventListener('click', () => {
      const url = document.getElementById('vefa-foto-url').value.trim();
      if (!url) return;
      document.getElementById('vefa-mevcut-foto').value = url;
      showVefaPreview(url);
    });
  }

  /* Fotoğrafı kaldır */
  const silBtn = document.getElementById('vefa-foto-sil');
  if (silBtn) {
    silBtn.addEventListener('click', () => {
      document.getElementById('vefa-mevcut-foto').value = '';
      document.getElementById('vefa-foto-preview').style.display = 'none';
      const secBtn2 = document.getElementById('vefa-foto-sec');
      if (secBtn2) secBtn2.textContent = '+ Fotoğraf Seç (JPG, PNG, WebP)';
      const fileInput2 = document.getElementById('vefa-foto-file');
      if (fileInput2) fileInput2.value = '';
      const urlInput = document.getElementById('vefa-foto-url');
      if (urlInput) urlInput.value = '';
    });
  }
}

function showVefaPreview(src) {
  const preview = document.getElementById('vefa-foto-preview');
  const img = document.getElementById('vefa-foto-img');
  if (preview && img) {
    img.src = src;
    preview.style.display = '';
  }
}

function resetVefaFotoUI() {
  const mevcutInput = document.getElementById('vefa-mevcut-foto');
  const preview = document.getElementById('vefa-foto-preview');
  const secBtn = document.getElementById('vefa-foto-sec');
  const fileInput = document.getElementById('vefa-foto-file');
  const urlInput = document.getElementById('vefa-foto-url');

  if (mevcutInput) mevcutInput.value = '';
  if (preview) preview.style.display = 'none';
  if (secBtn) secBtn.textContent = '+ Fotoğraf Seç (JPG, PNG, WebP)';
  if (fileInput) fileInput.value = '';
  if (urlInput) urlInput.value = '';
}

// Initialize admin panel when DOM is ready
let admin;
document.addEventListener('DOMContentLoaded', () => {
  admin = new AdminPanel();
  initVefaFotoUI();

  // Global modal close handlers
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-backdrop');
      if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
        // Vefa modalı kapanırken UI sıfırla
        if (modal.id === 'modal-vefa') resetVefaFotoUI();
      }
    });
  });

  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove('open');
        document.body.style.overflow = '';
        if (backdrop.id === 'modal-vefa') resetVefaFotoUI();
      }
    });
  });
});
