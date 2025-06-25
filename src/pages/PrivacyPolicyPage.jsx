// src/pages/PrivacyPolicyPage.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import backIcon from '/icons/back-arrow.svg'; // Pastikan path ikon ini benar

const PrivacyPolicyPage = () => {
    const navigate = useNavigate();

    // CSS disematkan di sini untuk kemudahan
    const styles = `
    .privacy-page-container {
      background-color: #f8f9fa; /* Warna latar belakang untuk seluruh halaman */
    }

    /* --- Style untuk Header Baru --- */
    .privacy-header {
        display: flex;
        align-items: center;
        justify-content: center; /* Membuat judul di tengah */
        padding: 16px;
        background-color: white;
        position: sticky;
        top: 0;
        z-index: 10;
        border-bottom: 1px solid #e9ecef;
    }
    .privacy-header h2 {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 600;
    }
    .privacy-back-button {
        background: none;
        border: none;
        cursor: pointer;
        position: absolute; /* Posisi absolut terhadap header */
        left: 16px; /* Jarak dari kiri */
    }
    .privacy-back-button img {
        width: 24px;
        height: 24px;
    }
    /* --- Akhir Style Header --- */

    .privacy-policy-container {
      max-width: 800px;
      margin: 0 auto;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.7;
      color: #333;
      padding: 20px;
      background-color: #f8f9fa;
    }
    .privacy-policy-container h2 {
      font-size: 1.5rem;
      margin-top: 40px;
      margin-bottom: 15px;
      color: #2c3e50;
    }
    .privacy-policy-container ul {
      padding-left: 20px;
    }
    .privacy-policy-container li {
      margin-bottom: 10px;
    }
    .privacy-policy-container strong {
      color: #2c3e50;
    }
    .contact-info {
      background-color: #ffffff;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 20px;
      margin-top: 30px;
    }
  `;

    return (
        <>
            <style>{styles}</style>
            <div className="privacy-page-container">
                {/* Header sekarang berada di luar container konten utama */}
                <header className="privacy-header">
                    <button onClick={() => navigate('/')} className="privacy-back-button">
                        <img src={backIcon} alt="Kembali" />
                    </button>
                    <h2>Kebijakan Privasi</h2>
                </header>

                <div className="privacy-policy-container">
                    {/* Judul h1 yang besar dihapus dari sini agar tidak duplikat */}
                    <p>Di Ospeky, kami berkomitmen untuk menjaga dan melindungi privasi setiap pengguna yang menggunakan layanan kami. Halaman ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi informasi pribadi Anda. Dengan menggunakan situs dan layanan kami, Anda dianggap telah membaca dan menyetujui kebijakan privasi ini.</p>

                    <h2>1. Informasi yang Kami Kumpulkan</h2>
                    <p>Kami mengumpulkan beberapa jenis informasi dari pengguna untuk keperluan operasional, pemrosesan pesanan, dan peningkatan layanan, termasuk:</p>
                    <ul>
                        <li><strong>Informasi Pribadi:</strong> seperti nama, alamat, email, nomor WhatsApp, dan data kampus untuk keperluan pengiriman atau komunikasi.</li>
                        <li><strong>Informasi Transaksi:</strong> seperti metode pembayaran, jumlah pembayaran, status transaksi, dan data terkait pesanan.</li>
                        <li><strong>Informasi Teknis:</strong> seperti alamat IP, jenis perangkat, browser, dan waktu akses, untuk analisis penggunaan sistem.</li>
                    </ul>

                    <h2>2. Penggunaan Informasi</h2>
                    <p>Informasi yang Anda berikan digunakan untuk:</p>
                    <ul>
                        <li>Memproses dan mengelola pemesanan perlengkapan ospek.</li>
                        <li>Menghubungi Anda terkait konfirmasi, pengiriman, atau status pemesanan.</li>
                        <li>Menyediakan layanan pelanggan dan menanggapi pertanyaan Anda.</li>
                        <li>Meningkatkan sistem layanan dan pengalaman pengguna.</li>
                        <li>Mengirimkan informasi penting atau promosi (hanya jika Anda setuju).</li>
                    </ul>
                    <p>Kami tidak akan menjual, menyewakan, atau membagikan informasi pribadi Anda kepada pihak ketiga tanpa izin Anda, kecuali diwajibkan oleh hukum.</p>

                    <h2>3. Perlindungan Data</h2>
                    <p>Kami menggunakan berbagai langkah keamanan teknis dan operasional untuk menjaga data Anda tetap aman, termasuk:</p>
                    <ul>
                        <li>Sistem enkripsi saat transaksi pembayaran.</li>
                        <li>Penyimpanan data pada sistem yang dilindungi.</li>
                        <li>Akses terbatas hanya kepada tim yang memiliki izin terkait data tertentu.</li>
                    </ul>
                    <p>Namun perlu diketahui, tidak ada sistem digital yang 100% aman, dan kami akan terus berupaya meminimalkan risiko.</p>

                    <h2>4. Tautan ke Pihak Ketiga</h2>
                    <p>Situs atau aplikasi Ospeky mungkin mengandung tautan ke layanan lain seperti metode pembayaran pihak ketiga (contohnya Midtrans). Kebijakan privasi pihak tersebut tidak berada di bawah kendali kami. Kami menyarankan Anda membaca kebijakan privasi dari layanan eksternal yang Anda gunakan.</p>

                    <h2>5. Transaksi Hanya Melalui Kanal Resmi</h2>
                    <p>Ospeky tidak bertanggung jawab atas segala bentuk transaksi di luar website resmi atau kontak resmi kami. Semua pesanan dan pembayaran harus dilakukan melalui sistem dan nomor yang telah kami verifikasi.</p>
                    <p>Jika Anda melakukan pembayaran atau memberikan informasi melalui pihak lain yang mengatasnamakan Ospeky tanpa melalui kanal resmi, maka itu di luar tanggung jawab kami sepenuhnya.</p>

                    <h2>6. Hak Anda Sebagai Pengguna</h2>
                    <p>Sebagai pengguna, Anda berhak untuk:</p>
                    <ul>
                        <li>Meminta akses terhadap data pribadi Anda.</li>
                        <li>Meminta koreksi atas informasi yang tidak akurat.</li>
                        <li>Menarik kembali persetujuan Anda untuk menerima informasi promosi.</li>
                    </ul>

                    <h2>7. Perubahan Kebijakan Privasi</h2>
                    <p>Kebijakan privasi ini dapat diperbarui dari waktu ke waktu. Setiap perubahan akan diumumkan melalui situs resmi kami. Kami menyarankan Anda untuk memeriksa halaman ini secara berkala.</p>

                    <div className="contact-info">
                        <h2>8. Kontak Kami</h2>
                        <p>Jika Anda memiliki pertanyaan terkait kebijakan privasi ini, atau ingin melaporkan dugaan pelanggaran data, silakan hubungi kami melalui:</p>
                        <p>📧 Email: oyixask@gmail.com</p>
                        <p>📍 Alamat: Klojen, Kota Malang, Jawa Timur</p>
                        <p>📱 Instagram: @ospeky.id</p>
                        <p>📞 WhatsApp: 0887-0827-0460</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PrivacyPolicyPage;