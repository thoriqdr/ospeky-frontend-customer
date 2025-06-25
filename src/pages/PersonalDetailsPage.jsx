// src/pages/PersonalDetailsPage.jsx (Versi Final Lengkap)

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ConfirmationModal from '../components/ConfirmationModal';
import api from '../api/api';
import './PersonalDetailsPage.css';

const PersonalDetailsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser } = useAuth();

    // --- State Management ---
    const [profileData, setProfileData] = useState({ nama: '', email: '', nomorHp: '' });
    const [tempProfileData, setTempProfileData] = useState({ nama: '', email: '', nomorHp: '' });
    const [isEditMode, setIsEditMode] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const isNewGoogleUser = location.state?.fromNewGoogleUser;

    // --- Hooks ---
    useEffect(() => {
        const fetchProfile = async () => {
            if (currentUser) {
                try {
                    setLoading(true);
                    const { data } = await api.get('/users/profile');

                    setProfileData(data);
                    setTempProfileData(data);
                    if (isNewGoogleUser) {
                        setIsEditMode(true);
                    }
                } catch (error) {
                    console.error("Gagal mengambil profil:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchProfile(); // 2. Panggil di dalam useEffect

        // 3. Jangan lupa dependency array agar tidak berjalan terus-menerus
    }, [currentUser, isNewGoogleUser]);

    // --- Handler Functions ---
    const hasUnsavedChanges = JSON.stringify(profileData) !== JSON.stringify(tempProfileData);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTempProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleBackClick = () => {
        if (isEditMode && hasUnsavedChanges) {
            setIsConfirmModalOpen(true);
        } else {
            navigate('/profile');
        }
    };

    const handleConfirmSave = async () => {
        setIsConfirmModalOpen(false);
        try {
            // Hapus juga logika token dan config di sini.
            const { data } = await api.patch('/users/profile', tempProfileData);

            setProfileData(data.user);
            setIsEditMode(false);
            alert('Perubahan berhasil disimpan!');
        } catch (error) {
            console.error('Gagal menyimpan perubahan:', error);
            alert('Gagal menyimpan perubahan.');
        }
    };

    // --- Render Logic ---
    if (loading) {
        return <p style={{ textAlign: 'center', marginTop: '3rem' }}>Memuat...</p>;
    }

    return (
        <div className="pd-page-wrapper">
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleConfirmSave}
                title="Simpan Perubahan?"
                message="Anda memiliki perubahan yang belum disimpan. Apakah Anda ingin menyimpannya sekarang?"
            />

            <header className="pd-header">
                <button className="pd-back-btn" onClick={handleBackClick}>
                    <img src="/icons/back-arrow-white.svg" alt="Kembali" />
                </button>
                <h1 className="pd-header-title">Detail Pribadi</h1>
                <button
                    className={`pd-main-edit-btn ${isEditMode ? 'save' : 'edit'}`}
                    onClick={() => {
                        if (isEditMode) {
                            if (hasUnsavedChanges) setIsConfirmModalOpen(true);
                            else setIsEditMode(false);
                        } else {
                            setIsEditMode(true);
                        }
                    }}
                >
                    {isEditMode ? 'Simpan' : 'Edit'}
                </button>
            </header>

            <main className="pd-content">
                {isNewGoogleUser && (
                    <div className="welcome-banner">
                        Selamat datang! Silakan lengkapi profil Anda di bawah ini.
                    </div>
                )}
                <div className="pd-info-card">
                    <div className="pd-form-group">
                        <label>Nama</label>
                        {isEditMode ? (
                            <input type="text" name="nama" className="pd-input" value={tempProfileData.nama} onChange={handleInputChange} />
                        ) : (
                            <span className="pd-value">{profileData.nama}</span>
                        )}
                    </div>
                    <div className="pd-form-group">
                        <label>Email</label>
                        {isEditMode ? (
                            <input type="email" name="email" className="pd-input" value={tempProfileData.email} onChange={handleInputChange} />
                        ) : (
                            <span className="pd-value">{profileData.email}</span>
                        )}
                    </div>
                    <div className="pd-form-group no-border">
                        <label>Info Kontak</label>
                        {isEditMode ? (
                            <input type="tel" name="nomorHp" className="pd-input" value={tempProfileData.nomorHp} onChange={handleInputChange} placeholder="Belum diatur" />
                        ) : (
                            <span className="pd-value">{profileData.nomorHp || 'Belum diatur'}</span>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PersonalDetailsPage;