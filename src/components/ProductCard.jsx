// src/components/ProductCard.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api'; 
import './ProductCard.css';


const PriceDisplay = ({ product }) => {
  if (product.isPO) {
    return (
      <>
        <span className="po-label">Pre-order</span>
        <p className="product-price">PO: Rp{product.hargaPO.toLocaleString('id-ID')}</p>
      </>
    );
  }
  if (product.variants && product.variants.length > 1) {
    const prices = product.variants.map(v => v.harga);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    if (minPrice === maxPrice) {
      return <p className="product-price">Rp{minPrice.toLocaleString('id-ID')}</p>;
    }
    return <p className="product-price">Rp{minPrice.toLocaleString('id-ID')} - {maxPrice.toLocaleString('id-ID')}</p>;
  }
  const singlePrice = product.variants?.[0]?.harga || 0;
  return <p className="product-price">Rp{singlePrice.toLocaleString('id-ID')}</p>;
};

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const baseUrl = api.defaults.baseURL.replace('/api', ''); 

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  // Tombol Biru -> Memberi sinyal mode 'beliLangsung'
  const handleBuyNowClick = (e) => {
    e.stopPropagation();
    navigate(`/product/${product.id}`, { state: { openOrderPopup: true, mode: 'beliLangsung' } });
  };

  // Tombol Hijau -> Memberi sinyal mode 'tambahKeKeranjang'
  const handleAddToCartClick = (e) => {
    e.stopPropagation();
    navigate(`/product/${product.id}`, { state: { openOrderPopup: true, mode: 'tambahKeKeranjang' } });
  };

  const imageUrl = product.gambarUrls && product.gambarUrls.length > 0
    ? `${baseUrl}/${product.gambarUrls[0]}`
    : 'placeholder.jpg';

  return (
    <div className="product-card" onClick={handleCardClick}>
      <div className="product-image-container">
        <img src={imageUrl} alt={product.namaProduk} className="product-image" />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.namaProduk}</h3>
        <PriceDisplay product={product} />
      </div>
      <div className="product-actions">
        <button className="btn-order" onClick={handleBuyNowClick}>Beli</button>
        <button className="btn-wish" onClick={handleAddToCartClick}>Cart</button>
      </div>
    </div>
  );
};

export default ProductCard;