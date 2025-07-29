import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './ListaPublicaciones.css';
import HeaderContratante from '../HeaderContratante/headerContratante';
import FormPublicacion from '../FormularioPublicacion/formularioPublicacion';

const ListaPublicaciones = ({ refrescar, onEditar, userId: userIdProp }) => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const userId = userIdProp || query.get('userId');
  console.log("userId en ListaPublicaciones:", userId);

  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroTitulo, setFiltroTitulo] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [publicacionEditar, setPublicacionEditar] = useState(null);

  useEffect(() => {
    if (!userId) {
      setPublicaciones([]);
      setLoading(false);
      return;
    }

    const fetchPublicaciones = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://softwave.online:8090/api/generar/contratante/${userId}`);
        setPublicaciones(res.data);
      } catch (err) {
        console.error("Error al cargar publicaciones:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicaciones();
  }, [userId, refrescar, mostrarFormulario]);

  const handleEditar = (idGenerar) => {
    const publicacionSeleccionada = publicaciones.find(pub => pub.id_genera === idGenerar);
    if (publicacionSeleccionada) {
      setPublicacionEditar(publicacionSeleccionada.publicacionempleo);
      setMostrarFormulario(true);
    }
  };

  const mostrarConfirmacionEliminacion = (idPublicacion) => {
    const toastId = toast.info(
      <div>
        <p>¿Seguro que deseas eliminar esta publicación?</p>
        <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
          <button
            style={{
              background: '#dc2626',
              color: 'white',
              border: 'none',
              padding: '6px 10px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
            onClick={() => {
              toast.dismiss(toastId);
              axios.delete(`http://softwave.online:8090/api/publicacion_empleo/eliminar/${idPublicacion}`)
                .then(res => {
                  const mensaje = res.data.toLowerCase();
                  if (mensaje.includes('correctamente')) {
                    toast.success(res.data);
                    setPublicaciones(prev =>
                      prev.filter(pub => pub.publicacionempleo.id_postulacion_empleo !== idPublicacion)
                    );
                  } else if (mensaje.includes('no se puede') || mensaje.includes('error') || mensaje.includes('no encontrada')) {
                    toast.error(res.data);
                  } else {
                    toast.info(res.data);
                  }
                })
            }}
          >
            Eliminar
          </button>
          <button
            style={{
              background: '#6b7280',
              color: 'white',
              border: 'none',
              padding: '6px 10px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
            onClick={() => toast.dismiss(toastId)}
          >
            Cancelar
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        draggable: false
      }
    );
  };

  const formatoLocal = (fechaISO) => {
    const fecha = new Date(fechaISO);
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const publicacionesFiltradas = publicaciones.filter(pub => {
    const fecha = pub.publicacionempleo?.fecha_publicacion || pub.fechaPublicacion;
    const fechaNormalizada = fecha ? formatoLocal(fecha) : '';
    const coincideFecha = filtroFecha ? fechaNormalizada === filtroFecha : true;
    const coincideTitulo = pub.publicacionempleo?.titulo?.toLowerCase().includes(filtroTitulo.toLowerCase());
    return coincideFecha && coincideTitulo;
  });

  const handleSuccess = () => {
    setMostrarFormulario(false);
    setPublicacionEditar(null);
  };

  const handleCancel = () => {
    setMostrarFormulario(false);
    setPublicacionEditar(null);
  };

  return (
    <>
      {!mostrarFormulario && <HeaderContratante userId={userId} />}

      {mostrarFormulario ? (
        <FormPublicacion
          userId={userId}
          publicacionEditar={publicacionEditar}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      ) : (
        <div className="lista-publicaciones">
          <div className="filtros-publicaciones">
            <h3 className="titulo">Mis Publicaciones</h3>
            <input
              type="text"
              placeholder="🔍 Filtrar por título"
              value={filtroTitulo}
              onChange={(e) => setFiltroTitulo(e.target.value)}
            />
            <input
              type="date"
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
            />
            {filtroFecha && (
              <button onClick={() => setFiltroFecha('')} className="btn-limpiar-filtro">
                Limpiar fecha
              </button>
            )}
          </div>

          {loading ? (
            <p className="loading-text">⏳ Cargando publicaciones...</p>
          ) : publicacionesFiltradas.length === 0 ? (
            <p className="no-publicaciones">📭 No tienes publicaciones con esos filtros.</p>
          ) : (
            <ul className="lista-items">
              {publicacionesFiltradas.map(pub => {
                const empleo = pub.publicacionempleo;
                const parroquia = empleo.parroquia?.nombre || 'N/A';
                const canton = empleo.parroquia?.canton?.nombre || '';
                const provincia = empleo.parroquia?.canton?.provincia?.nombre || '';

                return (
                  <li key={pub.id_genera} className="item-publicacion">
                    <div className="info-publicacion">
                      <h4>{empleo.titulo}</h4>
                      <div className="fila-info-basica">
                        <span className="dato-ubicacion">| 📍 {`${parroquia}, ${canton}, ${provincia}`}</span>
                        <span className="dato-jornada">| 🕒 {empleo.jornada || 'N/A'}</span>
                        <span className="dato-salario">| 💰 ${empleo.salario_estimado?.toLocaleString() || '0'}</span>
                      </div>
                      <div className="fila-fechas-estado">
                        <p>📅 <strong>Fecha publicación:</strong> {formatoLocal(pub.fechaPublicacion)}</p>
                        <p>⏳ <strong>Fecha límite:</strong> {empleo.fecha_limite ? formatoLocal(empleo.fecha_limite) : 'N/A'}</p>
                        <p>📊 <strong>Estado:</strong> {empleo.estado || 'N/A'}</p>
                      </div>
                      <p className="fila-disponibilidad">
                        ⚡ <strong>Disponibilidad inmediata:</strong> {empleo.disponibilidad_inmediata ? 'Sí' : 'No'}
                      </p>
                      <p className="fila-descripcion">
                        📝 <strong>Descripción:</strong> {empleo.descripcion}
                      </p>
                      <p className="fila-requisitos">
                        📌 <strong>Requisitos:</strong> {empleo.requisitos || 'No especificado'}
                      </p>
                      <p className="fila-turno">
                        🕔 <strong>Turno:</strong> {empleo.turno || 'No especificado'}
                      </p>
                      <p className="fila-actividades">
                        🛠️ <strong>Actividades a realizar:</strong> {empleo.actividades_realizar || 'No especificado'}
                      </p>
                    </div>
                    <div className="acciones-publicacion">
                      <button className="btn btn-editar" onClick={() => handleEditar(pub.id_genera)}>Editar</button>
                      <button className="btn btn-eliminar" onClick={() => mostrarConfirmacionEliminacion(empleo.id_postulacion_empleo)}>Eliminar</button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default ListaPublicaciones;
