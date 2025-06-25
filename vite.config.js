import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // String '/api' adalah awalan yang ingin kita teruskan
      '/api': {
        // Arahkan ke server backend Anda
        target: 'http://localhost:5000', // Ganti port 5000 jika backend Anda berjalan di port lain

        // Opsi ini penting untuk mencegah error
        changeOrigin: true,
        secure: false,
      },
    },
  },
});