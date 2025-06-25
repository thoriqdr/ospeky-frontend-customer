import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestMidtransTransaction } from '../api/api';
import { useNotification } from '../context/NotificationContext.jsx';
import './OrderCard.css';

const API_URL = 'http://localhost:5000';

const OrderItem = ({ item }) => {
  // --- Logika Fallback untuk Nama dan Gambar ---
  const displayName = item.namaProdukSnapshot || item.produk?.namaProduk;

  let imageUrl = '/images/default-product.png';
  if (item.gambarProdukSnapshot) {
    imageUrl = `${API_URL}/${item.gambarProdukSnapshot}`;
  } else if (item.produk?.gambarUrls) {
    try {
        const images = JSON.parse(item.produk.gambarUrls);
        if(images.length > 0) imageUrl = `${API_URL}/${images[0]}`;
    } catch(e) {}
  }
  
  // Tampilkan error HANYA jika tidak ada nama sama sekali dan produkId juga sudah null
  if (!displayName && !item.produkId) {
    return <div className="oc-item-error">Detail produk tidak dapat dimuat.</div>;
  }
  
  return (
    <div className="oc-item">
      <img src={imageUrl} alt={displayName || 'Gambar Produk'} className="oc-item-image" />
      <div className="oc-item-info">
        <p className="oc-item-name">{displayName || 'Memuat nama...'}</p>
        <div className="oc-item-price-details">
         <p>Harga : <span>Rp{item.harga.toLocaleString('id-ID')}</span></p>
       </div>
      </div>
      <span className="oc-item-quantity">x{item.jumlah}</span>
    </div>
  );
};


const OrderCard = ({ order, onOrderExpire }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const navigate = useNavigate();
  const { decrementNotificationCount } = useNotification();
  
  const items = order.detailPesanan || [];
  const showExpandButton = items.length > 2;
  
  const paymentInfo = useMemo(() => {
    let sisaTagihan = 0;
    let canPayNow = false;

    if (order.status === 'MENUNGGU_PELUNASAN') {
        const poItems = items.filter(item => {
            const tipe = item.tipeProdukSnapshot || item.produk?.tipeProduk;
            return tipe === 'PO_DP' || tipe === 'PO_LANGSUNG';
        });

        if (poItems.length > 0) {
            const allPricesSet = poItems.every(item => {
                const hargaTotal = item.hargaTotalPOSnapshot || item.produk?.hargaTotalPO;
                return hargaTotal != null && hargaTotal > 0;
            });

            if (allPricesSet) {
                let totalSisa = 0;
                poItems.forEach(item => {
                    const hargaAwalItem = item.harga * item.jumlah;
                    const hargaTotalItem = (item.hargaTotalPOSnapshot || item.produk?.hargaTotalPO) * item.jumlah;
                    totalSisa += (hargaTotalItem - hargaAwalItem);
                });
                
                sisaTagihan = totalSisa;
                if (sisaTagihan > 0) {
                    canPayNow = true;
                }
            }
        }
    }

    return { sisaTagihan, canPayNow };
  }, [order, items]);

  useEffect(() => {
    if (order.status !== 'MENUNGGAK') {
      setTimeLeft('');
      return; 
    }
    const expirationTime = new Date(order.createdAt).getTime() + 60 * 60 * 1000;
    const intervalId = setInterval(() => {
      const now = new Date().getTime();
      const distance = expirationTime - now;
      if (distance < 0) {
        clearInterval(intervalId);
        setTimeLeft("Waktu pembayaran habis");
        if (onOrderExpire) onOrderExpire();
      } else {
        const minutes = Math.floor((distance % (3600000)) / 60000);
        const seconds = Math.floor((distance % 60000) / 1000);
        setTimeLeft(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [order.status, order.createdAt, onOrderExpire]);

  const getStatusInfo = (status) => {
    const defaultClass = "oc-status-value";
    const statusMap = { "MENUNGGAK": "status-waiting", "MENUNGGU_PELUNASAN": "status-waiting", "DIKIRIM": "status-shipped", "SELESAI": "status-completed", "DIBATALKAN": "status-cancelled", "LUNAS": "status-completed" };
    return `${defaultClass} ${statusMap[status] || ''}`;
  };

  const displayedItems = showExpandButton && !isExpanded ? items.slice(0, 2) : items;
  
  const handlePayNow = async (e, paymentType) => {
    e.stopPropagation();
    setIsPaying(true);
    try {
      const transactionData = { orderId: order.id, type: paymentType };
      const midtransResponse = await requestMidtransTransaction(transactionData);
      const transactionToken = midtransResponse.data.token;
      
      if (!transactionToken) throw new Error("Gagal mendapatkan token pembayaran.");
      
      window.snap.pay(transactionToken, {
        onSuccess: () => { alert("Pembayaran berhasil!"); if (onOrderExpire) onOrderExpire(); decrementNotificationCount?.(); }, 
        onPending: () => { alert("Menunggu pembayaran Anda."); if (onOrderExpire) onOrderExpire(); decrementNotificationCount?.(); },
        onError: () => { alert("Pembayaran gagal!"); setIsPaying(false); },
        onClose: () => { setIsPaying(false); }
      });
    } catch (error) {
      alert(error.response?.data?.message || `Gagal memproses pembayaran tipe ${paymentType}.`);
      setIsPaying(false);
    }
  };
  
  const formatCurrency = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value || 0);

  return (
    <div className="oc-card" onClick={() => navigate(`/orders/${order.id}`)}>
      <div className="oc-header">
        <span className="oc-status-label">Status</span>
        <span className={getStatusInfo(order.status)}>{order.status.replace(/_/g, ' ')}</span>
      </div>
      <div className="oc-items-container">
        {displayedItems.map(item => <OrderItem key={item.id} item={item} />)}
      </div>
      {showExpandButton && (
        <div className="oc-expand-wrapper">
          <button onClick={(e) => {e.stopPropagation(); setIsExpanded(!isExpanded)}} className="oc-expand-btn">
            {isExpanded ? 'Tampilkan lebih sedikit' : `Lihat Semua (${items.length} produk)`}
          </button>
        </div>
      )}
      <div className="oc-footer">
        <div className="oc-total-section">
            <span className="oc-total-label">Total Pembayaran Awal</span>
            <span className="oc-total-amount">{formatCurrency(order.total)}</span>
        </div>
        
        {order.status === 'MENUNGGAK' && (
            <>
              {timeLeft && <p className="oc-countdown">Sisa waktu bayar: <strong>{timeLeft}</strong></p>}
              <button className="oc-action-button" onClick={(e) => handlePayNow(e, 'DP')} disabled={isPaying || timeLeft === "Waktu pembayaran habis"}>
                {isPaying ? 'Memproses...' : 'Bayar Sekarang'}
              </button>
            </>
        )}
        
        {order.status === 'MENUNGGU_PELUNASAN' && paymentInfo.canPayNow && (
            <div className="oc-pelunasan-section">
                <div className="oc-pelunasan-info">
                    <span>Sisa Tagihan:</span>
                    <strong>{formatCurrency(paymentInfo.sisaTagihan)}</strong>
                </div>
                <button className="oc-action-button oc-pelunasan-btn" onClick={(e) => handlePayNow(e, 'PELUNASAN')} disabled={isPaying}>
                    {isPaying ? 'Memproses...' : 'Lakukan Pelunasan'}
                </button>
            </div>
        )}
        
        {(['LUNAS', 'DIPROSES', 'DIKIRIM', 'SELESAI']).includes(order.status) && (
           <p className="oc-note">
             <strong>Note*</strong> {order.nomorUrutAngka ? `Nomor resi Anda: ${order.nomorUrutPrefix}${String(order.nomorUrutAngka).padStart(4, '0')}` : 'Barcode akan muncul setelah pembayaran lunas & diproses admin.'}
           </p>
        )}
        {(order.status === 'DIBATALKAN' || (order.status === 'MENUNGGAK' && timeLeft === "Waktu pembayaran habis")) && (
             <p className="oc-note">Pesanan ini telah dibatalkan atau kedaluwarsa.</p>
        )}
      </div>
    </div>
  );
};

export default OrderCard;