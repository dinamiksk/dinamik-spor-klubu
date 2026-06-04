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
const MSG_COLLECTION = 'iletisim';
const VEFA_COLLECTION = 'vefa';
const BAGIS_COLLECTION = 'bagislar';
const CALISMA_COLLECTION = 'orman_calismalar';
const AYARLAR_COLLECTION = 'ayarlar';
const AYARLAR_DOC_ORMAN = 'orman';
const AYARLAR_SITE_DOC = 'site';
// Site geneli ayarlar — Firestore boşken bu varsayılanlar (sayfadaki mevcut sabit değerler)
const DEFAULT_AYARLAR_SITE = {
  marka:   'Akdeniz Dinamik Spor Kulübü',
  slogan:  "İman. Disiplin. Spor. 2010'dan beri Antalya'da gençleri güçlü bireyler olarak yetiştiriyoruz.",
  telefon: '+90 539 729 32 32',
  eposta:  'akdenizdinamiksk@gmail.com',
  ig:      'https://instagram.com/dinamiksk',
  igKiz:   'https://instagram.com/dinamiksk.kiz',
  igBilek: 'https://instagram.com/antalyabilekguresi',
  igRota:  'https://instagram.com/rotaantalya',
  youtube: 'https://www.youtube.com/@scuba.team.antalya'
};
const KIZ_COLLECTION = 'kiz_projeler';
const KIZ_PREVIEW_URL = 'dinamik-calismalar/kiz/index.html?preview=admin';
const KIZ_PREVIEW_URL_WITH_HASH = KIZ_PREVIEW_URL + '#projeler';
const SAYFALAR_COLL = 'sayfalar';
const KIZ_SAYFA_DOC = 'kiz';

// Alan adı → UW key haritası
const KIZ_GORSEL_SLOTS = [
  { field: 'hero_bg',          key: 'kiz-g-hero',   label: 'Hero Arka Plan' },
  { field: 'biz_kimiz_1',      key: 'kiz-g-biz1',   label: 'Biz Kimiz — Üst' },
  { field: 'biz_kimiz_2',      key: 'kiz-g-biz2',   label: 'Biz Kimiz — Alt' },
  { field: 'kasifler_1',       key: 'kiz-g-kasif',  label: 'Kaşifler' },
  { field: 'arastirmacilar_1', key: 'kiz-g-arstr1', label: 'Araştırmacılar Sol' },
  { field: 'arastirmacilar_2', key: 'kiz-g-arstr2', label: 'Araştırmacılar Sağ' },
  { field: 'maceracilar_main', key: 'kiz-g-macer1', label: 'Maceracılar Büyük' },
  { field: 'maceracilar_sub',  key: 'kiz-g-macer2', label: 'Maceracılar Geniş' },
];

const ERKEK_COLLECTION = 'erkek_projeler';
const ERKEK_PREVIEW_URL = 'dinamik-calismalar/erkek/index.html?preview=admin';
const ERKEK_PREVIEW_URL_WITH_HASH = ERKEK_PREVIEW_URL + '#projeler';

const VEFA_PREVIEW_URL = 'vefa.html?preview=admin';
const VEFA_PREVIEW_URL_WITH_HASH = VEFA_PREVIEW_URL + '#yonetim-kurulu';
const ERKEK_SAYFA_DOC = 'erkek';
const KIZ_SAYFA_PREVIEW_URL   = 'dinamik-calismalar/kiz/index.html?preview=admin&sayfa=1';
const ERKEK_SAYFA_PREVIEW_URL = 'dinamik-calismalar/erkek/index.html?preview=admin&sayfa=1';

const BILEK_SAYFA_DOC = 'bilek-guresi';
const BILEK_SAYFA_PREVIEW_URL = 'sporlar/bilek-guresi/index.html?preview=admin&sayfa=1';
// Görsel slotları: Firestore alanı → UW widget key
const BILEK_GORSEL_SLOTS = [
  { field: 'hero_bg',     key: 'bg-g-hero'   },
  { field: 'cinema_img',  key: 'bg-g-cinema' },
  { field: 'hand_right',  key: 'bg-g-hand-r' },
  { field: 'hand_left',   key: 'bg-g-hand-l' },
];
// Metin alanları için sayfadaki mevcut içerikle eşleşen varsayılanlar
// (Firestore boşken admin formu bunlarla dolar → önizleme/kayıt doğru içerikle başlar)
const BILEK_METIN_DEFAULTS = {
  hero_label:       'Kuvvet Branşı · TABS',
  hero_title_1:     'Beş saniye',
  hero_title_2:     'Bir masa',
  hero_title_3:     'Bir seçim',
  hero_lead:        'Masa küçüktür. Dünyası değil. Ellerin kilitlenir, göz göze bakışır, hakem sesini keser; ve beş saniye içinde kim olduğun ortaya çıkar. Biz on yıldır Antalya\'da o beş saniyeye hazırlıyoruz.',
  hero_cta_primary: 'Masaya Otur',
  hero_cta_ghost:   'Antrenman Sürecini Gör',
  stat1_num: '10',  stat1_suffix: 'y', stat1_label: 'Yıl Tecrübe',
  stat2_num: '200', stat2_suffix: '+', stat2_label: 'Yetişen Sporcu',
  stat3_num: '15',  stat3_suffix: '+', stat3_label: 'Turnuva',
  stat4_num: '3',   stat4_suffix: '',  stat4_label: 'Uzman Eğitmen',
  veli_quote:  'Oğlum salona kuvvetini göstermek için gelmişti. Bir yıl sonra kendini tanımış olarak döndü.',
  veli_author: 'Hasan K.',
  veli_role:   'Bir veli · Antalya',
};

const ROTA_SAYFA_DOC = 'rota';
const ROTA_SAYFA_PREVIEW_URL = 'dinamik-calismalar/rota/index.html?preview=admin&sayfa=1';
// Rota sayfasındaki sabit bölüm görselleri (hero + galeri ayrı yönetilir)
const ROTA_GORSEL_SLOTS = [
  { field: 'logo',          key: 'rota-logo',      label: 'Hero Amblem (Logo)' },
  { field: 'img_meclis',    key: 'rota-meclis',    label: 'Bölüm 01 — Meclis' },
  { field: 'img_konusmaci', key: 'rota-konusmaci', label: '+1 Değer Bandı' },
  { field: 'img_sohbet',    key: 'rota-sohbet',    label: 'Bölüm 02 — Sohbet' },
  { field: 'img_iftar',     key: 'rota-iftar',     label: 'Bölüm 03 — Sofra' },
  { field: 'img_gaye',      key: 'rota-gaye',      label: 'Asıl Gayemiz Bandı' },
  { field: 'img_grup',      key: 'rota-grup',      label: 'Bölüm 04 — Kardeşlik' },
];
const ROTA_GORSEL_KEYS = new Set(ROTA_GORSEL_SLOTS.map(s => s.key));

const DALGIC_SAYFA_DOC = 'dalgiclik';
const DALGIC_SAYFA_PREVIEW_URL = 'sporlar/dalgiclik/index.html?preview=admin&sayfa=1';
const DALGIC_KATEGORILER = [
  { val: 'kesif',  ad: 'Keşif' },
  { val: 'reklam', ad: 'Reklam' },
  { val: 'egitim', ad: 'Eğitim' },
  { val: 'sisad',  ad: 'SİSAD' },
];

const ERKEK_GORSEL_SLOTS = [
  { field: 'hero_bg',       key: 'er-g-hero',   label: 'Hero Arka Plan' },
  { field: 'biz_kimiz_1',   key: 'er-g-biz1',   label: 'Biz Kimiz — Üst' },
  { field: 'biz_kimiz_2',   key: 'er-g-biz2',   label: 'Biz Kimiz — Alt' },
  { field: 'fidanlar_1',    key: 'er-g-fidan',  label: 'Fidanlar' },
  { field: 'yigitler_1',    key: 'er-g-yigit1', label: 'Yiğitler Sol' },
  { field: 'yigitler_2',    key: 'er-g-yigit2', label: 'Yiğitler Sağ' },
  { field: 'neferler_main', key: 'er-g-nefer1', label: 'Neferler Büyük' },
  { field: 'neferler_sub',  key: 'er-g-nefer2', label: 'Neferler Geniş' },
];

// Seed: mevcut 6 merkez projesi (Firestore boşsa "İçe aktar" ile yazılır)
const KIZ_SEED_PROJELER = [
  { kategori:'merkez', sira:10, no:'01', baslik:'İlk Namazım',
    teaser:'Evlatlarımıza namaz şuurunu aşılıyor, namazı hayatlarının ilk sırasına yazdırıyoruz. Saflar omuz omuza, gönüller bir saftır.',
    gorsel:'', yayinda:true,
    bolumler:[
      { tip:'p', text:'**Amacımız;** geleceğin varisi olan pek kıymetli evlatlarımıza namaz şuurunu aşılamak, namazı çok sevdirmek ve onu vazgeçilmezleri olarak hayatlarının ilk sırasına yazdırmaktır.' },
      { tip:'p', text:'Kulüp bünyesinde yaptığımız her faaliyette ilk gelecek projemiz bu olup, amacımız biri bin yapıp omuz omuza saf tutmaktır. **"İlk Namazım"**, evlatlarımızın gönüllerinde her daim **"gözbebeği namazım"** olarak kalacaktır.' }
    ]},
  { kategori:'merkez', sira:20, no:'02', baslik:'Her Gün Bir İyilik Yap',
    teaser:'Birler bir araya gelince çoğalır, iyilik biri bin yapar. Sıcak bir tebessüm, uzanan bir el — her günü iyilikle nakşetmek.',
    gorsel:'', yayinda:true,
    bolumler:[
      { tip:'p', text:'Bir, yalnız başına sadece "1"den ibarettir. Ancak birler bir araya gelince bizleri, sizleri ve onları oluşturur. İyilik konusu ise yalnızca bir kez yapılsa orada sayı "bir" kalmaz; bu sayının matematiksel hesabı yapılamaz. **İyilik, her güne bir sayı ile eklenince sayılar avuca sığmaz, katlanarak büyür.**' },
      { tip:'p', text:'**"Her Güne Bir İyilik"** adıyla çıktığımız bu yolda amacımız; sayının sadece matematikten ibaret olmadığını, yapılan iyiliklerin biri bin yapacağını öğretmektir. Onlara sıcacık bir tebessümün, uzanan bir yardım elinin, çevreye nadide bir bakışın sadece "bir iyilik" adı altında tasnif edilemeyeceğini, bu iyiliğin binlere bedel olduğunu aşılamayı amaçladık. Ve bu kıymetli yolu, onlara ömür boyu taşıyacakları bir **"hayati yol"** olarak armağan ettik.' }
    ]},
  { kategori:'merkez', sira:30, no:'03', baslik:"Hilal'i Gördüm",
    teaser:"Ramazan'ın nazenin ışığı altında; namaz, teravih, salavat ve hadisleri yüreklere ilmek ilmek nakşettik.",
    gorsel:'', yayinda:true,
    bolumler:[
      { tip:'intro', text:"Bakın Hilal'i gördüm, nasıl da nazlı nazlı bakıyor… Gökyüzünün nazenin ışığı. Kimdir o, hangi zamanın timsali bu güzellik? Onun adı Ramazan…" },
      { tip:'p', text:"Ramazan ayını evlatlarımıza tam da böyle aksettirdik. Yüreklerinde kıpır kıpır, masumane bir eğlence; hem ibadet hem ziyafet misali… Ama en çok da büyük bir sevgiyle; namazı, teravihi, Kur'an-ı Kerim okumalarını, salavatları ve hadisleri, kısacası **ibadetin özünü benliklerine kimlik edinecekleri her şeyi** bu yolda nazende kalplere ilmek ilmek nakşettik." }
    ]},
  { kategori:'merkez', sira:40, no:'04', baslik:'Liderim İtikaftayım',
    teaser:"Yol O'na, yoldaş O'na. Hayatın her anını bir itikaf teslimiyetiyle yaşamak — gözlerin içine yazılan ışık.",
    gorsel:'', yayinda:true,
    bolumler:[
      { tip:'intro', text:"Sessiz olun, itikaftayım. Kapattım gözlerimi; ağzımı kenetledim bir yudum su ile. Dilimi de susturdum, gönlümü bağladım Rahman'a…" },
      { tip:'p', text:"Evlatlarımızla birlikte girdiğimiz bu itikaf programında onlara öğrettiğimiz yegâne şey şudur: **Yol O'na, Yoldaş O'na…** İbadetlerin hassasiyeti sadece itikaf zamanıyla sınırlı değildir. Hayatın her anını bir itikaf teslimiyetiyle yaşamalarını, kapattıkları gözlerinin içine bir ışık olarak yazdırdık. Tüm hayati itikaflar artık onlara emanet…" }
    ]},
  { kategori:'merkez', sira:50, no:'05', baslik:'Seyyah',
    teaser:'Şehirleri, sokakları, gönülleri adım adım gezdik. Hatıra defterimize attığımız her imza, köklü bir kardeşlik.',
    gorsel:'', yayinda:true,
    bolumler:[
      { tip:'intro', text:'Bir şehir, bir sokak, bir cadde, bazen de küçük bir kuytuda kalmış; sıcacık, buram buram kokusunu içimize çektiğimiz gönül fırınımız… "Benim adım Seyyah" diyerek çıktık yola.' },
      { tip:'p', text:"Gönül fırınımız diye bahsettiğimiz satırlarda, o fırına sıcak gönüller eklemeye niyet ettik. Adımız Seyyah; gezdik, döndük, durduk ve nihayet bir gönüle konduk. Kulübümüz vesilesiyle Kayseri'de bulunan ve gönül fırıncılığı yaptığımız dostlarımızla bir şehri, bir sokağı, bir caddeyi adım adım gezdik; anılara sıcaklıklar ekledik. **Hatıra defterimize yazdığımız her bir seyyahlığın sonuna, hep güzel biten ve daima güzel bitecek olan köklü bir kardeşlik ile imzamızı attık.**" }
    ]},
  { kategori:'merkez', sira:60, no:'06', baslik:'Yeryüzü Yıldızları',
    teaser:'Ashab gibi inci taneleri, yeryüzünde pırıl pırıl yıldızlar. Maneviyatın enginlere ulaştığı bir yolculuk.',
    gorsel:'', yayinda:true,
    bolumler:[
      { tip:'intro', text:'Gökyüzünden yeryüzüne serilmiş, pırıl pırıl parlayan inci taneleri gibisiniz. Ashab gibisiniz…' },
      { tip:'p', text:'Gençlerimize işte böyle seslendik. Onları birer inci tanesi olarak gördük, ashabın ruhunu yüreklerine kondurduk. **Maneviyatın enginlere ulaştığı, benlikten öteye geçip ruhumuzun en derinlerinde hissettiğimiz ilahi rahmeti gönlümüze nakşettik** ve her birimiz yeryüzünde dolaşan birer yıldız olduk. Gençlerimize şükranlarımızı sunuyor ve biz de onların her birine gökyüzünden bir yıldız ithaf ediyoruz.' }
    ]}
];

const DEFAULT_AYARLAR_ORMAN = {
  fidanFiyati: 150,
  hedef: 1000,
  baselineFidan: 0,
  baselineKisi: 0,
  toplamFidan: 0,
  toplamKisi: 0,
  metinler: {
    masrafKullanim: "{fiyat} TL ve altında bağışlar; fidan dikim etkinliği gün masrafları, ulaşım, ikram, fidan bakım malzemeleri için kullanılır.",
    genelKullanim: "Tek işimiz fidan dikimi değil. Bağışlarınız gençlerimizin spor eğitimi, malzeme, kamp ve dikim seferberliklerinde ortak kumbaramız olarak kullanılır.",
    ibanNo: "TR12 3456 7890 1234 5678 9012 34"
  }
};

// Vefa tip etiketleri
const VEFA_TIP_AD = {
  'baskan':         'Mevcut Başkan',
  'yonetim':        'Yönetim Kurulu',
  'gecmis-baskan':  'Geçmiş Başkan'
};
const VEFA_TIP_IKON = {
  'baskan':         '👑',
  'yonetim':        '🏛️',
  'gecmis-baskan':  '📜'
};
const VEFA_TIP_KISA_BADGE = {
  'baskan':         'baskan',
  'yonetim':        'yonetim',
  'gecmis-baskan':  'gecmis'
};

const KONU_AD = {
  uyelik: 'Üyelik',
  bilek: 'Bilek Güreşi',
  dalgiclik: 'Dalgıçlık',
  erkek: 'Dinamik Erkek',
  kiz: 'Dinamik Kız',
  orman: 'Hatıra Ormanı',
  vefa: 'Vefa',
  genel: 'Genel Bilgi',
  basin: 'Basın/Sponsorluk'
};

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

const formatDateTime = (ts) => {
  // Firestore Timestamp veya null
  const d = ts?.toDate?.() || (ts ? new Date(ts) : null);
  if (!d || isNaN(d)) return '—';
  return d.toLocaleString('tr-TR', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

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
  duzenleId: null,
  mesajlar: [],
  msgFiltre: 'all',
  // Vefa state
  vefa: [],
  vefaTab: 'baskan',           // baskan | yonetim | gecmis-baskan
  yonetimModel: 'A',          // A | B | AB
  yonetimGrupFoto: '',
  vefaDuzenleId: null,
  vefaDraft: null,             // modal açıkken canlı önizleme için draft kayıt
  vefaPreviewReady: false,
  // Bağış state
  bagis: [],
  bagisTab: 'bekleyen',        // bekleyen | onayli | reddedilen | calismalar | ayarlar
  bagisKanal: 'all',           // all | akced | iban
  bagisArama: '',
  ayarlar: { ...DEFAULT_AYARLAR_ORMAN },
  bagisRedId: null,
  // Çalışmalar state
  calismalar: [],
  calismaDuzenleId: null,
  // Kız sayfası — Projeler state
  kizProjeler: [],
  kizTab: 'merkez',           // merkez | yerel | gorsel
  kizDuzenleId: null,
  kizDraft: null,             // modal açıkken canlı önizleme için draft proje
  kizPreviewReady: false,
  kizBolumler: [],            // modal açıkken bölüm editörü state'i
  // Kız sayfası — Sayfa görselleri state
  kizSayfaData: {},
  // Erkek sayfası — Projeler state
  erkekProjeler: [],
  erkekTab: 'merkez',
  erkekDuzenleId: null,
  erkekDraft: null,
  erkekPreviewReady: false,
  erkekBolumler: [],
  erkekSayfaData: {},
  kizSayfaPreviewReady: false,
  erkekSayfaPreviewReady: false,
  // Rota — Gençlik Buluşmaları sayfa görselleri
  rotaSayfaPreviewReady: false,
  // Dalgıçlık — Akdeniz'den Kareler galerisi
  dalgicGaleri: [],            // { url, baslik, kategori, sira, genis, _tempId, _uploading, _localUrl, _error, _percent }
  dalgicSayfaPreviewReady: false,
  // Bilek Güreşi — Sayfa yönetimi (görsel + metin)
  bilekSayfaData: {},
  bilekSayfaPreviewReady: false
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
// FIREBASE — MESAJLAR
// ========================================
const fetchMessages = async () => {
  await waitFirebase();
  const { db, collection, getDocs } = window.FB;
  const snap = await getDocs(collection(db, MSG_COLLECTION));
  const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  // En yeni üstte
  items.sort((a, b) => {
    const da = a.olusturuldu?.toDate?.()?.getTime() || 0;
    const db_ = b.olusturuldu?.toDate?.()?.getTime() || 0;
    return db_ - da;
  });
  console.log(`✉️  ${items.length} mesaj yüklendi`);
  return items;
};

const setMessageRead = async (id, okundu) => {
  await waitFirebase();
  const { db, doc, updateDoc } = window.FB;
  await updateDoc(doc(db, MSG_COLLECTION, id), { okundu });
};

const deleteMessage = async (id) => {
  await waitFirebase();
  const { db, doc, deleteDoc } = window.FB;
  await deleteDoc(doc(db, MSG_COLLECTION, id));
};

// ========================================
// NAVIGATION
// ========================================
const switchSection = (id) => {
  $$('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.section === id));
  $$('.section').forEach(s => s.classList.toggle('active', s.id === `section-${id}`));
  if (id === 'icerik') renderIcerik();
  if (id === 'dashboard') renderDashboard();
  if (id === 'mesajlar') renderMessages();
  if (id === 'vefa') renderVefa();
  if (id === 'orman') renderBagis();
  if (id === 'kiz')   renderKiz();
  if (id === 'erkek') renderErkek();
  if (id === 'rota') renderRota();
  if (id === 'dalgiclik') renderDalgic();
  if (id === 'bilek') renderBilek();
  if (id === 'ayarlar') renderAyarlarSite();
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
    const arsivde = window.isArchived ? window.isArchived(i) : (i.arsiv === true);
    if (durum === 'yayin' && (i.yayinda === false || arsivde)) return false;
    if (durum === 'taslak' && i.yayinda !== false) return false;
    if (durum === 'arsiv' && !arsivde) return false;
    return true;
  });
};

const itemCardHTML = (i) => {
  const tipBadge = `<span class="badge tip-${i.tip}">${TIP_IKON[i.tip] || ''} ${TIP_AD[i.tip] || i.tip}</span>`;
  const katBadge = `<span class="badge kat">${KATEGORI_AD[i.kategori] || i.kategori}</span>`;
  const arsivde = window.isArchived ? window.isArchived(i) : (i.arsiv === true);
  let durumBadge;
  if (i.yayinda === false) {
    durumBadge = '<span class="badge draft">Taslak</span>';
  } else if (arsivde) {
    const sebep = i.arsiv === true ? 'manuel' : 'otomatik';
    durumBadge = `<span class="badge draft" title="${sebep === 'manuel' ? 'Manuel arşivlendi' : '1 yıldan eski'}">📦 Arşivde</span>`;
  } else {
    durumBadge = '<span class="badge live">Yayında</span>';
  }
  const featBadge = i.oneCikar ? '<span class="badge featured">⭐ Öne Çıkan</span>' : '';
  const thumbUrl = i.gorsel ? window.cldUrl(i.gorsel, 'w_240,h_240,c_fill,q_auto,f_auto') : '';
  const galCount = Array.isArray(i.gorseller) ? i.gorseller.length : 0;
  const galBadge = galCount ? `<span class="badge featured">📷 ${galCount}</span>` : '';
  const thumb = thumbUrl
    ? `<img src="${escapeHtml(thumbUrl)}" alt="" loading="lazy">`
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
          ${galBadge}
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
  setToggle($('#t-arsiv'), false);
  updateConditionalFields('duyuru');
  uwClear('kapak');
  gwClear();
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
  setToggle($('#t-arsiv'), item.arsiv === true);
  updateConditionalFields(item.tip || 'duyuru');

  // Upload widget'ları doldur
  if (item.gorsel) uwSetPreview('kapak', item.gorsel);
  else uwClear('kapak');
  gwLoad(Array.isArray(item.gorseller) ? item.gorseller : []);

  modal.open();
};

const submitForm = async (e) => {
  e.preventDefault();
  const form = e.target;
  const fd = new FormData(form);
  const id = fd.get('id') || null;

  // Bekleyen yüklemeleri kontrol et
  if (uwState.kapak.uploading || gwIsBusy()) {
    toast('Görsel yüklemesi tamamlanmadı, lütfen bekle', 'error');
    return;
  }

  // Galeri URL'lerini al
  let gorseller = [];
  try {
    const raw = fd.get('gorseller') || '[]';
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) gorseller = parsed.filter(u => typeof u === 'string' && u);
  } catch (err) {
    console.warn('Galeri JSON parse hatası, boş array kullanılıyor:', err);
  }

  const data = {
    tip: fd.get('tip'),
    kategori: fd.get('kategori'),
    baslik: (fd.get('baslik') || '').trim(),
    kisaMetin: (fd.get('kisaMetin') || '').trim(),
    tamMetin: (fd.get('tamMetin') || '').trim(),
    gorsel: (fd.get('gorsel') || '').trim(),
    gorseller,
    tarih: fd.get('tarih') || todayISO(),
    yayinda: getToggle('#t-yayin'),
    oneCikar: getToggle('#t-feat'),
    arsiv: getToggle('#t-arsiv')
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
// MESAJLAR — render & actions
// ========================================
const filteredMessages = () => {
  if (state.msgFiltre === 'okunmamis') return state.mesajlar.filter(m => !m.okundu);
  if (state.msgFiltre === 'okunmus')   return state.mesajlar.filter(m => !!m.okundu);
  return state.mesajlar;
};

const msgCardHTML = (m) => {
  const okundu = !!m.okundu;
  const konuLbl = KONU_AD[m.konu] || m.konu || '—';
  const telLink = m.telefon
    ? `<span>📞 <a href="tel:${escapeHtml(m.telefon)}">${escapeHtml(m.telefon)}</a></span>`
    : '';
  const badge = okundu
    ? '<span class="badge-msg-read">Okundu</span>'
    : '<span class="badge-msg-unread">● Yeni</span>';
  const toggleAct = okundu
    ? `<button class="btn btn-ghost" data-msg-act="markUnread" data-id="${m.id}">Okunmadı işaretle</button>`
    : `<button class="btn btn-primary" data-msg-act="markRead" data-id="${m.id}">Okundu işaretle</button>`;

  return `
    <div class="msg-card ${okundu ? '' : 'unread'}" data-id="${m.id}">
      <div class="msg-card__head">
        <div>
          <span class="msg-card__name">${escapeHtml(m.ad || '(isimsiz)')}</span>
          ${badge}
        </div>
        <span class="msg-card__date">${formatDateTime(m.olusturuldu)}</span>
      </div>
      <div class="msg-card__meta">
        <span>✉️ <a href="mailto:${escapeHtml(m.email || '')}">${escapeHtml(m.email || '—')}</a></span>
        ${telLink}
        <span class="msg-card__konu">${escapeHtml(konuLbl)}</span>
      </div>
      <div class="msg-card__body">${escapeHtml(m.mesaj || '')}</div>
      <div class="msg-card__actions">
        ${toggleAct}
        <button class="btn btn-danger" data-msg-act="del" data-id="${m.id}">Sil</button>
      </div>
    </div>
  `;
};

const renderMessages = () => {
  const cont = $('#msg-list');
  if (!cont) return;
  const list = filteredMessages();
  if (!list.length) {
    cont.innerHTML = `
      <div class="empty-state">
        <h3>${state.mesajlar.length === 0 ? 'Henüz mesaj yok' : 'Bu filtreye uyan mesaj yok'}</h3>
        <p>${state.mesajlar.length === 0 ? 'İletişim formundan ilk mesaj geldiğinde burada görünecek.' : 'Farklı bir filtre dene.'}</p>
      </div>`;
    return;
  }
  cont.innerHTML = list.map(msgCardHTML).join('');
  bindMsgActions(cont);
};

const bindMsgActions = (root) => {
  $$('button[data-msg-act]', root).forEach(btn => {
    btn.addEventListener('click', () => onMsgAction(btn.dataset.msgAct, btn.dataset.id));
  });
};

const onMsgAction = async (act, id) => {
  const msg = state.mesajlar.find(m => m.id === id);
  if (!msg) return;

  if (act === 'markRead' || act === 'markUnread') {
    const okundu = act === 'markRead';
    msg.okundu = okundu;             // optimistic
    renderMessages();
    updateMsgBadge();
    try {
      await setMessageRead(id, okundu);
    } catch (err) {
      console.error('Mesaj durumu güncellenemedi:', err);
      msg.okundu = !okundu;          // geri al
      renderMessages();
      updateMsgBadge();
      toast('Güncelleme başarısız: ' + err.message, 'error');
    }
    return;
  }

  if (act === 'del') {
    if (!confirm(`${msg.ad || 'Bu mesaj'} adlı kişinin mesajı silinecek. Emin misin?`)) return;
    try {
      await deleteMessage(id);
      state.mesajlar = state.mesajlar.filter(x => x.id !== id);
      renderMessages();
      updateMsgBadge();
      toast('Mesaj silindi', 'success');
    } catch (err) {
      console.error('Mesaj silinemedi:', err);
      toast('Silme başarısız: ' + err.message, 'error');
    }
  }
};

const updateMsgBadge = () => {
  const badge = $('#nav-msg-badge');
  if (!badge) return;
  const unread = state.mesajlar.filter(m => !m.okundu).length;
  if (unread > 0) {
    badge.textContent = unread > 99 ? '99+' : String(unread);
    badge.hidden = false;
  } else {
    badge.hidden = true;
  }
};

// ========================================
// UPLOAD WIDGETS — Cloudinary
// ========================================
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
// HEIC/HEIF (iPhone) bilerek dışarıda — Chrome/Firefox bu formatı açamaz.
const ACCEPTED_TYPES = /^image\/(jpeg|jpg|png|webp|gif|svg\+xml)$/i;

const isValidImage = (file) => {
  if (!file) return { ok: false, msg: 'Dosya bulunamadı.' };
  if (file.size > MAX_FILE_SIZE) {
    return { ok: false, msg: `Dosya 10 MB üstünde (${(file.size / 1024 / 1024).toFixed(1)} MB). Daha küçük bir dosya seç.` };
  }
  if (/heic|heif/i.test(file.type) || /\.(heic|heif)$/i.test(file.name || '')) {
    return { ok: false, msg: 'HEIC/HEIF (iPhone) görselleri web’de açılmaz. Lütfen JPG, PNG veya WebP yükleyin.' };
  }
  if (!ACCEPTED_TYPES.test(file.type) && !/\.(jpe?g|png|webp|gif|svg)$/i.test(file.name || '')) {
    return { ok: false, msg: 'Sadece JPG, PNG, WebP, GIF veya SVG dosyalar yüklenebilir.' };
  }
  return { ok: true };
};

// ---- Tek görsel widget'ı (kapak + vefa + kiz-proje) ----
const uwState = {
  kapak:          { url: '', uploading: false },
  vefa:           { url: '', uploading: false },
  'yonetim-grup': { url: '', uploading: false },
  calisma:        { url: '', uploading: false },
  'kiz-proje':    { url: '', uploading: false },
  'kiz-g-hero':   { url: '', uploading: false },
  'kiz-g-biz1':   { url: '', uploading: false },
  'kiz-g-biz2':   { url: '', uploading: false },
  'kiz-g-kasif':  { url: '', uploading: false },
  'kiz-g-arstr1': { url: '', uploading: false },
  'kiz-g-arstr2': { url: '', uploading: false },
  'kiz-g-macer1': { url: '', uploading: false },
  'kiz-g-macer2': { url: '', uploading: false },
  'erkek-proje':  { url: '', uploading: false },
  'er-g-hero':    { url: '', uploading: false },
  'er-g-biz1':    { url: '', uploading: false },
  'er-g-biz2':    { url: '', uploading: false },
  'er-g-fidan':   { url: '', uploading: false },
  'er-g-yigit1':  { url: '', uploading: false },
  'er-g-yigit2':  { url: '', uploading: false },
  'er-g-nefer1':  { url: '', uploading: false },
  'er-g-nefer2':  { url: '', uploading: false },
  'bg-g-hero':    { url: '', uploading: false },
  'bg-g-cinema':  { url: '', uploading: false },
  'bg-g-hand-r':  { url: '', uploading: false },
  'bg-g-hand-l':  { url: '', uploading: false }
};

const uwEl = (key, attr) => $(`#uw-${key} [data-uw-${attr}]`);


const uwSetPreview = (key, url) => {
  const wrap = $(`#uw-${key}`);
  uwState[key].url = url;
  uwEl(key, 'img').src = window.cldUrl(url, 'w_800,q_auto,f_auto');
  uwEl(key, 'empty').hidden = true;
  uwEl(key, 'preview').hidden = false;
  uwEl(key, 'progress').hidden = true;
  // Hidden URL input'u doldur (form submit alacak)
  const urlInput = $(`#uw-${key}-url`);
  if (urlInput) urlInput.value = url;
  wrap.classList.remove('is-busy');
  uwHideError(key);
  if (key === 'kiz-proje')    schedulePreviewUpdate();
  if (key === 'erkek-proje')  scheduleErkekPreviewUpdate();
  if (key === 'vefa')         scheduleVefaPreviewUpdate();
  if (key === 'yonetim-grup' && uwState[key].uploading) onYonetimGrupFotoChange(url);
  if (key === 'rota-hero' || ROTA_GORSEL_KEYS.has(key)) scheduleRotaPreviewUpdate();
  if (KIZ_GORSEL_KEYS.has(key))   scheduleKizSayfaPreviewUpdate();
  if (ERKEK_GORSEL_KEYS.has(key)) scheduleErkekSayfaPreviewUpdate();
  if (BILEK_GORSEL_KEYS.has(key)) scheduleBilekSayfaPreviewUpdate();
};

const uwClear = (key) => {
  uwState[key].url = '';
  uwState[key].uploading = false;
  uwEl(key, 'empty').hidden = false;
  uwEl(key, 'preview').hidden = true;
  uwEl(key, 'progress').hidden = true;
  uwEl(key, 'fill').style.width = '0%';
  uwEl(key, 'percent').textContent = '0%';
  const urlInput = $(`#uw-${key}-url`);
  if (urlInput) urlInput.value = '';
  $(`#uw-${key}`).classList.remove('is-busy', 'is-dragover');
  uwHideError(key);
  if (key === 'kiz-proje')    schedulePreviewUpdate();
  if (key === 'erkek-proje')  scheduleErkekPreviewUpdate();
  if (key === 'vefa')         scheduleVefaPreviewUpdate();
  if (key === 'yonetim-grup' && state.yonetimGrupFoto) onYonetimGrupFotoChange('');
  if (key === 'rota-hero' || ROTA_GORSEL_KEYS.has(key)) scheduleRotaPreviewUpdate();
  if (KIZ_GORSEL_KEYS.has(key))   scheduleKizSayfaPreviewUpdate();
  if (ERKEK_GORSEL_KEYS.has(key)) scheduleErkekSayfaPreviewUpdate();
  if (BILEK_GORSEL_KEYS.has(key)) scheduleBilekSayfaPreviewUpdate();
};

const uwShowError = (key, msg) => {
  const errEl = uwEl(key, 'error');
  errEl.textContent = msg;
  errEl.hidden = false;
};
const uwHideError = (key) => {
  const errEl = uwEl(key, 'error');
  if (errEl) { errEl.hidden = true; errEl.textContent = ''; }
};

const uwShowProgress = (key, percent) => {
  uwEl(key, 'preview').hidden = false;
  uwEl(key, 'empty').hidden = true;
  uwEl(key, 'progress').hidden = false;
  uwEl(key, 'fill').style.width = percent + '%';
  uwEl(key, 'percent').textContent = percent + '%';
};

const uwHandleFile = async (key, file) => {
  uwHideError(key);
  const v = isValidImage(file);
  if (!v.ok) { uwShowError(key, v.msg); return; }

  uwState[key].uploading = true;
  $(`#uw-${key}`).classList.add('is-busy');

  // Önce lokal preview (hızlı feedback)
  const localUrl = URL.createObjectURL(file);
  uwEl(key, 'img').src = localUrl;
  uwEl(key, 'empty').hidden = true;
  uwEl(key, 'preview').hidden = false;
  uwShowProgress(key, 0);

  try {
    const optimized = await window.resizeImage(file);
    const result = await window.uploadToCloudinary(optimized, (p) => uwShowProgress(key, p));
    URL.revokeObjectURL(localUrl);
    uwSetPreview(key, result.secure_url);
    uwState[key].uploading = false;
  } catch (err) {
    console.error('Görsel yüklenemedi:', err);
    URL.revokeObjectURL(localUrl);
    uwClear(key);
    uwShowError(key, err.message || 'Yükleme başarısız oldu.');
    uwState[key].uploading = false;
  }
};

const initSingleUpload = (key) => {
  if (!uwState[key]) uwState[key] = { url: '', uploading: false };
  const wrap = $(`#uw-${key}`);
  const input = $(`#uw-${key}-input`);
  const empty = uwEl(key, 'empty');

  // Tıkla-seç
  empty.addEventListener('click', () => input.click());
  input.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (file) uwHandleFile(key, file);
    input.value = '';
  });

  // Drag-drop
  wrap.addEventListener('dragover', (e) => {
    e.preventDefault();
    wrap.classList.add('is-dragover');
  });
  wrap.addEventListener('dragleave', (e) => {
    if (e.target === wrap) wrap.classList.remove('is-dragover');
  });
  wrap.addEventListener('drop', (e) => {
    e.preventDefault();
    wrap.classList.remove('is-dragover');
    const file = e.dataTransfer.files?.[0];
    if (file) uwHandleFile(key, file);
  });

  // Replace / Remove butonları
  wrap.addEventListener('click', (e) => {
    if (e.target.matches('[data-uw-replace]')) input.click();
    if (e.target.matches('[data-uw-remove]')) uwClear(key);
  });

  // URL fallback input'u — manuel URL yazılırsa preview göster
  const urlInput = $(`#uw-${key}-url`);
  if (urlInput) {
    urlInput.addEventListener('input', () => {
      const val = urlInput.value.trim();
      if (val && /^https?:\/\//i.test(val)) {
        uwSetPreview(key, val);
      } else if (!val) {
        uwClear(key);
      }
    });
  }
};

// ---- Galeri widget'ı (çoklu) ----
const gwState = { items: [] }; // { url, uploading, error, tempId }
let gwTempCounter = 0;

const gwSyncJson = () => {
  const urls = gwState.items.filter(i => i.url && !i.error).map(i => i.url);
  $('#gw-json').value = JSON.stringify(urls);
};

const gwIsBusy = () => gwState.items.some(i => i.uploading);

const renderGallery = () => {
  const grid = $('#gw-grid');
  if (!grid) return;
  grid.innerHTML = gwState.items.map((it, idx) => {
    const cls = ['gw-item'];
    if (it.uploading) cls.push('is-uploading');
    const inner = it.error
      ? `<div class="gw-item-error">${escapeHtml(it.error)}</div>`
      : `<img src="${escapeHtml(it.url ? window.cldUrl(it.url, 'w_240,h_240,c_fill,q_auto,f_auto') : it.localUrl || '')}" alt="">`;
    return `
      <div class="${cls.join(' ')}" data-idx="${idx}" data-percent="${it.percent || 0}">
        ${inner}
        <button type="button" class="gw-item-remove" data-gw-remove="${idx}" title="Kaldır">×</button>
      </div>`;
  }).join('');

  $$('[data-gw-remove]', grid).forEach(b => {
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = Number(b.dataset.gwRemove);
      const it = gwState.items[idx];
      if (it?.localUrl) URL.revokeObjectURL(it.localUrl);
      gwState.items.splice(idx, 1);
      gwSyncJson();
      renderGallery();
    });
  });
  gwSyncJson();
};

const gwUploadOne = async (item) => {
  try {
    const optimized = await window.resizeImage(item.file);
    const result = await window.uploadToCloudinary(optimized, (p) => {
      item.percent = p;
      // Progress UI tek tek item için
      const node = $(`#gw-grid .gw-item[data-idx="${gwState.items.indexOf(item)}"]`);
      if (node) node.dataset.percent = p;
    });
    item.url = result.secure_url;
    item.uploading = false;
    item.file = null;
    if (item.localUrl) { URL.revokeObjectURL(item.localUrl); item.localUrl = null; }
    renderGallery();
  } catch (err) {
    console.error('Galeri görsel yükleme hatası:', err);
    item.uploading = false;
    item.error = err.message || 'Yükleme başarısız';
    if (item.localUrl) { URL.revokeObjectURL(item.localUrl); item.localUrl = null; }
    renderGallery();
  }
};

const gwAddFiles = (files) => {
  Array.from(files).forEach(file => {
    const v = isValidImage(file);
    if (!v.ok) {
      toast(v.msg, 'error');
      return;
    }
    const item = {
      tempId: ++gwTempCounter,
      file,
      localUrl: URL.createObjectURL(file),
      url: '',
      uploading: true,
      percent: 0,
      error: null
    };
    // Lokal preview için URL geçici olarak url gibi gösterilsin
    gwState.items.push(item);
    gwUploadOne(item);
  });
  renderGallery();
};

const gwClear = () => {
  gwState.items.forEach(it => { if (it.localUrl) URL.revokeObjectURL(it.localUrl); });
  gwState.items = [];
  $('#gw-json').value = '[]';
  renderGallery();
};

const gwLoad = (urls) => {
  gwClear();
  if (!Array.isArray(urls)) return;
  urls.forEach(url => {
    if (typeof url === 'string' && url) {
      gwState.items.push({ url, uploading: false, error: null, percent: 100 });
    }
  });
  renderGallery();
};

const initGalleryUpload = () => {
  const wrap = $('#gw');
  const input = $('#gw-input');
  const addBtn = $('#gw-add');

  addBtn.addEventListener('click', () => input.click());
  input.addEventListener('change', (e) => {
    if (e.target.files?.length) gwAddFiles(e.target.files);
    input.value = '';
  });

  // Drag-drop tüm widget'a
  wrap.addEventListener('dragover', (e) => {
    e.preventDefault();
    wrap.classList.add('is-dragover');
  });
  wrap.addEventListener('dragleave', (e) => {
    if (!wrap.contains(e.relatedTarget)) wrap.classList.remove('is-dragover');
  });
  wrap.addEventListener('drop', (e) => {
    e.preventDefault();
    wrap.classList.remove('is-dragover');
    if (e.dataTransfer.files?.length) gwAddFiles(e.dataTransfer.files);
  });
};

// ---- Çalışmalar çoklu galeri widget factory (cgw) ----
const makeGalleryWidget = (key, onChange) => {
  const state = { items: [] };
  let tempCounter = 0;

  const syncJson = () => {
    const urls = state.items.filter(i => i.url && !i.error).map(i => i.url);
    const el = $(`#cgw-${key}-json`);
    if (el) el.value = JSON.stringify(urls);
    if (typeof onChange === 'function') onChange();
  };

  const getUrls = () => state.items.filter(i => i.url && !i.error).map(i => i.url);

  const setUrls = (urls) => {
    state.items = (urls || []).map(url => ({ url, uploading: false, error: null }));
    render();
    syncJson();
  };

  const clear = () => { state.items = []; render(); syncJson(); };

  const isBusy = () => state.items.some(i => i.uploading);

  const render = () => {
    const grid = $(`#cgw-${key}-grid`);
    if (!grid) return;
    grid.innerHTML = state.items.map((it, idx) => {
      if (it.error) {
        return `<div class="cgw-item">
          <div class="cgw-item-error">${escapeHtml(it.error)}</div>
          <button type="button" class="cgw-item-remove" data-cgw-remove="${idx}">×</button>
        </div>`;
      }
      const src = it.url
        ? (window.cldUrl ? window.cldUrl(it.url, 'w_200,h_150,c_fill,q_auto,f_auto') : it.url)
        : (it.localUrl || '');
      const prog = it.uploading
        ? `<div class="cgw-item-progress">${it.percent || 0}%</div>`
        : '';
      const orderLabel = `<span class="cgw-drag-handle" title="Sıra: ${idx + 1}">${idx + 1}</span>`;
      return `<div class="cgw-item${it.uploading ? ' is-uploading' : ''}">
        <img src="${escapeHtml(src)}" alt="">
        ${prog}
        ${orderLabel}
        <button type="button" class="cgw-item-remove" data-cgw-remove="${idx}" title="Kaldır">×</button>
      </div>`;
    }).join('');

    $$('[data-cgw-remove]', grid).forEach(b => {
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = Number(b.dataset.cgwRemove);
        const it = state.items[idx];
        if (it?.localUrl) URL.revokeObjectURL(it.localUrl);
        state.items.splice(idx, 1);
        syncJson();
        render();
      });
    });
    syncJson();
  };

  const uploadOne = async (item) => {
    try {
      const optimized = await window.resizeImage(item.file);
      const result = await window.uploadToCloudinary(optimized, (p) => {
        item.percent = p;
        render();
      });
      item.url = result.secure_url;
      item.uploading = false;
      item.file = null;
      if (item.localUrl) { URL.revokeObjectURL(item.localUrl); item.localUrl = null; }
      render();
    } catch (err) {
      console.error('Galeri görsel yükleme hatası:', err);
      item.error = err.message || 'Yükleme başarısız';
      item.uploading = false;
      render();
    }
  };

  const addFiles = (files) => {
    const ALLOWED = /^image\/(jpeg|png|webp|heic|heif)$/i;
    Array.from(files).forEach(file => {
      if (!ALLOWED.test(file.type) && !/\.(heic|heif)$/i.test(file.name || '')) return;
      if (file.size > 10 * 1024 * 1024) {
        toast(`"${file.name}" 10 MB'ı aşıyor, atlandı`, 'warn');
        return;
      }
      const item = {
        url: '', uploading: true, error: null, percent: 0,
        file, localUrl: URL.createObjectURL(file), tempId: ++tempCounter
      };
      state.items.push(item);
      uploadOne(item);
    });
    render();
  };

  const init = () => {
    const drop  = $(`#cgw-${key}-drop`);
    const input = $(`#cgw-${key}-input`);
    if (!drop || !input) return;

    drop.addEventListener('click', () => input.click());
    input.addEventListener('change', (e) => {
      if (e.target.files?.length) addFiles(e.target.files);
      input.value = '';
    });
    drop.addEventListener('dragover', (e) => { e.preventDefault(); drop.classList.add('is-dragover'); });
    drop.addEventListener('dragleave', () => drop.classList.remove('is-dragover'));
    drop.addEventListener('drop', (e) => {
      e.preventDefault();
      drop.classList.remove('is-dragover');
      if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
    });
  };

  return { init, getUrls, setUrls, clear, isBusy };
};

const calismaGallery = makeGalleryWidget('calisma');
// Rota galeri — değişiklikte canlı önizlemeyi tetikler (scheduleRotaPreviewUpdate sonra tanımlı)
const rotaGallery = makeGalleryWidget('rota', () => scheduleRotaPreviewUpdate());

// ========================================
// VEFA — Firestore CRUD
// ========================================
const fetchVefa = async () => {
  await waitFirebase();
  const { db, collection, getDocs } = window.FB;
  const snap = await getDocs(collection(db, VEFA_COLLECTION));
  const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  console.log(`🕊️  ${items.length} vefa kaydı yüklendi`);
  return items;
};

const saveVefa = async (id, data) => {
  await waitFirebase();
  const { db, doc, setDoc, addDoc, collection, serverTimestamp } = window.FB;
  const payload = { ...data, guncellendi: serverTimestamp() };
  if (id) {
    await setDoc(doc(db, VEFA_COLLECTION, id), payload, { merge: true });
    return id;
  } else {
    payload.olusturuldu = serverTimestamp();
    const ref = await addDoc(collection(db, VEFA_COLLECTION), payload);
    return ref.id;
  }
};

const deleteVefa = async (id) => {
  await waitFirebase();
  const { db, doc, deleteDoc } = window.FB;
  await deleteDoc(doc(db, VEFA_COLLECTION, id));
};

// ========================================
// VEFA — render
// ========================================
const vefaInitials = (isim) => (isim || '').trim().split(/\s+/).map(n => n[0] || '').join('').slice(0,2).toUpperCase() || '·';

const vefaSorted = (list) => [...list].sort((a, b) => {
  const oa = Number.isFinite(a.oncelik) ? a.oncelik : 99;
  const ob = Number.isFinite(b.oncelik) ? b.oncelik : 99;
  if (oa !== ob) return oa - ob;
  return (a.isim || '').localeCompare(b.isim || '', 'tr');
});

const vefaForTab = () => vefaSorted(state.vefa.filter(v => v.tip === state.vefaTab));

const updateVefaCounts = () => {
  const tip = (t) => state.vefa.filter(v => v.tip === t).length;
  $('#vefa-count-baskan').textContent        = tip('baskan');
  $('#vefa-count-yonetim').textContent       = tip('yonetim');
  $('#vefa-count-gecmis-baskan').textContent = tip('gecmis-baskan');
};

const updateVefaButtonLabel = () => {
  const labels = {
    'baskan':         'Mevcut Başkan Ekle',
    'yonetim':        'Yönetim Kurulu Üyesi Ekle',
    'gecmis-baskan':  'Geçmiş Başkan Ekle'
  };
  $('#btn-yeni-vefa-label').textContent = labels[state.vefaTab] || 'Yeni Ekle';
};

const vefaCardHTML = (v) => {
  const thumbUrl = v.gorsel ? window.cldUrl(v.gorsel, 'w_240,h_300,c_fill,q_auto,f_auto') : '';
  const thumb = thumbUrl
    ? `<img src="${escapeHtml(thumbUrl)}" alt="" loading="lazy">`
    : vefaInitials(v.isim);

  const tipKisa = VEFA_TIP_KISA_BADGE[v.tip] || 'baskan';
  const tipBadge = `<span class="badge tip-${tipKisa}">${VEFA_TIP_IKON[v.tip] || ''} ${VEFA_TIP_AD[v.tip] || v.tip}</span>`;
  const yayinBadge = v.yayinda === false
    ? '<span class="badge draft">Gizli</span>'
    : '<span class="badge live">Yayında</span>';
  const oncelikBadge = `<span>· Sıra ${v.oncelik ?? 99}</span>`;

  return `
    <div class="vefa-card" data-id="${v.id}">
      <div class="vefa-card-thumb">${thumb}</div>
      <div class="vefa-card-body">
        <h3>${escapeHtml(v.isim || '(isimsiz)')}</h3>
        ${v.pozisyon ? `<div class="pozisyon">${escapeHtml(v.pozisyon)}</div>` : ''}
        <div class="vefa-card-meta">
          ${tipBadge}
          ${yayinBadge}
          ${v.donem ? `<span>· ${escapeHtml(v.donem)}</span>` : ''}
          ${oncelikBadge}
        </div>
      </div>
      <div class="vefa-card-actions">
        <button class="btn btn-ghost" data-vefa-act="edit" data-id="${v.id}">Düzenle</button>
        <button class="btn btn-danger" data-vefa-act="del" data-id="${v.id}">Sil</button>
      </div>
    </div>
  `;
};

const renderVefa = () => {
  // Tab UI
  $$('#vefa-tabs .sub-tab').forEach(t => t.classList.toggle('active', t.dataset.vefaTab === state.vefaTab));

  // Model panel ve önizleme sadece yönetim kurulu sekmesinde görünür
  const modelPanel = $('#yonetim-model-panel');
  if (modelPanel) modelPanel.style.display = state.vefaTab === 'yonetim' ? '' : 'none';
  updateYonetimPreview?.();

  updateVefaCounts();
  updateVefaButtonLabel();

  const cont = $('#vefa-list');
  const list = vefaForTab();

  // Mevcut Başkan'da 1'den fazla varsa uyarı (sadece bilgi amaçlı, eklemeyi engellemez)
  const baskanUyari = (state.vefaTab === 'baskan' && list.length > 1)
    ? `<div class="placeholder" style="margin-bottom:14px;padding:18px;text-align:left;border-style:solid;background:rgba(245,158,11,0.08);border-color:rgba(245,158,11,0.3);">
         <h3 style="color:#fbbf24;font-size:15px;font-family:inherit;">⚠️ ${list.length} mevcut başkan kaydı var</h3>
         <p style="color:var(--text-2);font-size:13px;">Sadece <strong>en küçük öncelik</strong> sayfada gösterilir. Eski başkanı "Geçmiş Başkanlar" sekmesine taşıyabilirsin.</p>
       </div>`
    : '';

  if (!list.length) {
    const bosMesaj = {
      'baskan':         { h: 'Henüz başkan eklenmemiş', p: 'Sağ üstten "Mevcut Başkan Ekle" butonuyla başlayabilirsin.' },
      'yonetim':        { h: 'Yönetim kurulu boş',       p: 'Yeni üye eklemek için sağ üstteki butonu kullan.' },
      'gecmis-baskan':  { h: 'Henüz geçmiş başkan yok',  p: 'Önceki dönemlerden başkanlar burada listelenir.' }
    }[state.vefaTab];
    cont.innerHTML = baskanUyari + `<div class="empty-state"><h3>${bosMesaj.h}</h3><p>${bosMesaj.p}</p></div>`;
    return;
  }

  cont.innerHTML = baskanUyari + list.map(vefaCardHTML).join('');
  bindVefaCardActions(cont);
};

const bindVefaCardActions = (root) => {
  $$('button[data-vefa-act]', root).forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const act = btn.dataset.vefaAct;
      if (act === 'edit') openVefaEdit(id);
      if (act === 'del')  confirmDeleteVefa(id);
    });
  });
};

// ========================================
// VEFA — Modal & Form
// ========================================
const vefaModal = {
  open()  { $('#modal-vefa').classList.add('open'); document.body.style.overflow = 'hidden'; },
  close() { $('#modal-vefa').classList.remove('open'); document.body.style.overflow = ''; }
};

const updateVefaFormForTip = (tip) => {
  // Pozisyon ipucu metni
  const hint = $('#vefa-pozisyon-hint');
  if (hint) {
    hint.textContent = {
      'baskan':         'Otomatik "Başkan" yazılır, istersen değiştir',
      'yonetim':        'Zorunlu — örn. Başkan Yardımcısı, Sayman, Üye',
      'gecmis-baskan':  'Otomatik "Başkan" yazılır'
    }[tip] || 'Opsiyonel';
  }
};

const openVefaNew = () => {
  state.vefaDuzenleId = null;
  const tip = state.vefaTab;
  const form = $('#form-vefa');
  form.reset();
  form.elements.id.value = '';
  form.elements.tip.value = tip;

  // Tipe göre varsayılanlar
  if (tip === 'baskan' || tip === 'gecmis-baskan') {
    form.elements.pozisyon.value = 'Başkan';
  }
  form.elements.oncelik.value = 10;
  if (form.elements.instagram_url) form.elements.instagram_url.value = '';
  if (form.elements.website_url)   form.elements.website_url.value = '';
  setToggle($('#t-vefa-yayin'), true);

  $('#modal-vefa-title').textContent = 'Yeni · ' + (VEFA_TIP_AD[tip] || 'Kayıt');
  $('#form-vefa-submit-btn').textContent = 'Yayınla';

  updateVefaFormForTip(tip);
  uwClear('vefa');
  vefaModal.open();
  initVefaPreview();
};

const openVefaEdit = (id) => {
  const v = state.vefa.find(x => x.id === id);
  if (!v) return;
  state.vefaDuzenleId = id;

  const form = $('#form-vefa');
  form.reset();
  form.elements.id.value = id;
  form.elements.tip.value = v.tip || 'baskan';
  form.elements.isim.value = v.isim || '';
  form.elements.pozisyon.value = v.pozisyon || '';
  form.elements.donem.value = v.donem || '';
  form.elements.biyografi.value = v.biyografi || '';
  form.elements.oncelik.value = Number.isFinite(v.oncelik) ? v.oncelik : 10;
  form.elements.gorsel.value = v.gorsel || '';
  if (form.elements.instagram_url) form.elements.instagram_url.value = v.instagram_url || '';
  if (form.elements.website_url)   form.elements.website_url.value = v.website_url || '';
  setToggle($('#t-vefa-yayin'), v.yayinda !== false);

  $('#modal-vefa-title').textContent = 'Düzenle · ' + (VEFA_TIP_AD[v.tip] || 'Kayıt');
  $('#form-vefa-submit-btn').textContent = 'Güncelle';

  updateVefaFormForTip(v.tip || 'baskan');

  if (v.gorsel) uwSetPreview('vefa', v.gorsel);
  else uwClear('vefa');

  vefaModal.open();
  initVefaPreview();
};

const submitVefaForm = async (e) => {
  e.preventDefault();
  const form = e.target;
  const fd = new FormData(form);
  const id = fd.get('id') || null;

  if (uwState.vefa.uploading) {
    toast('Görsel yüklemesi tamamlanmadı, lütfen bekle', 'error');
    return;
  }

  const tip = fd.get('tip') || 'baskan';
  const data = {
    tip,
    isim:      (fd.get('isim') || '').trim(),
    pozisyon:  (fd.get('pozisyon') || '').trim(),
    donem:     (fd.get('donem') || '').trim(),
    biyografi: (fd.get('biyografi') || '').trim(),
    gorsel:    (fd.get('gorsel') || '').trim(),
    oncelik:   parseInt(fd.get('oncelik'), 10) || 10,
    yayinda:   getToggle('#t-vefa-yayin')
  };
  if (!data.isim) {
    toast('İsim zorunlu', 'error');
    return;
  }
  if (tip === 'yonetim' && !data.pozisyon) {
    toast('Yönetim kurulu için pozisyon zorunlu', 'error');
    return;
  }

  const btn = $('#form-vefa-submit-btn');
  const original = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Kaydediliyor…';

  try {
    await saveVefa(id, data);
    toast(id ? 'Güncellendi' : 'Eklendi', 'success');
    vefaModal.close();
    await refreshVefa();
  } catch (err) {
    console.error(err);
    toast('Kayıt başarısız: ' + err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = original;
  }
};

const confirmDeleteVefa = async (id) => {
  const v = state.vefa.find(x => x.id === id);
  const isim = v?.isim || 'bu kayıt';
  if (!confirm(`"${isim}" silinecek. Bu işlem geri alınamaz. Emin misin?`)) return;
  try {
    await deleteVefa(id);
    toast('Silindi', 'success');
    await refreshVefa();
  } catch (err) {
    console.error(err);
    toast('Silme başarısız: ' + err.message, 'error');
  }
};

const refreshVefa = async () => {
  try {
    state.vefa = await fetchVefa();
    renderVefa();
  } catch (err) {
    console.error('Vefa veri çekme hatası:', err);
    toast('Vefa verileri yüklenemedi: ' + err.message, 'error');
  }
};

// ===== Yönetim Kurulu Model Ayarı =====
const onYonetimGrupFotoChange = (url) => {
  state.yonetimGrupFoto = url;
  const status = $('#yonetim-model-kaydet-status');
  if (status) status.textContent = 'Kaydedilmemiş değişiklik var';
  broadcastYonetimPreview();
};

const saveYonetimAyar = async (patch) => {
  await waitFirebase();
  const { db, doc, setDoc, serverTimestamp } = window.FB;
  await setDoc(doc(db, 'ayarlar', 'vefa'), { ...patch, guncellendi: serverTimestamp() }, { merge: true });
};

const loadYonetimAyar = async () => {
  await waitFirebase();
  const { db, doc, getDoc } = window.FB;
  const snap = await getDoc(doc(db, 'ayarlar', 'vefa'));
  return snap.exists() ? snap.data() : {};
};

const syncModelPanel = () => {
  const model = state.yonetimModel;
  $$('[name="yonetimModel"]').forEach(r => { r.checked = r.value === model; });
  const grupField = $('#yonetim-grup-foto-field');
  if (grupField) grupField.style.display = (model === 'B' || model === 'AB') ? '' : 'none';
  // Aktif seçeneği vurgula
  $$('.model-opt').forEach(el => {
    const radio = el.querySelector('input[name="yonetimModel"]');
    el.style.borderColor = radio?.checked ? 'var(--accent)' : 'var(--border)';
    el.style.background  = radio?.checked ? 'rgba(121,144,248,0.07)' : '';
  });
};

const initYonetimModelPanel = async () => {
  try {
    const ayar = await loadYonetimAyar();
    state.yonetimModel    = ayar.yonetimModel    || 'A';
    state.yonetimGrupFoto = ayar.yonetimGrupFoto || '';
    syncModelPanel();

    // Mevcut toplu fotoğraf varsa sadece UI'ı güncelle (Firestore'a tekrar yazma)
    if (state.yonetimGrupFoto) {
      const url = state.yonetimGrupFoto;
      uwState['yonetim-grup'].url = url;
      const imgEl = $(`#uw-yonetim-grup [data-uw-img]`);
      if (imgEl) imgEl.src = window.cldUrl ? window.cldUrl(url, 'w_800,q_auto,f_auto') : url;
      $(`#uw-yonetim-grup [data-uw-empty]`).hidden  = true;
      $(`#uw-yonetim-grup [data-uw-preview]`).hidden = false;
      $(`#uw-yonetim-grup [data-uw-progress]`).hidden = true;
    }
  } catch (e) {
    console.warn('Yönetim ayarları yüklenemedi:', e);
  }

  // Model radio değişimi — sadece UI senkronizasyonu, kayıt yok
  $$('[name="yonetimModel"]').forEach(radio => {
    radio.addEventListener('change', () => {
      state.yonetimModel = radio.value;
      syncModelPanel();
      updateYonetimPreview();
    });
  });

  // Toplu fotoğraf upload widget (callback uwSetPreview/uwClear üzerinden tetiklenir)
  initSingleUpload('yonetim-grup');

  // Kaydet butonu
  $('#btn-yonetim-model-kaydet')?.addEventListener('click', saveYonetimModelManual);

  // Önizleme
  initYonetimPreview();

  // İlk önizleme yükle
  updateYonetimPreview();
};

const saveYonetimModelManual = async () => {
  const btn = $('#btn-yonetim-model-kaydet');
  const status = $('#yonetim-model-kaydet-status');
  if (btn) { btn.disabled = true; btn.textContent = 'Kaydediliyor…'; }
  try {
    await saveYonetimAyar({
      yonetimModel: state.yonetimModel,
      yonetimGrupFoto: state.yonetimGrupFoto
    });
    toast('Yönetim kurulu ayarları kaydedildi', 'success');
    if (status) status.textContent = 'Kaydedildi ✓';
    setTimeout(() => { if (status) status.textContent = ''; }, 3000);
    broadcastYonetimPreview();
  } catch (e) {
    toast('Kayıt başarısız: ' + e.message, 'error');
    if (status) status.textContent = 'Hata!';
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Kaydet'; }
  }
};

const initYonetimPreview = () => {
  const iframe = $('#yonetim-preview-iframe');
  if (!iframe) return;
  iframe.addEventListener('load', () => {
    const status = $('#yonetim-preview-status');
    if (status) { status.textContent = 'Hazır'; status.className = 'preview-status is-ready'; }
    // iframe yüklenince veriyi gönder
    setTimeout(() => broadcastYonetimPreview(), 300);
  });
  $('#yonetim-preview-reload')?.addEventListener('click', () => {
    const status = $('#yonetim-preview-status');
    if (status) { status.textContent = 'Yükleniyor…'; status.className = 'preview-status'; }
    iframe.src = 'vefa.html?preview=admin&_t=' + Date.now() + '#yonetim-kurulu';
  });
};

const updateYonetimPreview = () => {
  const wrap = $('#yonetim-preview-wrap');
  const iframe = $('#yonetim-preview-iframe');
  if (!wrap || !iframe) return;
  // Önizleme paneli sadece yönetim sekmesinde görünür
  if (state.vefaTab !== 'yonetim') { wrap.style.display = 'none'; return; }
  wrap.style.display = '';
  if (!iframe.src || iframe.src === 'about:blank' || iframe.src === window.location.href) {
    const status = $('#yonetim-preview-status');
    if (status) { status.textContent = 'Yükleniyor…'; status.className = 'preview-status'; }
    iframe.src = 'vefa.html?preview=admin&_t=' + Date.now() + '#yonetim-kurulu';
  } else {
    broadcastYonetimPreview();
  }
};

const broadcastYonetimPreview = () => {
  const iframe = $('#yonetim-preview-iframe');
  if (!iframe?.contentWindow) return;
  try {
    iframe.contentWindow.postMessage({
      type: 'vefa-preview',
      vefa: state.vefa,
      focusId: null,
      ayarlar: { yonetimModel: state.yonetimModel, yonetimGrupFoto: state.yonetimGrupFoto }
    }, '*');
  } catch (e) { console.warn('Yönetim önizleme postMessage başarısız:', e); }
};

// ----- Vefa canlı önizleme (iframe + postMessage) -----
const collectVefaFormDraft = () => {
  const form = $('#form-vefa');
  if (!form) return null;
  const fd = new FormData(form);
  const tip = fd.get('tip') || state.vefaTab || 'baskan';
  const draft = {
    id:        fd.get('id') || state.vefaDuzenleId || '__draft',
    tip,
    isim:      (fd.get('isim') || '').trim(),
    pozisyon:  (fd.get('pozisyon') || '').trim(),
    donem:     (fd.get('donem') || '').trim(),
    biyografi: (fd.get('biyografi') || '').trim(),
    gorsel:    (fd.get('gorsel') || uwState.vefa?.url || '').trim(),
    oncelik:   parseInt(fd.get('oncelik'), 10) || 10,
    yayinda:   getToggle('#t-vefa-yayin')
  };
  if (tip === 'paydas') {
    draft.instagram_url = (fd.get('instagram_url') || '').trim();
    draft.website_url   = (fd.get('website_url') || '').trim();
  }
  return draft;
};

const broadcastVefaPreview = () => {
  const iframe = $('#vefa-preview-iframe');
  if (!iframe?.contentWindow || !state.vefaPreviewReady) return;

  let list = state.vefa.map(v => ({ ...v }));
  const draft = state.vefaDraft;
  if (state.vefaDuzenleId && draft) {
    list = list.map(v => v.id === state.vefaDuzenleId ? { ...v, ...draft } : v);
  } else if (draft) {
    list.push({ ...draft, id: '__draft' });
  }

  try {
    iframe.contentWindow.postMessage({
      type: 'vefa-preview',
      vefa: list,
      focusId: null,
      ayarlar: { yonetimModel: state.yonetimModel, yonetimGrupFoto: state.yonetimGrupFoto }
    }, '*');
  } catch (e) {
    console.warn('Vefa postMessage başarısız:', e);
  }
};

let vefaPreviewTimer = null;
const scheduleVefaPreviewUpdate = () => {
  state.vefaDraft = collectVefaFormDraft();
  clearTimeout(vefaPreviewTimer);
  vefaPreviewTimer = setTimeout(broadcastVefaPreview, 250);
};

const initVefaPreview = () => {
  const iframe = $('#vefa-preview-iframe');
  const status = $('#vefa-preview-status');
  if (!iframe) return;

  state.vefaDraft = collectVefaFormDraft();

  if (!iframe.src || !iframe.src.includes('preview=admin')) {
    state.vefaPreviewReady = false;
    if (status) { status.textContent = 'Yükleniyor…'; status.className = 'preview-status'; }
    iframe.src = VEFA_PREVIEW_URL_WITH_HASH;
  } else {
    state.vefaPreviewReady = true;
    if (status) { status.textContent = 'Bağlı · Canlı'; status.className = 'preview-status is-ready'; }
    broadcastVefaPreview();
  }
};

const handleVefaPreviewMessage = (e) => {
  if (e.data?.type !== 'vefa-preview-ready') return;
  state.vefaPreviewReady = true;
  const status = $('#vefa-preview-status');
  if (status) { status.textContent = 'Bağlı · Canlı'; status.classList.add('is-ready'); }
  broadcastVefaPreview();
};

// ========================================
// BAĞIŞ — Firestore CRUD
// ========================================
const fetchBagislar = async () => {
  await waitFirebase();
  const { db, collection, getDocs } = window.FB;
  const snap = await getDocs(collection(db, BAGIS_COLLECTION));
  const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  items.sort((a, b) => {
    const ta = a.olusturuldu?.toDate?.()?.getTime() || 0;
    const tb = b.olusturuldu?.toDate?.()?.getTime() || 0;
    return tb - ta;
  });
  console.log(`💰 ${items.length} bağış yüklendi`);
  return items;
};

const fetchAyarlarOrman = async () => {
  await waitFirebase();
  const { db, doc, getDoc } = window.FB;
  const ref = doc(db, AYARLAR_COLLECTION, AYARLAR_DOC_ORMAN);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const data = snap.data();
    return {
      ...DEFAULT_AYARLAR_ORMAN,
      ...data,
      metinler: { ...DEFAULT_AYARLAR_ORMAN.metinler, ...(data.metinler || {}) }
    };
  }
  return { ...DEFAULT_AYARLAR_ORMAN };
};

const saveAyarlarOrman = async (patch) => {
  await waitFirebase();
  const { db, doc, setDoc, serverTimestamp } = window.FB;
  await setDoc(
    doc(db, AYARLAR_COLLECTION, AYARLAR_DOC_ORMAN),
    { ...patch, guncellendi: serverTimestamp() },
    { merge: true }
  );
};

// ════════════════════════════════════════
// SITE GENELİ AYARLAR (ayarlar/site) — Ayarlar sekmesi
// ════════════════════════════════════════
const fetchAyarlarSite = async () => {
  await waitFirebase();
  const { db, doc, getDoc } = window.FB;
  const snap = await getDoc(doc(db, AYARLAR_COLLECTION, AYARLAR_SITE_DOC));
  return snap.exists() ? { ...DEFAULT_AYARLAR_SITE, ...snap.data() } : { ...DEFAULT_AYARLAR_SITE };
};

const saveAyarlarSite = async (patch) => {
  await waitFirebase();
  const { db, doc, setDoc, serverTimestamp } = window.FB;
  await setDoc(
    doc(db, AYARLAR_COLLECTION, AYARLAR_SITE_DOC),
    { ...patch, guncellendi: serverTimestamp() },
    { merge: true }
  );
};

let _ayarlarSiteLoaded = false;
const renderAyarlarSite = async () => {
  if (_ayarlarSiteLoaded) return;          // bir kez yükle — kullanıcının girdisini ezme (yarış durumu fix)
  const form = $('#form-ayarlar-site');
  const fields = form ? Array.from(form.querySelectorAll('input, textarea, button')) : [];
  const status = $('#ayar-site-status');
  const setVal = (id, v) => { const el = $('#' + id); if (el) el.value = v || ''; };
  // Yüklenirken formu kilitle ki async dolum kullanıcının yazdığını ezmesin
  fields.forEach(el => { el.disabled = true; });
  if (status) { status.textContent = 'Yükleniyor…'; status.className = 'status-msg'; }
  try {
    const a = await fetchAyarlarSite();
    setVal('ayar-site-marka',    a.marka);
    setVal('ayar-site-slogan',   a.slogan);
    setVal('ayar-site-telefon',  a.telefon);
    setVal('ayar-site-eposta',   a.eposta);
    setVal('ayar-site-ig',       a.ig);
    setVal('ayar-site-ig-kiz',   a.igKiz);
    setVal('ayar-site-ig-bilek', a.igBilek);
    setVal('ayar-site-ig-rota',  a.igRota);
    setVal('ayar-site-youtube',  a.youtube);
    _ayarlarSiteLoaded = true;
    if (status) { status.textContent = ''; status.className = 'status-msg'; }
  } catch (err) {
    console.warn('Site ayarları yüklenemedi:', err);
    if (status) { status.textContent = 'Ayarlar yüklenemedi — sayfayı yenileyin.'; status.className = 'status-msg err'; }
  } finally {
    fields.forEach(el => { el.disabled = false; });
  }
};

const handleSaveAyarlarSite = async (e) => {
  e.preventDefault();
  const status = $('#ayar-site-status');
  const btn = $('#btn-ayar-site-kaydet');
  const val = (id) => ($('#' + id)?.value || '').trim();
  const patch = {
    marka:   val('ayar-site-marka'),
    slogan:  val('ayar-site-slogan'),
    telefon: val('ayar-site-telefon'),
    eposta:  val('ayar-site-eposta'),
    ig:      val('ayar-site-ig'),
    igKiz:   val('ayar-site-ig-kiz'),
    igBilek: val('ayar-site-ig-bilek'),
    igRota:  val('ayar-site-ig-rota'),
    youtube: val('ayar-site-youtube')
  };
  btn.disabled = true;
  if (status) { status.textContent = 'Kaydediliyor…'; status.className = 'status-msg'; }
  try {
    await saveAyarlarSite(patch);
    if (status) { status.textContent = '✓ Kaydedildi'; status.className = 'status-msg ok'; }
    toast('Ayarlar kaydedildi', 'success');
  } catch (err) {
    console.error('Ayar kaydı hatası:', err);
    if (status) { status.textContent = 'Hata: ' + err.message; status.className = 'status-msg err'; }
    toast('Kayıt başarısız: ' + err.message, 'error');
  } finally {
    btn.disabled = false;
  }
};

const handleChangePassword = async (e) => {
  e.preventDefault();
  const status = $('#ayar-sifre-status');
  const btn = $('#btn-ayar-sifre');
  const setStatus = (msg, cls) => { if (status) { status.textContent = msg; status.className = 'status-msg ' + (cls || ''); } };
  const cur   = $('#ayar-sifre-mevcut')?.value || '';
  const yeni  = $('#ayar-sifre-yeni')?.value || '';
  const yeni2 = $('#ayar-sifre-yeni2')?.value || '';
  if (!cur || !yeni) return setStatus('Mevcut ve yeni şifre zorunlu.', 'err');
  if (yeni.length < 6) return setStatus('Yeni şifre en az 6 karakter olmalı.', 'err');
  if (yeni !== yeni2)  return setStatus('Yeni şifreler eşleşmiyor.', 'err');
  btn.disabled = true; setStatus('Değiştiriliyor…', '');
  try {
    await waitFirebase();
    const { auth, EmailAuthProvider, reauthenticateWithCredential, updatePassword } = window.FB;
    const user = auth.currentUser;
    if (!user) throw new Error('Oturum bulunamadı, tekrar giriş yap.');
    const cred = EmailAuthProvider.credential(user.email, cur);
    await reauthenticateWithCredential(user, cred);
    await updatePassword(user, yeni);
    setStatus('✓ Şifre değiştirildi', 'ok');
    toast('Şifre değiştirildi', 'success');
    $('#form-sifre')?.reset();
  } catch (err) {
    console.error('Şifre değiştirme hatası:', err);
    const map = {
      'auth/wrong-password':       'Mevcut şifre yanlış.',
      'auth/invalid-credential':   'Mevcut şifre yanlış.',
      'auth/weak-password':        'Yeni şifre çok zayıf (en az 6 karakter).',
      'auth/requires-recent-login':'Güvenlik için tekrar giriş yapman gerekiyor.',
      'auth/too-many-requests':    'Çok fazla deneme. Biraz bekle.'
    };
    setStatus(map[err.code] || ('Hata: ' + err.message), 'err');
  } finally {
    btn.disabled = false;
  }
};

// Atomic increment için Firestore FieldValue (window.FB'de yok — manuel)
const fbIncrement = async (docPath, fields) => {
  // fields: { fidanFiyati: -3, ... } → her field'ı increment uygulanır
  await waitFirebase();
  const { db, doc, getDoc, setDoc, serverTimestamp } = window.FB;
  const ref = doc(db, ...docPath.split('/'));
  const cur = (await getDoc(ref)).data() || {};
  const patch = { guncellendi: serverTimestamp() };
  Object.entries(fields).forEach(([k, delta]) => {
    patch[k] = (Number(cur[k]) || 0) + delta;
  });
  await setDoc(ref, patch, { merge: true });
};

const setBagisDurum = async (id, durum, extra = {}) => {
  await waitFirebase();
  const { db, doc, updateDoc, serverTimestamp } = window.FB;
  await updateDoc(doc(db, BAGIS_COLLECTION, id), {
    durum,
    ...extra,
    durumGuncellendi: serverTimestamp()
  });
};

const deleteBagis = async (id) => {
  await waitFirebase();
  const { db, doc, deleteDoc } = window.FB;
  await deleteDoc(doc(db, BAGIS_COLLECTION, id));
};

// ========================================
// BAĞIŞ — render
// ========================================
const fillTpl = (str, fiyat) => String(str || '').replaceAll('{fiyat}', String(fiyat));

const formatTL = (n) => new Intl.NumberFormat('tr-TR').format(n || 0) + ' TL';

const KANAL_AD = { akced: 'AKÇED', iban: 'IBAN' };

const bagisFidan = (b) => {
  // Bağışın o anki fiyatına göre hesaplanmış fidan sayısı
  const f = b.fidanFiyatiSnapshot || state.ayarlar.fidanFiyati || 150;
  if (!b.miktar || b.miktar < f) return 0;
  return Math.floor(b.miktar / f);
};

const setText = (sel, val) => { const el = $(sel); if (el) el.textContent = val; };

const updateBagisCounts = () => {
  const tip = (s) => (state.bagis || []).filter(b => b.durum === s).length;
  setText('#bagis-count-bekleyen', tip('bekleyen'));
  setText('#bagis-count-onayli', tip('onayli'));
  setText('#bagis-count-reddedilen', tip('reddedilen'));
  setText('#bagis-count-calismalar', (state.calismalar || []).length);
};

const updateBagisSummary = () => {
  const list = state.bagis || [];
  const onayli = list.filter(b => b.durum === 'onayli');
  const tutar = onayli.reduce((s, b) => s + (Number(b.miktar) || 0), 0);
  const a = state.ayarlar || DEFAULT_AYARLAR_ORMAN;
  const toplamFidan = (a.baselineFidan || 0) + (a.toplamFidan || 0);
  setText('#bagis-stat-bekleyen', list.filter(b => b.durum === 'bekleyen').length);
  setText('#bagis-stat-onayli', onayli.length);
  setText('#bagis-stat-fidan', toplamFidan);
  setText('#bagis-stat-tutar', formatTL(tutar));
};

const filteredBagis = () => {
  let list = state.bagis.filter(b => b.durum === state.bagisTab);
  if (state.bagisKanal !== 'all') list = list.filter(b => b.kanal === state.bagisKanal);
  if (state.bagisArama) {
    const q = state.bagisArama.toLowerCase().trim();
    list = list.filter(b =>
      (b.ad || '').toLowerCase().includes(q) ||
      (b.tel || '').toLowerCase().includes(q) ||
      (b.referansNo || '').toLowerCase().includes(q) ||
      (b.niyet || '').toLowerCase().includes(q)
    );
  }
  return list;
};

const bagisCardHTML = (b) => {
  const fidan = bagisFidan(b);
  const f = b.fidanFiyatiSnapshot || state.ayarlar.fidanFiyati || 150;
  const isFidan = (b.miktar || 0) >= f;
  const fidanBadge = isFidan
    ? `<span class="bagis-badge fidan">🌱 ${fidan} fidan</span>`
    : `<span class="bagis-badge kumbara">🪙 Kumbara/Masraf</span>`;
  const kanalBadge = `<span class="bagis-badge kanal-${b.kanal || 'iban'}">${b.kanal === 'akced' ? '🌳 AKÇED' : '🏦 IBAN'}</span>`;
  const durumBadge = b.durum === 'onayli'
    ? `<span class="bagis-badge onayli">✓ Onaylı</span>`
    : b.durum === 'reddedilen'
      ? `<span class="bagis-badge reddedilen">✕ Reddedilen</span>`
      : `<span class="bagis-badge bekleyen">⏳ Bekliyor</span>`;
  const tarih = formatDateTime(b.olusturuldu);
  const dekontUrl = b.dekontUrl || '';
  const thumbUrl = dekontUrl ? (window.cldUrl ? window.cldUrl(dekontUrl, 'w_184,h_184,c_fill,q_auto,f_auto') : dekontUrl) : '';
  const thumbHtml = thumbUrl
    ? `<img src="${escapeHtml(thumbUrl)}" alt="Dekont">`
    : `<span class="bagis-card-thumb-placeholder">📄</span>`;

  // Aksiyon butonları durum'a göre
  let actions = '';
  if (b.durum === 'bekleyen') {
    actions = `
      <button class="btn btn-success" data-bagis-act="onayla" data-id="${b.id}">✓ Onayla</button>
      <button class="btn btn-warn" data-bagis-act="reddet" data-id="${b.id}">✕ Reddet</button>
      <button class="btn btn-ghost" data-bagis-act="sil" data-id="${b.id}">🗑 Sil</button>
    `;
  } else if (b.durum === 'onayli') {
    actions = `
      <button class="btn btn-warn" data-bagis-act="geri" data-id="${b.id}" title="Onayı geri al, bekleyene döner">↩ Geri Al</button>
      <button class="btn btn-danger" data-bagis-act="sil" data-id="${b.id}">🗑 Sil</button>
    `;
  } else if (b.durum === 'reddedilen') {
    actions = `
      <button class="btn btn-success" data-bagis-act="onayla" data-id="${b.id}">✓ Onayla</button>
      <button class="btn btn-danger" data-bagis-act="sil" data-id="${b.id}">🗑 Sil</button>
    `;
  }

  const niyetHtml = b.niyet ? `<div class="bagis-card-niyet">"${escapeHtml(b.niyet)}"</div>` : '';
  const redSebebi = b.redSebebi ? `<div class="bagis-card-niyet" style="border-left-color:#e88080;color:#e88080;">Red sebebi: ${escapeHtml(b.redSebebi)}</div>` : '';

  return `
    <div class="bagis-card" data-id="${b.id}">
      <div class="bagis-card-thumb" data-bagis-act="dekont" data-id="${b.id}">
        ${thumbHtml}
      </div>
      <div class="bagis-card-body">
        <div class="bagis-card-name">
          ${escapeHtml(b.ad || '(isimsiz)')}
          ${kanalBadge}
          ${fidanBadge}
          ${durumBadge}
        </div>
        <div class="bagis-card-meta">
          <span class="meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg> <strong>${escapeHtml(b.tel || '—')}</strong></span>
          <span class="meta-item">💰 <strong>${formatTL(b.miktar)}</strong></span>
          <span class="meta-item">📋 Ref: <strong>${escapeHtml(b.referansNo || '—')}</strong></span>
          <span class="meta-item">🕒 ${tarih}</span>
        </div>
        ${niyetHtml}
        ${redSebebi}
      </div>
      <div class="bagis-card-actions">
        ${actions}
      </div>
    </div>
  `;
};

const renderBagisListe = () => {
  const cont = $('#bagis-list');
  if (!cont) return;
  const list = filteredBagis();
  if (!list.length) {
    const empty = state.bagisTab === 'bekleyen'
      ? 'Bekleyen bağış yok — şu an onay bekleyen bildirim bulunmuyor.'
      : state.bagisTab === 'onayli'
        ? 'Henüz onaylı bağış yok.'
        : 'Reddedilen bağış yok.';
    cont.innerHTML = `<div class="empty-state"><h3>Liste boş</h3><p>${empty}</p></div>`;
    return;
  }
  cont.innerHTML = list.map(bagisCardHTML).join('');
  bindBagisCardActions(cont);
};

const renderBagisAyarlar = () => {
  const a = state.ayarlar;
  $('#ayar-fidanFiyati').value = a.fidanFiyati ?? 150;
  $('#ayar-hedef').value = a.hedef ?? 1000;
  $('#ayar-baselineFidan').value = a.baselineFidan ?? 0;
  $('#ayar-baselineKisi').value = a.baselineKisi ?? 0;
  $('#ayar-ibanNo').value = (a.metinler?.ibanNo) || DEFAULT_AYARLAR_ORMAN.metinler.ibanNo;
  $('#ayar-masrafKullanim').value = (a.metinler?.masrafKullanim) || DEFAULT_AYARLAR_ORMAN.metinler.masrafKullanim;
  $('#ayar-genelKullanim').value  = (a.metinler?.genelKullanim)  || DEFAULT_AYARLAR_ORMAN.metinler.genelKullanim;
  $('#ayar-status').textContent = '';
};

const renderBagis = () => {
  // Section yoksa (DOM henüz hazır değil) sessizce çık
  if (!$('#section-orman')) return;

  const tab = state.bagisTab;
  const isAyarlar    = tab === 'ayarlar';
  const isCalismalar = tab === 'calismalar';
  const isListe      = !isAyarlar && !isCalismalar;

  const tb  = $('#bagis-toolbar');     if (tb)  tb.style.display = isListe ? '' : 'none';
  const lst = $('#bagis-list');        if (lst) lst.style.display = isListe ? '' : 'none';
  const set = $('#bagis-settings');    if (set) set.hidden = !isAyarlar;
  const cw  = $('#calismalar-wrap');   if (cw)  cw.hidden = !isCalismalar;

  $$('#bagis-tabs .sub-tab').forEach(t => t.classList.toggle('active', t.dataset.bagisTab === tab));
  $$('#bagis-kanal-chips .chip').forEach(c => c.classList.toggle('active', c.dataset.bagisKanal === state.bagisKanal));

  try { updateBagisCounts(); }   catch (e) { console.warn('updateBagisCounts:', e); }
  try { updateBagisSummary(); }  catch (e) { console.warn('updateBagisSummary:', e); }
  try {
    if (isAyarlar) renderBagisAyarlar();
    else if (isCalismalar) renderCalismalar();
    else renderBagisListe();
  } catch (e) {
    console.error('Bağış render hatası:', e);
    if (lst) lst.innerHTML = `<div class="empty-state"><h3>Yüklenemedi</h3><p>${escapeHtml(e?.message || 'Bilinmeyen hata')}</p></div>`;
  }
};

const bindBagisCardActions = (root) => {
  $$('[data-bagis-act]', root).forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = el.dataset.id;
      const act = el.dataset.bagisAct;
      if (act === 'dekont')   showDekontModal(id);
      if (act === 'onayla')   onaylaBagis(id);
      if (act === 'reddet')   openRedModal(id);
      if (act === 'geri')     geriAlBagis(id);
      if (act === 'sil')      confirmSilBagis(id);
    });
  });
};

// ----- Bağış aksiyonları -----
const onaylaBagis = async (id) => {
  const b = state.bagis.find(x => x.id === id);
  if (!b) return;
  if (!confirm(`${b.ad} adına ${formatTL(b.miktar)} bağış onaylanacak. Onaylamak istediğine emin misin?`)) return;

  try {
    const wasApproved = b.durum === 'onayli';
    const fidanArtisi = bagisFidan(b);
    const isFromRejected = b.durum === 'reddedilen';

    await setBagisDurum(id, 'onayli', { onayTarihi: new Date().toISOString().slice(0,10), redSebebi: '' });

    // Sayaç increment — sadece daha önce onaylı değilse artır
    if (!wasApproved) {
      await fbIncrement(`${AYARLAR_COLLECTION}/${AYARLAR_DOC_ORMAN}`, {
        toplamFidan: fidanArtisi,
        toplamKisi: 1
      });
    }

    toast(`${b.ad}: bağış onaylandı (${fidanArtisi} fidan eklendi)`, 'success');
    await refreshBagis();
  } catch (err) {
    console.error('Onay hatası:', err);
    toast('Onaylanamadı: ' + err.message, 'error');
  }
};

const openRedModal = (id) => {
  state.bagisRedId = id;
  const b = state.bagis.find(x => x.id === id);
  $('#bagis-red-isim').textContent = b?.ad || '—';
  $('#bagis-red-form').reset();
  $('#modal-bagis-red').classList.add('open');
};
const closeRedModal = () => {
  state.bagisRedId = null;
  $('#modal-bagis-red').classList.remove('open');
};
const submitRedForm = async (e) => {
  e.preventDefault();
  const id = state.bagisRedId;
  if (!id) return;
  const sebep = (new FormData(e.target).get('redSebebi') || '').toString().trim();
  if (!sebep) return;
  const b = state.bagis.find(x => x.id === id);
  if (!b) return;

  try {
    const wasApproved = b.durum === 'onayli';
    const eskiFidan = bagisFidan(b);

    await setBagisDurum(id, 'reddedilen', { redSebebi: sebep });

    // Daha önce onaylıysa sayaçtan düş
    if (wasApproved) {
      await fbIncrement(`${AYARLAR_COLLECTION}/${AYARLAR_DOC_ORMAN}`, {
        toplamFidan: -eskiFidan,
        toplamKisi: -1
      });
    }

    closeRedModal();
    toast(`${b.ad}: bağış reddedildi`, 'success');
    await refreshBagis();
  } catch (err) {
    console.error('Red hatası:', err);
    toast('İşlem başarısız: ' + err.message, 'error');
  }
};

const geriAlBagis = async (id) => {
  const b = state.bagis.find(x => x.id === id);
  if (!b) return;
  if (!confirm(`${b.ad} bağışının onayı geri alınacak ve sayaçtan düşülecek. Devam?`)) return;

  try {
    const eskiFidan = bagisFidan(b);
    await setBagisDurum(id, 'bekleyen', { onayTarihi: '' });
    await fbIncrement(`${AYARLAR_COLLECTION}/${AYARLAR_DOC_ORMAN}`, {
      toplamFidan: -eskiFidan,
      toplamKisi: -1
    });
    toast(`${b.ad}: onay geri alındı`, 'success');
    await refreshBagis();
  } catch (err) {
    console.error('Geri alma hatası:', err);
    toast('İşlem başarısız: ' + err.message, 'error');
  }
};

const confirmSilBagis = async (id) => {
  const b = state.bagis.find(x => x.id === id);
  if (!b) return;
  if (!confirm(`${b.ad} bağışı tamamen silinecek (geri alınamaz). Emin misin?`)) return;

  try {
    const wasApproved = b.durum === 'onayli';
    const eskiFidan = bagisFidan(b);
    await deleteBagis(id);
    if (wasApproved) {
      await fbIncrement(`${AYARLAR_COLLECTION}/${AYARLAR_DOC_ORMAN}`, {
        toplamFidan: -eskiFidan,
        toplamKisi: -1
      });
    }
    toast('Bağış silindi', 'success');
    await refreshBagis();
  } catch (err) {
    console.error('Silme hatası:', err);
    toast('Silinemedi: ' + err.message, 'error');
  }
};

// ----- Dekont preview modal -----
const showDekontModal = (id) => {
  const b = state.bagis.find(x => x.id === id);
  if (!b || !b.dekontUrl) {
    toast('Bu bildirim için dekont yok', 'error');
    return;
  }
  $('#bagis-dekont-baslik').textContent = `Dekont — ${b.ad}`;
  const big = window.cldUrl ? window.cldUrl(b.dekontUrl, 'w_1600,q_auto,f_auto') : b.dekontUrl;
  $('#bagis-dekont-img').src = big;
  $('#bagis-dekont-aboslute').href = b.dekontUrl;
  $('#modal-bagis-dekont').classList.add('open');
};
const closeDekontModal = () => $('#modal-bagis-dekont').classList.remove('open');

// ----- Ayarlar form submit -----
const submitAyarlarForm = async (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  const fidanFiyati = parseInt(f.get('fidanFiyati') || '0', 10);
  if (!fidanFiyati || fidanFiyati < 1) {
    $('#ayar-status').textContent = 'Fidan fiyatı geçerli olmalı';
    $('#ayar-status').className = 'ayar-status error';
    return;
  }
  const patch = {
    fidanFiyati,
    hedef: parseInt(f.get('hedef') || '1000', 10),
    baselineFidan: parseInt(f.get('baselineFidan') || '0', 10),
    baselineKisi: parseInt(f.get('baselineKisi') || '0', 10),
    metinler: {
      ...(state.ayarlar.metinler || {}),
      ibanNo: (f.get('ibanNo') || '').toString().trim(),
      masrafKullanim: (f.get('masrafKullanim') || '').toString(),
      genelKullanim: (f.get('genelKullanim') || '').toString()
    }
  };
  $('#ayar-status').textContent = 'Kaydediliyor...';
  $('#ayar-status').className = 'ayar-status';
  try {
    await saveAyarlarOrman(patch);
    state.ayarlar = { ...state.ayarlar, ...patch, metinler: { ...(state.ayarlar.metinler || {}), ...patch.metinler } };
    $('#ayar-status').textContent = '✓ Kaydedildi';
    $('#ayar-status').className = 'ayar-status success';
    toast('Ayarlar güncellendi', 'success');
    updateBagisSummary();
  } catch (err) {
    console.error('Ayar kaydetme hatası:', err);
    $('#ayar-status').textContent = 'Hata: ' + err.message;
    $('#ayar-status').className = 'ayar-status error';
  }
};

const refreshBagis = async () => {
  try {
    const [bagisList, ay] = await Promise.all([fetchBagislar(), fetchAyarlarOrman()]);
    state.bagis = bagisList;
    state.ayarlar = ay;
    renderBagis();
  } catch (err) {
    console.error('Bağış refresh hatası:', err);
    toast('Bağışlar yüklenemedi: ' + err.message, 'error');
  }
};

// ========================================
// ÇALIŞMALAR — Firestore CRUD
// ========================================
const fetchCalismalar = async () => {
  await waitFirebase();
  const { db, collection, getDocs } = window.FB;
  const snap = await getDocs(collection(db, CALISMA_COLLECTION));
  const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  console.log(`🌳 ${items.length} çalışma kaydı yüklendi`);
  return items;
};

const saveCalisma = async (id, data) => {
  await waitFirebase();
  const { db, doc, setDoc, addDoc, collection, serverTimestamp } = window.FB;
  const payload = { ...data, guncellendi: serverTimestamp() };
  if (id) {
    await setDoc(doc(db, CALISMA_COLLECTION, id), payload, { merge: true });
    return id;
  } else {
    payload.olusturuldu = serverTimestamp();
    const ref = await addDoc(collection(db, CALISMA_COLLECTION), payload);
    return ref.id;
  }
};

const deleteCalisma = async (id) => {
  await waitFirebase();
  const { db, doc, deleteDoc } = window.FB;
  await deleteDoc(doc(db, CALISMA_COLLECTION, id));
};

const refreshCalismalar = async () => {
  try {
    state.calismalar = await fetchCalismalar();
    renderBagis();
  } catch (err) {
    console.error('Çalışmalar refresh hatası:', err);
    toast('Çalışmalar yüklenemedi: ' + err.message, 'error');
  }
};

// ----- Sıralama -----
const calismaSorted = (list) => [...list].sort((a, b) => {
  const oa = Number.isFinite(a.oncelik) ? a.oncelik : 99;
  const ob = Number.isFinite(b.oncelik) ? b.oncelik : 99;
  if (oa !== ob) return oa - ob;
  // Aynı önceliklerde: olusturuldu DESC
  const ta = a.olusturuldu?.toDate?.()?.getTime() || 0;
  const tb = b.olusturuldu?.toDate?.()?.getTime() || 0;
  return tb - ta;
});

// ----- Render -----
const calismaCardHTML = (c) => {
  const kapakUrl = c.kapak ? (window.cldUrl ? window.cldUrl(c.kapak, 'w_240,h_160,c_fill,q_auto,f_auto') : c.kapak) : '';
  const thumb = kapakUrl
    ? `<img src="${escapeHtml(kapakUrl)}" alt="${escapeHtml(c.baslik || '')}">`
    : `<div class="calisma-card-thumb-empty">🌳</div>`;
  const videoBadge = c.video
    ? `<span class="calisma-card-thumb-video"><svg viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"/></svg> Video</span>`
    : '';
  const tarih = c.tarih ? `<span class="calisma-card-tarih">${escapeHtml(c.tarih)}</span><br>` : '';
  const meta = c.meta ? `<div class="calisma-card-meta">${escapeHtml(c.meta)}</div>` : '';
  const yayinBadge = c.yayinda !== false
    ? `<span class="calisma-card-badge on">✓ Yayında</span>`
    : `<span class="calisma-card-badge off">⊘ Taslak</span>`;
  const boyutBadge = c.boyut === 'wide' ? `<span class="calisma-card-badge wide">↔ Geniş</span>` : '';
  const oncBadge = `<span class="calisma-card-badge">#${Number.isFinite(c.oncelik) ? c.oncelik : 99}</span>`;
  return `
    <div class="calisma-card" data-id="${c.id}">
      <div class="calisma-card-thumb">${thumb}${videoBadge}</div>
      <div class="calisma-card-body">
        ${tarih}
        <div class="calisma-card-title">${escapeHtml(c.baslik || '(Başlıksız)')}</div>
        ${meta}
        <div class="calisma-card-badges">
          ${yayinBadge}
          ${boyutBadge}
          ${oncBadge}
        </div>
      </div>
      <div class="calisma-card-actions">
        <button class="btn btn-ghost" data-calisma-act="duzenle" data-id="${c.id}">✎ Düzenle</button>
        <button class="btn btn-ghost" data-calisma-act="yayin" data-id="${c.id}">${c.yayinda !== false ? '⊘ Taslağa al' : '✓ Yayına al'}</button>
        <button class="btn btn-danger" data-calisma-act="sil" data-id="${c.id}">🗑 Sil</button>
      </div>
    </div>
  `;
};

const renderCalismalar = () => {
  const cont = $('#calismalar-list');
  if (!cont) return;
  const list = calismaSorted(state.calismalar || []);
  if (!list.length) {
    cont.innerHTML = `
      <div class="empty-state">
        <h3>Henüz çalışma yok</h3>
        <p>"Yeni Çalışma" ile galeriye ilk anıyı ekle.</p>
      </div>`;
    return;
  }
  cont.innerHTML = list.map(calismaCardHTML).join('');
  bindCalismaCardActions(cont);
};

const bindCalismaCardActions = (root) => {
  $$('[data-calisma-act]', root).forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = el.dataset.id;
      const act = el.dataset.calismaAct;
      if (act === 'duzenle') openCalismaEdit(id);
      if (act === 'yayin')   toggleCalismaYayin(id);
      if (act === 'sil')     confirmDeleteCalisma(id);
    });
  });
};

// ----- Modal & form -----
const calismaModal = {
  open()  { $('#modal-calisma').classList.add('open'); document.body.style.overflow = 'hidden'; },
  close() { $('#modal-calisma').classList.remove('open'); document.body.style.overflow = ''; }
};

const openCalismaNew = () => {
  state.calismaDuzenleId = null;
  const form = $('#form-calisma');
  form.reset();
  form.elements.id.value = '';
  form.elements.oncelik.value = 10;
  form.elements.boyut.value = 'normal';
  setToggle($('#t-calisma-yayin'), true);
  $('#modal-calisma-title').textContent = 'Yeni Çalışma';
  $('#form-calisma-submit-btn').textContent = 'Yayınla';
  uwClear('calisma');
  calismaGallery.clear();
  vwClear('calisma');
  calismaModal.open();
};

const openCalismaEdit = (id) => {
  const c = (state.calismalar || []).find(x => x.id === id);
  if (!c) return;
  state.calismaDuzenleId = id;
  const form = $('#form-calisma');
  form.reset();
  form.elements.id.value = id;
  form.elements.baslik.value = c.baslik || '';
  form.elements.tarih.value = c.tarih || '';
  form.elements.meta.value = c.meta || '';
  form.elements.kapak.value = c.kapak || '';
  form.elements.video.value = c.video || '';
  form.elements.boyut.value = c.boyut === 'wide' ? 'wide' : 'normal';
  form.elements.oncelik.value = Number.isFinite(c.oncelik) ? c.oncelik : 10;
  setToggle($('#t-calisma-yayin'), c.yayinda !== false);
  $('#modal-calisma-title').textContent = 'Düzenle · ' + (c.baslik || 'Çalışma');
  $('#form-calisma-submit-btn').textContent = 'Güncelle';

  if (c.kapak) uwSetPreview('calisma', c.kapak); else uwClear('calisma');
  calismaGallery.setUrls(Array.isArray(c.galeri) ? c.galeri : []);
  if (c.video) vwSetPreview('calisma', c.video); else vwClear('calisma');

  calismaModal.open();
};

const submitCalismaForm = async (e) => {
  e.preventDefault();
  const form = e.target;
  const fd = new FormData(form);
  const id = fd.get('id') || null;

  if (uwState.calisma?.uploading) {
    toast('Kapak görseli yüklemesi tamamlanmadı, lütfen bekle', 'error');
    return;
  }
  if (vwState.calisma?.uploading) {
    toast('Video yüklemesi tamamlanmadı, lütfen bekle', 'error');
    return;
  }
  if (calismaGallery.isBusy()) {
    toast('Galeri fotoğrafları yüklemesi tamamlanmadı, lütfen bekle', 'error');
    return;
  }

  const data = {
    baslik:  (fd.get('baslik') || '').trim(),
    tarih:   (fd.get('tarih') || '').trim(),
    meta:    (fd.get('meta') || '').trim(),
    kapak:   (fd.get('kapak') || '').trim(),
    video:   (fd.get('video') || '').trim(),
    galeri:  JSON.parse(fd.get('galeri') || '[]'),
    boyut:   fd.get('boyut') === 'wide' ? 'wide' : 'normal',
    oncelik: parseInt(fd.get('oncelik'), 10) || 10,
    yayinda: getToggle('#t-calisma-yayin')
  };

  if (!data.baslik) { toast('Başlık zorunlu', 'error'); return; }
  if (!data.kapak)  { toast('Kapak görseli zorunlu', 'error'); return; }

  const btn = $('#form-calisma-submit-btn');
  const original = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Kaydediliyor…';

  try {
    await saveCalisma(id, data);
    toast(id ? 'Çalışma güncellendi' : 'Çalışma eklendi', 'success');
    calismaModal.close();
    await refreshCalismalar();
  } catch (err) {
    console.error(err);
    toast('Kayıt başarısız: ' + err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = original;
  }
};

const toggleCalismaYayin = async (id) => {
  const c = (state.calismalar || []).find(x => x.id === id);
  if (!c) return;
  try {
    await saveCalisma(id, { yayinda: c.yayinda === false });
    toast(c.yayinda === false ? 'Yayına alındı' : 'Taslağa alındı', 'success');
    await refreshCalismalar();
  } catch (err) {
    toast('İşlem başarısız: ' + err.message, 'error');
  }
};

const confirmDeleteCalisma = async (id) => {
  const c = (state.calismalar || []).find(x => x.id === id);
  if (!confirm(`"${c?.baslik || 'Çalışma'}" silinecek. Bu işlem geri alınamaz. Emin misin?`)) return;
  try {
    await deleteCalisma(id);
    toast('Silindi', 'success');
    await refreshCalismalar();
  } catch (err) {
    toast('Silme başarısız: ' + err.message, 'error');
  }
};

// ========================================
// VIDEO UPLOAD WIDGET (vw) — Cloudinary video
// ========================================
const vwState = {}; // { calisma: { uploading } }
const MAX_VIDEO_BYTES = 200 * 1024 * 1024; // 200 MB

const vwEl = (key, name) => $(`#vw-${key} [data-vw-${name}]`);
const vwShowProgress = (key, p) => {
  vwEl(key, 'progress').hidden = false;
  vwEl(key, 'fill').style.width = p + '%';
  vwEl(key, 'percent').textContent = p + '%';
};
const vwHideProgress = (key) => { vwEl(key, 'progress').hidden = true; };
const vwShowError = (key, msg) => {
  const el = vwEl(key, 'error');
  el.textContent = msg;
  el.hidden = false;
};
const vwHideError = (key) => { vwEl(key, 'error').hidden = true; };

const vwSetPreview = (key, url) => {
  vwHideError(key);
  const video = vwEl(key, 'video');
  if (video) video.src = window.cldVideo ? window.cldVideo(url, 'q_auto:eco,f_auto,w_640') : url;
  const empty = vwEl(key, 'empty'); if (empty) empty.hidden = true;
  const prev  = vwEl(key, 'preview'); if (prev) prev.hidden = false;
  vwHideProgress(key);
  vwState[key] = vwState[key] || {};
  vwState[key].url = url;
  const hidden = $(`#vw-${key}-url`);
  if (hidden) hidden.value = url;
};

const vwClear = (key) => {
  const video = vwEl(key, 'video');
  if (video) { video.removeAttribute('src'); video.load?.(); }
  const prev  = vwEl(key, 'preview'); if (prev) prev.hidden = true;
  const empty = vwEl(key, 'empty');  if (empty) empty.hidden = false;
  vwHideProgress(key);
  vwHideError(key);
  if (vwState[key]) { vwState[key].url = ''; vwState[key].uploading = false; }
  const hidden = $(`#vw-${key}-url`);
  if (hidden) hidden.value = '';
};

const vwHandleFile = async (key, file) => {
  vwHideError(key);

  if (!file.type.startsWith('video/')) {
    vwShowError(key, 'Geçersiz dosya — yalnızca video kabul edilir.');
    return;
  }
  if (file.size > MAX_VIDEO_BYTES) {
    const mb = (file.size / 1024 / 1024).toFixed(1);
    vwShowError(key, `Video çok büyük (${mb} MB). Max 60 MB. Daha kısa veya düşük çözünürlüklü bir video yükleyin.`);
    return;
  }

  vwState[key] = vwState[key] || {};
  vwState[key].uploading = true;
  $(`#vw-${key}`).classList.add('is-busy');

  vwEl(key, 'empty').hidden = true;
  vwEl(key, 'preview').hidden = false;
  // Lokal preview için object URL
  const localUrl = URL.createObjectURL(file);
  vwEl(key, 'video').src = localUrl;
  vwShowProgress(key, 0);

  try {
    const result = await window.uploadVideoToCloudinary(file, (p) => vwShowProgress(key, p));
    URL.revokeObjectURL(localUrl);
    vwSetPreview(key, result.secure_url);
    vwState[key].uploading = false;
  } catch (err) {
    console.error('Video yüklenemedi:', err);
    URL.revokeObjectURL(localUrl);
    vwClear(key);
    let userMsg = err.message || 'Yükleme başarısız oldu.';
    if (/preset|resource_type|video/i.test(userMsg)) {
      userMsg += ' (Cloudinary preset\'i video kabul etmiyor olabilir — dashboard\'dan "Resource type: Auto" yap.)';
    }
    vwShowError(key, userMsg);
    vwState[key].uploading = false;
  }
};

const initVideoUpload = (key) => {
  const wrap = $(`#vw-${key}`);
  const input = $(`#vw-${key}-input`);
  const empty = vwEl(key, 'empty');

  empty.addEventListener('click', () => input.click());
  input.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (file) vwHandleFile(key, file);
    input.value = '';
  });

  wrap.addEventListener('dragover', (e) => {
    e.preventDefault();
    wrap.classList.add('is-dragover');
  });
  wrap.addEventListener('dragleave', (e) => {
    if (e.target === wrap) wrap.classList.remove('is-dragover');
  });
  wrap.addEventListener('drop', (e) => {
    e.preventDefault();
    wrap.classList.remove('is-dragover');
    const file = e.dataTransfer.files?.[0];
    if (file) vwHandleFile(key, file);
  });

  wrap.addEventListener('click', (e) => {
    if (e.target.matches('[data-vw-replace]')) input.click();
    if (e.target.matches('[data-vw-remove]')) vwClear(key);
  });
};

// ========================================
// ÇOKLU VİDEO WİDGET (mvw)
// ========================================
const mvwState = {}; // { kiz: [{url, uploading}], erkek: [...] }

const mvwGetList = (key) => mvwState[key] || (mvwState[key] = []);

const mvwRender = (key, onChangeCb) => {
  const listEl = $(`#mvw-${key}-list`);
  if (!listEl) return;
  const items = mvwGetList(key);

  listEl.innerHTML = items.map((item, i) => {
    const poster = item.url && window.cldVideoPoster ? window.cldVideoPoster(item.url, 'w_320,h_180,c_fill,q_auto,f_jpg') : '';
    const thumb = poster
      ? `<div style="width:80px;height:52px;flex-shrink:0;border-radius:5px;background:#111 url('${poster}') center/cover no-repeat;"></div>`
      : `<div style="width:80px;height:52px;flex-shrink:0;border-radius:5px;background:#222;display:flex;align-items:center;justify-content:center;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" opacity=".4"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg></div>`;
    return `
      <div class="mvw-item" data-mvw-idx="${i}" draggable="${item.uploading ? 'false' : 'true'}">
        <div class="mvw-item-bar" style="gap:10px;">
          <span class="mvw-drag-handle" title="Sürükle">⠿</span>
          ${thumb}
          <span class="mvw-item-label">Video ${i + 1}${item.uploading ? ' — yükleniyor…' : ''}</span>
          ${item.uploading
            ? `<span style="font-size:12px;color:var(--accent);flex-shrink:0" data-mvw-pct-${i}>0%</span>`
            : `<button type="button" class="btn-tiny btn-tiny-danger" data-mvw-remove="${i}" style="flex-shrink:0">Kaldır</button>`
          }
        </div>
      </div>`;
  }).join('');

  // Kaldır butonları
  listEl.querySelectorAll('[data-mvw-remove]').forEach(btn => {
    btn.addEventListener('click', () => {
      mvwGetList(key).splice(parseInt(btn.dataset.mvwRemove, 10), 1);
      mvwRender(key, onChangeCb);
      if (onChangeCb) onChangeCb();
    });
  });

  // Drag-to-reorder
  let dragIdx = null;
  listEl.querySelectorAll('.mvw-item[draggable="true"]').forEach(el => {
    el.addEventListener('dragstart', () => {
      dragIdx = parseInt(el.dataset.mvwIdx, 10);
      el.style.opacity = '.4';
    });
    el.addEventListener('dragend', () => { el.style.opacity = ''; });
    el.addEventListener('dragover', (e) => { e.preventDefault(); el.style.outline = '2px dashed var(--accent)'; });
    el.addEventListener('dragleave', () => { el.style.outline = ''; });
    el.addEventListener('drop', (e) => {
      e.preventDefault();
      el.style.outline = '';
      const dropIdx = parseInt(el.dataset.mvwIdx, 10);
      if (dragIdx === null || dragIdx === dropIdx) return;
      const list = mvwGetList(key);
      const [moved] = list.splice(dragIdx, 1);
      list.splice(dropIdx, 0, moved);
      mvwRender(key, onChangeCb);
      if (onChangeCb) onChangeCb();
    });
  });
};

const mvwAdd = async (key, file, onChangeCb) => {
  const errEl = $(`#mvw-${key}-error`);
  if (errEl) errEl.hidden = true;

  if (!file.type.startsWith('video/')) {
    if (errEl) { errEl.textContent = 'Geçersiz dosya — yalnızca video kabul edilir.'; errEl.hidden = false; }
    return;
  }
  if (file.size > MAX_VIDEO_BYTES) {
    const mb = (file.size / 1024 / 1024).toFixed(0);
    if (errEl) { errEl.textContent = `Video çok büyük (${mb} MB). Cloudinary max 200 MB kabul eder.`; errEl.hidden = false; }
    return;
  }

  const idx = mvwGetList(key).length;
  mvwGetList(key).push({ url: '', uploading: true });
  mvwRender(key, onChangeCb);

  try {
    const result = await window.uploadVideoToCloudinary(file, (p) => {
      const pctEl = $(`[data-mvw-pct-${idx}]`);
      if (pctEl) pctEl.textContent = p + '%';
    });
    mvwGetList(key)[idx] = { url: result.secure_url, uploading: false };
  } catch (err) {
    mvwGetList(key).splice(idx, 1);
    if (errEl) { errEl.textContent = err.message || 'Yükleme başarısız.'; errEl.hidden = false; }
  }
  mvwRender(key, onChangeCb);
  if (onChangeCb) onChangeCb();
};

const mvwInit = (key, onChangeCb) => {
  const btn = $(`#mvw-${key}-btn`);
  const input = $(`#mvw-${key}-input`);
  if (!btn || !input) return;
  btn.addEventListener('click', () => input.click());
  input.addEventListener('change', (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach(f => mvwAdd(key, f, onChangeCb));
    input.value = '';
  });
};

const mvwSetUrls = (key, urls, onChangeCb) => {
  mvwState[key] = (urls || []).filter(Boolean).map(url => ({ url, uploading: false }));
  mvwRender(key, onChangeCb);
};

const mvwGetUrls = (key) => mvwGetList(key).filter(i => i.url && !i.uploading).map(i => i.url);
const mvwIsUploading = (key) => mvwGetList(key).some(i => i.uploading);
const mvwClear = (key, onChangeCb) => { mvwState[key] = []; mvwRender(key, onChangeCb); };

// ========================================
// REFRESH
// ========================================
const refresh = async () => {
  // Her fetch'i bağımsız çalıştır — biri fail olursa diğerleri yine render olsun
  const results = await Promise.allSettled([
    fetchAll(),
    fetchMessages(),
    fetchVefa(),
    fetchBagislar(),
    fetchAyarlarOrman(),
    fetchCalismalar(),
    fetchKizProjeler(),
    fetchKizSayfa(),
    fetchErkekProjeler(),
    fetchErkekSayfa(),
    fetchDalgicSayfa(),
    fetchBilekSayfa()
  ]);

  const [icerikRes, msgRes, vefaRes, bagisRes, ayarRes, calismaRes, kizRes, kizSayfaRes, erkekRes, erkekSayfaRes, dalgicRes, bilekRes] = results;

  if (icerikRes.status === 'fulfilled') {
    state.tumu = icerikRes.value;
  } else {
    console.error('İçerik çekilemedi:', icerikRes.reason);
    toast('İçerik yüklenemedi: ' + (icerikRes.reason?.message || 'bilinmeyen hata'), 'error');
    state.tumu = [];
  }

  if (msgRes.status === 'fulfilled') {
    state.mesajlar = msgRes.value;
  } else {
    console.error('Mesajlar çekilemedi:', msgRes.reason);
    state.mesajlar = [];
  }

  if (vefaRes.status === 'fulfilled') {
    state.vefa = vefaRes.value;
  } else {
    console.error('Vefa çekilemedi:', vefaRes.reason);
    toast('Vefa yüklenemedi: ' + (vefaRes.reason?.message || 'kuralı kontrol et'), 'error');
    state.vefa = [];
  }

  if (bagisRes.status === 'fulfilled') {
    state.bagis = bagisRes.value;
  } else {
    console.error('Bağış çekilemedi:', bagisRes.reason);
    state.bagis = [];
  }

  if (ayarRes.status === 'fulfilled') {
    state.ayarlar = ayarRes.value;
  } else {
    console.error('Ayarlar çekilemedi:', ayarRes.reason);
    state.ayarlar = { ...DEFAULT_AYARLAR_ORMAN };
  }

  if (calismaRes.status === 'fulfilled') {
    state.calismalar = calismaRes.value;
  } else {
    console.error('Çalışmalar çekilemedi:', calismaRes.reason);
    state.calismalar = [];
  }

  if (kizRes.status === 'fulfilled') {
    state.kizProjeler = kizRes.value;
  } else {
    console.error('Kız projeleri çekilemedi:', kizRes.reason);
    state.kizProjeler = [];
  }

  if (kizSayfaRes.status === 'fulfilled') {
    state.kizSayfaData = kizSayfaRes.value;
  } else {
    console.error('Kız sayfa görselleri çekilemedi:', kizSayfaRes.reason);
    state.kizSayfaData = {};
  }

  if (erkekRes.status === 'fulfilled') {
    state.erkekProjeler = erkekRes.value;
  } else {
    console.error('Erkek projeleri çekilemedi:', erkekRes.reason);
    state.erkekProjeler = [];
  }

  if (erkekSayfaRes.status === 'fulfilled') {
    state.erkekSayfaData = erkekSayfaRes.value;
  } else {
    console.error('Erkek sayfa görselleri çekilemedi:', erkekSayfaRes.reason);
    state.erkekSayfaData = {};
  }

  if (dalgicRes.status === 'fulfilled') {
    state.dalgicGaleri = normalizeDalgicGaleri(dalgicRes.value?.galeri);
  } else {
    console.error('Dalgıçlık galerisi çekilemedi:', dalgicRes.reason);
    state.dalgicGaleri = [];
  }

  if (bilekRes.status === 'fulfilled') {
    state.bilekSayfaData = bilekRes.value;
  } else {
    console.error('Bilek Güreşi sayfası çekilemedi:', bilekRes.reason);
    state.bilekSayfaData = {};
  }

  // Render her durumda — boş bile olsa loading spinner'ı temizler
  try { renderDashboard(); } catch (e) { console.error('Dashboard render hatası:', e); }
  try { renderIcerik();    } catch (e) { console.error('İçerik render hatası:', e); }
  try { renderMessages();  } catch (e) { console.error('Mesaj render hatası:', e); }
  try { updateMsgBadge();  } catch (e) { console.error('Badge hatası:', e); }
  try { renderVefa();      } catch (e) { console.error('Vefa render hatası:', e); }
  try { renderBagis();     } catch (e) { console.error('Bağış render hatası:', e); }
  try { renderKiz();       } catch (e) { console.error('Kız render hatası:', e); }
};

// ========================================
// AUTH
// ========================================
const showAuthError = (msg) => {
  const el = $('#auth-error');
  el.textContent = msg;
  el.classList.add('show');
};
const clearAuthError = () => {
  const el = $('#auth-error');
  el.textContent = '';
  el.classList.remove('show');
};

const friendlyAuthError = (code) => {
  const map = {
    'auth/invalid-email': 'Geçersiz e-posta adresi.',
    'auth/user-disabled': 'Bu kullanıcı devre dışı bırakılmış.',
    'auth/user-not-found': 'Bu e-postaya kayıtlı kullanıcı yok.',
    'auth/wrong-password': 'Parola hatalı.',
    'auth/invalid-credential': 'E-posta veya parola hatalı.',
    'auth/too-many-requests': 'Çok fazla başarısız deneme. Bir süre bekle.',
    'auth/network-request-failed': 'Ağ hatası. İnternet bağlantını kontrol et.'
  };
  return map[code] || 'Giriş başarısız. Tekrar dene.';
};

const handleLogin = async (e) => {
  e.preventDefault();
  clearAuthError();
  const email = $('#auth-email').value.trim();
  const password = $('#auth-password').value;
  const btn = $('#auth-submit');
  btn.disabled = true;
  btn.textContent = 'Giriş yapılıyor…';
  try {
    await waitFirebase();
    const { auth, signInWithEmailAndPassword } = window.FB;
    await signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged tetiklenecek, oradan paneli açacak
  } catch (err) {
    console.error('Login hatası:', err);
    showAuthError(friendlyAuthError(err.code));
  } finally {
    btn.disabled = false;
    btn.textContent = 'Giriş Yap';
  }
};

// Açık (kullanıcı kaynaklı) çıkışı, Firebase'in geçici null durumlarından ayırır.
let isLoggingOut = false;

const handleLogout = async () => {
  if (!confirm('Çıkış yapmak istediğine emin misin?')) return;
  try {
    isLoggingOut = true;
    const { auth, signOut } = window.FB;
    await signOut(auth);
    // onAuthStateChanged tetiklenecek, login ekranına dönecek
  } catch (err) {
    console.error('Logout hatası:', err);
    toast('Çıkış başarısız: ' + err.message, 'error');
  }
};

const showAuthGate = () => {
  const gate = $('#auth-gate');
  gate.classList.remove('hidden');
  gate.classList.remove('checking'); // oturum yok → giriş formunu göster
  $('.layout').style.display = 'none';
  $('#auth-password').value = '';
};

const hideAuthGate = (user) => {
  const gate = $('#auth-gate');
  gate.classList.add('hidden');
  gate.classList.remove('checking');
  $('.layout').style.display = '';
  $('#user-email').textContent = user.email || '—';
};

// ========================================
// KIZ SAYFASI — Projeler CRUD + canlı önizleme
// ========================================
const fetchKizProjeler = async () => {
  await waitFirebase();
  const { db, collection, getDocs } = window.FB;
  const snap = await getDocs(collection(db, KIZ_COLLECTION));
  const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  console.log(`🌸 ${items.length} kız projesi yüklendi`);
  return items;
};

const saveKizProje = async (id, data) => {
  await waitFirebase();
  const { db, doc, setDoc, addDoc, collection, serverTimestamp } = window.FB;
  const payload = { ...data, guncellendi: serverTimestamp() };
  if (id) {
    await setDoc(doc(db, KIZ_COLLECTION, id), payload, { merge: true });
    return id;
  } else {
    payload.olusturuldu = serverTimestamp();
    const ref = await addDoc(collection(db, KIZ_COLLECTION), payload);
    return ref.id;
  }
};

const deleteKizProje = async (id) => {
  await waitFirebase();
  const { db, doc, deleteDoc } = window.FB;
  await deleteDoc(doc(db, KIZ_COLLECTION, id));
};

const refreshKiz = async () => {
  try {
    state.kizProjeler = await fetchKizProjeler();
    renderKiz();
    broadcastKizPreview();
  } catch (err) {
    console.error('Kız veri çekme hatası:', err);
    toast('Kız projeleri yüklenemedi: ' + err.message, 'error');
  }
};

// ── Kız Sayfa Görselleri (sayfalar/kiz) ──
const fetchKizSayfa = async () => {
  await waitFirebase();
  const { db, doc, getDoc } = window.FB;
  const snap = await getDoc(doc(db, SAYFALAR_COLL, KIZ_SAYFA_DOC));
  return snap.exists() ? snap.data() : {};
};

const saveKizSayfaData = async (fields) => {
  await waitFirebase();
  const { db, doc, setDoc, serverTimestamp } = window.FB;
  await setDoc(doc(db, SAYFALAR_COLL, KIZ_SAYFA_DOC), { ...fields, guncellendi: serverTimestamp() }, { merge: true });
};

const renderKizSayfa = () => {
  const data = state.kizSayfaData || {};
  KIZ_GORSEL_SLOTS.forEach(({ field, key }) => {
    const url = data[field];
    if (url) {
      uwSetPreview(key, url);
    } else {
      uwClear(key);
    }
  });
};

// ----- Render -----
const kizSorted = (list) => [...list].sort((a, b) => {
  const sa = Number.isFinite(a.sira) ? a.sira : 999;
  const sb = Number.isFinite(b.sira) ? b.sira : 999;
  if (sa !== sb) return sa - sb;
  return (a.baslik || '').localeCompare(b.baslik || '', 'tr');
});

const kizForTab = () => kizSorted(state.kizProjeler.filter(p => (p.kategori || 'merkez') === state.kizTab));

const updateKizCounts = () => {
  const c = (k) => state.kizProjeler.filter(p => (p.kategori || 'merkez') === k).length;
  const m = $('#kiz-count-merkez'), y = $('#kiz-count-yerel');
  if (m) m.textContent = c('merkez');
  if (y) y.textContent = c('yerel');
};

const kizCardHTML = (p) => {
  const thumbInner = p.gorsel
    ? `<img src="${escapeHtml(window.cldUrl ? window.cldUrl(p.gorsel, 'w_180,h_220,c_fill,q_auto,f_auto') : p.gorsel)}" alt="" loading="lazy">`
    : `<span class="kiz-card-thumb-no">${escapeHtml(p.no || '·')}</span>`;
  const katBadge = (p.kategori === 'yerel')
    ? '<span class="badge kiz-yerel">📍 Yerel</span>'
    : '<span class="badge kiz-merkez">⭐ Merkez</span>';
  const yayinBadge = p.yayinda === false
    ? '<span class="badge draft">Gizli</span>'
    : '<span class="badge live">Yayında</span>';
  return `
    <div class="kiz-card" data-id="${p.id}">
      <div class="kiz-card-thumb">${thumbInner}</div>
      <div class="kiz-card-body">
        <h3>${escapeHtml(p.baslik || '(başlıksız)')}</h3>
        <p class="teaser">${escapeHtml(p.teaser || '')}</p>
        <div class="kiz-card-meta">
          ${katBadge}
          ${yayinBadge}
          <span>· Sıra ${p.sira ?? 99}</span>
          ${p.no ? `<span>· No ${escapeHtml(p.no)}</span>` : ''}
          <span>· ${(p.bolumler || []).length} bölüm</span>
        </div>
      </div>
      <div class="kiz-card-actions">
        <button class="btn btn-ghost" data-kiz-act="edit" data-id="${p.id}">Düzenle</button>
        <button class="btn btn-danger" data-kiz-act="del" data-id="${p.id}">Sil</button>
      </div>
    </div>
  `;
};

const renderKiz = () => {
  $$('#kiz-tabs .sub-tab').forEach(t => t.classList.toggle('active', t.dataset.kizTab === state.kizTab));
  updateKizCounts();

  // Görseller sekmesi
  const isGorsel = state.kizTab === 'gorsel';
  const panel = $('#kiz-sayfa-panel');
  const listEl = $('#kiz-list');
  const yeniBtn = $('#btn-yeni-kiz-proje');
  const seedBtn = $('#btn-kiz-seed');

  if (panel) panel.style.display = isGorsel ? '' : 'none';
  if (listEl) listEl.style.display = isGorsel ? 'none' : '';
  if (yeniBtn) yeniBtn.style.display = isGorsel ? 'none' : '';
  if (seedBtn) {
    seedBtn.hidden = isGorsel || state.kizProjeler.length > 0;
  }

  const labelBtn = $('#btn-yeni-kiz-proje-label');
  if (labelBtn) labelBtn.textContent = state.kizTab === 'yerel' ? 'Yeni Yerel Proje' : 'Yeni Merkez Projesi';

  if (isGorsel) {
    renderKizSayfa();
    initKizSayfaPreview();
    return;
  }

  const cont = listEl;
  if (!cont) return;
  const list = kizForTab();

  if (!list.length) {
    const mesaj = state.kizTab === 'merkez'
      ? { h: 'Merkez projeleri boş', p: 'Sağ üstten "Yeni Merkez Projesi" ile başla, ya da mevcut 6 projeyi içe aktar.' }
      : { h: 'Yerel proje yok', p: 'Sağ üstten "Yeni Yerel Proje" butonu ile ilk Dinamik Çalışması kartını ekle.' };
    cont.innerHTML = `<div class="empty-state"><h3>${mesaj.h}</h3><p>${mesaj.p}</p></div>`;
    return;
  }

  cont.innerHTML = list.map(kizCardHTML).join('');
  $$('button[data-kiz-act]', cont).forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const act = btn.dataset.kizAct;
      if (act === 'edit') openKizEdit(id);
      if (act === 'del')  confirmDeleteKiz(id);
    });
  });
};

// ----- Bölüm editörü -----
const kizBolumHTML = (b, idx, total) => {
  const tipBadge = b.tip === 'intro'
    ? '<span class="kiz-bolum-type intro">İntro · italik</span>'
    : '<span class="kiz-bolum-type p">Paragraf</span>';
  return `
    <div class="kiz-bolum" data-bolum-idx="${idx}">
      <div class="kiz-bolum-head">
        ${tipBadge}
        <div class="kiz-bolum-actions">
          <button type="button" data-bolum-toggle="${idx}" title="Tipi değiştir">${b.tip === 'intro' ? '→ P' : '→ İntro'}</button>
          <button type="button" data-bolum-up="${idx}" ${idx === 0 ? 'disabled' : ''} title="Yukarı taşı">↑</button>
          <button type="button" data-bolum-down="${idx}" ${idx === total - 1 ? 'disabled' : ''} title="Aşağı taşı">↓</button>
          <button type="button" class="danger" data-bolum-remove="${idx}" title="Bölümü sil">×</button>
        </div>
      </div>
      <textarea data-bolum-text="${idx}" placeholder="${b.tip === 'intro' ? 'İtalik giriş metni…' : 'Paragraf metni… (**kelime** ile kalın)'}">${escapeHtml(b.text || '')}</textarea>
    </div>
  `;
};

const renderKizBolumler = () => {
  const cont = $('#kiz-bolumler-list');
  if (!cont) return;
  const total = state.kizBolumler.length;
  if (!total) {
    cont.innerHTML = `<div class="empty-state" style="padding:24px 18px;"><p style="margin:0;">Henüz bölüm yok. Aşağıdan ekle.</p></div>`;
    return;
  }
  cont.innerHTML = state.kizBolumler.map((b, i) => kizBolumHTML(b, i, total)).join('');

  // Textarea binding (input event)
  $$('textarea[data-bolum-text]', cont).forEach(ta => {
    ta.addEventListener('input', () => {
      const idx = parseInt(ta.dataset.bolumText, 10);
      if (state.kizBolumler[idx]) state.kizBolumler[idx].text = ta.value;
      schedulePreviewUpdate();
    });
  });

  // Action buttons
  $$('button[data-bolum-toggle], button[data-bolum-up], button[data-bolum-down], button[data-bolum-remove]', cont).forEach(b => {
    b.addEventListener('click', () => {
      const idx = parseInt(b.dataset.bolumToggle ?? b.dataset.bolumUp ?? b.dataset.bolumDown ?? b.dataset.bolumRemove, 10);
      if (b.dataset.bolumToggle != null) {
        state.kizBolumler[idx].tip = state.kizBolumler[idx].tip === 'intro' ? 'p' : 'intro';
      } else if (b.dataset.bolumUp != null && idx > 0) {
        [state.kizBolumler[idx-1], state.kizBolumler[idx]] = [state.kizBolumler[idx], state.kizBolumler[idx-1]];
      } else if (b.dataset.bolumDown != null && idx < state.kizBolumler.length - 1) {
        [state.kizBolumler[idx+1], state.kizBolumler[idx]] = [state.kizBolumler[idx], state.kizBolumler[idx+1]];
      } else if (b.dataset.bolumRemove != null) {
        state.kizBolumler.splice(idx, 1);
      }
      renderKizBolumler();
      schedulePreviewUpdate();
    });
  });
};

const addKizBolum = (tip) => {
  state.kizBolumler.push({ tip: tip === 'intro' ? 'intro' : 'p', text: '' });
  renderKizBolumler();
  schedulePreviewUpdate();
  // Focus newly added textarea
  setTimeout(() => {
    const ta = $(`textarea[data-bolum-text="${state.kizBolumler.length - 1}"]`);
    ta?.focus();
  }, 50);
};

// ----- Modal -----
const kizModal = {
  open()  { $('#modal-kiz-proje').classList.add('open'); document.body.style.overflow = 'hidden'; },
  close() {
    $('#modal-kiz-proje').classList.remove('open');
    document.body.style.overflow = '';
    state.kizDraft = null;
    // kizPreviewReady'ı koru — iframe hâlâ DOM'da, tekrar açılınca anında bağlı
  }
};

const collectKizFormDraft = () => {
  const form = $('#form-kiz-proje');
  if (!form) return null;
  const fd = new FormData(form);
  return {
    id: fd.get('id') || state.kizDuzenleId || '__draft',
    kategori: fd.get('kategori') || 'merkez',
    sira: parseInt(fd.get('sira'), 10) || 99,
    no: (fd.get('no') || '').trim(),
    baslik: (fd.get('baslik') || '').trim(),
    teaser: (fd.get('teaser') || '').trim(),
    gorsel: (fd.get('gorsel') || uwState['kiz-proje'].url || '').trim(),
    videolar: mvwGetUrls('kiz'),
    bolumler: state.kizBolumler.map(b => ({ tip: b.tip, text: b.text || '' })),
    yayinda: getToggle('#t-kiz-yayin')
  };
};

const openKizNew = () => {
  state.kizDuzenleId = null;
  state.kizBolumler = [{ tip: 'p', text: '' }];

  const form = $('#form-kiz-proje');
  form.reset();
  form.elements.id.value = '';
  form.elements.kategori.value = state.kizTab;
  // Otomatik no: aynı kategorideki maksimum + 1
  const sameKat = state.kizProjeler.filter(p => (p.kategori || 'merkez') === state.kizTab);
  const maxSira = sameKat.reduce((m, p) => Math.max(m, Number.isFinite(p.sira) ? p.sira : 0), 0);
  form.elements.sira.value = maxSira + 10;
  form.elements.no.value = String(sameKat.length + 1).padStart(2, '0');
  setToggle($('#t-kiz-yayin'), true);

  $('#modal-kiz-title').textContent = state.kizTab === 'yerel' ? 'Yeni Yerel Proje' : 'Yeni Merkez Projesi';
  $('#form-kiz-submit-btn').textContent = 'Yayınla';
  $('#btn-kiz-proje-sil').style.display = 'none';

  uwClear('kiz-proje');
  mvwClear('kiz', schedulePreviewUpdate);
  renderKizBolumler();
  kizModal.open();
  initKizPreview();
};

const openKizEdit = (id) => {
  const p = state.kizProjeler.find(x => x.id === id);
  if (!p) return;
  state.kizDuzenleId = id;
  state.kizBolumler = (p.bolumler || []).map(b => ({ tip: b.tip || 'p', text: b.text || '' }));

  const form = $('#form-kiz-proje');
  form.reset();
  form.elements.id.value = id;
  form.elements.kategori.value = p.kategori || 'merkez';
  form.elements.sira.value = Number.isFinite(p.sira) ? p.sira : 10;
  form.elements.no.value = p.no || '';
  form.elements.baslik.value = p.baslik || '';
  form.elements.teaser.value = p.teaser || '';
  form.elements.gorsel.value = p.gorsel || '';
  const kizVideolar = p.videolar?.length ? p.videolar : (p.videoUrl ? [p.videoUrl] : []);
  mvwSetUrls('kiz', kizVideolar, schedulePreviewUpdate);
  setToggle($('#t-kiz-yayin'), p.yayinda !== false);

  $('#modal-kiz-title').textContent = 'Düzenle · ' + (p.baslik || 'Proje');
  $('#form-kiz-submit-btn').textContent = 'Güncelle';
  $('#btn-kiz-proje-sil').style.display = '';

  if (p.gorsel) uwSetPreview('kiz-proje', p.gorsel);
  else uwClear('kiz-proje');

  renderKizBolumler();
  kizModal.open();
  initKizPreview();
};

const submitKizForm = async (e) => {
  e.preventDefault();
  if (uwState['kiz-proje'].uploading || mvwIsUploading('kiz')) {
    toast('Yükleme tamamlanmadı, lütfen bekle', 'error');
    return;
  }

  const draft = collectKizFormDraft();
  if (!draft.baslik) { toast('Başlık zorunlu', 'error'); return; }
  if (!draft.teaser) { toast('Teaser (kart kısa metni) zorunlu', 'error'); return; }

  // Boş bölümleri at
  draft.bolumler = draft.bolumler.filter(b => (b.text || '').trim().length > 0);
  if (!draft.bolumler.length) {
    if (!confirm('Hiç hikâye bölümü yok. Yine de kaydedeyim mi?')) return;
  }

  const data = {
    kategori: draft.kategori,
    sira: draft.sira,
    no: draft.no,
    baslik: draft.baslik,
    teaser: draft.teaser,
    gorsel: draft.gorsel,
    videolar: draft.videolar || [],
    bolumler: draft.bolumler,
    yayinda: draft.yayinda
  };

  const btn = $('#form-kiz-submit-btn');
  const original = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Kaydediliyor…';

  try {
    const id = state.kizDuzenleId;
    await saveKizProje(id, data);
    toast(id ? 'Güncellendi' : 'Eklendi', 'success');
    kizModal.close();
    await refreshKiz();
  } catch (err) {
    console.error(err);
    toast('Kayıt başarısız: ' + err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = original;
  }
};

const confirmDeleteKiz = async (id) => {
  const p = state.kizProjeler.find(x => x.id === id);
  const baslik = p?.baslik || 'bu proje';
  if (!confirm(`"${baslik}" silinecek. Bu işlem geri alınamaz. Emin misin?`)) return;
  try {
    await deleteKizProje(id);
    toast('Silindi', 'success');
    await refreshKiz();
  } catch (err) {
    console.error(err);
    toast('Silme başarısız: ' + err.message, 'error');
  }
};

// ----- Canlı önizleme (iframe + postMessage) -----
const broadcastKizPreview = () => {
  const iframe = $('#kiz-preview-iframe');
  if (!iframe?.contentWindow || !state.kizPreviewReady) return;

  // Draft + tüm diğer projeler -> tek liste
  const draft = state.kizDraft || (state.kizDuzenleId ? null : null);
  let list = state.kizProjeler.map(p => ({ ...p }));
  if (state.kizDuzenleId && draft) {
    list = list.map(p => p.id === state.kizDuzenleId ? { ...p, ...draft } : p);
  } else if (draft) {
    list.push({ ...draft, id: '__draft' });
  }

  try {
    iframe.contentWindow.postMessage({
      type: 'kiz-projeler-preview',
      projeler: list,
      focusId: state.kizDuzenleId || null
    }, '*');
  } catch (e) {
    console.warn('postMessage başarısız:', e);
  }
};

let kizPreviewTimer = null;
const schedulePreviewUpdate = () => {
  state.kizDraft = collectKizFormDraft();
  clearTimeout(kizPreviewTimer);
  kizPreviewTimer = setTimeout(broadcastKizPreview, 250);
};

const initKizPreview = () => {
  const iframe = $('#kiz-preview-iframe');
  const status = $('#kiz-preview-status');
  if (!iframe) return;

  // Draft'ı baştan topla, böylece iframe ready olunca anında doğru veri gider
  state.kizDraft = collectKizFormDraft();

  if (!iframe.src || !iframe.src.includes('preview=admin')) {
    // İlk açılış
    state.kizPreviewReady = false;
    if (status) { status.textContent = 'Yükleniyor…'; status.className = 'preview-status'; }
    iframe.src = KIZ_PREVIEW_URL_WITH_HASH;
  } else {
    // İframe zaten yüklü — direkt broadcast et
    state.kizPreviewReady = true;
    if (status) { status.textContent = 'Bağlı · Canlı'; status.className = 'preview-status is-ready'; }
    broadcastKizPreview();
  }
};

// ── Sayfa Görselleri Önizleme ──────────────────────────────────────────────
const KIZ_GORSEL_KEYS   = new Set(KIZ_GORSEL_SLOTS.map(s => s.key));
const ERKEK_GORSEL_KEYS = new Set(ERKEK_GORSEL_SLOTS.map(s => s.key));
const BILEK_GORSEL_KEYS = new Set(BILEK_GORSEL_SLOTS.map(s => s.key));

const collectKizSayfaData = () => {
  const d = {};
  KIZ_GORSEL_SLOTS.forEach(({ field, key }) => {
    // Boş slot da '' olarak gönderilir ki önizleme/kayıt görseli temizleyebilsin
    d[field] = uwState[key]?.url || ($(`#uw-${key}-url`)?.value?.trim() || '');
  });
  return d;
};
const collectErkekSayfaData = () => {
  const d = {};
  ERKEK_GORSEL_SLOTS.forEach(({ field, key }) => {
    d[field] = uwState[key]?.url || ($(`#uw-${key}-url`)?.value?.trim() || '');
  });
  return d;
};

const broadcastKizSayfaPreview = () => {
  const iframe = $('#kiz-sayfa-preview-iframe');
  if (!iframe?.contentWindow || !state.kizSayfaPreviewReady) return;
  try { iframe.contentWindow.postMessage({ type: 'kiz-sayfa-preview', data: collectKizSayfaData() }, '*'); } catch (_) {}
};
const broadcastErkekSayfaPreview = () => {
  const iframe = $('#erkek-sayfa-preview-iframe');
  if (!iframe?.contentWindow || !state.erkekSayfaPreviewReady) return;
  try { iframe.contentWindow.postMessage({ type: 'erkek-sayfa-preview', data: collectErkekSayfaData() }, '*'); } catch (_) {}
};

let kizSayfaPreviewTimer = null;
const scheduleKizSayfaPreviewUpdate = () => {
  clearTimeout(kizSayfaPreviewTimer);
  kizSayfaPreviewTimer = setTimeout(broadcastKizSayfaPreview, 300);
};
let erkekSayfaPreviewTimer = null;
const scheduleErkekSayfaPreviewUpdate = () => {
  clearTimeout(erkekSayfaPreviewTimer);
  erkekSayfaPreviewTimer = setTimeout(broadcastErkekSayfaPreview, 300);
};

const initKizSayfaPreview = () => {
  const iframe = $('#kiz-sayfa-preview-iframe');
  const status = $('#kiz-sayfa-preview-status');
  if (!iframe) return;
  if (!iframe.src || !iframe.src.includes('sayfa=1')) {
    state.kizSayfaPreviewReady = false;
    if (status) { status.textContent = 'Yükleniyor…'; status.className = 'preview-status'; }
    iframe.src = KIZ_SAYFA_PREVIEW_URL;
  } else {
    state.kizSayfaPreviewReady = true;
    broadcastKizSayfaPreview();
  }
};
const initErkekSayfaPreview = () => {
  const iframe = $('#erkek-sayfa-preview-iframe');
  const status = $('#erkek-sayfa-preview-status');
  if (!iframe) return;
  if (!iframe.src || !iframe.src.includes('sayfa=1')) {
    state.erkekSayfaPreviewReady = false;
    if (status) { status.textContent = 'Yükleniyor…'; status.className = 'preview-status'; }
    iframe.src = ERKEK_SAYFA_PREVIEW_URL;
  } else {
    state.erkekSayfaPreviewReady = true;
    broadcastErkekSayfaPreview();
  }
};

const handleKizSayfaPreviewMessage = (e) => {
  if (e.data?.type !== 'kiz-sayfa-ready') return;
  state.kizSayfaPreviewReady = true;
  const status = $('#kiz-sayfa-preview-status');
  if (status) { status.textContent = 'Bağlı · Canlı'; status.classList.add('is-ready'); }
  broadcastKizSayfaPreview();
};
const handleErkekSayfaPreviewMessage = (e) => {
  if (e.data?.type !== 'erkek-sayfa-ready') return;
  state.erkekSayfaPreviewReady = true;
  const status = $('#erkek-sayfa-preview-status');
  if (status) { status.textContent = 'Bağlı · Canlı'; status.classList.add('is-ready'); }
  broadcastErkekSayfaPreview();
};

const handleKizPreviewMessage = (e) => {
  if (e.data?.type !== 'kiz-preview-ready') return;
  state.kizPreviewReady = true;
  const status = $('#kiz-preview-status');
  if (status) { status.textContent = 'Bağlı · Canlı'; status.classList.add('is-ready'); }
  broadcastKizPreview();
};

// ════════════════════════════════════════════════════════════
//  BİLEK GÜREŞİ — Sayfa yönetimi (görsel + metin)
//  Firestore: sayfalar/bilek-guresi · canlı önizleme: postMessage
// ════════════════════════════════════════════════════════════
const fetchBilekSayfa = async () => {
  await waitFirebase();
  const { db, doc, getDoc } = window.FB;
  const snap = await getDoc(doc(db, SAYFALAR_COLL, BILEK_SAYFA_DOC));
  return snap.exists() ? snap.data() : {};
};

const saveBilekSayfaData = async (fields) => {
  await waitFirebase();
  const { db, doc, setDoc, serverTimestamp } = window.FB;
  await setDoc(doc(db, SAYFALAR_COLL, BILEK_SAYFA_DOC), { ...fields, guncellendi: serverTimestamp() }, { merge: true });
};

// Formdaki tüm alanları topla: görsel slotları (UW) + metin alanları ([data-bilek-field])
const collectBilekSayfaData = () => {
  const d = {};
  BILEK_GORSEL_SLOTS.forEach(({ field, key }) => {
    // Boş slot '' olarak gönderilir → eski görsel temizlenir
    d[field] = uwState[key]?.url || ($(`#uw-${key}-url`)?.value?.trim() || '');
  });
  $$('#section-bilek [data-bilek-field]').forEach(el => {
    d[el.dataset.bilekField] = el.value;
  });
  return d;
};

// State → forma yaz (görseller + metinler). Metinler varsayılanla doldurulur.
const renderBilekSayfa = () => {
  const data = state.bilekSayfaData || {};
  // Görseller
  BILEK_GORSEL_SLOTS.forEach(({ field, key }) => {
    if (data[field]) uwSetPreview(key, data[field]);
    else uwClear(key);
  });
  // Metinler — kayıtlı değer yoksa varsayılan göster
  const merged = { ...BILEK_METIN_DEFAULTS, ...data };
  $$('#section-bilek [data-bilek-field]').forEach(el => {
    const f = el.dataset.bilekField;
    if (merged[f] !== undefined) el.value = merged[f];
  });
};

const broadcastBilekSayfaPreview = () => {
  const iframe = $('#bilek-sayfa-preview-iframe');
  if (!iframe?.contentWindow || !state.bilekSayfaPreviewReady) return;
  try { iframe.contentWindow.postMessage({ type: 'bilek-sayfa-preview', data: collectBilekSayfaData() }, '*'); } catch (_) {}
};

let bilekSayfaPreviewTimer = null;
const scheduleBilekSayfaPreviewUpdate = () => {
  clearTimeout(bilekSayfaPreviewTimer);
  bilekSayfaPreviewTimer = setTimeout(broadcastBilekSayfaPreview, 300);
};

const initBilekSayfaPreview = () => {
  const iframe = $('#bilek-sayfa-preview-iframe');
  const status = $('#bilek-preview-status');
  if (!iframe) return;
  if (!iframe.src || !iframe.src.includes('sayfa=1')) {
    state.bilekSayfaPreviewReady = false;
    if (status) { status.textContent = 'Yükleniyor…'; status.className = 'preview-status'; }
    iframe.src = BILEK_SAYFA_PREVIEW_URL;
  } else {
    state.bilekSayfaPreviewReady = true;
    broadcastBilekSayfaPreview();
  }
};

const handleBilekSayfaPreviewMessage = (e) => {
  if (e.data?.type !== 'bilek-sayfa-ready') return;
  state.bilekSayfaPreviewReady = true;
  const status = $('#bilek-preview-status');
  if (status) { status.textContent = 'Bağlı · Canlı'; status.classList.add('is-ready'); }
  broadcastBilekSayfaPreview();
};

const renderBilek = () => {
  renderBilekSayfa();
  initBilekSayfaPreview();
};

// Seed: mevcut 6 projeyi Firestore'a yaz
const seedKizProjeler = async () => {
  if (state.kizProjeler.length > 0) {
    if (!confirm('Zaten projeler var. Yine de ekleyeyim mi? (Mevcutlar silinmez, üstüne 6 yeni eklenir)')) return;
  }
  const btn = $('#btn-kiz-seed');
  if (btn) { btn.disabled = true; btn.textContent = 'İçe aktarılıyor…'; }
  try {
    for (const proje of KIZ_SEED_PROJELER) {
      await saveKizProje(null, proje);
    }
    toast(`${KIZ_SEED_PROJELER.length} proje içe aktarıldı`, 'success');
    await refreshKiz();
  } catch (err) {
    console.error(err);
    toast('İçe aktarma başarısız: ' + err.message, 'error');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Mevcut 6 projeyi içe aktar'; }
  }
};

// ========================================
// ERKEK SAYFASI — Projeler CRUD + canlı önizleme
// ========================================
const fetchErkekProjeler = async () => {
  await waitFirebase();
  const { db, collection, getDocs } = window.FB;
  const snap = await getDocs(collection(db, ERKEK_COLLECTION));
  const items = snap.docs.map(d => ({ ...d.data(), id: d.id }));
  console.log(`⚡ ${items.length} erkek projesi yüklendi`);
  return items;
};

const saveErkekProje = async (id, data) => {
  await waitFirebase();
  const { db, doc, setDoc, addDoc, collection, serverTimestamp } = window.FB;
  const payload = { ...data, guncellendi: serverTimestamp() };
  if (id) {
    await setDoc(doc(db, ERKEK_COLLECTION, id), payload, { merge: true });
    return id;
  } else {
    payload.olusturuldu = serverTimestamp();
    const ref = await addDoc(collection(db, ERKEK_COLLECTION), payload);
    return ref.id;
  }
};

const deleteErkekProje = async (id) => {
  await waitFirebase();
  const { db, doc, deleteDoc } = window.FB;
  await deleteDoc(doc(db, ERKEK_COLLECTION, id));
};

const refreshErkek = async () => {
  try {
    state.erkekProjeler = await fetchErkekProjeler();
    renderErkek();
    broadcastErkekPreview();
  } catch (err) {
    console.error('Erkek veri çekme hatası:', err);
    toast('Erkek projeleri yüklenemedi: ' + err.message, 'error');
  }
};

// ── Erkek Sayfa Görselleri (sayfalar/erkek) ──
const fetchErkekSayfa = async () => {
  await waitFirebase();
  const { db, doc, getDoc } = window.FB;
  const snap = await getDoc(doc(db, SAYFALAR_COLL, ERKEK_SAYFA_DOC));
  return snap.exists() ? snap.data() : {};
};

const saveErkekSayfaData = async (fields) => {
  await waitFirebase();
  const { db, doc, setDoc, serverTimestamp } = window.FB;
  await setDoc(doc(db, SAYFALAR_COLL, ERKEK_SAYFA_DOC), { ...fields, guncellendi: serverTimestamp() }, { merge: true });
};

const renderErkekSayfa = () => {
  const data = state.erkekSayfaData || {};
  ERKEK_GORSEL_SLOTS.forEach(({ field, key }) => {
    const url = data[field];
    if (url) uwSetPreview(key, url);
    else uwClear(key);
  });
};

// ----- Render -----
const erkekSorted = (list) => [...list].sort((a, b) => {
  const sa = Number.isFinite(a.sira) ? a.sira : 999;
  const sb = Number.isFinite(b.sira) ? b.sira : 999;
  if (sa !== sb) return sa - sb;
  return (a.baslik || '').localeCompare(b.baslik || '', 'tr');
});

const erkekForTab = () => erkekSorted(state.erkekProjeler.filter(p => (p.kategori || 'merkez') === state.erkekTab));

const updateErkekCounts = () => {
  const c = (k) => state.erkekProjeler.filter(p => (p.kategori || 'merkez') === k).length;
  const m = $('#erkek-count-merkez'), y = $('#erkek-count-yerel');
  if (m) m.textContent = c('merkez');
  if (y) y.textContent = c('yerel');
};

const erkekCardHTML = (p) => {
  const thumbInner = p.gorsel
    ? `<img src="${escapeHtml(window.cldUrl ? window.cldUrl(p.gorsel, 'w_180,h_220,c_fill,q_auto,f_auto') : p.gorsel)}" alt="" loading="lazy">`
    : `<span class="kiz-card-thumb-no">${escapeHtml(p.no || '·')}</span>`;
  const katBadge = (p.kategori === 'yerel')
    ? '<span class="badge er-yerel">📍 Yerel</span>'
    : '<span class="badge er-merkez">⭐ Merkez</span>';
  const yayinBadge = p.yayinda === false
    ? '<span class="badge draft">Gizli</span>'
    : '<span class="badge live">Yayında</span>';
  return `
    <div class="kiz-card" data-id="${p.id}">
      <div class="kiz-card-thumb">${thumbInner}</div>
      <div class="kiz-card-body">
        <h3>${escapeHtml(p.baslik || '(başlıksız)')}</h3>
        <p class="teaser">${escapeHtml(p.teaser || '')}</p>
        <div class="kiz-card-meta">
          ${katBadge}
          ${yayinBadge}
          <span>· Sıra ${p.sira ?? 99}</span>
          ${p.no ? `<span>· No ${escapeHtml(p.no)}</span>` : ''}
          <span>· ${(p.bolumler || []).length} bölüm</span>
        </div>
      </div>
      <div class="kiz-card-actions">
        <button class="btn btn-ghost" data-erkek-act="edit" data-id="${p.id}">Düzenle</button>
        <button class="btn btn-danger" data-erkek-act="del" data-id="${p.id}">Sil</button>
      </div>
    </div>
  `;
};

const renderErkek = () => {
  $$('#erkek-tabs .sub-tab').forEach(t => t.classList.toggle('active', t.dataset.erkekTab === state.erkekTab));
  updateErkekCounts();

  const isGorsel = state.erkekTab === 'gorsel';
  const panel = $('#erkek-sayfa-panel');
  const listEl = $('#erkek-list');
  const yeniBtn = $('#btn-yeni-erkek-proje');
  const seedBtn = $('#btn-erkek-seed');

  if (panel) panel.style.display = isGorsel ? '' : 'none';
  if (listEl) listEl.style.display = isGorsel ? 'none' : '';
  if (yeniBtn) yeniBtn.style.display = isGorsel ? 'none' : '';
  if (seedBtn) seedBtn.hidden = isGorsel;

  const labelBtn = $('#btn-yeni-erkek-proje-label');
  if (labelBtn) labelBtn.textContent = state.erkekTab === 'yerel' ? 'Yeni Yerel Proje' : 'Yeni Merkez Projesi';

  if (isGorsel) { renderErkekSayfa(); initErkekSayfaPreview(); return; }

  const cont = listEl;
  if (!cont) return;
  const list = erkekForTab();

  if (!list.length) {
    const mesaj = state.erkekTab === 'merkez'
      ? { h: 'Merkez projeleri boş', p: 'Sağ üstten "Yeni Merkez Projesi" ile başla, ya da mevcut 6 projeyi içe aktar.' }
      : { h: 'Yerel proje yok', p: 'Sağ üstten "Yeni Yerel Proje" butonu ile ilk kartı ekle.' };
    cont.innerHTML = `<div class="empty-state"><h3>${mesaj.h}</h3><p>${mesaj.p}</p></div>`;
    return;
  }

  cont.innerHTML = list.map(erkekCardHTML).join('');
  $$('button[data-erkek-act]', cont).forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const act = btn.dataset.erkekAct;
      if (act === 'edit') openErkekEdit(id);
      if (act === 'del')  confirmDeleteErkek(id);
    });
  });
};

// ----- Bölüm editörü -----
const erkekBolumHTML = (b, idx, total) => {
  const tipBadge = b.tip === 'intro'
    ? '<span class="kiz-bolum-type intro">İntro · italik</span>'
    : '<span class="kiz-bolum-type p">Paragraf</span>';
  return `
    <div class="kiz-bolum" data-erkek-bolum-idx="${idx}">
      <div class="kiz-bolum-head">
        ${tipBadge}
        <div class="kiz-bolum-actions">
          <button type="button" data-erkek-bolum-toggle="${idx}" title="Tipi değiştir">${b.tip === 'intro' ? '→ P' : '→ İntro'}</button>
          <button type="button" data-erkek-bolum-up="${idx}" ${idx === 0 ? 'disabled' : ''} title="Yukarı taşı">↑</button>
          <button type="button" data-erkek-bolum-down="${idx}" ${idx === total - 1 ? 'disabled' : ''} title="Aşağı taşı">↓</button>
          <button type="button" class="danger" data-erkek-bolum-remove="${idx}" title="Bölümü sil">×</button>
        </div>
      </div>
      <textarea data-erkek-bolum-text="${idx}" placeholder="${b.tip === 'intro' ? 'İtalik giriş metni…' : 'Paragraf metni… (**kelime** ile kalın)'}">${escapeHtml(b.text || '')}</textarea>
    </div>
  `;
};

const renderErkekBolumler = () => {
  const cont = $('#erkek-bolumler-list');
  if (!cont) return;
  const total = state.erkekBolumler.length;
  if (!total) {
    cont.innerHTML = `<div class="empty-state" style="padding:24px 18px;"><p style="margin:0;">Henüz bölüm yok. Aşağıdan ekle.</p></div>`;
    return;
  }
  cont.innerHTML = state.erkekBolumler.map((b, i) => erkekBolumHTML(b, i, total)).join('');

  $$('textarea[data-erkek-bolum-text]', cont).forEach(ta => {
    ta.addEventListener('input', () => {
      const idx = parseInt(ta.dataset.erkekBolumText, 10);
      if (state.erkekBolumler[idx]) state.erkekBolumler[idx].text = ta.value;
      scheduleErkekPreviewUpdate();
    });
  });

  $$('button[data-erkek-bolum-toggle], button[data-erkek-bolum-up], button[data-erkek-bolum-down], button[data-erkek-bolum-remove]', cont).forEach(b => {
    b.addEventListener('click', () => {
      const idx = parseInt(b.dataset.erkekBolumToggle ?? b.dataset.erkekBolumUp ?? b.dataset.erkekBolumDown ?? b.dataset.erkekBolumRemove, 10);
      if (b.dataset.erkekBolumToggle != null) {
        state.erkekBolumler[idx].tip = state.erkekBolumler[idx].tip === 'intro' ? 'p' : 'intro';
      } else if (b.dataset.erkekBolumUp != null && idx > 0) {
        [state.erkekBolumler[idx-1], state.erkekBolumler[idx]] = [state.erkekBolumler[idx], state.erkekBolumler[idx-1]];
      } else if (b.dataset.erkekBolumDown != null && idx < state.erkekBolumler.length - 1) {
        [state.erkekBolumler[idx+1], state.erkekBolumler[idx]] = [state.erkekBolumler[idx], state.erkekBolumler[idx+1]];
      } else if (b.dataset.erkekBolumRemove != null) {
        state.erkekBolumler.splice(idx, 1);
      }
      renderErkekBolumler();
      scheduleErkekPreviewUpdate();
    });
  });
};

const addErkekBolum = (tip) => {
  state.erkekBolumler.push({ tip: tip === 'intro' ? 'intro' : 'p', text: '' });
  renderErkekBolumler();
  scheduleErkekPreviewUpdate();
  setTimeout(() => {
    const ta = $(`textarea[data-erkek-bolum-text="${state.erkekBolumler.length - 1}"]`);
    ta?.focus();
  }, 50);
};


// ----- Modal -----
const erkekModal = {
  open()  { $('#modal-erkek-proje').classList.add('open'); document.body.style.overflow = 'hidden'; },
  close() {
    $('#modal-erkek-proje').classList.remove('open');
    document.body.style.overflow = '';
    state.erkekDraft = null;
  }
};

const collectErkekFormDraft = () => {
  const form = $('#form-erkek-proje');
  if (!form) return null;
  const fd = new FormData(form);
  return {
    id: fd.get('id') || state.erkekDuzenleId || '__draft',
    kategori: fd.get('kategori') || 'merkez',
    sira: parseInt(fd.get('sira'), 10) || 99,
    no: (fd.get('no') || '').trim(),
    baslik: (fd.get('baslik') || '').trim(),
    teaser: (fd.get('teaser') || '').trim(),
    gorsel: (fd.get('gorsel') || uwState['erkek-proje']?.url || '').trim(),
    videolar: mvwGetUrls('erkek'),
    bolumler: state.erkekBolumler.map(b => ({ tip: b.tip, text: b.text || '' })),
    yayinda: getToggle('#t-erkek-yayin')
  };
};

const openErkekNew = () => {
  state.erkekDuzenleId = null;
  state.erkekBolumler = [{ tip: 'p', text: '' }];

  const form = $('#form-erkek-proje');
  form.reset();
  form.elements.id.value = '';
  form.elements.kategori.value = state.erkekTab;
  const sameKat = state.erkekProjeler.filter(p => (p.kategori || 'merkez') === state.erkekTab);
  const maxSira = sameKat.reduce((m, p) => Math.max(m, Number.isFinite(p.sira) ? p.sira : 0), 0);
  form.elements.sira.value = maxSira + 10;
  form.elements.no.value = String(sameKat.length + 1).padStart(2, '0');
  setToggle($('#t-erkek-yayin'), true);

  $('#modal-erkek-title').textContent = state.erkekTab === 'yerel' ? 'Yeni Yerel Proje' : 'Yeni Merkez Projesi';
  $('#form-erkek-submit-btn').textContent = 'Yayınla';
  $('#btn-erkek-proje-sil').style.display = 'none';

  uwClear('erkek-proje');
  mvwClear('erkek', scheduleErkekPreviewUpdate);
  renderErkekBolumler();
  erkekModal.open();
  initErkekPreview();
};

const openErkekEdit = (id) => {
  const p = state.erkekProjeler.find(x => x.id === id);
  if (!p) return;
  state.erkekDuzenleId = id;
  state.erkekBolumler = (p.bolumler || []).map(b => ({ tip: b.tip || 'p', text: b.text || '' }));

  const form = $('#form-erkek-proje');
  form.reset();
  form.elements.id.value = id;
  form.elements.kategori.value = p.kategori || 'merkez';
  form.elements.sira.value = Number.isFinite(p.sira) ? p.sira : 10;
  form.elements.no.value = p.no || '';
  form.elements.baslik.value = p.baslik || '';
  form.elements.teaser.value = p.teaser || '';
  form.elements.gorsel.value = p.gorsel || '';
  const erkekVideolar = p.videolar?.length ? p.videolar : (p.videoUrl ? [p.videoUrl] : []);
  mvwSetUrls('erkek', erkekVideolar, scheduleErkekPreviewUpdate);
  setToggle($('#t-erkek-yayin'), p.yayinda !== false);

  $('#modal-erkek-title').textContent = 'Düzenle · ' + (p.baslik || 'Proje');
  $('#form-erkek-submit-btn').textContent = 'Güncelle';
  $('#btn-erkek-proje-sil').style.display = '';

  if (p.gorsel) uwSetPreview('erkek-proje', p.gorsel);
  else uwClear('erkek-proje');

  renderErkekBolumler();
  erkekModal.open();
  initErkekPreview();
};

const submitErkekForm = async (e) => {
  e.preventDefault();
  if (uwState['erkek-proje'].uploading || mvwIsUploading('erkek')) {
    toast('Yükleme tamamlanmadı, lütfen bekle', 'error');
    return;
  }

  const draft = collectErkekFormDraft();
  if (!draft.baslik) { toast('Başlık zorunlu', 'error'); return; }
  if (!draft.teaser) { toast('Teaser (kart kısa metni) zorunlu', 'error'); return; }

  draft.bolumler = draft.bolumler.filter(b => (b.text || '').trim().length > 0);
  if (!draft.bolumler.length) {
    if (!confirm('Hiç hikâye bölümü yok. Yine de kaydedeyim mi?')) return;
  }

  // Mevcut dökümanın form-dışı alanlarını koru (template, instagram_url, misyon, vizyon, galeri, eyebrow…)
  const existing = state.erkekProjeler.find(p => p.id === state.erkekDuzenleId) || {};
  const SKIP = new Set(['id', 'guncellendi', 'olusturuldu']);
  const preserved = Object.fromEntries(Object.entries(existing).filter(([k]) => !SKIP.has(k)));

  const data = {
    ...preserved,
    kategori: draft.kategori,
    sira: draft.sira,
    no: draft.no,
    baslik: draft.baslik,
    teaser: draft.teaser,
    gorsel: draft.gorsel,
    videolar: draft.videolar || [],
    bolumler: draft.bolumler,
    yayinda: draft.yayinda
  };

  // Rota'ya özel zorunlu alanları eksikse onar
  const isRotaDoc = data.template === 'rota' || state.erkekDuzenleId === 'rota-genclik-bulusmalari';
  if (isRotaDoc) {
    if (!data.template)       data.template       = 'rota';
    if (!data.instagram_url)  data.instagram_url  = 'https://www.instagram.com/rotaantalya/';
    if (!data.eyebrow)        data.eyebrow        = 'Yerel Çalışma · Antalya Kaleiçi · 2018';
    if (!data.misyon)         data.misyon         = 'Rota; hayatın her alanında fikir sahibi olan, daha bilinçli ve daha donanımlı bireyler yetiştirmek amacıyla yola çıkmıştır.';
    if (!data.vizyon)         data.vizyon         = 'Rota; hayatın akışında kritik ve analitik düşünce yapısına sahip, kendisine ve topluma faydalı, dünyayı amaç değil araç olarak gören 8 milyar insan topluluğunu hedefler.';
    if (!data.galeri)         data.galeri         = [];
  }

  const btn = $('#form-erkek-submit-btn');
  const original = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Kaydediliyor…';

  try {
    const id = state.erkekDuzenleId;
    await saveErkekProje(id, data);
    toast(id ? 'Güncellendi' : 'Eklendi', 'success');
    erkekModal.close();
    await refreshErkek();
  } catch (err) {
    console.error(err);
    toast('Kayıt başarısız: ' + err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = original;
  }
};

const confirmDeleteErkek = async (id) => {
  const p = state.erkekProjeler.find(x => x.id === id);
  const baslik = p?.baslik || 'bu proje';
  if (!confirm(`"${baslik}" silinecek. Bu işlem geri alınamaz. Emin misin?`)) return;
  try {
    await deleteErkekProje(id);
    toast('Silindi', 'success');
    await refreshErkek();
  } catch (err) {
    console.error(err);
    toast('Silme başarısız: ' + err.message, 'error');
  }
};

// ----- Canlı önizleme -----
const broadcastErkekPreview = () => {
  const iframe = $('#erkek-preview-iframe');
  if (!iframe?.contentWindow || !state.erkekPreviewReady) return;

  let list = state.erkekProjeler.map(p => ({ ...p }));
  const draft = state.erkekDraft;
  if (state.erkekDuzenleId && draft) {
    list = list.map(p => p.id === state.erkekDuzenleId ? { ...p, ...draft } : p);
  } else if (draft) {
    list.push({ ...draft, id: '__draft' });
  }

  try {
    iframe.contentWindow.postMessage({
      type: 'erkek-projeler-preview',
      projeler: list,
      focusId: state.erkekDuzenleId || null
    }, '*');
  } catch (e) {
    console.warn('postMessage başarısız:', e);
  }
};

let erkekPreviewTimer = null;
const scheduleErkekPreviewUpdate = () => {
  state.erkekDraft = collectErkekFormDraft();
  clearTimeout(erkekPreviewTimer);
  erkekPreviewTimer = setTimeout(broadcastErkekPreview, 250);
};

const initErkekPreview = () => {
  const iframe = $('#erkek-preview-iframe');
  const status = $('#erkek-preview-status');
  if (!iframe) return;

  state.erkekDraft = collectErkekFormDraft();

  if (!iframe.src || !iframe.src.includes('preview=admin')) {
    state.erkekPreviewReady = false;
    if (status) { status.textContent = 'Yükleniyor…'; status.className = 'preview-status'; }
    iframe.src = ERKEK_PREVIEW_URL_WITH_HASH;
  } else {
    state.erkekPreviewReady = true;
    if (status) { status.textContent = 'Bağlı · Canlı'; status.className = 'preview-status is-ready'; }
    broadcastErkekPreview();
  }
};

const handleErkekPreviewMessage = (e) => {
  if (e.data?.type !== 'erkek-preview-ready') return;
  state.erkekPreviewReady = true;
  const status = $('#erkek-preview-status');
  if (status) { status.textContent = 'Bağlı · Canlı'; status.classList.add('is-ready'); }
  broadcastErkekPreview();
};

// Seed
const seedErkekProjeler = async () => {
  const SEED = [
    { id:'ilk-namazim', kategori:'merkez', sira:10, no:'01', baslik:'İlk Namazım',
      teaser:'Evlatlarımıza namaz şuurunu aşılıyor, namazı hayatlarının ilk sırasına yazdırıyoruz. Saflar omuz omuza, gönüller bir saftır.',
      gorsel:'', yayinda:true,
      bolumler:[
        { tip:'p', text:'**Amacımız;** geleceğin varisi olan pek kıymetli evlatlarımıza namaz şuurunu aşılamak, namazı çok sevdirmek ve onu vazgeçilmezleri olarak hayatlarının ilk sırasına yazdırmaktır.' },
        { tip:'p', text:'Kulüp bünyesinde yaptığımız her faaliyette ilk gelecek projemiz bu olup, amacımız biri bin yapıp omuz omuza saf tutmaktır. **"İlk Namazım"**, evlatlarımızın gönüllerinde her daim **"gözbebeği namazım"** olarak kalacaktır.' }
      ]},
    { id:'her-gun-bir-iyilik', kategori:'merkez', sira:20, no:'02', baslik:'Her Gün Bir İyilik Yap',
      teaser:'Birler bir araya gelince çoğalır, iyilik biri bin yapar. Sıcak bir tebessüm, uzanan bir el — her günü iyilikle nakşetmek.',
      gorsel:'', yayinda:true,
      bolumler:[
        { tip:'p', text:'Bir, yalnız başına sadece "1"den ibarettir. Ancak birler bir araya gelince bizleri, sizleri ve onları oluşturur. İyilik konusu ise yalnızca bir kez yapılsa orada sayı "bir" kalmaz; bu sayının matematiksel hesabı yapılamaz. **İyilik, her güne bir sayı ile eklenince sayılar avuca sığmaz, katlanarak büyür.**' },
        { tip:'p', text:'**"Her Güne Bir İyilik"** adıyla çıktığımız bu yolda amacımız; sayının sadece matematikten ibaret olmadığını, yapılan iyiliklerin biri bin yapacağını öğretmektir. Onlara sıcacık bir tebessümün, uzanan bir yardım elinin, çevreye nadide bir bakışın sadece "bir iyilik" adı altında tasnif edilemeyeceğini, bu iyiliğin binlere bedel olduğunu aşılamayı amaçladık. Ve bu kıymetli yolu, onlara ömür boyu taşıyacakları bir **"hayati yol"** olarak armağan ettik.' }
      ]},
    { id:'hilali-gordum', kategori:'merkez', sira:30, no:'03', baslik:"Hilal'i Gördüm",
      teaser:"Ramazan'ın nazenin ışığı altında; namaz, teravih, salavat ve hadisleri yüreklere ilmek ilmek nakşettik.",
      gorsel:'', yayinda:true,
      bolumler:[
        { tip:'intro', text:"Bakın Hilal'i gördüm, nasıl da nazlı nazlı bakıyor… Gökyüzünün nazenin ışığı. Kimdir o, hangi zamanın timsali bu güzellik? Onun adı Ramazan…" },
        { tip:'p', text:"Ramazan ayını evlatlarımıza tam da böyle aksettirdik. Yüreklerinde kıpır kıpır, masumane bir eğlence; hem ibadet hem ziyafet misali… Ama en çok da büyük bir sevgiyle; namazı, teravihi, Kur'an-ı Kerim okumalarını, salavatları ve hadisleri, kısacası **ibadetin özünü benliklerine kimlik edinecekleri her şeyi** bu yolda nazende kalplere ilmek ilmek nakşettik." }
      ]},
    { id:'liderim-itikaftayim', kategori:'merkez', sira:40, no:'04', baslik:'Liderim İtikaftayım',
      teaser:"Yol O'na, yoldaş O'na. Hayatın her anını bir itikaf teslimiyetiyle yaşamak — gözlerin içine yazılan ışık.",
      gorsel:'', yayinda:true,
      bolumler:[
        { tip:'intro', text:"Sessiz olun, itikaftayım. Kapattım gözlerimi; ağzımı kenetledim bir yudum su ile. Dilimi de susturdum, gönlümü bağladım Rahman'a…" },
        { tip:'p', text:"Evlatlarımızla birlikte girdiğimiz bu itikaf programında onlara öğrettiğimiz yegâne şey şudur: **Yol O'na, Yoldaş O'na…** İbadetlerin hassasiyeti sadece itikaf zamanıyla sınırlı değildir. Hayatın her anını bir itikaf teslimiyetiyle yaşamalarını, kapattıkları gözlerinin içine bir ışık olarak yazdırdık. Tüm hayati itikaflar artık onlara emanet…" }
      ]},
    { id:'seyyah', kategori:'merkez', sira:50, no:'05', baslik:'Seyyah',
      teaser:'Şehirleri, sokakları, gönülleri adım adım gezdik. Hatıra defterimize attığımız her imza, köklü bir kardeşlik.',
      gorsel:'', yayinda:true,
      bolumler:[
        { tip:'intro', text:'Bir şehir, bir sokak, bir cadde, bazen de küçük bir kuytuda kalmış; sıcacık, buram buram kokusunu içimize çektiğimiz gönül fırınımız… "Benim adım Seyyah" diyerek çıktık yola.' },
        { tip:'p', text:"Gönül fırınımız diye bahsettiğimiz satırlarda, o fırına sıcak gönüller eklemeye niyet ettik. Adımız Seyyah; gezdik, döndük, durduk ve nihayet bir gönüle konduk. Kulübümüz vesilesiyle Kayseri'de bulunan ve gönül fırıncılığı yaptığımız dostlarımızla bir şehri, bir sokağı, bir caddeyi adım adım gezdik; anılara sıcaklıklar ekledik. **Hatıra defterimize yazdığımız her bir seyyahlığın sonuna, hep güzel biten ve daima güzel bitecek olan köklü bir kardeşlik ile imzamızı attık.**" }
      ]},
    { id:'yeryuzu-yildizlari', kategori:'merkez', sira:60, no:'06', baslik:'Yeryüzü Yıldızları',
      teaser:'Ashab gibi inci taneleri, yeryüzünde pırıl pırıl yıldızlar. Maneviyatın enginlere ulaştığı bir yolculuk.',
      gorsel:'', yayinda:true,
      bolumler:[
        { tip:'intro', text:'Gökyüzünden yeryüzüne serilmiş, pırıl pırıl parlayan inci taneleri gibisiniz. Ashab gibisiniz…' },
        { tip:'p', text:'Gençlerimize işte böyle seslendik. Onları birer inci tanesi olarak gördük, ashabın ruhunu yüreklerine kondurduk. **Maneviyatın enginlere ulaştığı, benlikten öteye geçip ruhumuzun en derinlerinde hissettiğimiz ilahi rahmeti gönlümüze nakşettik** ve her birimiz yeryüzünde dolaşan birer yıldız olduk. Gençlerimize şükranlarımızı sunuyor ve biz de onların her birine gökyüzünden bir yıldız ithaf ediyoruz.' }
      ]},
    { id:'rota-genclik-bulusmalari', template:'rota',
      kategori:'yerel', sira:10, no:'01',
      eyebrow:'Yerel Çalışma · Antalya Kaleiçi · 2018',
      baslik:'Rota Gençlik Buluşmaları',
      teaser:"Karatay Medresesi'nde — gençlerin kendi hayat rotalarını çizdiği, her programda \"+1 değer\" kattığı bir gelişim ortamı.",
      gorsel:'', galeri:[],
      instagram_url:'https://www.instagram.com/rotaantalya/',
      misyon:'Rota; hayatın her alanında fikir sahibi olan, daha bilinçli ve daha donanımlı bireyler yetiştirmek amacıyla yola çıkmıştır.',
      vizyon:"Rota; hayatın akışında kritik ve analitik düşünce yapısına sahip, kendisine ve topluma faydalı, dünyayı amaç değil araç olarak gören 8 milyar insan topluluğunu hedefler.",
      yayinda:true,
      bolumler:[
        { tip:'p', text:"**2018 yılından bu yana** Antalya Kaleiçi'nde faaliyet gösteren Rota Gençlik Buluşmaları, gençlerin hayat yolculuklarında doğru bir rota çizebilmelerine katkı sunmak amacıyla kurulmuş bir gençlik çalışmasıdır. Kaleiçi'nin hareketli atmosferinde, barların ve müzikli mekânların arasından geçilerek ulaşılan manevi bir kale olan **Karatay Medresesi**'nde gerçekleştirdiğimiz bu çalışmalar; gençlere hem maddi hem de manevi anlamda yeni ufuklar kazandırmayı hedeflemektedir." },
        { tip:'p', text:"Rota ismini seçmemizin temel sebebi, gençlerin kendi hayat rotalarını bilinçli bir şekilde çizebilmelerine yardımcı olmaktır. Bu doğrultuda alanında uzman isimlerin katıldığı **mesleki ve kişisel gelişim seminerleri**, manevi değerler üzerine sohbetler, Kur'an meali okumaları, hadis sohbetleri, grup münazaraları, sosyal aktiviteler, şehir dışı gezileri ve pek çok faaliyet düzenlemekteyiz. Her programın temel hedefi; katılımcının bulunduğu noktadan bir adım daha ileriye taşınması, kendisine **\"+1 değer\"** katması ve dünya bakışı açısından olumlu bir dönüşüm yaşamasıdır." },
        { tip:'p', text:"Rota Gençlik Buluşmaları, başlangıçta kendi içimizde gerçekleştirdiğimiz samimi sohbetler ve Kur'an meali okumalarıyla başlayan bir yolculuk iken; **bugün birçok uzmanı ve alanında yetkin kişiyi ağırlayan, Türkiye genelinde örnek gösterilen bir gençlik çalışmasına dönüşmüştür.**" },
        { tip:'intro', text:"Çalışmalarımız boyunca asıl gayemizin Allah'ın rızasını kazanmak olduğunu hiçbir zaman unutmuyoruz. Gençliğe yönelik yaptığımız her faaliyet; insanın maddeye basarak manaya ulaşma yolculuğunda ona rehberlik edebilme niyeti taşımaktadır." },
        { tip:'p', text:"Genç ve dinamik yönetim ekibimiz, sahip olduğu enerjiyi ve heyecanı tüm çalışmalarımıza yansıtmaktadır. **Samimiyet, bilinç, gelişim ve kardeşlik** temelinde şekillenen Rota Gençlik Buluşmaları; yalnızca bir etkinlik topluluğu değil, aynı zamanda gençlerin kendilerini keşfettikleri, fikir ürettikleri ve hayata daha güçlü hazırlandıkları bir gelişim ortamıdır." }
      ]}
  ];
  const seedIds = new Set(SEED.map(s => s.id));
  // Mevcut projelerden SEED'e dahil OLMAYANLAR korunur (kullanıcının elle eklediği yerel projeler)
  const willDelete = state.erkekProjeler.filter(p => seedIds.has(p.id));
  const stranger    = state.erkekProjeler.filter(p => !seedIds.has(p.id));

  const msg = state.erkekProjeler.length === 0
    ? 'Tüm SEED projeleri (6 merkez + Rota) yüklenecek. Devam edilsin mi?'
    : `Mevcut ${willDelete.length} SEED dokümanı temizlenip yeniden yazılacak.\n` +
      `Korunacak ekstra proje sayısı: ${stranger.length}\n\n` +
      `Mükerrer (eski auto-ID) dokümanlar da silinecek. Devam edilsin mi?`;
  if (!confirm(msg)) return;

  const btn = $('#btn-erkek-seed');
  if (btn) { btn.disabled = true; btn.textContent = 'Sıfırlanıyor…'; }
  try {
    // 1) ÖNCE: SEED ID'leriyle çakışan veya eski auto-ID'li mükerrer dokümanları sil
    // Mükerrer tespiti: aynı baslik'a sahip ama farklı id olan dokümanlar
    const seedBasliks = new Set(SEED.map(s => (s.baslik || '').toLowerCase().trim()));
    const dupes = state.erkekProjeler.filter(p => {
      if (seedIds.has(p.id)) return true; // SEED ID'si — overwrite için sileceğiz (setDoc zaten yapacak ama eski auto-ID'li mükerrerleri yakalamak için)
      const b = (p.baslik || '').toLowerCase().trim();
      return seedBasliks.has(b); // SEED'le aynı başlık ama farklı ID → eski mükerrer
    });
    for (const p of dupes) {
      try { await deleteErkekProje(p.id); } catch (e) { console.warn('Silme hatası:', p.id, e); }
    }

    // 2) SEED'i yaz — ama daha önce yüklenmiş görsel/galeri kullanıcı verisi varsa koru
    //    (silinmiş eski auto-ID'lerden gelmediği sürece — bu yüzden refresh sonrası tekrar oku)
    const beforeWrite = await fetchErkekProjeler();
    const beforeMap = new Map(beforeWrite.map(p => [p.id, p]));
    for (const proje of SEED) {
      const existing = beforeMap.get(proje.id);
      const merged = { ...proje };
      if (existing) {
        // Kullanıcı verisi olabilecek alanlar — varsa SEED'in boş değerini ezme
        if (existing.gorsel) merged.gorsel = existing.gorsel;
        if (Array.isArray(existing.galeri) && existing.galeri.length) merged.galeri = existing.galeri;
        if (existing.instagram_url) merged.instagram_url = existing.instagram_url;
      }
      await saveErkekProje(proje.id, merged);
    }

    toast(`${SEED.length} proje yazıldı, ${dupes.length} eski/mükerrer silindi`, 'success');
    await refreshErkek();
  } catch (err) {
    console.error(err);
    toast('İçe aktarma başarısız: ' + err.message, 'error');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Tüm projeleri sıfırla & yeniden yaz (6 merkez + Rota)'; }
  }
};

// ========================================
// ROTA — Gençlik Buluşmaları sayfa görselleri
// (hero_bg tek görsel + galeri[] URL dizisi → sayfalar/rota)
// ========================================
const fetchRotaSayfa = async () => {
  await waitFirebase();
  const { db, doc, getDoc } = window.FB;
  const snap = await getDoc(doc(db, SAYFALAR_COLL, ROTA_SAYFA_DOC));
  return snap.exists() ? snap.data() : {};
};

const collectRotaSayfaData = () => {
  const d = {
    hero_bg: uwState['rota-hero']?.url || '',
    galeri: rotaGallery.getUrls(),
  };
  ROTA_GORSEL_SLOTS.forEach(({ field, key }) => {
    // Boş slot '' olarak gönderilir → sayfa gömülü görsele döner
    d[field] = uwState[key]?.url || ($(`#uw-${key}-url`)?.value?.trim() || '');
  });
  return d;
};

const saveRotaSayfaData = async (data) => {
  await waitFirebase();
  const { db, doc, setDoc, serverTimestamp } = window.FB;
  await setDoc(
    doc(db, SAYFALAR_COLL, ROTA_SAYFA_DOC),
    { ...data, guncellendi: serverTimestamp() },
    { merge: true }
  );
};

const rotaIsBusy = () => (uwState['rota-hero']?.uploading) || rotaGallery.isBusy()
  || ROTA_GORSEL_SLOTS.some(({ key }) => uwState[key]?.uploading);

// Canlı önizleme
const broadcastRotaPreview = () => {
  const iframe = $('#rota-sayfa-preview-iframe');
  if (!iframe?.contentWindow || !state.rotaSayfaPreviewReady) return;
  try { iframe.contentWindow.postMessage({ type: 'rota-sayfa-preview', data: collectRotaSayfaData() }, '*'); } catch (_) {}
};
let rotaPreviewTimer = null;
const scheduleRotaPreviewUpdate = () => {
  clearTimeout(rotaPreviewTimer);
  rotaPreviewTimer = setTimeout(broadcastRotaPreview, 300);
};
const initRotaPreview = () => {
  const iframe = $('#rota-sayfa-preview-iframe');
  const status = $('#rota-preview-status');
  if (!iframe) return;
  if (!iframe.src || !iframe.src.includes('sayfa=1')) {
    state.rotaSayfaPreviewReady = false;
    if (status) { status.textContent = 'Yükleniyor…'; status.className = 'preview-status'; }
    iframe.src = ROTA_SAYFA_PREVIEW_URL;
  } else {
    state.rotaSayfaPreviewReady = true;
    broadcastRotaPreview();
  }
};
const handleRotaPreviewMessage = (e) => {
  if (e.data?.type !== 'rota-sayfa-ready') return;
  state.rotaSayfaPreviewReady = true;
  const status = $('#rota-preview-status');
  if (status) { status.textContent = 'Bağlı · Canlı'; status.classList.add('is-ready'); }
  broadcastRotaPreview();
};

let rotaSayfaLoaded = false;
const renderRota = async () => {
  initRotaPreview();
  if (rotaSayfaLoaded) return;
  rotaSayfaLoaded = true;
  try {
    const data = await fetchRotaSayfa();
    if (data.hero_bg) uwSetPreview('rota-hero', data.hero_bg);
    else uwClear('rota-hero');
    ROTA_GORSEL_SLOTS.forEach(({ field, key }) => {
      if (data[field]) uwSetPreview(key, data[field]);
      else uwClear(key);
    });
    rotaGallery.setUrls(Array.isArray(data.galeri) ? data.galeri : []);
    broadcastRotaPreview();
  } catch (err) {
    console.error('Rota sayfa verisi yüklenemedi:', err);
  }
};

// ========================================
// DALGIÇLIK — Akdeniz'den Kareler galerisi
// ========================================
let dalgicTempCounter = 0;

// Firestore'dan gelen veya kaydedilecek galeri öğelerini normalize et
const normalizeDalgicGaleri = (arr) => {
  if (!Array.isArray(arr)) return [];
  return arr
    .filter(it => it && typeof it.url === 'string' && it.url)
    .map(it => ({
      url: it.url,
      baslik: typeof it.baslik === 'string' ? it.baslik : '',
      kategori: DALGIC_KATEGORILER.some(k => k.val === it.kategori) ? it.kategori : 'kesif',
      sira: Number.isFinite(it.sira) ? it.sira : (parseInt(it.sira, 10) || 0),
      genis: it.genis === true,
      _tempId: ++dalgicTempCounter,
      _uploading: false,
      _error: null,
      _percent: 100,
    }));
};

const fetchDalgicSayfa = async () => {
  await waitFirebase();
  const { db, doc, getDoc } = window.FB;
  const snap = await getDoc(doc(db, SAYFALAR_COLL, DALGIC_SAYFA_DOC));
  return snap.exists() ? snap.data() : {};
};

const saveDalgicSayfaData = async (galeri) => {
  await waitFirebase();
  const { db, doc, setDoc, serverTimestamp } = window.FB;
  await setDoc(doc(db, SAYFALAR_COLL, DALGIC_SAYFA_DOC), { galeri, guncellendi: serverTimestamp() }, { merge: true });
};

const dalgicIsBusy = () => state.dalgicGaleri.some(i => i._uploading);

// Kaydedilecek/önizlenecek temiz galeri (yüklenmesi biten öğeler)
const dalgicCleanGaleri = () => state.dalgicGaleri
  .filter(i => i.url && !i._error && !i._uploading)
  .map(i => ({
    url: i.url,
    baslik: i.baslik || '',
    kategori: i.kategori || 'kesif',
    sira: Number.isFinite(i.sira) ? i.sira : (parseInt(i.sira, 10) || 0),
    genis: i.genis === true,
  }));

const renderDalgicGaleri = () => {
  const list = $('#dalgic-list');
  if (!list) return;

  if (!state.dalgicGaleri.length) {
    list.innerHTML = `<div class="dgl-empty">Henüz fotoğraf yok. "Fotoğraf Ekle" ile başla.</div>`;
    return;
  }

  list.innerHTML = state.dalgicGaleri.map((it) => {
    const thumbSrc = it._localUrl
      || (it.url ? (window.cldUrl ? window.cldUrl(it.url, 'w_200,h_200,c_fill,q_auto,f_auto') : it.url) : '');
    const thumbInner = it._error
      ? `<span class="dgl-err">⚠</span>`
      : `<img src="${escapeHtml(thumbSrc)}" alt="">${it._uploading ? `<span class="dgl-percent">${it._percent || 0}%</span>` : ''}`;
    const opts = DALGIC_KATEGORILER.map(k =>
      `<option value="${k.val}"${it.kategori === k.val ? ' selected' : ''}>${k.ad}</option>`).join('');
    return `
      <div class="dgl-card${it._uploading ? ' is-uploading' : ''}" data-tempid="${it._tempId}">
        <div class="dgl-thumb">${thumbInner}</div>
        <div class="dgl-fields">
          <input type="text" data-dgl-field="baslik" placeholder="Başlık (opsiyonel)" value="${escapeHtml(it.baslik || '')}">
          <div class="dgl-row">
            <select data-dgl-field="kategori">${opts}</select>
            <input type="number" data-dgl-field="sira" placeholder="Sıra" value="${Number.isFinite(it.sira) ? it.sira : ''}">
            <label class="dgl-genis"><input type="checkbox" data-dgl-field="genis"${it.genis ? ' checked' : ''}> Geniş</label>
          </div>
          ${it._error ? `<span class="dgl-err">${escapeHtml(it._error)}</span>` : ''}
        </div>
        <div class="dgl-actions">
          <button type="button" class="btn-tiny" data-dgl-replace>Değiştir</button>
          <button type="button" class="btn-tiny btn-tiny-danger" data-dgl-remove>Sil</button>
        </div>
      </div>`;
  }).join('');
};

const renderDalgic = () => {
  renderDalgicGaleri();
  initDalgicPreview();
};

const dalgicItemByTempId = (tempId) => state.dalgicGaleri.find(i => i._tempId === Number(tempId));

const dalgicUploadOne = async (item, file) => {
  try {
    const optimized = await window.resizeImage(file);
    const result = await window.uploadToCloudinary(optimized, (p) => {
      item._percent = p;
      const node = $(`#dalgic-list .dgl-card[data-tempid="${item._tempId}"] .dgl-percent`);
      if (node) node.textContent = p + '%';
    });
    item.url = result.secure_url;
    item._uploading = false;
    item._error = null;
    if (item._localUrl) { URL.revokeObjectURL(item._localUrl); item._localUrl = null; }
    renderDalgicGaleri();
    scheduleDalgicPreviewUpdate();
  } catch (err) {
    console.error('Dalgıçlık galeri görsel yükleme hatası:', err);
    item._uploading = false;
    item._error = err.message || 'Yükleme başarısız';
    if (item._localUrl) { URL.revokeObjectURL(item._localUrl); item._localUrl = null; }
    renderDalgicGaleri();
  }
};

const dalgicAddFiles = (files) => {
  const maxSira = state.dalgicGaleri.reduce((m, i) => Math.max(m, Number.isFinite(i.sira) ? i.sira : 0), 0);
  let added = 0;
  Array.from(files).forEach((file) => {
    const v = isValidImage(file);
    if (!v.ok) { toast(v.msg, 'error'); return; }
    const item = {
      url: '',
      baslik: '',
      kategori: 'kesif',
      sira: maxSira + 10 * (++added),
      genis: false,
      _tempId: ++dalgicTempCounter,
      _uploading: true,
      _localUrl: URL.createObjectURL(file),
      _error: null,
      _percent: 0,
    };
    state.dalgicGaleri.push(item);
    dalgicUploadOne(item, file);
  });
  renderDalgicGaleri();
};

// Tek öğenin görselini değiştir
let dalgicReplaceTarget = null;
const dalgicReplaceFile = (file) => {
  const item = dalgicItemByTempId(dalgicReplaceTarget);
  dalgicReplaceTarget = null;
  if (!item) return;
  const v = isValidImage(file);
  if (!v.ok) { toast(v.msg, 'error'); return; }
  if (item._localUrl) URL.revokeObjectURL(item._localUrl);
  item._localUrl = URL.createObjectURL(file);
  item._uploading = true;
  item._error = null;
  item._percent = 0;
  renderDalgicGaleri();
  dalgicUploadOne(item, file);
};

// Canlı önizleme
const broadcastDalgicPreview = () => {
  const iframe = $('#dalgic-sayfa-preview-iframe');
  if (!iframe?.contentWindow || !state.dalgicSayfaPreviewReady) return;
  try { iframe.contentWindow.postMessage({ type: 'dalgic-sayfa-preview', galeri: dalgicCleanGaleri() }, '*'); } catch (_) {}
};
let dalgicPreviewTimer = null;
const scheduleDalgicPreviewUpdate = () => {
  clearTimeout(dalgicPreviewTimer);
  dalgicPreviewTimer = setTimeout(broadcastDalgicPreview, 300);
};
const initDalgicPreview = () => {
  const iframe = $('#dalgic-sayfa-preview-iframe');
  const status = $('#dalgic-preview-status');
  if (!iframe) return;
  if (!iframe.src || !iframe.src.includes('sayfa=1')) {
    state.dalgicSayfaPreviewReady = false;
    if (status) { status.textContent = 'Yükleniyor…'; status.className = 'preview-status'; }
    iframe.src = DALGIC_SAYFA_PREVIEW_URL;
  } else {
    state.dalgicSayfaPreviewReady = true;
    broadcastDalgicPreview();
  }
};
const handleDalgicPreviewMessage = (e) => {
  if (e.data?.type !== 'dalgic-sayfa-ready') return;
  state.dalgicSayfaPreviewReady = true;
  const status = $('#dalgic-preview-status');
  if (status) { status.textContent = 'Bağlı · Canlı'; status.classList.add('is-ready'); }
  broadcastDalgicPreview();
};

// ========================================
// INIT
// ========================================
const setupPanelListeners = () => {
  // Aynı listener'lar iki kez bağlanmasın diye flag
  if (setupPanelListeners._done) return;
  setupPanelListeners._done = true;

  // Sidebar
  $$('.nav-item').forEach(b => b.addEventListener('click', () => switchSection(b.dataset.section)));

  // Ayarlar — site geneli + şifre değiştirme
  $('#form-ayarlar-site')?.addEventListener('submit', handleSaveAyarlarSite);
  $('#form-sifre')?.addEventListener('submit', handleChangePassword);

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

  // Mesaj filtre chips
  $$('#msg-chips .chip').forEach(c => {
    c.addEventListener('click', () => {
      $$('#msg-chips .chip').forEach(x => x.classList.remove('active'));
      c.classList.add('active');
      state.msgFiltre = c.dataset.filterMsg;
      renderMessages();
    });
  });

  // Upload widget'ları
  initSingleUpload('kapak');
  initSingleUpload('vefa');
  initSingleUpload('calisma');
  initSingleUpload('kiz-proje');
  initSingleUpload('erkek-proje');
  mvwInit('kiz', schedulePreviewUpdate);
  mvwInit('erkek', scheduleErkekPreviewUpdate);
  // Sayfa görselleri upload widget'ları
  KIZ_GORSEL_SLOTS.forEach(({ key }) => initSingleUpload(key));
  ERKEK_GORSEL_SLOTS.forEach(({ key }) => initSingleUpload(key));
  BILEK_GORSEL_SLOTS.forEach(({ key }) => initSingleUpload(key));
  initVideoUpload('calisma');
  calismaGallery.init();
  rotaGallery.init();
  initSingleUpload('rota-hero');
  ROTA_GORSEL_SLOTS.forEach(({ key }) => initSingleUpload(key));
  initGalleryUpload();

  // ===== Vefa: tab + form + buttons =====
  $('#btn-yeni-vefa').addEventListener('click', openVefaNew);

  // Üst tab (3 tip)
  $$('#vefa-tabs .sub-tab').forEach(t => {
    t.addEventListener('click', () => {
      state.vefaTab = t.dataset.vefaTab;
      renderVefa();
    });
  });

  // Vefa modal close
  const closeVefaModal = () => { vefaModal.close(); state.vefaDraft = null; };
  $$('[data-vefa-close]').forEach(el => el.addEventListener('click', closeVefaModal));
  $('#modal-vefa').addEventListener('click', (e) => {
    if (e.target.id === 'modal-vefa') closeVefaModal();
  });

  // Vefa form submit
  const vefaForm = $('#form-vefa');
  vefaForm.addEventListener('submit', submitVefaForm);

  // Vefa: canlı önizleme wiring
  vefaForm.addEventListener('input', scheduleVefaPreviewUpdate);
  vefaForm.addEventListener('change', scheduleVefaPreviewUpdate);
  $('#uw-vefa-url')?.addEventListener('input', scheduleVefaPreviewUpdate);
  $('#t-vefa-yayin')?.addEventListener('click', () => setTimeout(scheduleVefaPreviewUpdate, 30));
  window.addEventListener('message', handleVefaPreviewMessage);

  $('#vefa-preview-jump')?.addEventListener('click', () => {
    const iframe = $('#vefa-preview-iframe');
    try { iframe.contentWindow.location.hash = '#yonetim-kurulu'; } catch (_) {}
  });
  $('#vefa-preview-reload')?.addEventListener('click', () => {
    const iframe = $('#vefa-preview-iframe');
    if (iframe) {
      state.vefaPreviewReady = false;
      const status = $('#vefa-preview-status');
      if (status) { status.textContent = 'Yükleniyor…'; status.className = 'preview-status'; }
      iframe.src = VEFA_PREVIEW_URL + '&_t=' + Date.now() + '#yonetim-kurulu';
    }
  });

  // Yönetim Kurulu Model Ayarı
  initYonetimModelPanel();

  // ===== Bağış Yönetimi =====
  try {
    $$('#bagis-tabs .sub-tab').forEach(t => {
      t.addEventListener('click', () => {
        state.bagisTab = t.dataset.bagisTab;
        renderBagis();
      });
    });
    $$('#bagis-kanal-chips .chip').forEach(c => {
      c.addEventListener('click', () => {
        state.bagisKanal = c.dataset.bagisKanal;
        renderBagis();
      });
    });
    $('#bagis-search')?.addEventListener('input', (e) => {
      state.bagisArama = e.target.value;
      renderBagisListe();
    });

    // Dekont modal close
    $$('[data-bagis-dekont-close]').forEach(el => el.addEventListener('click', closeDekontModal));
    $('#modal-bagis-dekont')?.addEventListener('click', (e) => {
      if (e.target.id === 'modal-bagis-dekont') closeDekontModal();
    });

    // Red modal close + submit
    $$('[data-bagis-red-close]').forEach(el => el.addEventListener('click', closeRedModal));
    $('#modal-bagis-red')?.addEventListener('click', (e) => {
      if (e.target.id === 'modal-bagis-red') closeRedModal();
    });
    $('#bagis-red-form')?.addEventListener('submit', submitRedForm);

    // Ayarlar form
    $('#bagis-settings-form')?.addEventListener('submit', submitAyarlarForm);

    // İlk render — section gizli olsa bile; spinner kalmasın diye
    renderBagis();
  } catch (e) {
    console.error('Bağış init hatası:', e);
  }

  // ===== Çalışmalar / Anılar =====
  try {
    $('#btn-calisma-yeni')?.addEventListener('click', openCalismaNew);
    $$('[data-calisma-close]').forEach(el => el.addEventListener('click', () => calismaModal.close()));
    $('#modal-calisma')?.addEventListener('click', (e) => {
      if (e.target.id === 'modal-calisma') calismaModal.close();
    });
    $('#form-calisma')?.addEventListener('submit', submitCalismaForm);
  } catch (e) {
    console.error('Çalışma init hatası:', e);
  }

  // ===== Kız Sayfası — Projeler =====
  try {
    $('#btn-yeni-kiz-proje')?.addEventListener('click', openKizNew);
    $('#btn-kiz-seed')?.addEventListener('click', seedKizProjeler);

    // Tab değişimi
    $$('#kiz-tabs .sub-tab').forEach(t => {
      t.addEventListener('click', () => {
        state.kizTab = t.dataset.kizTab;
        renderKiz();
      });
    });

    // Modal close
    $$('[data-kiz-close]').forEach(el => el.addEventListener('click', () => kizModal.close()));
    $('#modal-kiz-proje')?.addEventListener('click', (e) => {
      if (e.target.id === 'modal-kiz-proje') kizModal.close();
    });

    // Form submit
    $('#form-kiz-proje')?.addEventListener('submit', submitKizForm);

    // Sil butonu (edit modunda)
    $('#btn-kiz-proje-sil')?.addEventListener('click', () => {
      if (state.kizDuzenleId) {
        kizModal.close();
        confirmDeleteKiz(state.kizDuzenleId);
      }
    });

    // Bölüm ekle butonları
    $$('button[data-bolum-add]').forEach(b => {
      b.addEventListener('click', () => addKizBolum(b.dataset.bolumAdd));
    });

    // Form input → canlı önizleme (debounced)
    const form = $('#form-kiz-proje');
    if (form) {
      form.addEventListener('input', schedulePreviewUpdate);
      form.addEventListener('change', schedulePreviewUpdate);
    }
    // Toggle değişimini de dinle (data-toggle butonları zaten classList.toggle çalıştırıyor)
    $('#t-kiz-yayin')?.addEventListener('click', () => {
      setTimeout(schedulePreviewUpdate, 30);
    });
    // Görsel widget değişimi için kiz-proje URL input
    $('#uw-kiz-proje-url')?.addEventListener('input', schedulePreviewUpdate);

    // Preview iframe ready listeners
    window.addEventListener('message', handleKizPreviewMessage);
    window.addEventListener('message', handleKizSayfaPreviewMessage);

    // Sayfa görselleri kaydet
    $('#btn-kiz-sayfa-kaydet')?.addEventListener('click', async () => {
      const statusEl = $('#kiz-sayfa-status');

      // Her slot için URL topla (UW widget veya URL input)
      const fields = {};
      let anyUploading = false;
      KIZ_GORSEL_SLOTS.forEach(({ field, key }) => {
        if (uwState[key]?.uploading) { anyUploading = true; return; }
        // Boş slot '' olarak kaydedilir → eski görsel temizlenir (silme bug fix)
        fields[field] = uwState[key]?.url || ($(`#uw-${key}-url`)?.value?.trim() || '');
      });

      if (anyUploading) {
        toast('Görsel yükleniyor, lütfen bekleyin…', 'info');
        return;
      }

      if (statusEl) { statusEl.textContent = 'Kaydediliyor…'; statusEl.className = 'status-msg'; }
      try {
        await saveKizSayfaData(fields);
        state.kizSayfaData = { ...state.kizSayfaData, ...fields };
        if (statusEl) { statusEl.textContent = '✓ Kaydedildi'; statusEl.className = 'status-msg ok'; }
        setTimeout(() => { if (statusEl) statusEl.textContent = ''; }, 3000);
        toast('Sayfa görselleri kaydedildi.', 'success');
      } catch (err) {
        console.error('Sayfa görseli kaydetme hatası:', err);
        if (statusEl) { statusEl.textContent = 'Hata: ' + err.message; statusEl.className = 'status-msg err'; }
        toast('Kaydetme başarısız: ' + err.message, 'error');
      }
    });

    // Iframe yüklendiğinde durumu güncelle
    $('#kiz-preview-iframe')?.addEventListener('load', () => {
      // Iframe sayfası kendiliğinden preview-ready postMessage'ı atacak
      // O gelene kadar status "Yükleniyor…" kalır
    });

    // Preview head action butonları
    $('#kiz-preview-jump')?.addEventListener('click', () => {
      const iframe = $('#kiz-preview-iframe');
      try {
        // Same-origin: hash atayarak scroll tetikle
        iframe.contentWindow.location.hash = '#projeler';
      } catch (_) {
        iframe.src = KIZ_PREVIEW_URL_WITH_HASH;
      }
    });
    $('#kiz-preview-reload')?.addEventListener('click', () => {
      const iframe = $('#kiz-preview-iframe');
      if (iframe) {
        state.kizPreviewReady = false;
        const status = $('#kiz-preview-status');
        if (status) { status.textContent = 'Yenileniyor…'; status.className = 'preview-status'; }
        iframe.src = KIZ_PREVIEW_URL + '&_t=' + Date.now() + '#projeler';
      }
    });

    // Sayfa görselleri önizleme — yenile
    $('#kiz-sayfa-preview-reload')?.addEventListener('click', () => {
      const iframe = $('#kiz-sayfa-preview-iframe');
      if (iframe) {
        state.kizSayfaPreviewReady = false;
        const status = $('#kiz-sayfa-preview-status');
        if (status) { status.textContent = 'Yenileniyor…'; status.className = 'preview-status'; }
        iframe.src = KIZ_SAYFA_PREVIEW_URL + '&_t=' + Date.now();
      }
    });
  } catch (e) {
    console.error('Kız Sayfası init hatası:', e);
  }

  // ===== Erkek Sayfası — Projeler =====
  try {
    $('#btn-yeni-erkek-proje')?.addEventListener('click', openErkekNew);
    $('#btn-erkek-seed')?.addEventListener('click', seedErkekProjeler);

    // Tab değişimi
    $$('#erkek-tabs .sub-tab').forEach(t => {
      t.addEventListener('click', () => {
        state.erkekTab = t.dataset.erkekTab;
        renderErkek();
      });
    });

    // Modal close
    $$('[data-erkek-close]').forEach(el => el.addEventListener('click', () => erkekModal.close()));
    $('#modal-erkek-proje')?.addEventListener('click', (e) => {
      if (e.target.id === 'modal-erkek-proje') erkekModal.close();
    });

    // Form submit
    $('#form-erkek-proje')?.addEventListener('submit', submitErkekForm);

    // Sil butonu (edit modunda)
    $('#btn-erkek-proje-sil')?.addEventListener('click', () => {
      if (state.erkekDuzenleId) {
        erkekModal.close();
        confirmDeleteErkek(state.erkekDuzenleId);
      }
    });

    // Bölüm ekle butonları
    $$('button[data-erkek-bolum-add]').forEach(b => {
      b.addEventListener('click', () => addErkekBolum(b.dataset.erkekBolumAdd));
    });

    // Form input → canlı önizleme (debounced)
    const erkekForm = $('#form-erkek-proje');
    if (erkekForm) {
      erkekForm.addEventListener('input', scheduleErkekPreviewUpdate);
      erkekForm.addEventListener('change', scheduleErkekPreviewUpdate);
    }
    $('#t-erkek-yayin')?.addEventListener('click', () => {
      setTimeout(scheduleErkekPreviewUpdate, 30);
    });
    $('#uw-erkek-proje-url')?.addEventListener('input', scheduleErkekPreviewUpdate);

    // Preview iframe ready listeners
    window.addEventListener('message', handleErkekPreviewMessage);
    window.addEventListener('message', handleErkekSayfaPreviewMessage);

    // Sayfa görselleri kaydet
    $('#btn-erkek-sayfa-kaydet')?.addEventListener('click', async () => {
      const statusEl = $('#erkek-sayfa-status');
      const fields = {};
      let anyUploading = false;
      ERKEK_GORSEL_SLOTS.forEach(({ field, key }) => {
        if (uwState[key]?.uploading) { anyUploading = true; return; }
        // Boş slot '' olarak kaydedilir → eski görsel temizlenir (silme bug fix)
        fields[field] = uwState[key]?.url || ($(`#uw-${key}-url`)?.value?.trim() || '');
      });
      if (anyUploading) { toast('Görsel yükleniyor, lütfen bekleyin…', 'info'); return; }
      if (statusEl) { statusEl.textContent = 'Kaydediliyor…'; statusEl.className = 'status-msg'; }
      try {
        await saveErkekSayfaData(fields);
        state.erkekSayfaData = { ...state.erkekSayfaData, ...fields };
        if (statusEl) { statusEl.textContent = '✓ Kaydedildi'; statusEl.className = 'status-msg ok'; }
        setTimeout(() => { if (statusEl) statusEl.textContent = ''; }, 3000);
        toast('Sayfa görselleri kaydedildi.', 'success');
      } catch (err) {
        console.error('Erkek sayfa görseli kaydetme hatası:', err);
        if (statusEl) { statusEl.textContent = 'Hata: ' + err.message; statusEl.className = 'status-msg err'; }
        toast('Kaydetme başarısız: ' + err.message, 'error');
      }
    });

    $('#erkek-preview-iframe')?.addEventListener('load', () => {});

    $('#erkek-preview-jump')?.addEventListener('click', () => {
      const iframe = $('#erkek-preview-iframe');
      try {
        iframe.contentWindow.location.hash = '#projeler';
      } catch (_) {
        iframe.src = ERKEK_PREVIEW_URL_WITH_HASH;
      }
    });
    $('#erkek-preview-reload')?.addEventListener('click', () => {
      const iframe = $('#erkek-preview-iframe');
      if (iframe) {
        state.erkekPreviewReady = false;
        const status = $('#erkek-preview-status');
        if (status) { status.textContent = 'Yenileniyor…'; status.className = 'preview-status'; }
        iframe.src = ERKEK_PREVIEW_URL + '&_t=' + Date.now() + '#projeler';
      }
    });

    // Sayfa görselleri önizleme — yenile
    $('#erkek-sayfa-preview-reload')?.addEventListener('click', () => {
      const iframe = $('#erkek-sayfa-preview-iframe');
      if (iframe) {
        state.erkekSayfaPreviewReady = false;
        const status = $('#erkek-sayfa-preview-status');
        if (status) { status.textContent = 'Yenileniyor…'; status.className = 'preview-status'; }
        iframe.src = ERKEK_SAYFA_PREVIEW_URL + '&_t=' + Date.now();
      }
    });
  } catch (e) {
    console.error('Erkek Sayfası init hatası:', e);
  }

  // ===== Rota — Gençlik Buluşmaları sayfa görselleri =====
  try {
    // Kaydet
    $('#btn-rota-sayfa-kaydet')?.addEventListener('click', async () => {
      const statusEl = $('#rota-sayfa-status');
      if (rotaIsBusy()) { toast('Görsel yükleniyor, lütfen bekleyin…', 'info'); return; }
      if (statusEl) { statusEl.textContent = 'Kaydediliyor…'; statusEl.className = 'status-msg'; }
      try {
        await saveRotaSayfaData(collectRotaSayfaData());
        if (statusEl) { statusEl.textContent = '✓ Kaydedildi'; statusEl.className = 'status-msg ok'; }
        setTimeout(() => { if (statusEl) statusEl.textContent = ''; }, 3000);
        toast('Rota sayfası görselleri kaydedildi.', 'success');
      } catch (err) {
        console.error('Rota sayfası kaydetme hatası:', err);
        if (statusEl) { statusEl.textContent = 'Hata: ' + err.message; statusEl.className = 'status-msg err'; }
        toast('Kaydetme başarısız: ' + err.message, 'error');
      }
    });

    // Preview ready listener + yenile
    window.addEventListener('message', handleRotaPreviewMessage);
    $('#rota-preview-reload')?.addEventListener('click', () => {
      const iframe = $('#rota-sayfa-preview-iframe');
      if (iframe) {
        state.rotaSayfaPreviewReady = false;
        const status = $('#rota-preview-status');
        if (status) { status.textContent = 'Yenileniyor…'; status.className = 'preview-status'; }
        iframe.src = ROTA_SAYFA_PREVIEW_URL + '&_t=' + Date.now();
      }
    });
  } catch (e) {
    console.error('Rota init hatası:', e);
  }

  // ===== Dalgıçlık — Akdeniz'den Kareler galerisi =====
  try {
    const dalgicInput = $('#dalgic-file-input');

    $('#btn-dalgic-ekle')?.addEventListener('click', () => {
      dalgicReplaceTarget = null;
      dalgicInput?.click();
    });

    dalgicInput?.addEventListener('change', (e) => {
      const files = e.target.files;
      if (files?.length) {
        if (dalgicReplaceTarget != null) dalgicReplaceFile(files[0]);
        else dalgicAddFiles(files);
      }
      dalgicInput.value = '';
    });

    // Liste içi alan düzenleme + buton aksiyonları (event delegation)
    const dalgicList = $('#dalgic-list');
    dalgicList?.addEventListener('input', (e) => {
      const field = e.target.dataset?.dglField;
      if (!field) return;
      const card = e.target.closest('.dgl-card');
      const item = dalgicItemByTempId(card?.dataset.tempid);
      if (!item) return;
      if (field === 'baslik')   item.baslik = e.target.value;
      if (field === 'kategori') item.kategori = e.target.value;
      if (field === 'sira')     item.sira = parseInt(e.target.value, 10) || 0;
      if (field === 'genis')    item.genis = e.target.checked;
      scheduleDalgicPreviewUpdate();
    });
    dalgicList?.addEventListener('change', (e) => {
      if (e.target.dataset?.dglField) scheduleDalgicPreviewUpdate();
    });
    dalgicList?.addEventListener('click', (e) => {
      const card = e.target.closest('.dgl-card');
      if (!card) return;
      const tempId = Number(card.dataset.tempid);
      if (e.target.closest('[data-dgl-remove]')) {
        const item = dalgicItemByTempId(tempId);
        if (item?._localUrl) URL.revokeObjectURL(item._localUrl);
        state.dalgicGaleri = state.dalgicGaleri.filter(i => i._tempId !== tempId);
        renderDalgicGaleri();
        scheduleDalgicPreviewUpdate();
      }
      if (e.target.closest('[data-dgl-replace]')) {
        dalgicReplaceTarget = tempId;
        dalgicInput?.click();
      }
    });

    // Kaydet
    $('#btn-dalgic-kaydet')?.addEventListener('click', async () => {
      const statusEl = $('#dalgic-status');
      if (dalgicIsBusy()) { toast('Görsel yükleniyor, lütfen bekleyin…', 'info'); return; }
      if (statusEl) { statusEl.textContent = 'Kaydediliyor…'; statusEl.className = 'status-msg'; }
      try {
        await saveDalgicSayfaData(dalgicCleanGaleri());
        if (statusEl) { statusEl.textContent = '✓ Kaydedildi'; statusEl.className = 'status-msg ok'; }
        setTimeout(() => { if (statusEl) statusEl.textContent = ''; }, 3000);
        toast('Galeri kaydedildi.', 'success');
      } catch (err) {
        console.error('Dalgıçlık galerisi kaydetme hatası:', err);
        if (statusEl) { statusEl.textContent = 'Hata: ' + err.message; statusEl.className = 'status-msg err'; }
        toast('Kaydetme başarısız: ' + err.message, 'error');
      }
    });

    // Preview ready listener + yenile
    window.addEventListener('message', handleDalgicPreviewMessage);
    $('#dalgic-preview-reload')?.addEventListener('click', () => {
      const iframe = $('#dalgic-sayfa-preview-iframe');
      if (iframe) {
        state.dalgicSayfaPreviewReady = false;
        const status = $('#dalgic-preview-status');
        if (status) { status.textContent = 'Yenileniyor…'; status.className = 'preview-status'; }
        iframe.src = DALGIC_SAYFA_PREVIEW_URL + '&_t=' + Date.now();
      }
    });
  } catch (e) {
    console.error('Dalgıçlık init hatası:', e);
  }

  // ===== Bilek Güreşi — Sayfa yönetimi =====
  try {
    // Preview ready listener
    window.addEventListener('message', handleBilekSayfaPreviewMessage);

    // Metin alanları → canlı önizleme (debounced)
    $('#section-bilek')?.addEventListener('input', (e) => {
      if (e.target.matches('[data-bilek-field]')) scheduleBilekSayfaPreviewUpdate();
    });

    // Kaydet
    $('#btn-bilek-kaydet')?.addEventListener('click', async () => {
      const statusEl = $('#bilek-status');

      // Görsel yükleniyorsa bekle
      const anyUploading = BILEK_GORSEL_SLOTS.some(({ key }) => uwState[key]?.uploading);
      if (anyUploading) {
        toast('Görsel yükleniyor, lütfen bekleyin…', 'info');
        return;
      }

      const fields = collectBilekSayfaData();
      if (statusEl) { statusEl.textContent = 'Kaydediliyor…'; statusEl.className = 'status-msg'; }
      try {
        await saveBilekSayfaData(fields);
        state.bilekSayfaData = { ...state.bilekSayfaData, ...fields };
        if (statusEl) { statusEl.textContent = '✓ Kaydedildi'; statusEl.className = 'status-msg ok'; }
        setTimeout(() => { if (statusEl) statusEl.textContent = ''; }, 3000);
        toast('Bilek Güreşi sayfası kaydedildi.', 'success');
      } catch (err) {
        console.error('Bilek Güreşi kaydetme hatası:', err);
        if (statusEl) { statusEl.textContent = 'Hata: ' + err.message; statusEl.className = 'status-msg err'; }
        toast('Kaydetme başarısız: ' + err.message, 'error');
      }
    });

    // Önizlemeyi yenile
    $('#bilek-preview-reload')?.addEventListener('click', () => {
      const iframe = $('#bilek-sayfa-preview-iframe');
      if (iframe) {
        state.bilekSayfaPreviewReady = false;
        const status = $('#bilek-preview-status');
        if (status) { status.textContent = 'Yenileniyor…'; status.className = 'preview-status'; }
        iframe.src = BILEK_SAYFA_PREVIEW_URL + '&_t=' + Date.now();
      }
    });
  } catch (e) {
    console.error('Bilek Güreşi init hatası:', e);
  }

  // Logout
  $('#btn-logout').addEventListener('click', handleLogout);
};

const init = async () => {
  // Login formu her zaman bağlanır
  $('#auth-form').addEventListener('submit', handleLogin);

  // Firebase'i bekle, sonra auth state listener kur
  await waitFirebase();
  const { auth, onAuthStateChanged } = window.FB;

  let everLoggedIn = false;
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      everLoggedIn = true;
      hideAuthGate(user);
      setupPanelListeners();
      await refresh();
    } else {
      // Açık çıkış yapıldıysa VEYA henüz hiç giriş yapılmadıysa login ekranını göster.
      // Aksi halde (giriş sonrası gelen geçici null'lar) yok say.
      if (isLoggingOut || !everLoggedIn) {
        isLoggingOut = false;
        everLoggedIn = false;
        showAuthGate();
      }
    }
  });
};

document.addEventListener('DOMContentLoaded', init);
