// src/firebase/firebaseConfig.js

import { initializeApp } from "firebase/app";
// 1. KEMBALIKAN impor getAuth
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Ini adalah konfigurasi BARU Anda yang sudah benar dan kita hardcode untuk sementara
const firebaseConfig = {
  apiKey: "AIzaSyCjZM_HyecPa_GZjja_gLQfFVyMYT3kXWk",
  authDomain: "ospeky-project.firebaseapp.com",
  projectId: "ospeky-project",
  storageBucket: "ospeky-project.firebasestorage.app",
  messagingSenderId: "79969410779",
  appId: "1:79969410779:web:2a104c41a3ada22b8636fe"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// 2. KEMBALIKAN ekspor auth. Kode ini sekarang akan berhasil
// karena API di Google Cloud sudah Anda aktifkan.
export const auth = getAuth(app);
export const db = getFirestore(app);