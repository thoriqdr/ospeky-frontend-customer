import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { getMyOrderById, requestMidtransTransaction } from '../api/api';
import QRCode from 'react-qr-code';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import './OrderDetailPage.css';
import backIcon from '/icons/back-arrow-white.svg';


const OrderDetailPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isPaying, setIsPaying] = useState(false);

    const fetchOrder = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await getMyOrderById(orderId);
            setOrder(data);
        } catch (error) {
            console.error("Gagal memuat detail pesanan:", error);
        } finally {
            setLoading(false);
        }
    }, [orderId]);

    useEffect(() => {
        fetchOrder();
    }, [fetchOrder]);

    const paymentDetails = useMemo(() => {
        if (!order) return null;

        let subtotalBarangLunas = 0;
        let subtotalDP = 0;
        let sisaTagihanAwal = 0;
        const rincianSisaTagihan = [];

        order.detailPesanan.forEach(item => {
            const hargaAwalItem = item.harga * item.jumlah;

            // --- Logika Fallback untuk Kalkulasi ---
            const tipeProduk = item.tipeProdukSnapshot || item.produk?.tipeProduk;
            const hargaTotalPO = item.hargaTotalPOSnapshot || item.produk?.hargaTotalPO;
            const namaProduk = item.namaProdukSnapshot || item.produk?.namaProduk || 'Produk Telah Dihapus';

            if (!tipeProduk) return;

            switch (tipeProduk) {
                case 'TUNGGAL':
                case 'VARIAN':
                    subtotalBarangLunas += hargaAwalItem;
                    break;
                case 'PO_LANGSUNG':
                case 'PO_DP':
                    subtotalDP += hargaAwalItem;
                    if (hargaTotalPO && hargaTotalPO > 0) {
                        const sisaTagihanItem = (hargaTotalPO * item.jumlah) - hargaAwalItem;
                        sisaTagihanAwal += sisaTagihanItem;
                        rincianSisaTagihan.push({ nama: namaProduk, sisa: sisaTagihanItem, status: 'Siap Dilunasi' });
                    } else {
                        rincianSisaTagihan.push({ nama: namaProduk, sisa: 0, status: 'Belum Ditetapkan' });
                    }
                    break;
                default:
                    subtotalBarangLunas += hargaAwalItem;
                    break;
            }
        });

        const totalPembayaranAwal = subtotalBarangLunas + subtotalDP;
        let sisaTagihanFinal = sisaTagihanAwal;
        let totalSudahDibayar = totalPembayaranAwal;

        if (['LUNAS', 'DIPROSES', 'DIKIRIM', 'SELESAI'].includes(order.status)) {
            sisaTagihanFinal = 0;
            totalSudahDibayar = totalPembayaranAwal + sisaTagihanAwal;
        }
        
        const semuaHargaPoTelahDitetapkan = !rincianSisaTagihan.some(item => item.status === 'Belum Ditetapkan');

        return { 
            subtotalBarangLunas, 
            subtotalDP, 
            totalPembayaranAwal, 
            sisaTagihan: sisaTagihanFinal, 
            totalSudahDibayar,
            rincianSisaTagihan,
            semuaHargaPoTelahDitetapkan
        };
    }, [order]);
    
    const handlePayRemainder = async () => {
        setIsPaying(true);
        try {
            const transactionData = {
              orderId: order.id,
              type: 'PELUNASAN', 
            };
            const midtransResponse = await requestMidtransTransaction(transactionData);
            window.snap.pay(midtransResponse.data.token, {
              onSuccess: () => { alert("Pelunasan berhasil!"); fetchOrder(); },
              onPending: () => { alert("Menunggu pembayaran Anda."); fetchOrder(); },
              onError: () => { alert("Pelunasan gagal!"); setIsPaying(false); },
              onClose: () => { setIsPaying(false); }
            });
          } catch (error) {
            alert(error.response?.data?.message || "Gagal memproses pelunasan.");
            setIsPaying(false);
          }
    };

    const formatCurrency = (value) => {
        if (value === null || value === undefined) return 'Rp0';
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
    }
    
    const formatDate = (dateString) => {
        if (!dateString) return 'Menunggu..';
        try {
            return format(new Date(dateString), 'dd-MM-yyyy HH:mm', { locale: { ...id, options: { weekStartsOn: 1 } } });
        } catch (error) {
            return 'Tanggal tidak valid';
        }
    }

    const getProductImage = (item) => {
        const defaultImage = '/images/default-product.png';
        const baseUrl = api.defaults.baseURL.replace('/api', ''); // baseURL yang benar
        
        // Logika Fallback untuk Gambar
        if (item.gambarProdukSnapshot) {
            return `${baseUrl}/${item.gambarProdukSnapshot}`; // <- Perbaikan
        }
        if (item.produk?.gambarUrls) {
            try {
                const images = JSON.parse(item.produk.gambarUrls);
                if (images.length > 0) {
                    return `${baseUrl}/${images[0]}`; // <- Perbaikan
                }
            } catch (e) {
                return defaultImage;
            }
        }
        return defaultImage;
    };

    if (loading) return <p className="od-message">Memuat detail pesanan...</p>;
    if (!order || !paymentDetails) return <p className="od-message">Pesanan tidak ditemukan atau Anda tidak memiliki akses.</p>;
    
    const nomorResi = order.nomorUrutAngka ? `${order.nomorUrutPrefix}${String(order.nomorUrutAngka).padStart(4, '0')}` : null;

    return (
        <div className="od-page-container">
            <header className="od-page-header">
                <button onClick={() => navigate(-1)} className="od-back-button"><img src={backIcon} alt="Kembali" /></button>
                <h1>Detail Pesanan</h1>
            </header>

            <main className="od-page-content">
                <div className="od-card">
                    <div className="od-status-section">
                        <span>Status</span>
                        <strong>{order.status.replace(/_/g, ' ')}</strong>
                    </div>
                    {order.detailPesanan.map(item => {
                        // --- Logika Fallback untuk Nama Tampilan ---
                        const displayName = item.namaProdukSnapshot || item.produk?.namaProduk;
                        
                        // Tampilkan error HANYA jika snapshot KOSONG dan produkId juga KOSONG (artinya benar-benar dihapus)
                        if (!displayName && !item.produkId) {
                           return <div key={item.id} className="od-product-item"><p className="od-item-error">Detail produk tidak dapat dimuat.</p></div>;
                        }

                        return (
                            <div key={item.id} className="od-product-item">
                                <img src={getProductImage(item)} alt={displayName || 'Gambar Produk'} className="od-product-image" />
                                <div className="od-product-info">
                                    <p className="od-product-name">{displayName || 'Memuat nama...'}</p>
                                    <p className="od-product-price">{formatCurrency(item.harga)}</p>
                                </div>
                                <span className="od-product-qty">x{item.jumlah}</span>
                            </div>
                        )
                    })}
                </div>

                {order.status === 'MENUNGGU_PELUNASAN' && paymentDetails.rincianSisaTagihan.length > 0 && (
                    <div className="od-card">
                        <h4>Rincian Sisa Tagihan Pre-Order</h4>
                        <div className="od-po-breakdown">
                            {paymentDetails.rincianSisaTagihan.map((item, index) => (
                                <div key={index} className="od-po-item">
                                    <span>{item.nama}</span>
                                    <p className={item.status === 'Belum Ditetapkan' ? 'od-po-pending' : 'od-po-ready'}>
                                        {item.status === 'Belum Ditetapkan' ? 'Belum Ditetapkan' : formatCurrency(item.sisa)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="od-card">
                    <h4>Opsi Pengiriman</h4>
                    <p className="od-shipping-option">{order.opsiPengiriman.replace(/_/g, ' ')}</p>
                    {order.opsiPengiriman === 'diantar' && order.alamatPengiriman && (
                        <div className="od-shipping-address">
                            <p><strong>{order.alamatPengiriman.namaPenerima}</strong> ({order.alamatPengiriman.nomorTelepon})</p>
                            <p>{order.alamatPengiriman.detailAlamat}, {order.alamatPengiriman.kecamatan}, {order.alamatPengiriman.kota}</p>
                        </div>
                    )}
                </div>

                <div className="od-card">
                    <div className="od-info-grid">
                        <span>No. Pesanan</span><p>{nomorResi || order.id.substring(0,8).toUpperCase()}</p>
                        <span>Waktu Pemesanan</span><p>{format(new Date(order.createdAt), 'dd-MM-yyyy HH:mm', { locale: { ...id, options: { weekStartsOn: 1 } } })}</p>
                        {order.tanggalDp && (
                            <>
                                <span>Waktu Pembayaran 1</span><p>{formatDate(order.tanggalDp)}</p>
                            </>
                        )}
                        {order.tanggalPelunasan && (
                            <>
                                <span>Waktu Pembayaran 2</span><p>{formatDate(order.tanggalPelunasan)}</p>
                            </>
                        )}
                    </div>
                </div>
                
                <div className="od-card">
                    <h4>Rincian Pembayaran</h4>
                    <div className="od-pricing-grid">
                        {paymentDetails.subtotalBarangLunas > 0 && (
                            <><span>Subtotal Barang Lunas</span><p>{formatCurrency(paymentDetails.subtotalBarangLunas)}</p></>
                        )}
                        {paymentDetails.subtotalDP > 0 && (
                            <><span>Subtotal Uang Muka (DP)</span><p>{formatCurrency(paymentDetails.subtotalDP)}</p></>
                        )}
                        <hr /><hr />
                        <span>Total Pembayaran Awal</span>
                        <p><strong>{formatCurrency(paymentDetails.totalPembayaranAwal)}</strong></p>
                        <hr /><hr />
                        <span>Total Sudah Dibayarkan</span>
                        <p>{formatCurrency(paymentDetails.totalSudahDibayar)}</p>
                        <span className="sisa-pelunasan">Total Sisa Tagihan</span>
                        <p className="sisa-pelunasan">{formatCurrency(paymentDetails.sisaTagihan)}</p>
                    </div>
                </div>

                {order.status === 'MENUNGGU_PELUNASAN' && paymentDetails.sisaTagihan > 0 && paymentDetails.semuaHargaPoTelahDitetapkan && (
                    <div className="od-action-card">
                         <button className="od-pay-button" onClick={handlePayRemainder} disabled={isPaying}>
                            {isPaying ? 'Memproses...' : `Lakukan Pelunasan (${formatCurrency(paymentDetails.sisaTagihan)})`}
                        </button>
                    </div>
                )}
                
                {order.catatan && (
                    <div className="od-card">
                        <h4>Catatan</h4>
                        <p className="od-catatan-text">{order.catatan}</p>
                    </div>
                )}

                <div className="od-qr-section">
                    {nomorResi && order.status !== 'MENUNGGAK' ? (
                        <>
                            <div className="od-nomor-resi">{nomorResi}</div>
                            <QRCode value={order.id} size={200} />
                            <p>Tunjukkan barcode ini saat pengambilan barang<br/>(bukan nomor antrian)</p>
                        </>
                    ) : (
                        <p className="od-qr-placeholder">QR Code Akan Muncul di Sini Setelah Pembayaran Lunas!</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default OrderDetailPage;