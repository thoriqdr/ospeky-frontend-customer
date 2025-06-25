// src/context/NotificationContext.js

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { getUnpaidOrdersCount } from '../api/api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotification = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const [notificationCount, setNotificationCount] = useState(0);
  const { currentUser } = useAuth();

  // Fungsi ini tetap ada untuk mengambil data awal saat aplikasi dimuat
  const refetchNotifications = useCallback(async () => {
    if (!currentUser) {
      setNotificationCount(0);
      return;
    }
    try {
      const { data } = await getUnpaidOrdersCount();
      setNotificationCount(data.count); 
    } catch (error) {
      console.error("Gagal memuat ulang notifikasi:", error);
      setNotificationCount(0);
    }
  }, [currentUser]);

  useEffect(() => {
    refetchNotifications();
  }, [refetchNotifications]);

  // --- FUNGSI BARU UNTUK UPDATE INSTAN ---
  // Fungsi ini hanya akan mengurangi angka state secara lokal, membuatnya instan.
  const decrementNotificationCount = () => {
    setNotificationCount(prevCount => (prevCount > 0 ? prevCount - 1 : 0));
  };
  // --- AKHIR FUNGSI BARU ---

  const value = {
    notificationCount,
    refetchNotifications, // Kita tetap sediakan jika diperlukan
    decrementNotificationCount, // Sediakan fungsi baru
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};