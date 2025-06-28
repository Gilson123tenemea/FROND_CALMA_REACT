import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Inicio from './components/Inicio/Inicio';
import Login from './components/Login/login';
import Registro from './components/Registro/registro';
import ResetPassword from './components/Login/ResetPassword'; // <-- Asegúrate de importar esto correctamente

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/reset-password" element={<ResetPassword />} /> {/* <-- Esta línea FALTABA */}
      </Routes>
    </Router>
  </StrictMode>
);
