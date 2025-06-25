// src/components/Footer.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

// Hook untuk mendeteksi klik di luar elemen (untuk menutup popup)
const useOutsideClick = (ref, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
};

const Footer = () => {
  // State untuk mengontrol visibilitas popup
  const [isContactPopupOpen, setIsContactPopupOpen] = useState(false);
  const contactRef = useRef(); // Ref untuk popup dan tombolnya

  // Terapkan hook outside click
  useOutsideClick(contactRef, () => setIsContactPopupOpen(false));

  // --- TAUTAN KONTAK ---
  const whatsappNumber = "6288708270460";
  const whatsappText = "Halo Ospeky, saya ingin bertanya mengenai produk dan layanan Anda.";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;
  const telegramUrl = "https://t.me/ospeky_id";
  const instagramUrl = "https://www.instagram.com/ospeky.id";
  const tiktokUrl = "https://www.tiktok.com/@ospeky.id";

  // CSS disematkan di sini agar komponen self-contained
  const styles = `
    .contact-wrapper {
      position: relative;
      display: inline-block;
    }
    .contact-button {
      background: none;
      border: none;
      color: #34495E;
      font-weight: 600;
      font-size: 1.1rem;
      cursor: pointer;
      padding: 0;
    }
    .contact-popup {
      position: absolute;
      bottom: calc(100% + 10px); /* Muncul di atas tombol */
      left: 50%;
      transform: translateX(-50%);
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      width: 200px;
      padding: 8px;
      z-index: 1200;
      animation: slide-up-fade-in 0.3s ease-out;
    }
    .contact-popup::after { /* Membuat segitiga penunjuk */
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border-width: 6px;
      border-style: solid;
      border-color: white transparent transparent transparent;
    }
    .contact-popup a {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      text-decoration: none;
      color: #333;
      font-weight: 500;
      border-radius: 8px;
      transition: background-color 0.2s ease;
    }
    .contact-popup a:hover {
      background-color: #f5f5f5;
    }
    .contact-icon {
      width: 20px;
      height: 20px;
    }
    @keyframes slide-up-fade-in {
      from {
        opacity: 0;
        transform: translate(-50%, 10px);
      }
      to {
        opacity: 1;
        transform: translate(-50%, 0);
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <footer className="footer-container">
        <div className="footer-main">
          <div className="footer-logo-section">
            <h2 className="footer-logo-text">OSPEKY.COM</h2>
          </div>
          <div className="footer-links">
            <Link to="/tentang-kami">Tentang Kami</Link>
            <Link to="/syarat-dan-ketentuan">Syarat & Ketentuan</Link>

            {/* --- PERUBAHAN DIMULAI DI SINI --- */}
            <div className="contact-wrapper" ref={contactRef}>
              <button className="contact-button" onClick={() => setIsContactPopupOpen(!isContactPopupOpen)}>
                Hubungi Kami
              </button>
              {isContactPopupOpen && (
                <div className="contact-popup">
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <img src="/icons/whatsapp.svg" alt="WhatsApp" className="contact-icon" />
                    <span>WhatsApp</span>
                  </a>
                  <a href={telegramUrl} target="_blank" rel="noopener noreferrer">
                    <img src="/icons/telegram.svg" alt="Telegram" className="contact-icon" />
                    <span>Telegram</span>
                  </a>
                  <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
                    <img src="/icons/instagram.svg" alt="Instagram" className="contact-icon" />
                    <span>Instagram</span>
                  </a>
                  <a href={tiktokUrl} target="_blank" rel="noopener noreferrer">
                    <img src="/icons/tiktok.svg" alt="TikTok" className="contact-icon" />
                    <span>TikTok</span>
                  </a>
                </div>
              )}
            </div>
            {/* --- AKHIR PERUBAHAN --- */}

            <Link to="/privasi">Privasi</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>Copyrights © 2025 Ospeky.id Indonesia</p>
          <p>All rights reserved.</p>
          
          
        </div>
      </footer>
    </>
  );
};

export default Footer;