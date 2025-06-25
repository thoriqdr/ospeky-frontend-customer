// src/components/AuthModal.jsx (Versi Final Lengkap)

import React, { useState } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import { useNavigate } from 'react-router-dom';
import './AuthModal.css';

const AuthModal = () => {
  // --- STATE MANAGEMENT ---
  const { login, loginWithGoogle, forgotPassword } = useAuth();
  const { closeAuthModal, openOnboardingModal } = useModal();
  const navigate = useNavigate();

  const [view, setView] = useState('login'); // 'login', 'register', 'forgotPassword'
  const [resetEmailSent, setResetEmailSent] = useState(false);
  
  const [nama, setNama] = useState('');
  const [nomorHp, setNomorHp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // --- HANDLER FUNCTIONS ---

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      // result sekarang berisi { user, isNewUser } dari backend kita
      const result = await loginWithGoogle();
      
      closeAuthModal();

      // Cek flag isNewUser langsung dari backend
      if (result.isNewUser) {
        openOnboardingModal(); 
      }
      // Jika pengguna lama, tidak perlu reload. AuthContext akan handle update UI.
    } catch (error) {
      setError("Gagal login dengan Google.");
      console.error("Google login error:", error);
    } finally {
        setLoading(false);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (view === 'register') {
      if (password !== confirmPassword) {
        setError('Password tidak cocok!');
        setLoading(false);
        return;
      }
      try {
        await api.post('/auth/register', { email, password, nama, nomorHp });
        await login(email, password);
        closeAuthModal(); // Cukup tutup modal, tidak perlu reload
      } catch (err) {
        const message = err.response?.data?.message || 'Gagal mendaftar.';
        setError(message);
      } finally {
        setLoading(false);
      }
      return;
    }
    
    if (view === 'login') {
      try {
        await login(email, password);
        closeAuthModal(); // Cukup tutup modal, tidak perlu reload
      } catch (err) {
        setError('Email atau password salah.');
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await forgotPassword(email);
      setResetEmailSent(true);
    } catch (err) {
      setError(err.code === 'auth/user-not-found' ? 'Email tidak terdaftar.' : 'Gagal mengirim email reset.');
    } finally {
      setLoading(false);
    }
  };

  const switchView = (newView) => {
    setError('');
    setResetEmailSent(false);
    setPassword('');
    setConfirmPassword('');
    setNama('');
    setNomorHp('');
    // Email tidak direset agar bisa dipakai di form lupa password jika perlu
    if (view === 'forgotPassword') setEmail(''); 
    setView(newView);
  };

  const renderContent = () => {
    if (view === 'forgotPassword') {
      if (resetEmailSent) {
        return (
          <div className="reset-success">
            <h4>Periksa Email Anda</h4>
            <p>Link untuk mengatur ulang password telah dikirim ke <strong>{email}</strong>.</p>
          </div>
        );
      }
      return (
        <form onSubmit={handleForgotPasswordSubmit}>
          <p className="auth-instruction">Masukkan email terdaftar Anda untuk menerima link reset password.</p>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
          </div>
          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Mengirim...' : 'Kirim Link Reset'}
          </button>
        </form>
      );
    }

    // Tampilan untuk Login dan Daftar
    return (
      <form onSubmit={handleAuthSubmit}>
        {view === 'register' && (
          <>
            <div className="form-group">
              <label htmlFor="nama">Nama Lengkap</label>
              <input type="text" id="nama" value={nama} onChange={(e) => setNama(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="nomorHp">Nomor HP</label>
              <input type="tel" id="nomorHp" value={nomorHp} onChange={(e) => setNomorHp(e.target.value)} required />
            </div>
          </>
        )}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {view === 'login' && (
          <div className="forgot-password-container">
            <button type="button" className="forgot-password-link" onClick={() => switchView('forgotPassword')}>
              Lupa Password?
            </button>
          </div>
        )}
        {view === 'register' && (
          <div className="form-group">
            <label htmlFor="confirm-password">Konfirmasi Password</label>
            <input type="password" id="confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
        )}
        <button type="submit" className="auth-submit-btn" disabled={loading}>
          {loading ? 'Memproses...' : (view === 'login' ? 'Login' : 'Daftar')}
        </button>
      </form>
    );
  };

  return (
    <div className="auth-modal-overlay" onClick={closeAuthModal}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal-btn" onClick={closeAuthModal}>×</button>
        
        <h2>{view === 'login' ? 'Login' : view === 'register' ? 'Daftar' : 'Reset Password'}</h2>
        {error && <p className="auth-error">{error}</p>}
        
        {renderContent()}
        
        {view !== 'forgotPassword' && (
          <>
            <div className="separator">atau</div>
            <button type="button" className="google-login-btn" onClick={handleGoogleLogin} disabled={loading}>
              <img src="/icons/google.svg" alt="Google icon" />
              Lanjutkan dengan Google
            </button>
          </>
        )}

        <p className="auth-switcher">
          {view === 'login' && 'Belum punya akun?'}
          {view === 'register' && 'Sudah punya akun?'}
          {view === 'forgotPassword' && 'Ingat password Anda?'}
          <button onClick={() => switchView(view === 'login' ? 'register' : 'login')}>
            {view === 'login' ? 'Daftar' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;