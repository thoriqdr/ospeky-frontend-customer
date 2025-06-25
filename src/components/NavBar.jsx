// src/components/Navbar.jsx

import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import useOutsideClick from '../hooks/useOutsideClick';
import useUnpaidOrdersCount from '../hooks/useUnpaidOrdersCount';
import NavMenuPopup from './NavMenuPopup';
import './NavBar.css';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { openAuthModal } = useModal();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef();
  useOutsideClick(menuRef, () => setIsMenuOpen(false));
  const notificationCount = useUnpaidOrdersCount();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Gagal logout", error);
    }
  };

  return (
    <nav className="navbar" ref={menuRef}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src="/logo.svg" alt="Ospeky.id" />
        </Link>
        <div className="navbar-auth">
          {currentUser ? (
            <div className="menu-container">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="navbar-button menu-button">
                <img src="/icons/menu.svg" alt="Menu" className="menu-icon-btn"/>
                Menu
                {notificationCount > 0 && <div className="navbar-menu-badge"></div>}
              </button>
              {isMenuOpen && <NavMenuPopup onClose={() => setIsMenuOpen(false)} />}
            </div>
          ) : (
            <button onClick={openAuthModal} className="navbar-button">Login</button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;