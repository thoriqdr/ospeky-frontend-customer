// src/hooks/useUnpaidOrdersCount.js

import { useState, useEffect } from 'react';
import { getMyOrders } from '../api/api'; // Pastikan path ini benar
import { useAuth } from '../context/AuthContext';

const useUnpaidOrdersCount = () => {
  const [count, setCount] = useState(0);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setCount(0);
      return;
    }

    const fetchUnpaidCount = async () => {
      try {
        const { data: orders } = await getMyOrders();
        const unpaidStatuses = ["MENUNGGAK", "MENUNGGU_PELUNASAN"];
        const unpaidOrders = orders.filter(order => unpaidStatuses.includes(order.status));
        setCount(unpaidOrders.length);
      } catch (error) {
        console.error("Gagal mengambil data pesanan untuk notifikasi:", error);
        setCount(0);
      }
    };

    fetchUnpaidCount();
    
  }, [currentUser]); // Akan fetch ulang jika pengguna login/logout

  return count;
};

export default useUnpaidOrdersCount;