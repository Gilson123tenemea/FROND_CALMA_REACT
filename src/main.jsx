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

import CVCompletoView from './components/ModuloAspirante/CV/CVCompletoView';
import Soluciones from './components/Login/Soluciones';
import Servicios from './components/Login/Servicios';
import SobreNosotros from './components/Login/SobreNosotros';
import Empleo from './components/Login/Empleo';
import Contacto from './components/Login/Contacto';
import FichaPacienteForm from './components/FichaPaciente/ficha';

import MedicamentosList from './components/FichaPacienteMedicamentos/medicamentoslist';
import MedicamentoForm from './components/FichaPacienteMedicamentos/medicacion';
import AlergiasAlimentariasList from './components/FichaPacienteAlergia/alergiaalist';
import AlergiaAlimentariaForm from './components/FichaPacienteAlergia/alergiaali';
import AlergiasMedicamentosList from './components/FichaPacienteAlergiaMedicamento/alergiamedlist';
import AlergiaMedicamentoForm from './components/FichaPacienteAlergiaMedicamento/alergiamedicamento';
import InteresesList from './components/FichaPacienteInteres/intereseslist';
import InteresForm from './components/FichaPacienteInteres/interes';
import TemasList from './components/FichaPacienteTema/temalist';
import TemaForm from './components/FichaPacienteTema/temasc';


// ✅ Importación del componente Postulaciones
import Postulaciones from './components/ModuloContratante/Postulaciones/Postulaciones';
import { i } from 'framer-motion/client';

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
         <Route path="/fichas/nueva" element={<FichaPacienteForm />} />
        <Route path="/fichas/:id_ficha_paciente" element={<FichaPacienteForm  key={location.pathname} />} />

        {/* Medicamentos */}
        <Route path="/fichas/:id_ficha_paciente/medicamentos" element={<MedicamentosList />} />
        <Route path="/fichas/:id_ficha_paciente/medicamentos/nuevo" element={<MedicamentoForm />} />
        <Route path="/fichas/:id_ficha_paciente/medicamentos/:idListaMedicamentos" element={<MedicamentoForm />} />

        {/* Alergias Alimentarias */}
        <Route path="/fichas/:id_ficha_paciente/alergias-alimentarias" element={<AlergiasAlimentariasList />} />
        <Route path="/fichas/:id_ficha_paciente/alergias-alimentarias/nuevo" element={<AlergiaAlimentariaForm />} />
        <Route path="/fichas/:id_ficha_paciente/alergias-alimentarias/:id_alergias_alimentarias" element={<AlergiaAlimentariaForm />} />

        {/* Alergias a Medicamentos */}
        <Route path="/fichas/:id_ficha_paciente/alergias-medicamentos" element={<AlergiasMedicamentosList />} />
        <Route path="/fichas/:id_ficha_paciente/alergias-medicamentos/nuevo" element={<AlergiaMedicamentoForm />} />
        <Route path="/fichas/:id_ficha_paciente/alergias-medicamentos/:id_alergiamed" element={<AlergiaMedicamentoForm />} />

        {/* Intereses */}
        <Route path="/fichas/:id_ficha_paciente/intereses" element={<InteresesList />} />
        <Route path="/fichas/:id_ficha_paciente/intereses/nuevo" element={<InteresForm />} />
        <Route path="/fichas/:id_ficha_paciente/intereses/:idInteresesPersonales" element={<InteresForm />} />

        {/* Temas de Conversación */}
        <Route path="/fichas/:id_ficha_paciente/temas" element={<TemasList />} />
        <Route path="/fichas/:id_ficha_paciente/temas/nuevo" element={<TemaForm />} />
        <Route path="/fichas/:id_ficha_paciente/temas/:idTemaConversacion" element={<TemaForm />} />


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
        <Route path="/solution" element={<Soluciones />} />
        <Route path="/services" element={<Servicios />} />
        <Route path="/about" element={<SobreNosotros />} />
        <Route path="/empleo" element={<Empleo />} />
        <Route path="/contact" element={<Contacto />} />

        {/* Otras rutas */}
        <Route path="/Calificacion/calificacion" element={<Calificacion />} />

        {/* ✅ Ruta nueva para ver postulaciones del contratante */}
        <Route path="/postulaciones/:userId" element={<Postulaciones />} />
      </Routes>
    </Router>
  </StrictMode>
);

