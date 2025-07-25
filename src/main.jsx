import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

// Importación corregida de RequireCV según tu estructura
import RequireCV from './components/ModuloAspirante/CV/RequireCV';

// Importación de componentes
import FormularioPublicacion from './components/ModuloContratante/FormularioPublicacion/formularioPublicacion';
import ListaPublicaciones from './components/ModuloContratante/ListaPublicaciones/listaPublicaciones'; // ← PUNTO Y COMA AGREGADO
import Inicio from './components/Inicio/Inicio';
import Login from './components/Login/Login';
import Registro from './components/Registro/registro';
import ResetPassword from './components/Login/ResetPassword';

// Módulos principales
import ModuloAspirante from './components/ModuloAspirante/moduloAspirante';
import ModuloContratante from './components/ModuloContratante/moduloContratante';

// Componentes varios
import RegistroPaciente from './components/ModuloContratante/RegistroPaciente/registropaciente';
import Visualizarpaciente from './components/ModuloContratante/RegistroPaciente/visualizarpaciente';
import PerfilAspirante from './components/ModuloAspirante/PerfilAspirante/perfilAspirante';
import CVForm from './components/ModuloAspirante/CV/cv';
import PerfilContratante from './components/ModuloContratante/PerfilContratante/perfilContratante';
import CVCompletoView from './components/ModuloAspirante/CV/CVCompletoView';
import Postulaciones from './components/ModuloContratante/Postulaciones/Postulaciones';
import DetallesTrabajo from './components/ModuloContratante/DetallesTrabajo/DetallesTrabajo';

import CVContratanteView from './components/ModuloAspirante/CV/CVContratanteView';

// Componentes de CV relacionados
import RecomendacionesForm from './components/Recomendaciones/RecomendacionesForm';
import CertificadosForm from './components/Certificados/CertificadosForm';
import HabilidadesForm from './components/Habilidades/HabilidadesForm';
import DisponibilidadForm from './components/Disponibilidad/DisponibilidadForm';

// Componentes de calificaciones - NUEVOS
import Calificacion from './components/Calificacion/calificacion';
import TrabajosAceptados from './components/ModuloContratante/TrabajosAceptados/TrabajosAceptados';
// Otros componentes
import Soluciones from './components/Login/Soluciones';
import Servicios from './components/Login/Servicios';
import SobreNosotros from './components/Login/SobreNosotros';
import Empleo from './components/Login/Empleo';
import Contacto from './components/Login/Contacto';
import FichaPacienteForm from './components/FichaPaciente/ficha';
import FichaPacienteVer from './components/FichaPaciente/verficha';
import MedicamentoForm from './components/FichaPacienteMedicamentos/medicacionform';
import AlergiaAlimentariaForm from './components/FichaPacienteAlergia/alergiaali';
import AlergiaMedicamentoForm from './components/FichaPacienteAlergiaMedicamento/alergiamedicamento';
import InteresForm from './components/FichaPacienteInteres/interes';
import TemaForm from './components/FichaPacienteTema/temasc';
import PostulacionesAspirante from './components/ModuloAspirante/PostulacionesAspirante/PostulacionesAspirante';
import TodasLasCalificaciones from './components/ModuloAspirante/Calificaciones/TodasLasCalificaciones';
import Calificacionescv from './components/ModuloAspirante/CV/CalificacionesCV/CalificacionesCV';
//Ver ficha segun el estado en aspirantes
import VerFichaAceptada from './components/ModuloAspirante/PostulacionesAspirante/verfcihaaceptada';
//Politicas de privacidad
import PoliticasDePrivacidad from './components/Inicio/PoliticasDePrivacidad';

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
        <Route path="/solution" element={<Soluciones />} />
        <Route path="/services" element={<Servicios />} />
        <Route path="/about" element={<SobreNosotros />} />
        <Route path="/empleo" element={<Empleo />} />
        <Route path="/contact" element={<Contacto />} />

        {/* Rutas protegidas para aspirantes */}
        <Route
          path="/moduloAspirante/*"
          element={
            <RequireCV>
              <ModuloAspirante />
            </RequireCV>
          }
        />

        <Route
          path="/moduloAspirante/postulaciones/:userId"
          element={
            <RequireCV>
              <PostulacionesAspirante />
            </RequireCV>
          }
        />

        {/* Nueva ruta para ver ficha del paciente */}
        <Route
          path="/moduloAspirante/ficha-paciente/:idPaciente"
          element={
            <RequireCV>
              <VerFichaAceptada />
            </RequireCV>
          }
        />

        <Route
          path="/moduloAspirante/perfilAspirante"
          element={
            <RequireCV>
              <PerfilAspirante />
            </RequireCV>
          }
        />

        <Route path="/aspirante/:aspiranteId/calificaciones" element={<TodasLasCalificaciones />} />
        <Route path="/politicas-de-privacidad" element={<PoliticasDePrivacidad />} />

        {/* Rutas de CV */}
        <Route path="/moduloAspirante/cv" element={<CVForm />} />
        <Route path="/cv/:idCV" element={<CVForm editMode={false} />} />
        <Route path="/cv/:idCV/edit" element={<CVForm editMode={true} />} />
        <Route path="/cv-aspirante/:idAspirante" element={<CVContratanteView />} />

        {/* Rutas dependientes de CV (protegidas) */}
        <Route
          path="/cv/:idCV/certificados"
          element={
            <RequireCV>
              <CertificadosForm />
            </RequireCV>
          }
        />

        <Route
          path="/cv/:idCV/recomendaciones"
          element={
            <RequireCV>
              <RecomendacionesForm />
            </RequireCV>
          }
        />

        <Route
          path="/cv/:idCV/habilidades"
          element={
            <RequireCV>
              <HabilidadesForm />
            </RequireCV>
          }
        />

        <Route
          path="/cv/:idCV/disponibilidad"
          element={
            <RequireCV>
              <DisponibilidadForm />
            </RequireCV>
          }
        />

        {/* Otras rutas protegidas */}
        <Route
          path="/recomendaciones/:idCV"
          element={
            <RequireCV>
              <RecomendacionesForm />
            </RequireCV>
          }
        />

        <Route
          path="/habilidades/:idCV"
          element={
            <RequireCV>
              <HabilidadesForm />
            </RequireCV>
          }
        />

        <Route
          path="/disponibilidad/:idCV"
          element={
            <RequireCV>
              <DisponibilidadForm />
            </RequireCV>
          }
        />

        <Route
          path="/certificados/:idCV"
          element={
            <RequireCV>
              <CertificadosForm />
            </RequireCV>
          }
        />

        {/* Rutas de módulo contratante (no protegidas) */}
        <Route path="/moduloContratante/*" element={<ModuloContratante />} />
        <Route path="/moduloContratante/perfilContratante" element={<PerfilContratante />} />
        <Route path="/postulaciones/:userId" element={<Postulaciones />} />
        <Route path="/detalles-trabajo/:idRealizar" element={<DetallesTrabajo />} />

        {/* Rutas de paciente */}
        <Route path="/registropaciente" element={<RegistroPaciente />} />
        <Route path="/moduloContratante/formularioPublicacion" element={<FormularioPublicacion />} />
        <Route path="/moduloContratante/ListaPublicaciones" element={<ListaPublicaciones />} />

        <Route path="/moduloContratante/registropaciente" element={<RegistroPaciente />} />
        <Route path="/moduloContratante/visualizarpaciente" element={<Visualizarpaciente />} />
        <Route path="/moduloContratante/ficha/:idPaciente" element={<FichaPacienteVer />} />
        <Route path="/editarFicha/:idFicha" element={<FichaPacienteForm />} />

        <Route path="/moduloContratante/registropaciente/:idPaciente" element={<RegistroPaciente />} />

        <Route
          path="/fichas/nueva"
          element={<FichaPacienteForm />}
        />
        <Route
          path="/fichas/:id_ficha_paciente"
          element={<FichaPacienteForm key={location.pathname} editMode={true} />}
        />
        <Route path="/fichas/:id_ficha_paciente" element={<FichaPacienteForm key={location.pathname} />} />
        <Route path="/fichas/:id_ficha_paciente/medicamentos" element={<MedicamentoForm />} />
        <Route path="/fichas/:id_ficha_paciente/medicamentos/:idListaMedicamentos" element={<MedicamentoForm />} />
        <Route path="/fichas/:id_ficha_paciente/alergias-alimentarias" element={<AlergiaAlimentariaForm />} />
        <Route path="/fichas/:id_ficha_paciente/alergias-alimentarias/:id_alergias_alimentarias" element={<AlergiaAlimentariaForm />} />
        <Route path="/fichas/:id_ficha_paciente/alergias-medicamentos" element={<AlergiaMedicamentoForm />} />
        <Route path="/fichas/:id_ficha_paciente/alergias-medicamentos/:id_alergiamed" element={<AlergiaMedicamentoForm />} />
        <Route path="/fichas/:id_ficha_paciente/intereses" element={<InteresForm />} />
        <Route path="/fichas/:id_ficha_paciente/intereses/:idInteresesPersonales" element={<InteresForm />} />
        <Route path="/fichas/:id_ficha_paciente/temas" element={<TemaForm />} />
        <Route path="/fichas/:id_ficha_paciente/temas/:idTemaConversacion" element={<TemaForm />} />

        {/* Rutas de calificaciones - NUEVAS */}
        <Route path="/trabajos-aceptados" element={<TrabajosAceptados />} />
        <Route path="/Calificacion/calificacion" element={<Calificacion />} />
      </Routes>
    </Router>
  </StrictMode>
);