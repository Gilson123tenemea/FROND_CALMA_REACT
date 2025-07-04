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

import RegistroPaciente from './components/ModuloContratante/RegistroPaciente/registropaciente';
import PerfilAspirante from './components/ModuloAspirante/PerfilAspirante/perfilAspirante';
import CVForm from './components/ModuloAspirante/CV/cv';
import PerfilContratante from './components/ModuloContratante/PerfilContratante/perfilContratante';

import RecomendacionesForm from './components/Recomendaciones/RecomendacionesForm';
import CertificadosForm from './components/Certificados/CertificadosForm';
import HabilidadesForm from './components/Habilidades/HabilidadesForm';
import DisponibilidadForm from './components/Disponibilidad/DisponibilidadForm';
import Calificacion from './components/Calificacion/calificacion';
import FichaPaciente from './components/FichaPaciente/ficha';
import FichaPacienteAlergia from './components/FichaPacienteAlergia/alergiaali';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path='/registropaciente' element={<RegistroPaciente />} />
        <Route path="/moduloContratante/registropaciente" element={<RegistroPaciente />} />
        <Route path="/moduloAspirante/perfilAspirante" element={<PerfilAspirante />} />
        <Route path="/moduloAspirante/cv" element={<CVForm />} />
        <Route path="/moduloContratante/perfilContratante" element={<PerfilContratante />} />
        {/* Rutas protegidas/redireccionadas según el rol */}
        <Route path="/moduloAspirante" element={<ModuloAspirante />} />
        <Route path="/moduloContratante" element={<ModuloContratante />} />
        <Route path="/recomendaciones/:idCV" element={<RecomendacionesForm />} />
        <Route path="/cv/:idCV/certificados" element={<CertificadosForm />} />
        <Route path="/habilidades/:idCV" element={<HabilidadesForm />} />
        <Route path="/disponibilidad/:idCV" element={<DisponibilidadForm />} />
        <Route path="/Calificacion/calificacion" element={<Calificacion />} />
        <Route path='/ficha' element={<FichaPaciente />} />
        <Route path="/alergiaali" element={<FichaPacienteAlergia />} />



      </Routes>
    </Router>
  </StrictMode>
);
