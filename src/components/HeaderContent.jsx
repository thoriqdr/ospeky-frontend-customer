// src/components/HeaderContent.jsx

// 1. Impor hooks dan komponen yang diperlukan
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext'; // Impor context keranjang kita
import SearchBar from './SearchBar';
import './HeaderContent.css';

// Komponen CartButton yang sudah di-upgrade
const CartButton = () => {
  // 2. Ambil cartItems dari CartContext
  const { cartItems } = useContext(CartContext);

  // 3. Hitung total item unik di keranjang
  const itemCount = cartItems.length;

  return (
    // 4. Ubah <button> menjadi <Link> dan arahkan ke '/cart'
    <Link to="/cart" className="cart-button-area">
      <img src="/icons/cart.svg" alt="Keranjang Belanja" />
      {/* 5. Tampilkan badge jumlah item jika ada item di keranjang */}
      {itemCount > 0 && (
        <span className="cart-item-count">{itemCount}</span>
      )}
    </Link>
  );
};

// Nama komponen utama Anda adalah SearchArea, kita biarkan seperti itu
const SearchArea = () => {
  return (
    <div className="search-area-container">
      <SearchBar />
      <CartButton />
    </div>
  );
};

export default SearchArea;