// src/pages/ProfilePage.jsx (Dengan Logika Cek Provider)

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ConfirmationModal from '../components/ConfirmationModal';
import ChangePasswordModal from '../components/ChangePasswordModal';
import axios from 'axios';
import './ProfilePage.css';

const ProfilePage = () => {
    const navigate = useNavigate();
    const { currentUser, logout } = useAuth();
    
    const [profileData, setProfileData] = useState({ nama: 'Memuat...' });
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            if (currentUser) {
                try {
                    const token = await currentUser.getIdToken();
                    const config = { headers: { Authorization: `Bearer ${token}` } };
                    const { data } = await axios.get('/api/users/profile', config);
                    setProfileData(data);
                } catch (error) {
                    console.error("Gagal mengambil profil:", error);
                    setProfileData({ nama: currentUser.displayName || 'Nama Pengguna' });
                }
            }
        };
        fetchProfile();
    }, [currentUser]);

    // --- LOGIKA BARU UNTUK CEK METODE LOGIN ---
    // Cek apakah provider pengguna mengandung 'password'. 
    // Jika ya, berarti dia mendaftar dengan email & password.
    const hasPasswordProvider = currentUser?.providerData.some(
        (provider) => provider.providerId === 'password'
    );

    const handleBackToHome = () => navigate('/', { state: { openNavMenu: true } });
    const handleLogoutClick = () => setIsLogoutModalOpen(true);
    const handleConfirmLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error("Gagal untuk logout:", error);
        } finally {
            setIsLogoutModalOpen(false);
        }
    };

    return (
        <div className="profile-page-container">
            <header className="profile-header">
                <button className="back-button-profile" onClick={handleBackToHome}>
                    <img src="/icons/back-arrow.svg" alt="Kembali" />
                </button>
                <div className="profile-pic-container">
                    <img src="/icons/profile.svg" alt="Profile" />
                </div>
                <h1 className="profile-name">{profileData.nama}</h1>
            </header>

            <div className="profile-menu">
                <Link to="/profile/details" className="profile-menu-item">
                    <span>Detail Pribadi</span>
                    <span className="material-icons-outlined arrow-icon">chevron_right</span>
                </Link>
                <Link to="/profile/addresses" className="profile-menu-item">
                    <span>Alamat Saya</span>
                    <span className="material-icons-outlined arrow-icon">chevron_right</span>
                </Link>
                
                {/* --- TAMPILKAN MENU GANTI PASSWORD HANYA JIKA PERLU --- */}
                {hasPasswordProvider && (
                    <div className="profile-menu-item" onClick={() => setIsPasswordModalOpen(true)}>
                        <span>Ganti Password</span>
                        <span className="material-icons-outlined arrow-icon">chevron_right</span>
                    </div>
                )}

                <div onClick={handleLogoutClick} className="profile-menu-item logout">
                    <span>Log Out</span>
                    <span className="material-icons-outlined arrow-icon">chevron_right</span>
                </div>
            </div>
            
            <ConfirmationModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleConfirmLogout}
                title="Konfirmasi Logout"
                message="Apakah Anda yakin ingin keluar dari akun Anda?"
            />

            <ChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
            />
        </div>
    );
};

export default ProfilePage;