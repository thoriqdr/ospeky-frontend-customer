// frontend-customer/src/pages/ProductDetailPage.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';

import 'swiper/css';
import 'swiper/css/pagination';
import './ProductDetailPage.css';
import OrderPopup from '../components/OrderPopup';
import backIcon from '/icons/back-arrow.svg';


const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  // Kita tidak perlu memanggil useAuth atau useModal di sini lagi
  // karena semua logika login akan ditangani di dalam OrderPopup

  const [showOrderPopup, setShowOrderPopup] = useState(false);
  const [popupMode, setPopupMode] = useState('tambahKeKeranjang'); // Default mode
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [displayImages, setDisplayImages] = useState([]);
  const baseUrl = api.defaults.baseURL.replace('/api', '');

  const swiperRef = useRef(null);

  // useEffect untuk membuka popup jika diperintahkan dari ProductCard
  useEffect(() => {
    if (location.state?.openOrderPopup) {
      // Ambil 'mode' dari state navigasi
      setPopupMode(location.state.mode || 'tambahKeKeranjang');
      setShowOrderPopup(true);
    }
  }, [location.state]);

  // useEffect untuk mengambil data produk dari API
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      api.get(`/products/${id}`)
        .then(response => {
          const productData = response.data;

          if (productData.gambarUrls && typeof productData.gambarUrls === 'string') {
            try { productData.gambarUrls = JSON.parse(productData.gambarUrls); } catch (e) { productData.gambarUrls = []; }
          }

          setProduct(productData);

          if (productData.variants && productData.variants.length > 0 && productData.variants[0].namaVarian !== 'Default') {
            setSelectedVariant(productData.variants[0]);
          }
        })
        .catch(error => { console.error("Gagal mengambil detail produk:", error); })
        .finally(() => { setIsLoading(false); });
    }
  }, [id]);

  // useEffect untuk menggabungkan gambar utama dan varian
  useEffect(() => {
    if (product) {
      const mainImages = product.gambarUrls || [];
      const variantImages = product.variants.filter(v => v.namaVarian !== 'Default' && v.gambarUrl).map(v => v.gambarUrl);
      const allImages = [...mainImages, ...variantImages.filter(vImg => !mainImages.includes(vImg))];
      setDisplayImages(allImages);
    }
  }, [product]);


  // --- Fungsi-fungsi Handler ---
  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    if (swiperRef.current?.swiper && variant.gambarUrl) {
      const imageIndex = displayImages.findIndex(url => url === variant.gambarUrl);
      if (imageIndex !== -1) { swiperRef.current.swiper.slideTo(imageIndex); }
    }
  };

  // Tombol "Beli Langsung" akan membuka popup dalam mode 'beliLangsung'
  const handleBuyNowClick = () => {
    setPopupMode('beliLangsung');
    setShowOrderPopup(true);
  };

  // Tombol "+ Keranjang" akan membuka popup dalam mode 'tambahKeKeranjang'
  const handleAddToCartClick = () => {
    setPopupMode('tambahKeKeranjang');
    setShowOrderPopup(true);
  };


  // Tampilan saat data sedang dimuat atau tidak ditemukan
  if (isLoading) { return <div className="loading-text">Loading...</div>; }
  if (!product) { return <div className="loading-text">Produk tidak ditemukan.</div>; }

  // Variabel bantu
  const isVariantProduct = product.variants && (product.variants.length > 1 || (product.variants.length === 1 && product.variants[0].namaVarian !== 'Default'));
  const currentPrice = selectedVariant?.harga ?? (product.isPO ? product.hargaPO : product.variants?.[0]?.harga);

  // --- Render Tampilan Komponen ---
  return (
    <div className="product-detail-container">
      <button onClick={() => navigate(-1)} className="detail-back-button">
        <img src={backIcon} alt="Kembali" />
      </button>

      <div className="image-gallery">
        <Swiper
          ref={swiperRef}
          modules={[Pagination]}
          pagination={{ clickable: true }}
          spaceBetween={0}
          slidesPerView={1}
        >
          {displayImages.map((url, index) => (
            <SwiperSlide key={index}>
              <img src={`${baseUrl}/${url}`} alt={`${product.namaProduk} - Gambar ${index + 1}`} className="main-product-image" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="product-details">
        <div className="price-sold-row">
          <div className="price-container"> {/* Tambahan wrapper untuk menampung kedua harga */}
            <p className="price">
              {product.isPO && "PO (DP): "}Rp{currentPrice?.toLocaleString('id-ID')}
            </p>

            {/* --- PENAMBAHAN LOGIKA HARGA TOTAL PO DI SINI --- */}
            {product.isPO && (
              <p className="price-total-po">
                Harga Total: {product.hargaTotalPO ? `Rp${product.hargaTotalPO.toLocaleString('id-ID')}` : 'Belum ditetapkan'}
              </p>
            )}
            {/* --- AKHIR PENAMBAHAN --- */}

          </div>
          <span className="sold-count">{product.totalTerjual || 0} Terjual</span>
        </div>

        <h2 className="product-name">{product.namaProduk}</h2>
        <hr className="divider" />

        {isVariantProduct && (
          <div className="variant-selection">
            {product.variants.map(variant => (
              variant.gambarUrl &&
              <div
                key={variant.id}
                className={`variant-preview-item ${selectedVariant?.id === variant.id ? 'active' : ''}`}
                onClick={() => handleVariantSelect(variant)}
              >
                <img
                  src={`${baseUrl}/${variant.gambarUrl}`}
                  alt={variant.namaVarian}
                  className="variant-preview-image"
                />
              </div>
            ))}
          </div>
        )}

        <div className="description">
          <h3>Deskripsi</h3>
          <p style={{ whiteSpace: 'pre-wrap' }}>{product.deskripsi}</p>
        </div>
      </div>

      <div className="action-buttons">
        <button className="order-now-btn" onClick={handleBuyNowClick}>
          Beli Langsung
        </button>
        <button className="wish-list-btn" onClick={handleAddToCartClick}>
          + Keranjang
        </button>
      </div>

      {showOrderPopup && (
        <OrderPopup
          product={product}
          selectedVariant={selectedVariant}
          onClose={() => setShowOrderPopup(false)}
          mode={popupMode}
        />
      )}
    </div>
  );
};

export default ProductDetailPage;