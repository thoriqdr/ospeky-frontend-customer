// src/components/ServiceNav.jsx
import React from 'react';
import './ServiceNav.css';

const ServiceNav = () => {
    const handleComingSoon = (serviceName) => {
        alert(`Fitur '${serviceName}' saat ini belum tersedia.`);
    }

    return (
        <div className="service-nav-container">
            {/* Tombol Makanan (hanya ikon) */}
            <div onClick={() => handleComingSoon('Makanan')} className="service-button">
                <div className="service-icon">
                    <img src="/icons/makanan.svg" alt="Ikon Makanan" />
                </div>
            </div>

            {/* Tombol Ojek (hanya ikon) */}
            <div onClick={() => handleComingSoon('Ojek')} className="service-button">
                <div className="service-icon">
                    <img src="/icons/ojek.png" alt="Ikon Ojek" />
                </div>
            </div>

            {/* Tombol More (ikon dan teks) */}
            <div onClick={() => handleComingSoon('Lainnya')} className="service-button more-button">
                <div className="service-icon">
                    <img src="/icons/more.svg" alt="Ikon Lainnya" />
                </div>
            </div>
        </div>
    );
}

export default ServiceNav;