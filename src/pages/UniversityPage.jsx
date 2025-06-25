// frontend-customer/src/pages/UniversityPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UniversityPage.css';
import backIcon from '/icons/back-arrow-white.svg';
import ProductCard from '../components/ProductCard'; // Impor komponen ProductCard

const API_URL = 'http://localhost:5000';

const UniversityPage = () => {
  const { universityId } = useParams();
  const navigate = useNavigate();
  
  // State untuk data
  const [university, setUniversity] = useState(null);
  const [products, setProducts] = useState([]);
  
  // State untuk UI
  const [activeTab, setActiveTab] = useState('universitas');
  const [isProductsLoading, setIsProductsLoading] = useState(true);

  // Mengambil data detail universitas
  useEffect(() => {
    if (universityId) {
      axios.get(`/api/categories/universitas/public/${universityId}`)
        .then(response => {
          setUniversity(response.data);
        })
        .catch(error => {
          console.error("Gagal mengambil detail universitas:", error);
        });
    }
  }, [universityId]);

  // Mengambil data produk berdasarkan tab yang aktif
  useEffect(() => {
    if (universityId) {
      setIsProductsLoading(true);
      axios.get(`/api/products/public?universityId=${universityId}&type=${activeTab}`)
        .then(response => {
          setProducts(response.data);
        })
        .catch(error => {
          console.error(`Gagal mengambil produk untuk ${activeTab}:`, error);
          setProducts([]);
        })
        .finally(() => {
          setIsProductsLoading(false);
        });
    }
  }, [universityId, activeTab]);

  if (!university) {
    return <div className="loading-text">Loading...</div>;
  }

  const logoUrl = `${API_URL}/${university.logoUrl}`;

  return (
    <div className="uni-page-container">
      <header className="uni-page-header">
        <button onClick={() => navigate(-1)} className="back-button-uni">
          <img src={backIcon} alt="Kembali" />
        </button>
        <div className="uni-info">
          <img src={logoUrl} alt={`Logo ${university.nama}`} className="uni-logo-large" />
          <h1 className="uni-name-large">{university.nama}</h1>
        </div>
      </header>

      <div className="tabs-wrapper">
        <div className="tabs-container">
          <button 
            className={`tab-button ${activeTab === 'universitas' ? 'active' : ''}`}
            onClick={() => setActiveTab('universitas')}
          >
            Ospek Universitas
          </button>
          <button 
            className={`tab-button ${activeTab === 'fakultas' ? 'active' : ''}`}
            onClick={() => setActiveTab('fakultas')}
          >
            Ospek Fakultas
          </button>
        </div>
      </div>
      
      <div className="uni-page-content">
        <div className="product-list-container">
          {isProductsLoading ? (
            <p className="info-text">Memuat produk...</p>
          ) : products.length > 0 ? (
            products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="info-text">Belum ada produk untuk kategori ini.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UniversityPage;