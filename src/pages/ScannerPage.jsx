// src/pages/ScannerPage.jsx

import React, { useState, useRef } from 'react';
import { useZxing } from 'react-zxing';
import { BrowserQRCodeReader } from '@zxing/library';
import api from '../api/api';
import './ScannerPage.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const Icon = ({ name }) => <span className="material-icons-outlined">{name}</span>;

const ScannerPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [verifiedOrder, setVerifiedOrder] = useState(null);
  const [error, setError] = useState('');
  const [errorDetails, setErrorDetails] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleScanResult = async (result) => {
    if (loading || !result) return;
    
    const orderId = result.getText();
    // Reset state setiap ada scan baru
    setLoading(true);
    setError('');
    setErrorDetails('');
    setSuccess('');

    try {
      const response = await api.get(`/orders/verify-pickup/${orderId}`);
      setVerifiedOrder(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Gagal memverifikasi pesanan.';
      setError(errorMessage);
      
      if (err.response?.data?.completedAt) {
        const completedDate = new Date(err.response.data.completedAt);
        const formattedDate = format(completedDate, 'dd MMMM yyyy - HH:mm', { locale: id });
        setErrorDetails(`Diambil pada: ${formattedDate}`);
      }
      // --- PERUBAHAN 1: HAPUS setTimeout ---
      // setTimeout(() => resetScanner(), 4000); // Baris ini dihapus
    } finally {
      setLoading(false);
    }
  };

  const { ref } = useZxing({
    onResult: handleScanResult,
    onError: () => {},
  });
  
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset state setiap ada upload baru
    setLoading(true);
    setError('');
    setErrorDetails('');
    setSuccess('');

    const imageUrl = URL.createObjectURL(file);
    const codeReader = new BrowserQRCodeReader();

    try {
      const result = await codeReader.decodeFromImageUrl(imageUrl);
      if (!result) throw new Error("QR code tidak terdeteksi.");
      await handleScanResult(result);
    } catch (err) {
      setError('Gagal membaca QR code dari gambar.');
    } finally {
      URL.revokeObjectURL(imageUrl);
      if (fileInputRef.current) fileInputRef.current.value = "";
      // Hentikan loading jika terjadi error di sini
      if (error) { 
        setLoading(false);
      }
    }
  };
  
  const handleConfirmPickup = async () => {
    if (!verifiedOrder) return;
    setLoading(true);
    setError('');
    try {
      await api.patch(`/orders/complete-pickup/${verifiedOrder.id}`);
      setSuccess(`Pesanan untuk ${verifiedOrder.user.nama} berhasil diserahkan!`);
      setVerifiedOrder(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyelesaikan pesanan.');
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setVerifiedOrder(null);
    setError('');
    setErrorDetails('');
    setSuccess('');
    setLoading(false);
  };

  const renderContent = () => {
    if (success) {
      return (
        <div className="scanner-result success">
          <Icon name="check_circle" />
          <h2>Berhasil!</h2>
          <p>{success}</p>
          <button onClick={resetScanner} className="scanner-button">Scan Lagi</button>
        </div>
      );
    }

    if (verifiedOrder) {
      return (
        <div className="scanner-result verification">
          <Icon name="inventory_2" />
          <h2>Verifikasi Pesanan</h2>
          <div className="order-details-card">
            <p><strong>Nama Pelanggan:</strong> {verifiedOrder.user.nama}</p>
            <p><strong>Nomor Pesanan:</strong> ...{verifiedOrder.id.slice(-6).toUpperCase()}</p>
            <p><strong>Barang Pesanan:</strong></p>
            <ul>
              {verifiedOrder.detailPesanan.map(item => (
                <li key={item.id}>
                  {item.produk.namaProduk}
                  {item.variant && item.variant.namaVarian !== 'Default' ? ` (${item.variant.namaVarian})` : ''}
                  {' x'}{item.jumlah}
                </li>
              ))}
            </ul>
          </div>
          <button onClick={handleConfirmPickup} disabled={loading} className="scanner-button confirm">
            {loading ? 'Memproses...' : 'Konfirmasi Penyerahan'}
          </button>
          <button onClick={resetScanner} disabled={loading} className="scanner-button secondary">
            Batal & Scan Ulang
          </button>
        </div>
      );
    }

    // Tampilan scanner utama
    return (
      <div className="scanner-view">
        <div className="scanner-header">
            <button onClick={() => navigate('/')} className="scanner-nav-button">
              <Icon name="arrow_back_ios_new" />
            </button>
            <h2>Scan QR Pesanan</h2>
            <button onClick={logout} className="scanner-nav-button">
              <Icon name="logout" />
            </button>
        </div>
        <div className="scanner-container">
          <video ref={ref} className="qr-reader-video" />
          <div className="scanner-overlay"><div className="scanner-box"></div></div>
        </div>
        {loading && <p className="status-text">Memproses...</p>}
        {error && (
            <div className="status-text error">
                {/* --- PERUBAHAN 2: Tambahkan tombol close --- */}
                <button onClick={resetScanner} className="close-error-btn">×</button>
                <p>{error}</p>
                {errorDetails && <small>{errorDetails}</small>} 
            </div>
        )}
        <p className="upload-prompt">Atau</p>
        <input 
            type="file" accept="image/*" ref={fileInputRef} 
            style={{ display: 'none' }} onChange={handleFileUpload}
        />
        <button onClick={() => fileInputRef.current.click()} className="scanner-button upload" disabled={loading}>
          <Icon name="upload_file" /> Unggah Gambar QR
        </button>
      </div>
    );
  };

  return <div className="scanner-page">{renderContent()}</div>;
};

export default ScannerPage;