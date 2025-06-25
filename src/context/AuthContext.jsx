// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  // --- 1. Impor fungsi-fungsi yang dibutuhkan untuk ganti password ---
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import api from '../api/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async () => {
    try {
      const { data } = await api.get('/users/profile');
      setUserProfile(data);
    } catch (error) {
      setUserProfile(null);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserProfile();
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [fetchUserProfile]);

  async function login(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await fetchUserProfile();
    return userCredential.user;
  }

  function logout() {
    return signOut(auth);
  }

  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const response = await api.post('/auth/google', { token: await result.user.getIdToken() });
    await fetchUserProfile();
    return response.data;
  }
  
  async function updateUserProfile(profileData) {
      if (!currentUser) throw new Error("Tidak ada pengguna untuk diupdate.");
      await api.patch('/users/profile', profileData);
      await updateProfile(currentUser, { displayName: profileData.nama });
      await fetchUserProfile();
  }

  function forgotPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  // --- 2. Tambahkan definisi fungsi yang hilang di sini ---
  function changeUserPassword(oldPassword, newPassword) {
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, oldPassword);
    // Pengguna harus re-otentikasi terlebih dahulu
    return reauthenticateWithCredential(user, credential).then(() => {
        // Jika berhasil, baru update password
        return updatePassword(user, newPassword);
    });
  }
  // --- Akhir dari fungsi baru ---

  const value = {
    currentUser,
    userProfile,
    loading,
    login,
    logout,
    loginWithGoogle,
    forgotPassword,
    updateUserProfile,
    refreshUserProfile: fetchUserProfile,
    changeUserPassword, // Sekarang variabel ini sudah didefinisikan di atas
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};