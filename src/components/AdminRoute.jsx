// src/components/AdminRoute.jsx

import React from 'react';
import { useAuth } from '../context/AuthContext';
import useUserProfile from '../hooks/useUserProfile'; // 1. Impor hook profil
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
    const { currentUser, loading: authLoading } = useAuth(); // Ambil status loading dari AuthContext
    const userProfile = useUserProfile(); // Ambil profil dari database

    // 2. Tampilkan loading jika otentikasi atau pengambilan profil sedang berjalan
    if (authLoading) {
        return <div className="loading-screen">Memeriksa otentikasi...</div>;
    }
    
    // 3. Jika tidak ada pengguna yang login sama sekali, lempar ke halaman login
    if (!currentUser) {
        return <Navigate to="/admin/login" />;
    }

    // 4. Setelah user ada, kita tunggu data profilnya
    // 'userProfile' akan null saat pertama kali dimuat
    if (!userProfile) {
        return <div className="loading-screen">Memuat profil pengguna...</div>;
    }

    // 5. Setelah semua data ada, baru lakukan pengecekan role
    if (userProfile.role === 'ADMIN') {
        return <Outlet />; // Jika admin, tampilkan halaman (ScannerPage)
    } else {
        // Jika login tapi bukan admin, lempar ke halaman utama (atau halaman "Akses Ditolak")
        return <Navigate to="/" />; 
    }
};

// CSS sederhana untuk layar loading
const styles = `
.loading-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: 1.2rem;
  font-family: sans-serif;
  color: #333;
}
`;

// Tambahkan style ke dalam komponen
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);


export default AdminRoute;