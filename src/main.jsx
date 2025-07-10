// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

import Inicio from './components/Inicio/Inicio';
import Login from './components/Login/Login';
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
import CVCompletoView from './components/ModuloAspirante/CV/CVCompletoView';


// ✅ Importación del componente Postulaciones
import Postulaciones from './components/ModuloContratante/Postulaciones/Postulaciones';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/ver-cv/:idCV" element={<CVCompletoView />} />


        {/* Rutas de módulos */}
        <Route path="/moduloAspirante/*" element={<ModuloAspirante />} />
        <Route path="/moduloContratante/*" element={<ModuloContratante />} />

        {/* Rutas de perfil */}
        <Route path="/moduloAspirante/perfilAspirante" element={<PerfilAspirante />} />
        <Route path="/moduloContratante/perfilContratante" element={<PerfilContratante />} />

        {/* Rutas de paciente */}
        <Route path="/registropaciente" element={<RegistroPaciente />} />
        <Route path="/moduloContratante/registropaciente" element={<RegistroPaciente />} />
        <Route path='/ficha' element={<FichaPaciente />} />
        <Route path="/alergiaali" element={<FichaPacienteAlergia />} />

        {/* Rutas de CV */}
        <Route path="/moduloAspirante/cv" element={<CVForm />} />
        <Route path="/cv/:idCV" element={<CVForm editMode={false} />} />
        <Route path="/cv/:idCV/edit" element={<CVForm editMode={true} />} />
        
        {/* Rutas dependientes de CV */}
        <Route path="/cv/:idCV/certificados" element={<CertificadosForm />} />     
        <Route path="/cv/:idCV/recomendaciones" element={<RecomendacionesForm />} />
        <Route path="/cv/:idCV/habilidades" element={<HabilidadesForm />} />
        <Route path="/cv/:idCV/disponibilidad" element={<DisponibilidadForm />} />
        <Route path="/recomendaciones/:idCV" element={<RecomendacionesForm />} />
        <Route path="/habilidades/:idCV" element={<HabilidadesForm />} />
        <Route path="/disponibilidad/:idCV" element={<DisponibilidadForm />} />
        <Route path="/certificados/:idCV" element={<CertificadosForm />} />
        <Route path="/disponibilidad/:idCV" element={<DisponibilidadForm />} />

        {/* Otras rutas */}
        <Route path="/Calificacion/calificacion" element={<Calificacion />} />

        {/* ✅ Ruta nueva para ver postulaciones del contratante */}
        <Route path="/postulaciones/:userId" element={<Postulaciones />} />
      </Routes>
    </Router>
  </StrictMode>
);

