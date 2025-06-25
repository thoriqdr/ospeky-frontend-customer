// src/pages/HomePage.jsx

import React, { useState, useEffect, useMemo } from 'react';

// Impor semua komponen yang dibutuhkan oleh halaman ini
import ProductCard from '../components/ProductCard';
import HeaderContent from '../components/HeaderContent';
import UniversitySlider from '../components/UniversitySlider';
import ServiceNav from '../components/ServiceNav';
import api from '../api/api';

import './HomePage.css';


const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUniversityId, setSelectedUniversityId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true); // Selalu set loading true di awal
        const response = await api.get('/products/public');
        setProducts(response.data);
        setError(null); // Bersihkan error jika sukses
      } catch (err) {
        console.error("Gagal mengambil data produk:", err);
        setError("Gagal memuat produk. Silakan coba beberapa saat lagi.");
      } finally {
        setLoading(false); // Selalu set loading false di akhir
      }
    };

    fetchProducts();
  }, []);

  // 2. Fungsi untuk menangani klik pada logo universitas
  const handleUniversitySelect = (universityId) => {
    // Jika ID yang sama diklik lagi, reset filter (tampilkan semua)
    if (selectedUniversityId === universityId) {
      setSelectedUniversityId(null);
    } else {
      // Jika ID baru, set sebagai filter
      setSelectedUniversityId(universityId);
    }
  };

  // 3. Gunakan useMemo untuk memfilter produk secara efisien
  const filteredProducts = useMemo(() => {
    if (!selectedUniversityId) {
      return products; // Jika tidak ada filter, tampilkan semua
    }
    return products.filter(p => p.universitasId === selectedUniversityId);
  }, [products, selectedUniversityId]);


  return (
    <>
      {/* Menggunakan SearchArea, bukan SearchBar secara langsung */}
      <HeaderContent />
      <UniversitySlider />
      <ServiceNav />
      
      <div className="homepage-container">
        <h2 className="section-title">Rekomendasi untukmu</h2>
        {loading && <div className="loading-text">Memuat produk...</div>}
        {error && <div className="error-text">{error}</div>}
        {!loading && !error && (
          <div className="product-grid">
            {products.slice(0, 4).map(product =>  (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default HomePage;