// src/App.jsx (Versi Final dengan Perbaikan Rute Universitas)

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

// Impor Provider
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ModalProvider, useModal } from './context/ModalContext';
import { NotificationProvider } from './context/NotificationContext';
// Impor Komponen & Halaman
import Navbar from './components/NavBar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import NotificationsPage from './pages/NotificationsPage';
import UniversitySearchPage from './pages/UniversitySearchPage';
import UniversityPage from './pages/UniversityPage';
import ProfilePage from './pages/ProfilePage';
import PersonalDetailsPage from './pages/PersonalDetailsPage';
import AddressesPage from './pages/AddressesPage'; // <-- Impor halaman baru
import AddressFormPage from './pages/AddressFormPage';
import AddressSelectionPage from './pages/AddressSelectionPage';
import OnboardingModal from './components/OnboardingModal';
import OrderDetailPage from './pages/OrderDetailPage';
import AboutUsPage from './pages/AboutUsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import SyaratDanKetentuanPage from './pages/SyaratDanKetentuanPage';
import AdminLoginPage from './pages/AdminLoginPage';
import ScannerPage from './pages/ScannerPage';
import AdminRoute from './components/AdminRoute';





const Layout = () => {
  const location = useLocation();
  const { isAuthModalOpen, isOnboardingModalOpen } = useModal();


  const showMainLayout =
    !location.pathname.startsWith('/product/') &&
    !location.pathname.startsWith('/profile') &&
    !location.pathname.startsWith('/admin') &&
    !location.pathname.startsWith('/universitas') &&
    !location.pathname.startsWith('/checkout') &&

    !location.pathname.startsWith('/orders') && // <-- Dikembalikan
    // !location.pathname.startsWith('/search-university') && // jadi text sesmentara waktu
    location.pathname !== '/checkout' &&
    location.pathname !== '/tentang-kami' &&
    location.pathname !== '/syarat-dan-ketentuan' &&
    location.pathname !== '/privasi' &&
    location.pathname !== '/cart';

  return (
    <div className="app-container">
      {isAuthModalOpen && <AuthModal />}
      {isOnboardingModalOpen && <OnboardingModal />}

      {showMainLayout && <Navbar />}


      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search-university" element={<UniversitySearchPage />} />

          {/* --- PERBAIKAN DI SINI: Ubah :id menjadi :universityId --- */}
          <Route path="/universitas/:universityId" element={<UniversityPage />} />

          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/details" element={<PersonalDetailsPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile/addresses" element={<AddressesPage />} />
          <Route path="/profile/addresses/new" element={<AddressFormPage />} /> {/* <-- RUTE TAMBAH */}
          <Route path="/profile/addresses/edit/:addressId" element={<AddressFormPage />} /> {/* <-- RUTE EDIT */}
          <Route path="/checkout/select-address" element={<AddressSelectionPage />} />
          <Route path="/orders/:orderId" element={<OrderDetailPage />} />
          <Route path="/tentang-kami" element={<AboutUsPage />} />
          <Route path="/privasi" element={<PrivacyPolicyPage />} />
          <Route path="/syarat-dan-ketentuan" element={<SyaratDanKetentuanPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route element={<AdminRoute />}>
           <Route path="/admin/scanner" element={<ScannerPage />} />
          </Route>
          

        </Routes>
      </main>

      {showMainLayout && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ModalProvider>
            <NotificationProvider>
              <Layout />
            </NotificationProvider>
          </ModalProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;