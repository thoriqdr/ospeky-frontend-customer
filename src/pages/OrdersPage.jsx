import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Impor useAuth
import { getMyOrders } from '../api/api'; 
import OrderCard from '../components/OrderCard';
import './OrdersPage.css';
import backIcon from '/icons/back-arrow-white.svg';

const OrdersPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // Ambil data pengguna yang login
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Dalam Proses');

  // --- PERBAIKAN UTAMA DI SINI ---
  const fetchOrders = useCallback(async () => {
    // Jangan lakukan apa-apa jika belum ada user yang login
    if (!currentUser) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data } = await getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error('Gagal mengambil daftar pesanan:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
    // useCallback sekarang bergantung pada currentUser.
    // Artinya, jika user berganti (login/logout), fungsi ini akan dibuat ulang.
  }, [currentUser]); 

  // useEffect sekarang memanggil fetchOrders setiap kali currentUser berubah.
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  // --- AKHIR PERBAIKAN ---

  const filteredOrders = useMemo(() => {
    // Menambahkan MENUNGGU_PELUNASAN ke tab Dalam Proses
    const prosesStatus = ["MENUNGGAK", "MENUNGGU_PELUNASAN", "LUNAS", "DIPROSES", "DIKIRIM"];
    const selesaiStatus = ["SELESAI", "DIBATALKAN"];

    if (activeTab === 'Dalam Proses') {
      return orders.filter(order => prosesStatus.includes(order.status));
    } else {
      return orders.filter(order => selesaiStatus.includes(order.status));
    }
  }, [orders, activeTab]);

  return (
    <div className="orders-page-container">
      <header className="orders-page-header">
        <button onClick={() => navigate('/')} className="orders-back-button">
          <img src={backIcon} alt="Kembali" />
        </button>
        <h1>Pesanan Saya</h1>
      </header>

      <div className="orders-tabs-container">
        <button 
          className={`orders-tab-button ${activeTab === 'Dalam Proses' ? 'active' : ''}`}
          onClick={() => setActiveTab('Dalam Proses')}
        >
          Dalam Proses
        </button>
        <button 
          className={`orders-tab-button ${activeTab === 'Selesai' ? 'active' : ''}`}
          onClick={() => setActiveTab('Selesai')}
        >
          Selesai
        </button>
      </div>

      <main className="orders-list-container">
        {loading ? (
          <p className="orders-message">Memuat pesanan...</p>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <OrderCard 
              key={order.id} 
              order={order} 
              onOrderExpire={fetchOrders}
            />
          ))
        ) : (
          <p className="orders-message">Tidak ada pesanan di kategori ini.</p>
        )}
      </main>
    </div>
  );
};

export default OrdersPage;