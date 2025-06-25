import React, { useState, useEffect, useContext } from 'react'; // <-- TAMBAHKAN 'useContext' DI SINI
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TermsModal from '../components/TermsModal';
import { CartContext } from '../context/CartContext';

import { useNotification } from '../context/NotificationContext.jsx';
import './CheckoutPage.css';
import backIcon from '/icons/back-arrow.svg';
import { getMyAddresses, createOrder, requestMidtransTransaction } from '../api/api';

const API_URL = 'http://localhost:5000';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();

  // Fungsi untuk mengambil item dari sessionStorage atau dari state navigasi
  const getInitialItems = () => {
    try {
      const itemsFromStorage = sessionStorage.getItem('checkoutItems');
      return itemsFromStorage ? JSON.parse(itemsFromStorage) : (location.state?.orderItems || []);
    } catch (error) {
      console.error("Gagal memparsing item dari sessionStorage:", error);
      return [];
    }
  };

  const [orderItems, setOrderItems] = useState(getInitialItems);
  const [shippingOption, setShippingOption] = useState('ambil_ditempat');
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressLoading, setAddressLoading] = useState(true);
  const [catatan, setCatatan] = useState(() => sessionStorage.getItem('checkoutNote') || '');
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const { removeItemsByIds } = useContext(CartContext);
  const { decrementNotificationCount } = useNotification();

  // Efek untuk menyimpan item ke sessionStorage jika ada data baru dari navigasi
  useEffect(() => {
    if (location.state?.orderItems && location.state.orderItems.length > 0) {
      sessionStorage.setItem('checkoutItems', JSON.stringify(location.state.orderItems));
      setOrderItems(location.state.orderItems);
    }
  }, [location.state?.orderItems]);

  // Efek untuk menyimpan catatan ke sessionStorage setiap kali nilainya berubah
  useEffect(() => {
    sessionStorage.setItem('checkoutNote', catatan);
  }, [catatan]);

  // Efek untuk mengambil alamat default saat halaman dimuat
  useEffect(() => {
    const fetchDefaultAddress = async () => {
      setAddressLoading(true);
      try {
        const { data } = await getMyAddresses({ isDefault: 'true' });
        if (data.length > 0) {
          setSelectedAddress(data[0]);
        }
      } catch (error) {
        console.error("Gagal mengambil alamat default:", error);
      } finally {
        setAddressLoading(false);
      }
    };
    fetchDefaultAddress();
  }, []);

  // Efek untuk menerima alamat yang baru dipilih dari halaman pemilihan alamat
  useEffect(() => {
    if (location.state?.selectedAddress) {
      setSelectedAddress(location.state.selectedAddress);
    }
  }, [location.state?.selectedAddress]);

  // Kalkulasi Rincian Pembayaran
  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const biayaLayanan = 0;
  const diskon = 0;
  const totalPembayaran = subtotal + biayaLayanan - diskon;

  // Fungsi untuk membuka modal Syarat & Ketentuan
  // Kode Baru dengan Pengecekan Wajib
  const handleOpenTerms = () => {
    // Pengecekan alamat sekarang berlaku untuk semua opsi pengiriman
    if (!selectedAddress) {
      alert("Mohon pilih atau lengkapi alamat Anda terlebih dahulu.");
      return;
    }
    if (orderItems.length === 0) {
      alert("Keranjang belanja Anda kosong.");
      return;
    }
    setIsTermsModalOpen(true);
  };

  // Fungsi yang dieksekusi setelah menyetujui S&K
  // CheckoutPage.jsx (Kode yang Sudah Diperbaiki)

  const handleConfirmAndPay = async () => {
    setIsTermsModalOpen(false);

    if (shippingOption === 'diantar' && !selectedAddress) {
      alert("Alamat pengiriman wajib dipilih jika Anda memilih opsi 'Diantar ke rumah'.");
      return;
    }

    console.log("Mengecek isi orderItems sebelum dikirim:", orderItems);


    setIsProcessingPayment(true);

    // 1. Susun data pesanan untuk dikirim ke backend
    const orderDataForDb = {
      // Ambil alamatId jika opsi 'diantar', jika tidak kirim null
      alamatPengirimanId: shippingOption === 'diantar' ? selectedAddress.id : null,

      // Ambil opsi pengiriman dari state
      opsiPengiriman: shippingOption,

      // Ambil catatan dari state
      catatan: catatan,

      // Transformasi `orderItems` menjadi format `detailPesanan` yang diharapkan backend
      detailPesanan: orderItems.map(item => ({
        produkId: item.productId,       // Asumsi `item.id` adalah ID produk
        variantId: item.variantId || null, // Asumsi `item.variantId` ada di item
        jumlah: item.quantity,
        harga: item.price
      })),
    };

    try {
      // 2. Buat pesanan di database kita
      const orderResponse = await createOrder(orderDataForDb);
      const newOrder = orderResponse.data.pesanan; // Pastikan backend mengembalikan 'pesanan'

      // Periksa apakah newOrder dan propertinya ada sebelum melanjutkan
      if (!newOrder || !newOrder.id || !newOrder.total) {
        throw new Error("Gagal mendapatkan detail pesanan yang valid dari server.");
      }

      // 3. Siapkan data untuk transaksi Midtrans
      const transactionDataForMidtrans = {
        orderId: newOrder.id,
        type: 'DP',
        amount: newOrder.total,
        // Pastikan currentUser ada dan memiliki displayName & email
        customerName: currentUser?.displayName || 'Pelanggan',
        customerEmail: currentUser?.email,
      };

      // 4. Minta token transaksi dari backend kita
      const midtransResponse = await requestMidtransTransaction(transactionDataForMidtrans);
      const transactionToken = midtransResponse.data.token;

      // 5. Tampilkan popup pembayaran Midtrans (Snap.js)
      window.snap.pay(transactionToken, {
        onSuccess: function (result) {
          console.log('success', result);
          alert("Pembayaran berhasil!");
          sessionStorage.removeItem('checkoutItems'); // Hapus item dari session storage
          sessionStorage.removeItem('checkoutNote');
          const idsToRemove = orderItems.map(item => item.variantId);
          removeItemsByIds(idsToRemove);
          decrementNotificationCount();
          navigate('/orders');
        },
        onPending: function (result) {
          console.log('pending', result);
          alert("Menunggu pembayaran Anda!");
          sessionStorage.removeItem('checkoutItems'); // Hapus item dari session storage
          sessionStorage.removeItem('checkoutNote');
          const idsToRemove = orderItems.map(item => item.variantId);
          removeItemsByIds(idsToRemove);
          decrementNotificationCount();
          navigate('/orders');
        },
        onError: function (result) {
          console.log('error', result);
          alert("Pembayaran gagal!");
        },
        onClose: function () {
          alert('Anda menutup popup tanpa menyelesaikan pembayaran. Pesanan Anda menunggu pembayaran.');
          sessionStorage.removeItem('checkoutNote');
          const idsToRemove = orderItems.map(item => item.variantId);
          removeItemsByIds(idsToRemove);
          decrementNotificationCount();
          navigate('/orders'); // Arahkan ke daftar pesanan agar user bisa bayar lagi nanti
        }
      });

    } catch (error) {
      console.error("Gagal memproses pembayaran:", error);
      // Tampilkan pesan error spesifik dari backend jika ada
      const errorMessage = error.response?.data?.message || "Terjadi kesalahan saat memproses pesanan Anda.";
      alert(errorMessage);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="checkout-container">
      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        onConfirm={handleConfirmAndPay}
        title="Syarat & Ketentuan"
      />

      <div className="checkout-header">
        <button onClick={() => navigate(-1)} className="checkout-back-button">
          <img src={backIcon} alt="Kembali" />
        </button>
        <h2>Checkout</h2>
      </div>

      <div className="shipping-address" onClick={() => navigate('/checkout/select-address')}>
        <div className="address-icon-container">
          <span className="material-icons-outlined">place</span>
        </div>
        {addressLoading ? (
          <p>Memuat alamat...</p>
        ) : selectedAddress ? (
          <div className="address-details">
            <h4>{selectedAddress.namaPenerima} <span className="phone-number">{selectedAddress.nomorTelepon}</span></h4>
            <p>{[selectedAddress.detailAlamat, selectedAddress.kecamatan, selectedAddress.kota].filter(Boolean).join(', ')}</p>
          </div>
        ) : (
          <div className="address-details">
            <h4>Pilih Alamat Pengiriman</h4>
            <p>Anda belum memilih alamat.</p>
          </div>
        )}
        <div className="address-action">
          <span className="material-icons-outlined">chevron_right</span>
        </div>
      </div>

      <div className="shipping-options">
        <h4>Opsi Pengiriman <span className="required-star">*</span></h4>
        <label>
          <input
            type="radio"
            name="shipping"
            value="ambil_ditempat"
            checked={shippingOption === 'ambil_ditempat'}
            onChange={(e) => setShippingOption(e.target.value)}
          />
          Ambil di tempat
        </label>
        <label>
          <input
            type="radio"
            name="shipping"
            value="diantar"
            checked={shippingOption === 'diantar'}
            onChange={(e) => setShippingOption(e.target.value)}
          />
          Diantar ke rumah (Tambahan biaya)
        </label>
        <p className="shipping-note">
          Biaya pengiriman mengikuti tarif pada aplikasi Gojek. Biaya yang tertera saat ini tidak termasuk biaya pengiriman
        </p>
      </div>

      <div className="order-notes-section">
        <h4>Tinggalkan catatan</h4>
        <textarea
          value={catatan}
          onChange={(e) => setCatatan(e.target.value)}
          placeholder="Ketik catatan penting di sini..."
          maxLength="100"
          rows="3"
        ></textarea>
        <div className="char-counter">{catatan.length}/100</div>
      </div>

      <div className="order-items-list">
        {orderItems.map((item, index) => {
          // =========================================================================================
          // PERUBAHAN: Logika untuk menampilkan nama varian secara langsung
          // LOKASI: Di dalam blok map untuk `orderItems`
          // PENJELASAN: Logika ini sekarang akan:
          // 1. Jika nama produk utama adalah "variant", maka HANYA NAMA VARIAN yang ditampilkan.
          // 2. Jika produk biasa punya varian, maka ditampilkan sebagai "Nama Produk - Nama Varian".
          // 3. Jika tidak punya varian, hanya nama produk yang ditampilkan.
          // =========================================================================================
          let displayName;
          if (item.name && item.name.toLowerCase() === 'variant' && item.variantName) { // <-- PERUBAHAN
            displayName = item.variantName;                                               // <-- PERUBAHAN
          } else if (item.variantName && item.variantName !== 'Default') {                // <-- PERUBAHAN
            displayName = `${item.name} - ${item.variantName}`;                          // <-- PERUBAHAN
          } else {                                                                        // <-- PERUBAHAN
            displayName = item.name;                                                      // <-- PERUBAHAN
          }

          return (
            <div key={index} className="order-item">
              <img src={`${API_URL}/${item.image}`} alt={displayName} className="order-item-image" />
              <div className="order-item-details">
                <p className="order-item-name">{displayName}</p>
                <p className="order-item-price">Rp{item.price.toLocaleString('id-ID')}</p>
              </div>
              <div className="order-item-quantity">
                <span>{item.quantity}</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="payment-summary">
        <h4>Rincian Pembayaran</h4>
        <div className="summary-row">
          <span>Subtotal Pesanan</span>
          <span>Rp{subtotal.toLocaleString('id-ID')}</span>
        </div>
        <div className="summary-row">
          <span>Biaya Layanan</span>
          <span>Rp{biayaLayanan.toLocaleString('id-ID')}</span>
        </div>
        <div className="summary-row">
          <span>Diskon</span>
          <span>-Rp{diskon.toLocaleString('id-ID')}</span>
        </div>
        <hr className="summary-divider" />
        <div className="summary-row total">
          <span>Total Pembayaran</span>
          <span>Rp{totalPembayaran.toLocaleString('id-ID')}</span>
        </div>
      </div>

      <div className="checkout-action-button">
        <button onClick={handleOpenTerms} disabled={isProcessingPayment}>
          {isProcessingPayment ? 'Memproses...' : 'Bayar'}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;