// src/pages/SyaratDanKetentuanPage.jsx

import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import backIcon from '/icons/back-arrow.svg'; // Pastikan path ikon ini benar

const SyaratDanKetentuanPage = () => {
    const navigate = useNavigate();
    const refs = useRef([]);

    // Logika untuk animasi saat scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                    }
                });
            },
            { threshold: 0.1 }
        );
        refs.current.forEach(ref => { if (ref) observer.observe(ref); });
        return () => { refs.current.forEach(ref => { if (ref) observer.unobserve(ref); }); };
    }, []);

    const addToRefs = (el) => {
        if (el && !refs.current.includes(el)) {
            refs.current.push(el);
        }
    };

    const styles = `
    .terms-page-wrapper { background-color: #f8f9fa; }
    .terms-header {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
        background-color: white;
        position: sticky;
        top: 0;
        z-index: 10;
        border-bottom: 1px solid #e9ecef;
        margin-bottom: 40px;
    }
    .terms-header h2 { margin: 0; font-size: 1.1rem; font-weight: 600; }
    .terms-back-button { background: none; border: none; cursor: pointer; position: absolute; left: 16px; }
    .terms-back-button img { width: 24px; height: 24px; }

    .terms-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 0 20px 50px 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.7;
      color: #333;
    }
    .terms-container h1 {
      font-size: 2.2rem;
      color: #2c3e50;
      border-bottom: 2px solid #eee;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    .terms-container ol {
      list-style: none;
      counter-reset: terms-counter;
      padding-left: 0;
    }
    .terms-container ol > li {
      counter-increment: terms-counter;
      margin-bottom: 30px;
    }
    /* Membuat penomoran custom yang profesional */
    .terms-container ol > li::before {
      content: counter(terms-counter) ".";
      font-size: 1.5rem;
      font-weight: 700;
      color: #3498db;
      margin-right: 10px;
    }
    .terms-container li strong {
      font-size: 1.3rem;
      color: #2c3e50;
    }
    .terms-container ul {
      list-style-type: '•';
      padding-left: 25px;
      margin-top: 15px;
    }
    .terms-container ul li {
      margin-bottom: 10px;
    }
    .terms-container .penutup {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #eee;
    }

    /* Animasi */
    .animate-on-scroll { opacity: 0; transition: opacity 0.8s ease-out, transform 0.8s ease-out; }
    .fade-in-up { transform: translateY(30px); }
    .animate-on-scroll.is-visible { opacity: 1; transform: translateY(0); }
  `;

    return (
        <>
            <style>{styles}</style>
            <div className="terms-page-wrapper">
                <header className="terms-header">
                    <button onClick={() => navigate('/')} className="terms-back-button">
                        <img src={backIcon} alt="Kembali" />
                    </button>
                    <h2>Syarat & Ketentuan</h2>
                </header>

                <div className="terms-container">
                    <h1 ref={addToRefs} className="animate-on-scroll fade-in-up">Syarat dan Ketentuan Ospeky</h1>
                    <p ref={addToRefs} className="animate-on-scroll fade-in-up">Dengan melakukan pembelian perlengkapan ospek melalui layanan kami, selanjutnya disebut Tim Ospeky, Anda telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan berikut ini. Ketentuan ini berlaku sebagai dasar hukum dan etika antara pihak pembeli dan penyedia layanan.</p>
                    
                    <ol>
                        <li ref={addToRefs} className="animate-on-scroll fade-in-up">
                            <strong>DP Anda Tidak Akan Hangus – Kami Pastikan Anda Tetap Terima Haknya</strong>
                            <p>Uang muka (DP) yang telah dibayarkan oleh pembeli tidak akan hangus sepenuhnya, berbeda dengan praktik umum yang sering terjadi.</p>
                            <ul>
                                <li>Apabila pembatalan terjadi setelah Tim Ospeky melakukan pembelian atau proses produksi:</li>
                                <li>Barang yang telah dibeli atau dibuat tetap akan diserahkan kepada pembeli.</li>
                                <li>Sisa dana DP yang belum digunakan akan dikembalikan secara transparan.</li>
                            </ul>
                            <p>Tim Ospeky berkomitmen pada sistem yang adil dan terbuka: tidak ada dana yang hilang tanpa pertanggungjawaban.</p>
                        </li>
                        <li ref={addToRefs} className="animate-on-scroll fade-in-up">
                            <strong>Pembayaran dan Pemesanan</strong>
                            <ul>
                                <li>Pembayaran dapat dilakukan melalui metode resmi yang disediakan oleh Tim Ospeky.</li>
                                <li>Pesanan akan diproses hanya setelah konfirmasi pembayaran diterima oleh sistem kami.</li>
                                <li>Pemesanan dianggap sah apabila data telah diisi dengan lengkap dan pembayaran dilakukan melalui kanal resmi.</li>
                            </ul>
                        </li>
                        <li ref={addToRefs} className="animate-on-scroll fade-in-up">
                          <strong>Pengadaan dan Penyerahan Barang</strong>
                          <ul>
                            <li>Setelah pembayaran dikonfirmasi, Tim Ospeky akan memulai proses pembelian atau produksi barang sesuai pesanan.</li>
                            <li>Barang akan diserahkan langsung kepada pembeli sesuai jadwal distribusi yang telah ditentukan.</li>
                            <li>Jika pesanan dibatalkan dan barang telah dibeli sebagian, maka barang tersebut akan tetap diberikan kepada pembeli, disertai pengembalian dana yang belum digunakan (jika ada).</li>
                          </ul>
                        </li>
                        <li ref={addToRefs} className="animate-on-scroll fade-in-up">
                          <strong>Harga Produk Tidak Mengikuti Harga Pasar</strong>
                          <p>Harga yang tercantum dalam katalog produk Tim Ospeky tidak mengacu secara langsung pada harga pasar umum, melainkan disusun berdasarkan:</p>
                          <ul>
                            <li>Skema produksi massal</li>
                            <li>Biaya logistik dan distribusi</li>
                            <li>Desain dan kustomisasi eksklusif kegiatan ospek</li>
                          </ul>
                          <p>Oleh karena itu, harga tidak dapat ditawar atau dibandingkan langsung dengan harga pasar ritel.</p>
                        </li>
                        <li ref={addToRefs} className="animate-on-scroll fade-in-up">
                          <strong>Perubahan dan Pembatalan Pesanan</strong>
                          <ul>
                              <li>Perubahan pesanan hanya dapat dilakukan sebelum Tim Ospeky memulai proses pengadaan atau produksi barang.</li>
                              <li>Pembatalan pesanan setelah proses pengadaan dimulai akan mengikuti ketentuan:</li>
                              <li>Barang yang telah dibeli tetap menjadi milik pembeli dan akan diserahkan saat distribusi.</li>
                              <li>DP tidak dikembalikan penuh, tetapi dihitung secara rasional berdasarkan barang yang telah diproses.</li>
                              <li>Tidak ada penukaran atau pengembalian barang, kecuali jika terdapat kesalahan atau kerusakan dari pihak Tim Ospeky.</li>
                          </ul>
                        </li>
                        <li ref={addToRefs} className="animate-on-scroll fade-in-up">
                            <strong>Keterlambatan dan Keadaan di Luar Kendali (Force Majeure)</strong>
                            <p>Tim Ospeky tidak bertanggung jawab atas keterlambatan pengiriman atau produksi yang disebabkan oleh hal-hal di luar kendali seperti:</p>
                            <ul>
                                <li>Bencana alam, cuaca ekstrem</li>
                                <li>Kebijakan kampus atau instansi yang berubah sewaktu-waktu</li>
                                <li>Gangguan distribusi logistik, dsb.</li>
                            </ul>
                            <p>Dalam kasus tersebut, Tim Ospeky akan segera memberikan pemberitahuan dan solusi terbaik kepada pembeli.</p>
                        </li>
                        <li ref={addToRefs} className="animate-on-scroll fade-in-up">
                            <strong>Komunikasi, Validasi Data, dan Keamanan</strong>
                            <ul>
                                <li>Semua komunikasi dan transaksi resmi hanya dilakukan melalui Website resmi Tim Ospeky dan Kontak resmi yang tertera di halaman layanan (WhatsApp/email resmi).</li>
                                <li>Tim Ospeky tidak bertanggung jawab atas kerugian yang timbul akibat transaksi atau komunikasi yang dilakukan di luar kanal resmi kami.</li>
                                <li>Waspadalah terhadap penipuan yang mengatasnamakan Tim Ospeky. Jika Anda menerima informasi mencurigakan atau tidak berasal dari sumber resmi, segera laporkan kepada kami.</li>
                                <li>Segala bentuk penipuan atau manipulasi data akan ditindak sesuai hukum yang berlaku.</li>
                            </ul>
                        </li>
                        <li ref={addToRefs} className="animate-on-scroll fade-in-up">
                            <strong>Keamanan Transaksi dan Tanggung Jawab Pembeli</strong>
                            <ul>
                                <li>Pembeli wajib memastikan data yang diberikan saat pemesanan adalah valid dan sesuai.</li>
                                <li>Kesalahan data seperti nama, ukuran, jumlah, atau kontak, menjadi tanggung jawab pembeli.</li>
                                <li>Tim Ospeky tidak berkewajiban melakukan koreksi data setelah pesanan diproses, kecuali terbukti ada kesalahan dari pihak kami.</li>
                            </ul>
                        </li>
                    </ol>
                    <div ref={addToRefs} className="penutup animate-on-scroll fade-in-up">
                      <p><strong>Penutup</strong><br/>Dengan melakukan transaksi melalui Tim Ospeky, Anda menyetujui seluruh syarat dan ketentuan ini secara sadar, tanpa paksaan, dan dengan pertimbangan penuh. Sistem ini dirancang agar transparan, adil, dan bertanggung jawab bagi semua pihak.</p>
                      <p>Jika Anda memerlukan bantuan atau klarifikasi, silakan hubungi kami melalui kanal resmi Tim Ospeky yang tercantum pada halaman utama situs atau aplikasi.</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SyaratDanKetentuanPage;