// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

import Inicio from './components/Inicio/Inicio';
import Login from './components/Login/Login'; // Asegúrate que esté con mayúscula si el archivo es Login.jsx
import Registro from './components/Registro/Registro';
import ResetPassword from './components/Login/ResetPassword';

import ModuloAspirante from './components/ModuloAspirante/ModuloAspirante';
import ModuloContratante from './components/ModuloContratante/ModuloContratante';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Rutas protegidas/redireccionadas según el rol */}
        <Route path="/moduloAspirante" element={<ModuloAspirante />} />
        <Route path="/moduloContratante" element={<ModuloContratante />} />
      </Routes>
    </Router>
  </StrictMode>
);
