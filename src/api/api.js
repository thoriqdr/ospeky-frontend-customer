import axios from 'axios';
import { auth } from '../firebase/firebaseConfig'; // Pastikan path ini benar

const api = axios.create({
  // Mengambil alamat dasar dari environment variable dan menambahkan '/api'
  baseURL: `${import.meta.env.VITE_API_URL}/api`, 
});

// Interceptor ini akan otomatis menempelkan token autentikasi ke setiap permintaan
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Fungsi spesifik untuk mengambil pesanan milik pengguna yang sedang login
export const getMyOrders = () => {
  return api.get('/orders/myorders');
};

export const getUserProfile = () => {
  return api.get('/users/profile');
};

export const getMyAddresses = (params = {}) => {
  return api.get('/users/addresses', { params });
};

export const createOrder = (orderData) => {
  return api.post('/orders', orderData);
};

export const requestMidtransTransaction = (transactionData) => {
  return api.post('/payments/request-midtrans', transactionData);
};
// ... setelah fungsi getMyAddresses



export const getAddressById = (addressId) => {
  return api.get(`/users/addresses/${addressId}`);
};

export const createAddress = (addressData) => {
  return api.post('/users/addresses', addressData);
};

export const updateAddress = (addressId, addressData) => {
  return api.patch(`/users/addresses/${addressId}`, addressData);
};

export const deleteAddress = (addressId) => {
  return api.delete(`/users/addresses/${addressId}`);
};

export const getMyOrderById = (orderId) => {
  return api.get(`/orders/myorders/${orderId}`);
};

export const getUnpaidOrdersCount = () => api.get('/orders/unpaid-count');

export default api;