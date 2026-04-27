/**
 * DİNAMİK SPOR KULÜBÜ - Firebase Bağlantısı
 * ==========================================
 * window.FB üzerinden Firestore fonksiyonları erişilir.
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

window.firebaseReady = Promise.resolve(window.FB);

console.log("%c🔥 Firebase hazır", "color: #f97316; font-weight: bold");

window.dispatchEvent(new Event("firebase-ready"));
