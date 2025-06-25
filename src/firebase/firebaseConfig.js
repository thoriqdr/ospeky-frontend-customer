// src/firebase/firebaseConfig.js (Versi Aman dengan Environment Variables)

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// =========================================================================================
// PERUBAHAN UNTUK KEAMANAN
// KETERANGAN: Konfigurasi sekarang dibaca dari Environment Variables (import.meta.env)
//             sehingga tidak ada kunci rahasia yang tersimpan di dalam kode.
// =========================================================================================
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Ekspor auth dan db
export const auth = getAuth(app);
export const db = getFirestore(app);