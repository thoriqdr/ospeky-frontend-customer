// src/components/NavMenuPopup.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import useUserProfile from '../hooks/useUserProfile'; // 1. Ganti useAuth dengan useUserProfile
import useUnpaidOrdersCount from '../hooks/useUnpaidOrdersCount';
import './NavMenuPopup.css';

// Impor ikon yang ada
import profileIcon from '/icons/profile.svg';
import orderIcon from '/icons/order.svg';
import adminIcon from '/icons/scanner.svg'; 

const NavMenuPopup = ({ onClose }) => {
  const userProfile = useUserProfile(); // 2. Panggil hook baru untuk mendapatkan profil lengkap
  const notificationCount = useUnpaidOrdersCount();

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <div className="nav-menu-popup">
      <ul>
        <li>
          <Link to="/profile" onClick={handleLinkClick}>
            <img src={profileIcon} alt="Akun Saya" className="nav-menu-icon" />
            <span>Akun saya</span>
          </Link>
        </li>
        <li>
          <Link to="/orders" onClick={handleLinkClick}>
            <img src={orderIcon} alt="Pesanan Saya" className="nav-menu-icon" />
            <span>Pesanan saya</span>
            {notificationCount > 0 && (
              <span className="notification-badge">{notificationCount}</span>
            )}
          </Link>
        </li>

        {/* --- PERBAIKAN KONDISI DIMULAI DI SINI --- */}
        {/* 3. Gunakan 'userProfile.role' untuk pengecekan yang akurat */}
        {userProfile && userProfile.role === 'ADMIN' && (
          <li>
            <Link to="/admin/scanner" onClick={handleLinkClick}>
              <img src={adminIcon} alt="Admin Scanner" className="nav-menu-icon" />
              <span>Admin Scanner</span>
            </Link>
          </li>
        )}
        {/* --- AKHIR PERUBAHAN --- */}
        
      </ul>
    </div>
  );
};

export default NavMenuPopup;