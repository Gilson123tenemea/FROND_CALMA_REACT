import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Inicio from './components/Inicio/Inicio';
import Login from './components/Login/login';
import Registro from './components/Registro/registro';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} /> {/* Ruta principal */}
        <Route path="/login" element={<Login />} /> {/* Ruta de login */}
        <Route path='/registro' element ={<Registro />}/>
      </Routes>
    </Router>
  </StrictMode>
);