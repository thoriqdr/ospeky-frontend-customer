// frontend-customer/src/components/UniversityResultCard.jsx
    
import React from 'react';
import api from '../api/api'; 
import { useNavigate } from 'react-router-dom'; // 1. Impor useNavigate
import './UniversityResultCard.css';


const UniversityResultCard = ({ university }) => {
  const navigate = useNavigate(); // 2. Inisialisasi hook navigasi
  const baseUrl = api.defaults.baseURL.replace('/api', '');
  const fullLogoUrl = `${baseUrl}/${university.logoUrl}`;
  // 3. Buat fungsi untuk menangani klik
  const handleCardClick = () => {
    // Arahkan ke halaman detail dengan ID universitas
    navigate(`/universitas/${university.id}`);
  };

  return (
    // 4. Tambahkan event onClick ke kontainer utama
    <div className="uni-card-container" onClick={handleCardClick}>
      <div className="uni-card-image-area">
        <img src={fullLogoUrl} alt={`Logo ${university.nama}`} className="uni-card-image" />
      </div>
      <div className="uni-card-content-area">
        <p className="uni-card-name">{university.nama}</p>
      </div>
    </div>
  );
};

export default UniversityResultCard;