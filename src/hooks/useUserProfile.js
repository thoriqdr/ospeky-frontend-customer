// src/hooks/useUserProfile.js

import { useState, useEffect } from 'react';
import { getUserProfile } from '../api/api'; // Pastikan path ini benar
import { useAuth } from '../context/AuthContext';

const useUserProfile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Jika tidak ada user yang login, pastikan profil juga kosong
    if (!currentUser) {
      setUserProfile(null);
      return;
    }

    const fetchProfile = async () => {
      try {
        // Panggil API backend Anda untuk mendapatkan data user, termasuk role
        const { data } = await getUserProfile();
        setUserProfile(data);
      } catch (error) {
        console.error("Gagal mengambil profil pengguna:", error);
        setUserProfile(null);
      }
    };

    fetchProfile();
    
  }, [currentUser]); // Hook ini akan berjalan setiap kali user login/logout

  return userProfile; // Mengembalikan data profil: { id, email, nama, role }
};

export default useUserProfile;