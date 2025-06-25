// src/context/ModalContext.jsx

import React, { createContext, useState, useContext } from 'react';
import AuthModal from '../components/AuthModal';
import TermsModal from '../components/TermsModal';
import OnboardingModal from '../components/OnboardingModal'; // 1. Impor OnboardingModal

const ModalContext = createContext();

export function useModal() {
  return useContext(ModalContext);
}

export const ModalProvider = ({ children }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [termsModalOptions, setTermsModalOptions] = useState({ showConfirm: false, onConfirm: () => {} });
  
  // --- STATE & FUNGSI BARU UNTUK ONBOARDING ---
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const openOnboardingModal = () => setIsOnboardingModalOpen(true);
  const closeOnboardingModal = () => setIsOnboardingModalOpen(false);
  // --- AKHIR BAGIAN BARU ---

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const openTermsModal = (options = {}) => {
    setTermsModalOptions({
      showConfirm: options.showConfirmButton || false,
      onConfirm: options.onConfirm || (() => {})
    });
    setIsTermsModalOpen(true);
  };
  const closeTermsModal = () => setIsTermsModalOpen(false);

  // --- PERBARUI VALUE UNTUK MENYERTAKAN ONBOARDING ---
  const value = {
    openAuthModal,
    closeAuthModal,
    openTermsModal,
    openOnboardingModal, // <-- Tambahkan ini
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      {isAuthModalOpen && <AuthModal onClose={closeAuthModal} />}
      {isTermsModalOpen && (
        <TermsModal
          isOpen={true}
          onClose={closeTermsModal}
          onConfirm={() => {
            termsModalOptions.onConfirm();
            closeTermsModal();
          }}
          title="Syarat & Ketentuan"
          showConfirmButton={termsModalOptions.showConfirm}
        />
      )}
      {/* Render OnboardingModal secara kondisional */}
      {isOnboardingModalOpen && <OnboardingModal onClose={closeOnboardingModal} />}
    </ModalContext.Provider>
  );
};