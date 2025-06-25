// src/components/ChangePasswordModal.jsx (Dengan Perbaikan Tipe Input Dinamis)

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './ChangePasswordModal.css';

const ChangePasswordModal = ({ isOpen, onClose }) => {
    const { changeUserPassword } = useAuth();
    
    // State untuk form
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // State untuk visibility password
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return setError('Password baru tidak cocok.');
        }
        if (newPassword.length < 6) {
            return setError('Password baru minimal harus 6 karakter.');
        }

        setError('');
        setLoading(true);

        try {
            await changeUserPassword(oldPassword, newPassword);
            alert('Password berhasil diubah!');
            handleClose();
        } catch (err) {
            if (err.code === 'auth/wrong-password') {
                setError('Password lama yang Anda masukkan salah.');
            } else {
                setError('Terjadi kesalahan. Silakan coba lagi.');
                console.error(err);
            }
        } finally {
            setLoading(false);
        }
    };
    
    const handleClose = () => {
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setError('');
        setLoading(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content-pw" onClick={(e) => e.stopPropagation()}>
                <h2 className="modal-title-pw">Ganti Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group-pw">
                        <label htmlFor="oldPassword">Password Lama</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showOldPassword ? 'text' : 'password'}
                                id="oldPassword"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                // Petunjuk untuk password saat ini
                                autoComplete="current-password"
                                required
                            />
                            <button type="button" className="password-toggle-btn" onClick={() => setShowOldPassword(!showOldPassword)}>
                                <img src={showOldPassword ? '/icons/visibility_off.svg' : '/icons/visibility_on.svg'} alt="Toggle visibility" />
                            </button>
                        </div>
                    </div>

                    <div className="form-group-pw">
                        <label htmlFor="newPassword">Password Baru</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                // Petunjuk untuk password baru, mencegah autofill lama
                                autoComplete="new-password"
                                required
                            />
                            <button type="button" className="password-toggle-btn" onClick={() => setShowNewPassword(!showNewPassword)}>
                                <img src={showNewPassword ? '/icons/visibility_off.svg' : '/icons/visibility_on.svg'} alt="Toggle visibility" />
                            </button>
                        </div>
                    </div>

                    <div className="form-group-pw">
                        <label htmlFor="confirmPassword">Konfirmasi Password Baru</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                // Petunjuk untuk password baru
                                autoComplete="new-password"
                                required
                            />
                            <button type="button" className="password-toggle-btn" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                <img src={showConfirmPassword ? '/icons/visibility_off.svg' : '/icons/visibility_on.svg'} alt="Toggle visibility" />
                            </button>
                        </div>
                    </div>

                    <div className="error-message-pw">{error}</div>
                    <div className="modal-actions-pw">
                        <button type="button" className="modal-btn-pw cancel" onClick={handleClose} disabled={loading}>Batal</button>
                        <button type="submit" className="modal-btn-pw confirm" disabled={loading}>{loading ? 'Menyimpan...' : 'Simpan'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordModal;