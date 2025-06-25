// src/pages/AdminLoginPage.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import useUserProfile from '../hooks/useUserProfile';
import './AdminLoginPage.css';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle, currentUser } = useAuth(); // Ambil loginWithGoogle
  const userProfile = useUserProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (userProfile && userProfile.role === 'ADMIN') {
      navigate('/admin/scanner');
    }
  }, [userProfile, navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      // Redirect akan ditangani oleh useEffect di atas
    } catch (err) {
      setError(err.message || "Gagal login. Periksa kembali email dan password Anda.");
    } finally {
      setLoading(false);
    }
  };

  // --- FUNGSI BARU UNTUK GOOGLE LOGIN ---
  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      // Redirect juga akan ditangani oleh useEffect
    } catch (error) {
      setError("Gagal login dengan Google.");
      console.error("Google login error:", error);
    } finally {
        setLoading(false);
    }
  };

  if (currentUser && !userProfile) {
    return <div className="admin-login-container"><p>Memeriksa sesi...</p></div>;
  }
  
  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <img src="/logo.svg" alt="Ospeky Logo" className="admin-login-logo"/>
        <h2>Admin Scanner</h2>
        <p>Login untuk melakukan verifikasi pengambilan pesanan.</p>
        
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Memproses...' : 'Login'}
          </button>
        </form>

        {/* --- JSX BARU UNTUK GOOGLE LOGIN --- */}
        <div className="separator">atau</div>
        <button type="button" className="google-login-btn" onClick={handleGoogleLogin} disabled={loading}>
          <img src="/icons/google.svg" alt="Google icon" />
          Lanjutkan dengan Google
        </button>
      </div>
    </div>
  );
};

export default AdminLoginPage;