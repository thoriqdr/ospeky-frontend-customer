// frontend-customer/src/pages/UniversitySearchPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import './UniversitySearchPage.css';
import UniversityResultCard from '../components/UniversityResultCard'; // Komponen baru yang akan kita buat


import backIcon from '/icons/back-arrow.svg';
import searchIcon from '/icons/search.svg';

const UniversitySearchPage = () => {
  const navigate = useNavigate();
  
  // State yang sudah ada
  const [query, setQuery] = useState('');
  
  // State baru untuk hasil dan status loading
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [initialSearchDone, setInitialSearchDone] = useState(false);

  // useEffect untuk memanggil API dengan debouncing
  useEffect(() => {
    // Timer untuk debouncing
    const timerId = setTimeout(() => {
      if (query) {
        setIsLoading(true);
        setInitialSearchDone(true);
        api.get(`/categories/universitas/public?search=${query}`)
          .then(response => {
           if (Array.isArray(response.data)) {
              setResults(response.data);
            } else {
              setResults([]);
            }
          })
          .catch(error => {
            console.error("Error fetching search results:", error);
            setResults([]); // Kosongkan hasil jika error
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        // Kosongkan hasil jika query kosong
        setResults([]);
        setInitialSearchDone(false);
      }
    }, 300); // Tunggu 300ms setelah user berhenti mengetik

    // Cleanup function: batalkan timer jika user mengetik lagi
    return () => {
      clearTimeout(timerId);
    };
  }, [query]); // Effect ini berjalan setiap kali 'query' berubah

  return (
    <div className="search-page-container">
      <div className="search-page-header">
        {/* ... (bagian header tidak berubah) ... */}
        <button onClick={() => navigate(-1)} className="back-button">
          <img src={backIcon} alt="Back" />
        </button>
        <div className="search-input-wrapper">
          <img src={searchIcon} alt="Search" className="search-input-icon" />
          <input
            type="text"
            placeholder="Cari universitas..."
            className="search-input-field"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="search-results-area">
        {isLoading && <p className="search-placeholder-text">Mencari...</p>}
        
        {!isLoading && initialSearchDone && results.length === 0 && (
          <p className="search-placeholder-text">Universitas tidak ditemukan.</p>
        )}
        
        <div className="university-cards-grid">
          {!isLoading && results.map(uni => (
            <UniversityResultCard key={uni.id} university={uni} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UniversitySearchPage;