import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import Registro from './pages/Registro';
import Home from './pages/Home';

function Ap() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/home" element={<Home />} />
        {/* Agrega más rutas aquí si tienes */}
      </Routes>
    </Router>
  );
}

export default Ap;
