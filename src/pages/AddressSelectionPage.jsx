import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyAddresses } from '../api/api';
import './AddressesPage.css'; // Kita gunakan style yang sama dengan AddressesPage
import backIcon from '/icons/back-arrow-white.svg'; // Pastikan path ikon benar

const AddressSelectionPage = () => {
    const navigate = useNavigate();
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAddresses = async () => {
            setLoading(true);
            try {
                // Memanggil fungsi dari api.js untuk mengambil semua alamat
                const { data } = await getMyAddresses();
                setAddresses(data);
            } catch (error) {
                console.error("Gagal mengambil alamat:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAddresses();
    }, []);

    const handleSelectAddress = (address) => {
        // Kembali ke halaman checkout dengan data alamat terpilih
        // replace: true digunakan agar halaman ini tidak masuk ke riwayat browser
        navigate('/checkout', { state: { selectedAddress: address }, replace: true });
    };

    const handleEditAddress = (e, addressId) => {
        // Mencegah event klik pada kartu utama saat tombol edit diklik
        e.stopPropagation(); 
        // Arahkan ke halaman edit, dan berikan "jejak" untuk kembali ke sini
        navigate(`/profile/addresses/edit/${addressId}?redirect=/checkout/select-address`);
    };

    return (
        <div className="address-page-wrapper">
            <header className="address-page-header">
                {/* Tombol kembali sekarang menggunakan navigate(-1) agar kembali ke halaman sebelumnya (checkout) */}
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <img src={backIcon} alt="Kembali" />
                </button>
                <h1 className="header-title">Pilih Alamat Pengiriman</h1>
            </header>

            <main className="address-page-content">
                {loading ? (
                    <p style={{ textAlign: 'center' }}>Memuat alamat...</p>
                ) : (
                    addresses.map(addr => (
                        <div key={addr.id} className="address-card selectable" onClick={() => handleSelectAddress(addr)}>
                            <div className="address-card-main-info">
                                <span className="address-name">{addr.namaPenerima}</span>
                                <span className="address-phone">{addr.nomorTelepon}</span>
                            </div>
                            <p className="address-details">{[addr.detailAlamat, addr.kecamatan, addr.kota].filter(Boolean).join(', ')}</p>
                            
                            {/* --- BAGIAN BARU DITAMBAHKAN DI SINI --- */}
                            <div className="address-card-footer">
                                {addr.isAlamatUtama && (
                                    <div className="address-badge">Alamat Utama</div>
                                )}
                                <button className="edit-address-btn" onClick={(e) => handleEditAddress(e, addr.id)}>
                                    <span className="material-icons-outlined">edit</span>
                                </button>
                            </div>
                            {/* --- AKHIR BAGIAN BARU --- */}
                        </div>
                    ))
                )}
                 <button
                    className="add-address-button"
                    // Tombol ini juga diberi "jejak" redirect
                    onClick={() => navigate('/profile/addresses/new?redirect=/checkout/select-address')}
                >
                    <span className="material-icons-outlined">add</span>
                    <span>Tambah Alamat Baru</span>
                </button>
            </main>
        </div>
    );
};

export default AddressSelectionPage;