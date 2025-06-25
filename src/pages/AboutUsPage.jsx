import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import backIcon from '/icons/back-arrow.svg'; // Pastikan path ikon ini benar

const AboutUsPage = () => {
    const navigate = useNavigate();
    const refs = useRef([]);

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

        refs.current.forEach(ref => {
            if (ref) observer.observe(ref);
        });

        return () => {
            refs.current.forEach(ref => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, []);

    const addToRefs = (el) => {
        if (el && !refs.current.includes(el)) {
            refs.current.push(el);
        }
    };

    const styles = `
    .about-us-page-wrapper {
      background-color: #f8f9fa;
    }
    .about-us-container {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      color: #333;
      padding: 0 20px 50px 20px; /* Padding atas dihapus, diganti oleh header */
      overflow-x: hidden;
      background-color: #ffffff; /* Warna latar belakang untuk seluruh halaman */
    }

    /* --- Style untuk Header Halaman ini --- */
    .about-header {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
        background-color: white;
        position: sticky;
        top: 0;
        z-index: 10;
        border-bottom: 1px solid #e9ecef;
        margin-bottom: 40px; /* Jarak antara header dan konten */
    }
    .about-header h2 {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 600;
    }
    .about-back-button {
        background: none;
        border: none;
        cursor: pointer;
        position: absolute;
        left: 16px;
    }
    .about-back-button img {
        width: 24px;
        height: 24px;
    }
    /* --- Akhir Style Header --- */

    .about-us-content {
      max-width: 900px;
      margin: 0 auto;
    }
    .main-section {
      
      padding: 40px;
      
    }
    .about-image-wrapper {
      float: left;
      width: 100%;
      max-width: 280px;
      margin-right: 30px; 
      margin-bottom: 20px;
    }
    .about-image-wrapper img {
      width: 100%;
      height: auto;
      border-radius: 12px;
      object-fit: cover;
    }
    .about-text-wrapper h2 {
      font-size: 1.5rem;
      font-weight: 600;
      
      text-align: justify;
      color: #34495e;
      margin-top: 0;
      margin-bottom: 20px;
      line-height: 1.4;
    }
    .about-text-wrapper p {
      font-size: 1.1rem;
      line-height: 1.8;
      color: #555;
      margin-bottom: 20px;
      text-align: justify;
    }
    .about-text-wrapper blockquote {
      border-left: 4px solid #3498db;
      padding-left: 20px;
      margin: 30px 0;
      font-style: italic;
      color: #666;
    }
    .signature-block {
      margin-top: 40px;
      line-height: 1.6;
    }
    .signature-block .name {
      font-weight: 700;
      color: #2c3e50;
    }
    .signature-block .title {
      font-size: 0.9rem;
      color: #7f8c8d;
    }

    /* Animasi scroll */
    .animate-on-scroll {
      opacity: 0;
      transition: opacity 0.8s ease-out, transform 0.8s ease-out;
    }
    .fade-in-up {
      transform: translateY(30px);
    }
    .animate-on-scroll.is-visible {
      opacity: 1;
      transform: translateY(0) translateX(0);
    }

    /* Responsif Mobile */
    @media (max-width: 768px) {
      .about-image-wrapper {
        float: none;
        margin: 0 auto 20px auto;
        max-width: 80%;
      }
      .main-section {
        padding: 25px;
      }
      .about-text-wrapper p {
        text-align: left;
      }
    }
  `;

    return (
        <>
            <style>{styles}</style>
            <div className="about-us-page-wrapper">
                {/* Header baru yang benar untuk halaman ini */}
                <header className="about-header">
                    <button onClick={() => navigate('/')} className="about-back-button">
                        <img src={backIcon} alt="Kembali" />
                    </button>
                    <h2>Tentang Kami</h2>
                </header>

                <div className="about-us-container">
                    <div className="about-us-content">
                        <section className="main-section">
                            <div className="about-text-wrapper">
                                

                                <h2 className="animate-on-scroll fade-in-up" ref={addToRefs}>
                                    Halo, saya Thoriq Dwi Rayoga, founder dari Ospeky — sebuah inisiatif yang saya bangun dengan semangat untuk menghadirkan solusi praktis dan terpercaya dalam penyediaan perlengkapan ospek bagi mahasiswa dan pelajar.
                                </h2>
                                <p className="animate-on-scroll fade-in-up" ref={addToRefs}>
                                    Saya merupakan mahasiswa aktif di Universitas Brawijaya, dan lulusan dari SMA Negeri 1 Bunguran Timur. Sejak masa sekolah, saya telah mengembangkan ketertarikan dalam dunia kreatif, digital, serta kewirausahaan. Perjalanan saya dimulai dari menjadi seorang konten kreator YouTube sejak tahun 2019, yang memperkuat kemampuan komunikasi, kreativitas, dan manajemen proyek secara mandiri.
                                </p>
                                <p className="animate-on-scroll fade-in-up" ref={addToRefs}>
                                    Berbekal pengalaman sebagai freelancer di berbagai marketplace seperti Shopee dan Maxim, saya terbiasa menghadapi dinamika pasar digital, termasuk pengelolaan penjualan, pemasaran, dan kepuasan pelanggan. Di samping itu, saya juga pernah belajar langsung di lapangan sebagai mekanik di bengkel motor dan bike wash, yang mengasah keterampilan teknis serta etos kerja secara profesional.
                                </p>
                                <p className="animate-on-scroll fade-in-up" ref={addToRefs}>
                                    Dengan kombinasi pengalaman kreatif, bisnis, dan teknis tersebut, saya membentuk Ospeky sebagai platform penyedia perlengkapan ospek yang tidak hanya fokus pada penjualan produk, tetapi juga menjunjung tinggi transparansi, tanggung jawab, dan kenyamanan pelanggan. Ospeky hadir untuk membantu mempermudah proses ospek bagi mahasiswa baru dengan layanan yang terstruktur, sistem pembayaran yang adil, serta proses distribusi yang profesional.
                                </p>
                                <blockquote className="animate-on-scroll fade-in-up" ref={addToRefs}>
                                    Saya percaya, integritas dan komitmen adalah fondasi utama dalam membangun kepercayaan pelanggan. Oleh karena itu, Ospeky tidak hanya dikelola secara teknis, tapi juga dengan hati, karena saya sendiri pernah berada di posisi yang sama — menghadapi ospek sebagai mahasiswa baru.
                                    </blockquote>

                                    <div className="signature-block animate-on-scroll fade-in-up" ref={addToRefs}>
                                        <p>Terima kasih telah mempercayakan kebutuhan ospek Anda kepada Ospeky.<br />Salam hangat,</p>
                                        <p className="name">Thoriq Dwi Rayoga</p>
                                        <p className="title">Founder of Ospeky</p>
                                    </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AboutUsPage;