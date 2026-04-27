/**
 * DİNAMİK SPOR KULÜBÜ - Firebase Bağlantısı
 * ==========================================
 * Bu dosya Firebase'i başlatır ve site genelinde kullanılabilir hale getirir.
 * Diğer JS dosyaları window.FB üzerinden erişir.
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

window.FB = {
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
  ready: true
};

// Bağlantı testi — yüklenince Firestore'a bir test kaydı yazar
(async () => {
  try {
    const testRef = await addDoc(collection(db, "_test_baglanti"), {
      mesaj: "Firebase bağlantı testi başarılı",
      zaman: serverTimestamp(),
      sayfa: location.pathname
    });
    console.log("%c✅ Firebase bağlandı!", "color: #4ade80; font-weight: bold; font-size: 14px");
    console.log("Test kayıt ID:", testRef.id);
    console.log("Firebase console'dan kontrol edebilirsin: _test_baglanti koleksiyonu");
  } catch (e) {
    console.error("%c❌ Firebase bağlantı hatası:", "color: #ef4444; font-weight: bold", e);
  }
})();

window.dispatchEvent(new Event("firebase-ready"));
