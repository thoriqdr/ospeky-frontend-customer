// src/pages/AddressesPage.jsx (Terhubung ke Data Asli)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import './AddressesPage.css';

const AddressesPage = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    // 1. KEMBALIKAN STATE KE KONDISI AWAL
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);

    // 2. AKTIFKAN KEMBALI useEffect UNTUK MENGAMBIL DATA DARI SERVER
    useEffect(() => {
        const fetchAddresses = async () => {
            if (currentUser) {
                setLoading(true);

                try {
                    // Cukup panggil api.get langsung. 
                    // Token dan header sudah diurus otomatis oleh api.js.
                    // Juga, hapus '/api' dari path karena sudah ada di baseURL.
                    const { data } = await api.get('/users/addresses');
                    setAddresses(data);
                } catch (error) {
                    console.error("Gagal mengambil alamat:", error);
                    setAddresses([]);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchAddresses();
    }, [currentUser]); // Dependency tetap

    return (
        <div className="address-page-wrapper">
            <header className="address-page-header">
                <button className="back-btn" onClick={() => navigate('/profile')}>
                    <img src="/icons/back-arrow-white.svg" alt="Kembali" />
                </button>
                <h1 className="header-title">Alamat Saya</h1>
            </header>

            <main className="address-page-content">
                {loading ? (
                    <p style={{ textAlign: 'center' }}>Memuat alamat...</p>
                ) : addresses.length > 0 ? (
                    addresses.map(addr => (
                        <div key={addr.id} className="address-card">
                            <div className="address-card-main-info">
                                <span className="address-name">{addr.namaPenerima}</span>
                                <span className="address-phone">{addr.nomorTelepon}</span>
                            </div>
                            <p className="address-details">{[addr.detailAlamat, addr.kecamatan, addr.kota].filter(Boolean).join(', ')}</p>
                            <div className="address-card-footer">
                                {addr.isAlamatUtama && (
                                    <div className="address-badge">Alamat pengantaran</div>
                                )}
                                <button
                                    className="edit-address-btn"
                                    onClick={() => navigate(`/profile/addresses/edit/${addr.id}`)}
                                >
                                    <span className="material-icons-outlined">edit</span>
                                </button>
                            </div>
                        </div>
                    ))
                ) : null}

                <button
                    className="add-address-button"
                    onClick={() => navigate('/profile/addresses/new')}
                >
                    <span className="material-icons-outlined">add</span>
                    <span>Tambah Alamat Baru</span>
                </button>

                {/* Pesan kalau tidak ada alamat */}
                {!loading && addresses.length === 0 && (
                    <p style={{
                        textAlign: 'center',
                        color: '#7f8c8d',
                        marginTop: '16px'
                    }}>
                        Belum ada alamat yang tersimpan.
                    </p>
                )}

            </main>
        </div>
    );
};

export default AddressesPage;