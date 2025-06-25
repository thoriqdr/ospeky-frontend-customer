// src/components/OnboardingModal.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import './OnboardingModal.css';

const OnboardingModal = ({ onClose }) => {
    // Ambil semua yang dibutuhkan dari AuthContext
    const { userProfile, updateUserProfile, refreshUserProfile } = useAuth();
    
    // State lokal hanya untuk form
    const [formData, setFormData] = useState({ nama: '', nomorHp: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // useEffect untuk mengisi form dengan data dari context
    useEffect(() => {
        if (userProfile) {
            // Pastikan nilai tidak pernah null untuk menghindari error "uncontrolled input"
            setFormData({
                nama: userProfile.nama || '',
                email: userProfile.email || '',
                nomorHp: userProfile.nomorHp || ''
            });
        }
    }, [userProfile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSave = async () => {
        if (!formData.nomorHp || formData.nomorHp.trim() === '') {
            setError('Nomor HP wajib diisi untuk melanjutkan.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            // Panggil satu fungsi update dari context
            await updateUserProfile({
                nama: formData.nama,
                nomorHp: formData.nomorHp,
            });
            setSuccess(true); // Tampilkan pesan sukses
            
            // Tutup modal setelah 2 detik
            setTimeout(() => {
                onClose();
                // Refresh data di seluruh aplikasi (opsional, tapi bagus)
                refreshUserProfile(); 
            }, 2000);

        } catch (err) {
            setError('Gagal menyimpan profil. Coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="onboarding-modal-overlay">
            <div className="onboarding-modal-content">
                <h3>Selamat Datang di Ospeky!</h3>
                <p className="subtitle">Satu langkah lagi, mohon lengkapi detail profil Anda.</p>
                
                {success ? (
                    <div className="onboarding-success">
                        <p>✅ Profil berhasil diperbarui!</p>
                    </div>
                ) : (
                    <div className="onboarding-form">
                        <div className="onboarding-form-group">
                            <label>Nama Lengkap</label>
                            <input type="text" name="nama" value={formData.nama} onChange={handleChange} />
                        </div>
                        <div className="onboarding-form-group">
                            <label>Email</label>
                            <input type="email" name="email" value={formData.email} disabled />
                        </div>
                        <div className="onboarding-form-group">
                            <label>Nomor HP (Wajib Diisi)</label>
                            <input type="tel" name="nomorHp" value={formData.nomorHp} onChange={handleChange} placeholder="Contoh: 08123456789" />
                        </div>
                    </div>
                )}

                {error && <p className="onboarding-error">{error}</p>}

                {/* Jangan tampilkan tombol simpan jika sudah sukses */}
                {!success && (
                    <button 
                        className="onboarding-save-btn" 
                        onClick={handleSave}
                        disabled={!formData.nomorHp || loading}
                    >
                        {loading ? 'Menyimpan...' : 'Simpan & Lanjutkan'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default OnboardingModal;