import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

const SearchBar = () => {
  const navigate = useNavigate();

  const handleNavigateToSearchPage = () => {
    navigate('/search-university');
  };

  return (
    // Container ini yang akan diklik untuk navigasi
    <div className="search-bar-container" onClick={handleNavigateToSearchPage}>
      {/* Path ikon langsung dari folder public, tanpa import */}
      <img src="/icons/search.svg" alt="Search" className="search-icon" />
      <span className="search-bar-placeholder">Cari kampus anda...</span>
    </div>
  );
};

export default SearchBar;