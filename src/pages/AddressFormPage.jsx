import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
// Pastikan path ke api.js dan ConfirmationModal sudah benar
import { getAddressById, createAddress, updateAddress, deleteAddress } from '../api/api';
import ConfirmationModal from '../components/ConfirmationModal';
import './AddressFormPage.css';
import backIcon from '/icons/back-arrow-white.svg';

const AddressFormPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { addressId } = useParams();

    const queryParams = new URLSearchParams(location.search);
    const redirectUrl = queryParams.get('redirect');

    const [formData, setFormData] = useState({
        namaPenerima: '',
        nomorTelepon: '',
        kota: '',
        kecamatan: '',
        detailAlamat: '',
        isAlamatUtama: false,
    });
    
    // --- STATE BARU UNTUK MENYIMPAN PESAN ERROR ---
    const [errors, setErrors] = useState({});

    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const isEditMode = Boolean(addressId);

    useEffect(() => {
        if (isEditMode) {
            setLoading(true);
            const fetchAddress = async () => {
                try {
                    const { data } = await getAddressById(addressId);
                    setFormData(data);
                } catch (error) {
                    console.error("Gagal mengambil detail alamat", error);
                    navigate(-1);
                } finally {
                    setLoading(false);
                }
            };
            fetchAddress();
        } else {
            setLoading(false);
        }
    }, [addressId, isEditMode, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Hapus pesan error untuk kolom yang sedang diisi
        if (errors[name]) {
            setErrors(prevErrors => ({ ...prevErrors, [name]: null }));
        }
    };

    // --- FUNGSI BARU UNTUK VALIDASI FORM ---
    const validateForm = () => {
        const newErrors = {};
        const errorMessage = "Bagian ini wajib di isi";
        if (!formData.namaPenerima.trim()) newErrors.namaPenerima = errorMessage;
        if (!formData.nomorTelepon.trim()) newErrors.nomorTelepon = errorMessage;
        if (!formData.kota.trim()) newErrors.kota = errorMessage;
        if (!formData.kecamatan.trim()) newErrors.kecamatan = errorMessage;
        if (!formData.detailAlamat.trim()) newErrors.detailAlamat = errorMessage;
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Jalankan validasi terlebih dahulu
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors); // Set state error jika ada yang kosong
            return; // Hentikan proses submit
        }

        setIsSubmitting(true);
        try {
            if (isEditMode) {
                await updateAddress(addressId, formData);
            } else {
                await createAddress(formData);
            }
            // Kembali ke halaman sebelumnya setelah sukses
            navigate(-1); 
        } catch (error) {
            console.error("Gagal menyimpan alamat:", error);
            alert('Gagal menyimpan alamat.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConfirmDelete = async () => {
        setIsDeleteModalOpen(false);
        setIsSubmitting(true);
        try {
            await deleteAddress(addressId);
            navigate(-1);
        } catch (error) {
            console.error("Gagal menghapus alamat:", error);
            alert('Gagal menghapus alamat.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <p style={{ textAlign: 'center', marginTop: '3rem' }}>Memuat formulir alamat...</p>;
    }

    return (
        <div className="address-form-page-wrapper">
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Hapus Alamat?"
                message="Apakah Anda yakin ingin menghapus alamat ini? Tindakan ini tidak dapat dibatalkan."
            />
            <header className="address-form-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <img src={backIcon} alt="Kembali" />
                </button>
                <h1 className="header-title">{isEditMode ? 'Edit Alamat' : 'Alamat Baru'}</h1>
            </header>
            <form className="address-form-content" onSubmit={handleSubmit} noValidate>
                <div className="form-card">
                    <h2 className="form-card-title">Alamat</h2>
                    <div className="form-group">
                        <label htmlFor="namaPenerima">Nama Lengkap</label>
                        <input type="text" id="namaPenerima" name="namaPenerima" value={formData.namaPenerima} onChange={handleChange} 
                               className={errors.namaPenerima ? 'input-error' : ''}
                               placeholder={errors.namaPenerima || ''} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="nomorTelepon">Nomor Telepon</label>
                        <input type="tel" id="nomorTelepon" name="nomorTelepon" value={formData.nomorTelepon} onChange={handleChange} 
                               className={errors.nomorTelepon ? 'input-error' : ''}
                               placeholder={errors.nomorTelepon || ''} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="kota">Kota</label>
                        <input type="text" id="kota" name="kota" value={formData.kota} onChange={handleChange}
                               className={errors.kota ? 'input-error' : ''}
                               placeholder={errors.kota || ''} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="kecamatan">Kecamatan</label>
                        <input type="text" id="kecamatan" name="kecamatan" value={formData.kecamatan} onChange={handleChange}
                               className={errors.kecamatan ? 'input-error' : ''}
                               placeholder={errors.kecamatan || ''} />
                    </div>
                    <div className="form-group no-border">
                        <label htmlFor="detailAlamat">Nama Jalan, Gedung, No. Rumah dan Detail Lainnya</label>
                        <textarea id="detailAlamat" name="detailAlamat" value={formData.detailAlamat} onChange={handleChange} rows="3"
                                  className={errors.detailAlamat ? 'input-error' : ''}
                                  placeholder={errors.detailAlamat || ''}></textarea>
                    </div>
                </div>
                <div className="form-card">
                     <label className="checkbox-label">
                        <input type="checkbox" name="isAlamatUtama" checked={formData.isAlamatUtama} onChange={handleChange} />
                        Jadikan alamat utama
                    </label>
                </div>
                <div className="form-actions">
                    {isEditMode && (
                        <button type="button" className="btn-delete" onClick={() => setIsDeleteModalOpen(true)} disabled={isSubmitting}>
                            Hapus
                        </button>
                    )}
                    <button type="submit" className="btn-save" disabled={isSubmitting}>
                        {isSubmitting ? 'Menyimpan...' : 'Simpan Alamat'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddressFormPage;