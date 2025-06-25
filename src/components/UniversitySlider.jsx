// src/components/UniversitySlider.jsx

import React, { useState, useEffect } from 'react';
import api from '../api/api'; 
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
// 1. Impor komponen 'Link' dari react-router-dom
import { Link } from 'react-router-dom';

// Impor CSS bawaan Swiper
import 'swiper/css';
import 'swiper/css/autoplay';

import './UniversitySlider.css';

// Definisikan URL API dan URL dasar untuk gambar

const UniversitySlider = () => {
  // State untuk menyimpan data universitas dari backend
  const [universities, setUniversities] = useState([]);
  const baseUrl = api.defaults.baseURL.replace('/api', ''); 

  // useEffect untuk mengambil data saat komponen pertama kali dimuat
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await api.get('/categories/universitas/public');
        // Simpan data yang diterima ke dalam state
        setUniversities(response.data);
      } catch (error) {
        console.error("Gagal memuat data universitas:", error);
      }
    };

    fetchUniversities();
  }, []); // Dependensi kosong berarti ini hanya berjalan sekali

  // Jika tidak ada data universitas, jangan tampilkan slider sama sekali
  if (universities.length === 0) {
    return null; // atau tampilkan pesan loading
  }

  return (
    <div className="uni-slider-section">
      <h2 className="section-title">Universitas anda</h2>
      
      <Swiper
        modules={[Autoplay]}
        spaceBetween={15}
        slidesPerView={4}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
      >
        {universities.map((uni) => (
          <SwiperSlide key={uni.id}>
            {/* 2. Bungkus item universitas dengan komponen Link */}
            {/* Arahkan 'to' ke halaman universitas dengan ID yang sesuai */}
            <Link to={`/universitas/${uni.id}`} className="university-item-link">
              <div className="university-item">
                <img 
                  src={uni.logoUrl ? `${baseUrl}/${uni.logoUrl}` : '...'}
                  alt={uni.nama} 
                />
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default UniversitySlider;