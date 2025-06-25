// src/components/OrderPopup.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import api from '../api/api';
import './OrderPopup.css';


const OrderPopup = ({ product, selectedVariant: initialVariant, onClose, mode }) => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { currentUser } = useAuth();
  const { openAuthModal } = useModal();
  const baseUrl = api.defaults.baseURL.replace('/api', '');

  const [activeVariant, setActiveVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product?.variants?.length > 0) {
      setActiveVariant(initialVariant || product.variants[0]);
    }
  }, [product, initialVariant]);

  const handleConfirm = () => {
    // --- PERBAIKAN DIMULAI DI SINI ---
    const itemData = {
      // Menggunakan product.namaProduk agar konsisten, varian hanya untuk pembeda
      name: product.namaProduk,
      price: activeVariant.harga,
      quantity: quantity,
      image: activeVariant.gambarUrl || product.gambarUrls[0],
      productId: product.id, // Mengganti nama 'id' menjadi 'productId' agar lebih jelas
      variantId: activeVariant.id,
      variantName: activeVariant.namaVarian,
      tipeProduk: product.tipeProduk, // <-- PERBAIKAN DI SINI // INI ADALAH BARIS KUNCI YANG DITAMBAHKAN
    };
    // --- AKHIR PERUBAHAN ---

    if (mode === 'beliLangsung') {
      // ALUR BELI LANGSUNG (Tombol Biru)
      if (!currentUser) {
        onClose();
        openAuthModal();
      } else {
        // Langsung ke halaman checkout dengan data yang sudah lengkap (termasuk isPO)
        navigate('/checkout', { state: { orderItems: [itemData] } });
      }
    } else {
      // ALUR TAMBAH KE KERANJANG (Tombol Hijau)
      addToCart(itemData);
      // Menggunakan nama produk utama untuk notifikasi yang lebih konsisten
      alert(`${product.namaProduk} berhasil ditambahkan ke keranjang!`);
      onClose();
    }
  };

  const handleVariantChange = (v) => setActiveVariant(v);
  const handleIncrement = () => { if (quantity < (activeVariant?.stok || 0)) { setQuantity(p => p + 1); } };
  const handleDecrement = () => { setQuantity(p => (p > 1 ? p - 1 : 1)); };

  if (!product || !activeVariant) return null;

  const displayImage = activeVariant?.gambarUrl ? `${baseUrl}/${activeVariant.gambarUrl}` : `${baseUrl}/${product.gambarUrls[0]}`;
  const displayPrice = activeVariant?.harga;
  const displayStock = activeVariant?.stok;
  const confirmButtonText = mode === 'beliLangsung' ? 'Lanjut ke Checkout' : 'Tambah ke Keranjang';

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <img src={displayImage} alt={activeVariant.namaVarian || product.namaProduk} className="popup-product-image" />
          <div className="popup-product-info">
            <p className="popup-product-price">Rp{displayPrice?.toLocaleString('id-ID')}</p>
            <span className="popup-product-stock">Stok: {displayStock}</span>
          </div>
        </div>
        {product.variants && (product.variants.length > 1 || (product.variants.length === 1 && product.variants[0].namaVarian !== 'Default')) && (
          <div className="popup-variant-section">
            <h4>Pilih Varian: {activeVariant.namaVarian}</h4>
            <div className="popup-variant-list">
              {product.variants.map(variant => ( variant.namaVarian !== 'Default' && (
                <div key={variant.id} className={`popup-variant-item ${activeVariant?.id === variant.id ? 'active' : ''}`} onClick={() => handleVariantChange(variant)}>
                  <img src={`${baseUrl}/${variant.gambarUrl}`} alt={variant.namaVarian} />
                  <span className="popup-variant-item-name">{variant.namaVarian}</span>
                </div>
              )))}
            </div>
          </div>
        )}
        <div className="popup-quantity-selector">
          <p>Jumlah</p>
          <div className="quantity-controls">
            <button onClick={handleDecrement} disabled={quantity <= 1}>−</button>
            <span>{quantity}</span>
            <button onClick={handleIncrement} disabled={quantity >= displayStock}>+</button>
          </div>
        </div>
        <button className="add-to-cart-btn" disabled={displayStock === 0} onClick={handleConfirm}>
          {confirmButtonText}
        </button>
      </div>
    </div>
  );
};

export default OrderPopup;