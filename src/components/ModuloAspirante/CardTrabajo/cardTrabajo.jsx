import React, { useState } from 'react';
import './CardTrabajo.css';
import {
  Building2,
  User2,
  MapPin,
  BadgeDollarSign,
  ClipboardList,
  Info,
  CalendarClock,
  Clock,
  ClipboardCheck
} from 'lucide-react';

const CardTrabajo = ({ trabajo, idAspirante }) => {
  const {
    id,
    titulo,
    salario,
    ubicacion,
    empresa,
    contratante,
    descripcion,
    requisitos,
    jornada,
    turno,
    actividadesRealizar
  } = trabajo;

  const publicador = empresa || contratante || "Anónimo";
  const [postulado, setPostulado] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);

  const handleAplicar = async () => {
    if (!idAspirante) {
      console.log('❌ No se pudo obtener el ID del aspirante.');
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8090/api/realizar/postular?idAspirante=${idAspirante}&idPublicacionEmpleo=${id}`,
        { method: 'POST' }
      );

      if (response.ok) {
        setPostulado(true);
        console.log('✅ ¡Postulación exitosa!');
      } else if (response.status === 409) {
        setPostulado(true);
        console.log('⚠️ Ya te has postulado a esta oferta.');
      } else {
        const texto = await response.text();
        console.error('Error al postular:', texto);
      }
    } catch (error) {
      console.error('❌ Error inesperado al postular:', error);
    }
  };

  return (
    <>
      <div className="card-elegante" tabIndex={0}>
        <div className="card-info">
          <div className="card-cabecera">
            <h2 className="card-titulo">{titulo}</h2>
            <p className="card-empresa">
              {empresa ? <Building2 size={16} style={{ marginRight: 6 }} /> : <User2 size={16} style={{ marginRight: 6 }} />}
              {publicador}
            </p>
          </div>

          <div className="card-detalles-basicos">
            <span>
              <Info size={18} /> <strong>Descripción:</strong> {descripcion}
            </span>
            <span>
              <BadgeDollarSign size={18} /> <strong>Salario:</strong> ${salario.toFixed(2)}
            </span>
            <span>
              <MapPin size={18} /> <strong>Ubicación:</strong> {`${ubicacion.parroquia}, ${ubicacion.canton}, ${ubicacion.provincia}`}
            </span>
          </div>

          <div className="card-botones">
            <button className="card-boton" onClick={() => setModalAbierto(true)}>
              Saber más
            </button>
            <button
              className="card-boton"
              onClick={handleAplicar}
              disabled={postulado}
            >
              {postulado ? (
                <>
                  <ClipboardCheck size={16} style={{ marginRight: 4 }} /> Ya postulado
                </>
              ) : (
                'Aplicar'
              )}
            </button>
          </div>
        </div>
      </div>

      {modalAbierto && (
        <div className="modal-fondo" onClick={() => setModalAbierto(false)}>
          <div className="modal-contenido" onClick={e => e.stopPropagation()}>
            <h2>{titulo}</h2>
            <p><ClipboardList size={16} /> <strong>Requisitos:</strong> {requisitos}</p>
            <p><CalendarClock size={16} /> <strong>Jornada:</strong> {jornada}</p>
            <p><Clock size={16} /> <strong>Turno:</strong> {turno}</p>
            <p><Info size={16} /> <strong>Actividades a realizar:</strong> {actividadesRealizar || 'No especificadas'}</p>
            <button className="card-boton" onClick={() => setModalAbierto(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </>
  );
};

export default CardTrabajo;
