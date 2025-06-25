import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'; // 1. Impor axios
axios.defaults.baseURL = 'http://localhost:5000'; 



createRoot(document.getElementById('root')).render(
 // <React.StrictMode> // Biarkan ini dalam komentar untuk saat ini
    <App />
  // </React.StrictMode>,
)
