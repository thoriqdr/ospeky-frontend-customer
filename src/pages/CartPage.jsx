// src/pages/CartPage.jsx (Versi Debugging)

import React, { useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import ConfirmationPopup from '../components/ConfirmationPopup';
import './CartPage.css';

import backIcon from '/icons/back-arrow.svg';
import deleteIcon from '/icons/delete.svg';
import api from '../api/api';


const CartPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { openAuthModal } = useModal();
  const { cartItems, removeFromCart, updateQuantity, toggleItemSelected, toggleSelectAll, removeItemsByIds } = useContext(CartContext);

  const [showPoWarning, setShowPoWarning] = useState(false);

  const { totalPrice, selectedCount, isAllSelected, itemsToCheckout } = useMemo(() => {
    const selectedItems = cartItems.filter(item => item.selected);
    const total = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return {
      totalPrice: total,
      selectedCount: selectedItems.length,
      isAllSelected: cartItems.length > 0 && cartItems.every(item => item.selected),
      itemsToCheckout: selectedItems,
    };
  }, [cartItems]);

  const proceedToCheckout = () => {
    navigate('/checkout', { state: { orderItems: itemsToCheckout } });
  };

  const handleCheckout = () => {
    if (!currentUser) {
      openAuthModal();
      return;
    }

    if (itemsToCheckout.length === 0) {
      alert("Pilih setidaknya satu item untuk di-checkout.");
      return;
    }

    // --- LOG UNTUK DEBUGGING ---
    console.log("--- Memulai proses checkout ---");
    console.log("Item yang akan di-checkout:", itemsToCheckout);

    const hasPoItems = itemsToCheckout.some(item => item.tipeProduk === 'PO_DP' || item.tipeProduk === 'PO_LANGSUNG');
    const hasNonPoItems = itemsToCheckout.some(item => item.tipeProduk === 'TUNGGAL' || item.tipeProduk === 'VARIAN');

    console.log("Apakah ada item PO? ->", hasPoItems);
    console.log("Apakah ada item non-PO? ->", hasNonPoItems);
    // --- AKHIR LOG ---

    if (hasPoItems && hasNonPoItems) {
      setShowPoWarning(true);
    } else {
      proceedToCheckout();
    }
  };

  const handleBulkDelete = () => {
    const itemsToDelete = cartItems.filter(item => item.selected);
    if (itemsToDelete.length === 0) return;
    if (window.confirm(`Anda yakin ingin menghapus ${itemsToDelete.length} item?`)) {
      removeItemsByIds(itemsToDelete.map(item => item.variantId));
    }
  };

  return (
    <>
      {showPoWarning && (
        <ConfirmationPopup
          isAlertMode={true}
          title="Informasi Pengiriman"
          message="Pesanan Anda berisi produk Pre-Order (PO) dan produk ready-stock. Pengiriman semua barang akan digabung dan mengikuti jadwal penyelesaian item PO."
          confirmText="Mengerti"
          onConfirm={() => {
            setShowPoWarning(false);
            proceedToCheckout();
          }}
        />
      )}

      <div className="cart-page-container">
        <div className="cart-header">
          <button onClick={() => navigate(-1)} className="cart-back-button">
            <img src={backIcon} alt="Kembali" />
          </button>
          <h2>Keranjang Saya</h2>
        </div>

        {cartItems.length > 0 ? (
          <>
            <div className="select-all-container">
              <div className="select-all-left">
                <input type="checkbox" id="select-all" checked={isAllSelected} onChange={(e) => toggleSelectAll(e.target.checked)} />
                <label htmlFor="select-all">Pilih semua</label>
              </div>
              <button className="bulk-delete-btn" onClick={handleBulkDelete} disabled={selectedCount === 0}>Hapus</button>
            </div>

            <div className="cart-items-list">
              {cartItems.map(item => (
                <div key={item.variantId} className="cart-item">
                  <input type="checkbox" className="item-checkbox" checked={!!item.selected} onChange={() => toggleItemSelected(item.variantId)} />
                  <img src={`${api.defaults.baseURL.replace('/api', '')}/${item.image}`} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-info">
                    <p className="cart-item-name">{item.name}</p>
                    {item.tipeProduk === 'PO_DP' && <p className="cart-item-po-label">Pre-order (DP)</p>}
                    {item.tipeProduk === 'PO_LANGSUNG' && <p className="cart-item-po-label">Pre-order</p>}
                    <p className="cart-item-price">Rp{item.price.toLocaleString('id-ID')}</p>
                    <div className="cart-item-quantity">
                      <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.variantId)} className="delete-item-btn"><img src={deleteIcon} alt="Hapus" /></button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="empty-cart-message">
            <p>Keranjang Anda masih kosong.</p>
            <button onClick={() => navigate('/')}>Mulai Belanja</button>
          </div>
        )}

        <div className="cart-summary-footer">
          <div className="total-price-section">
            <p>Total</p>
            <h3>Rp{totalPrice.toLocaleString('id-ID')}</h3>
          </div>
          <button className="checkout-button" disabled={selectedCount === 0} onClick={handleCheckout}>
            Checkout ({selectedCount})
          </button>
        </div>
      </div>
    </>
  );
};

export default CartPage;