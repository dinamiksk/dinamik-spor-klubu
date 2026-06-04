/**
 * DİNAMİK SPOR KULÜBÜ - Firebase Bağlantısı
 * ==========================================
 * window.FB üzerinden Firestore + Auth fonksiyonları erişilir.
 * window.firebaseReady promise'i ile init bitmesini beklenebilir.
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB80zNjJBMG0wr_QnK15vlcjXwjajKy-rk",
  authDomain: "dinamik-spor-klubu.firebaseapp.com",
  projectId: "dinamik-spor-klubu",
  storageBucket: "dinamik-spor-klubu.firebasestorage.app",
  messagingSenderId: "550383748316",
  appId: "1:550383748316:web:608c217034c9fffcebe019"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Tarayıcı kapansa bile login açık kalsın
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn("Auth persistence ayarlanamadı:", err);
});

window.FB = {
  // Firestore
  db,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  // Auth
  auth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  ready: true
};

window.firebaseReady = Promise.resolve(window.FB);

console.log("%c🔥 Firebase hazır (Firestore + Auth)", "color: #f97316; font-weight: bold");

window.dispatchEvent(new Event("firebase-ready"));

// =============================================================
// CLOUDINARY — Görsel hosting
// =============================================================
window.CLOUDINARY = {
  cloudName: "dnh3mgmhr",
  uploadPreset: "dinamik_unsigned",
  folder: "dinamik-spor"
};

/**
 * Tarayıcıdan Cloudinary'ye direct upload (unsigned).
 * @param {File|Blob} file Yüklenecek dosya
 * @param {(percent:number)=>void} [onProgress] Yüzde callback'i (0-100)
 * @returns {Promise<{secure_url:string, public_id:string, width:number, height:number, format:string, bytes:number}>}
 */
window.uploadToCloudinary = (file, onProgress) => {
  // Sadece her tarayıcıda (Safari + Chrome/Firefox) açılan formatlara izin ver.
  // HEIC/HEIF (iPhone), SVG, TIFF vb. engellenir; aksi halde görsel Chrome'da açılmaz.
  const name = (file && file.name) || "";
  const type = ((file && file.type) || "").toLowerCase();
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
  const extOk  = /\.(jpe?g|png|webp|gif|svg)$/i.test(name);
  const typeOk = ALLOWED_TYPES.includes(type);
  const isHeic = /heic|heif/i.test(type) || /\.(heic|heif)$/i.test(name);
  if (isHeic || (!typeOk && !extOk)) {
    return Promise.reject(new Error(
      "Bu görsel formatı web'de açılamıyor (örn. iPhone HEIC). " +
      "Lütfen JPG, PNG veya WebP formatında bir görsel yükleyin."
    ));
  }
  return cldUpload(file, onProgress, "image");
};

/**
 * Video upload — Cloudinary video/upload endpoint.
 * Preset 'Resource type: Auto' veya 'Video' olmalı.
 * Free tier: tek dosya max 100 MB.
 */
window.uploadVideoToCloudinary = (file, onProgress) => {
  return cldUpload(file, onProgress, "video");
};

function cldUpload(file, onProgress, resourceType) {
  const url = `https://api.cloudinary.com/v1_1/${window.CLOUDINARY.cloudName}/${resourceType}/upload`;
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", window.CLOUDINARY.uploadPreset);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try { resolve(JSON.parse(xhr.responseText)); }
        catch (err) { reject(new Error("Cloudinary yanıtı geçersiz JSON")); }
      } else {
        let msg = `Cloudinary hatası (${xhr.status})`;
        try {
          const err = JSON.parse(xhr.responseText);
          if (err?.error?.message) msg = err.error.message;
        } catch {}
        reject(new Error(msg));
      }
    };
    xhr.onerror = () => reject(new Error("Cloudinary bağlantı hatası — internet kontrol edin"));
    xhr.send(fd);
  });
}

/**
 * Tarayıcıda görseli yeniden boyutlandır + WebP'ye çevir.
 * 1600px üstü görseller küçültülür, kalite %82.
 * HEIC/HEIF ve SVG'ler dokunulmadan döner (browser desteği yok).
 */
window.resizeImage = async (file, maxSize = 1600, quality = 0.82) => {
  if (!file || !file.type) return file;
  if (/heic|heif/i.test(file.type) || /\.(heic|heif)$/i.test(file.name || "")) return file;
  if (/svg/i.test(file.type)) return file;
  if (!/^image\//.test(file.type)) return file;

  const img = new Image();
  const objUrl = URL.createObjectURL(file);
  try {
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => reject(new Error("Görsel okunamadı"));
      img.src = objUrl;
    });

    let { width, height } = img;
    if (width > maxSize || height > maxSize) {
      const ratio = Math.min(maxSize / width, maxSize / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d").drawImage(img, 0, 0, width, height);

    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("Görsel dönüştürülemedi"))),
        "image/webp",
        quality
      );
    });

    const baseName = (file.name || "image").replace(/\.\w+$/, "");
    return new File([blob], `${baseName}.webp`, { type: "image/webp" });
  } finally {
    URL.revokeObjectURL(objUrl);
  }
};

/**
 * Cloudinary URL'ine transform parametresi ekle.
 * /upload/ ile public_id arasına yerleştirir.
 * Cloudinary URL değilse veya boşsa olduğu gibi döner (dış URL'lere uyumlu).
 */
window.cldUrl = (url, transform = "q_auto,f_auto") => {
  if (!url || typeof url !== "string") return url;
  if (!url.includes("res.cloudinary.com")) return url;
  if (!url.includes("/upload/")) return url;
  return url.replace("/upload/", `/upload/${transform}/`);
};

// Yaygın varyantlar — sayfalarda kullanılacak
window.cldThumb       = (u) => window.cldUrl(u, "w_400,h_300,c_fill,q_auto,f_auto");
window.cldThumbSmall  = (u) => window.cldUrl(u, "w_120,h_120,c_fill,q_auto,f_auto");
window.cldHero        = (u) => window.cldUrl(u, "w_1200,q_auto,f_auto");
window.cldGallery     = (u) => window.cldUrl(u, "w_1600,q_auto,f_auto");

// Sığdır (kırpmadan) — orijinal oranı korur, sadece üst sınır verir.
window.cldFit         = (u, w = 1200) => window.cldUrl(u, `w_${w},q_auto,f_auto`);

/**
 * Video URL'ine bandwidth-friendly transform ekle.
 *  - q_auto:eco → düşük bitrate (kalite kaybı kabul edilebilir, ~%30 daha az veri)
 *  - f_auto    → tarayıcıya göre format (av1/h264)
 *  - w_<w>     → max genişlik (ölçek). 720 default, 1080 retina.
 */
window.cldVideo = (url, transform = "q_auto:eco,f_auto,w_720") => {
  if (!url || typeof url !== "string") return url;
  if (!url.includes("res.cloudinary.com")) return url;
  if (!url.includes("/upload/")) return url;
  return url.replace("/upload/", `/upload/${transform}/`);
};

/** Video poster (kapak) URL — video'dan auto-generated jpg thumbnail */
window.cldVideoPoster = (url, transform = "w_800,q_auto,f_jpg") => {
  if (!url || typeof url !== "string") return url;
  if (!url.includes("res.cloudinary.com")) return url;
  // /video/upload/ → /video/upload/<t>/<file>.jpg
  const out = url.replace("/upload/", `/upload/${transform}/`);
  return out.replace(/\.(mp4|mov|webm|m4v|avi|mkv)(\?|$)/i, ".jpg$2");
};

/**
 * Akıllı görsel kapsayıcısı — bulanık arka plan + tam görsel.
 * Görsel oranı ne olursa olsun (yatay/dikey) sabit oranlı kutuya
 * KIRPILMADAN sığar; boş kalan yerleri görselin bulanık kopyası doldurur.
 *
 * Kullanım:
 *   container.innerHTML = window.smartImg(url, alt, { ratio: '16/10' });
 *
 * Opsiyonlar:
 *   ratio       : '16/10' (varsayılan), '16/9', '4/3', '1/1' vb.
 *   foregroundW : tam görsel için max genişlik (px). Varsayılan 1200.
 *   backgroundW : bulanık arka plan için genişlik (px). Varsayılan 400.
 *   klass       : ekstra CSS class
 *   eager       : true ise loading="eager" (ilk ekran için)
 *   placeholder : görsel yoksa gösterilecek glyph
 */
window.smartImg = (url, alt = "", opts = {}) => {
  const {
    ratio = "16/10",
    foregroundW = 1200,
    backgroundW = 400,
    klass = "",
    eager = false,
    placeholder = "◇"
  } = opts;
  const loading = eager ? "eager" : "lazy";
  const safeAlt = String(alt || "").replace(/"/g, "&quot;");

  if (!url) {
    return `<div class="smart-img smart-img--empty ${klass}" style="aspect-ratio:${ratio};">
      <span class="smart-img__ph">${placeholder}</span>
    </div>`;
  }
  const fgUrl = window.cldFit(url, foregroundW);
  const bgUrl = window.cldFit(url, backgroundW);
  // Bg artık <img> değil — CSS background-image. Safari'nin position:absolute+img
  // davranışsızlığını ortadan kaldırır.
  const safeBg = bgUrl.replace(/'/g, "%27");
  return `<div class="smart-img ${klass}" style="aspect-ratio:${ratio}; --smart-img-bg:url('${safeBg}');">
    <img class="smart-img__fg" src="${fgUrl}" alt="${safeAlt}" loading="${loading}" decoding="async">
  </div>`;
};

console.log("%c☁️  Cloudinary hazır", "color: #3b82f6; font-weight: bold");

// =============================================================
// ARŞİV — 12 ay otomatik yaşlanma + manuel toggle
// =============================================================
window.ARSIV_GUN = 365;

/**
 * Bir içerik arşivde mi?
 *  - item.arsiv === true (admin manuel)
 *  - VEYA item.tarih > 365 gün önce
 */
window.isArchived = (item) => {
  if (!item) return false;
  if (item.arsiv === true) return true;
  if (item.tarih) {
    const t = new Date(item.tarih).getTime();
    if (!isNaN(t)) {
      const yas = (Date.now() - t) / (24 * 3600 * 1000);
      if (yas > window.ARSIV_GUN) return true;
    }
  }
  return false;
};

/** Public sayfalarda gösterilmeli mi? (yayında + arşivde değil) */
window.isPublicVisible = (item) => {
  if (!item || item.yayinda === false) return false;
  return !window.isArchived(item);
};
