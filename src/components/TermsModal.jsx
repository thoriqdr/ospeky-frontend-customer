import React from 'react';
import './TermsModal.css';
import backIcon from '/icons/back-arrow-white.svg'; // Pastikan path ikon ini benar

const TermsModal = ({ isOpen, onClose, onConfirm, title }) => {
  if (!isOpen) return null;

  return (
    <div className="terms-modal-overlay" onClick={onClose}>
      <div className="terms-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="terms-modal-header">
          <button className="back-btn" onClick={onClose}>
             <img src={backIcon} alt="Kembali" />
          </button>
          <h2>{title}</h2>
        </div>
        <div className="terms-modal-body">
          {/* --- Teks S&K Resmi Dimasukkan di Sini --- */}
          <h3>Syarat dan Ketentuan Ospeky</h3>
          <p>Dengan melakukan pembelian perlengkapan ospek melalui layanan kami, selanjutnya disebut Tim Ospeky, Anda telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan berikut ini. Ketentuan ini berlaku sebagai dasar hukum dan etika antara pihak pembeli dan penyedia layanan.</p>
          
          <ol>
            <li>
              <strong>DP Anda Tidak Akan Hangus – Kami Pastikan Anda Tetap Terima Haknya</strong>
              <p>Uang muka (DP) yang telah dibayarkan oleh pembeli tidak akan hangus sepenuhnya, berbeda dengan praktik umum yang sering terjadi.</p>
              <ul>
                <li>Apabila pembatalan terjadi setelah Tim Ospeky melakukan pembelian atau proses produksi:</li>
                <li>Barang yang telah dibeli atau dibuat tetap akan diserahkan kepada pembeli.</li>
                <li>Sisa dana DP yang belum digunakan akan dikembalikan secara transparan.</li>
              </ul>
              <p>Tim Ospeky berkomitmen pada sistem yang adil dan terbuka: tidak ada dana yang hilang tanpa pertanggungjawaban.</p>
            </li>
            <li>
              <strong>Pembayaran dan Pemesanan</strong>
              <ul>
                <li>Pembayaran dapat dilakukan melalui metode resmi yang disediakan oleh Tim Ospeky.</li>
                <li>Pesanan akan diproses hanya setelah konfirmasi pembayaran diterima oleh sistem kami.</li>
                <li>Pemesanan dianggap sah apabila data telah diisi dengan lengkap dan pembayaran dilakukan melalui kanal resmi.</li>
              </ul>
            </li>
            <li>
              <strong>Pengadaan dan Penyerahan Barang</strong>
              <ul>
                <li>Setelah pembayaran dikonfirmasi, Tim Ospeky akan memulai proses pembelian atau produksi barang sesuai pesanan.</li>
                <li>Barang akan diserahkan langsung kepada pembeli sesuai jadwal distribusi yang telah ditentukan.</li>
                <li>Jika pesanan dibatalkan dan barang telah dibeli sebagian, maka barang tersebut akan tetap diberikan kepada pembeli, disertai pengembalian dana yang belum digunakan (jika ada).</li>
              </ul>
            </li>
            <li>
              <strong>Harga Produk Tidak Mengikuti Harga Pasar</strong>
              <p>Harga yang tercantum dalam katalog produk Tim Ospeky tidak mengacu secara langsung pada harga pasar umum, melainkan disusun berdasarkan:</p>
              <ul>
                <li>Skema produksi massal</li>
                <li>Biaya logistik dan distribusi</li>
                <li>Desain dan kustomisasi eksklusif kegiatan ospek</li>
              </ul>
              <p>Oleh karena itu, harga tidak dapat ditawar atau dibandingkan langsung dengan harga pasar ritel.</p>
            </li>
            <li>
              <strong>Perubahan dan Pembatalan Pesanan</strong>
              <ul>
                  <li>Perubahan pesanan hanya dapat dilakukan sebelum Tim Ospeky memulai proses pengadaan atau produksi barang.</li>
                  <li>Pembatalan pesanan setelah proses pengadaan dimulai akan mengikuti ketentuan:</li>
                  <li>Barang yang telah dibeli tetap menjadi milik pembeli dan akan diserahkan saat distribusi.</li>
                  <li>DP tidak dikembalikan penuh, tetapi dihitung secara rasional berdasarkan barang yang telah diproses.</li>
                  <li>Tidak ada penukaran atau pengembalian barang, kecuali jika terdapat kesalahan atau kerusakan dari pihak Tim Ospeky.</li>
              </ul>
            </li>
             <li>
                <strong>Keterlambatan dan Keadaan di Luar Kendali (Force Majeure)</strong>
                <ul>
                    <li>Tim Ospeky akan berupaya sebaik mungkin untuk menyelesaikan dan mengirimkan pesanan tepat waktu.</li>
                    <li>Namun, apabila terjadi gangguan yang berada di luar kendali seperti: Bencana alam, cuaca ekstrem, Kebijakan kampus atau instansi yang berubah sewaktu-waktu, Gangguan distribusi logistik, dsb.</li>
                    <li>Dalam kasus tersebut, Tim Ospeky akan segera memberikan pemberitahuan dan solusi terbaik kepada pembeli.</li>
                </ul>
             </li>
             <li>
                <strong>Komunikasi, Validasi Data, dan Keamanan</strong>
                <ul>
                    <li>Semua komunikasi dan transaksi resmi hanya dilakukan melalui: Website resmi Tim Ospeky dan Kontak resmi yang tertera di halaman layanan (WhatsApp/email resmi).</li>
                    <li>Tim Ospeky tidak bertanggung jawab atas kerugian yang timbul akibat transaksi atau komunikasi yang dilakukan di luar kanal resmi kami.</li>
                    <li>Waspadalah terhadap penipuan yang mengatasnamakan Tim Ospeky. Jika Anda menerima informasi mencurigakan atau tidak berasal dari sumber resmi, segera laporkan kepada kami.</li>
                    <li>Segala bentuk penipuan atau manipulasi data akan ditindak sesuai hukum yang berlaku.</li>
                </ul>
             </li>
             <li>
                <strong>Keamanan Transaksi dan Tanggung Jawab Pembeli</strong>
                <ul>
                    <li>Pembeli wajib memastikan data yang diberikan saat pemesanan adalah valid dan sesuai.</li>
                    <li>Kesalahan data seperti nama, ukuran, jumlah, atau kontak, menjadi tanggung jawab pembeli.</li>
                    <li>Tim Ospeky tidak berkewajiban melakukan koreksi data setelah pesanan diproses, kecuali terbukti ada kesalahan dari pihak kami.</li>
                </ul>
             </li>
          </ol>
          <p><strong>Penutup</strong><br/>Dengan melakukan transaksi melalui Tim Ospeky, Anda menyetujui seluruh syarat dan ketentuan ini secara sadar, tanpa paksaan, dan dengan pertimbangan penuh. Sistem ini dirancang agar transparan, adil, dan bertanggung jawab bagi semua pihak.</p>
          <p>Jika Anda memerlukan bantuan atau klarifikasi, silakan hubungi kami melalui kanal resmi Tim Ospeky yang tercantum pada halaman utama situs atau aplikasi.</p>
        </div>
        <div className="terms-modal-footer">
          <button onClick={onConfirm} className="confirm-button">Setuju dan Lanjutkan</button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;