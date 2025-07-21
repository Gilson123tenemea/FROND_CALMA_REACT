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
    disponibilidad_inmediata,
    fechaLimite,
    jornada,
    turno,
    correo,
    actividadesRealizar
  } = trabajo;

  const publicador = empresa || contratante || "Anónimo";
  const [postulado, setPostulado] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);

  const publicacion = trabajo.publicacionempleo || {};
  const contratanteUsuario = trabajo.contratante?.usuario || {};

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

          <div style={{ fontSize: '14px', color: '#555', marginBottom: '-12px' }}>
            {empresa ? <Building2 size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} /> : <User2 size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />}
            {publicador}
          </div>
          <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#000', marginBottom: '-20px' }}>
            {titulo}
          </div>

          <div className="card-detalles-basicos">
            <div className="detalle-simple">
              <div style={{ flexBasis: '40%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                <MapPin size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                {`${ubicacion.parroquia}, ${ubicacion.canton}, ${ubicacion.provincia}`}
              </div>

              <div style={{ padding: '0 10px', userSelect: 'none' }}>|</div>

              <div style={{ flexBasis: '25%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                <Clock size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                {turno || 'No especificado'}
              </div>

              <div style={{ padding: '0 10px', userSelect: 'none' }}>|</div>

              <div style={{ flexBasis: '20%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                <BadgeDollarSign size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                ${salario?.toFixed(2)}
              </div>
            </div>

            <div className="fila-detalle">
              <span>
                <Info size={18} /> <strong>Descripción:</strong> {descripcion}
              </span>
            </div>
            <div className="fila-detalle">
              <span>
                <ClipboardList size={18} /> <strong>Actividades:</strong> {actividadesRealizar || 'No especificadas'}
              </span>
            </div>
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
            <h3>Detalles del empleo</h3>
            <p><BadgeDollarSign size={16} /> <strong>Salario Estimado:</strong> ${salario?.toFixed(2) || 'No especificado'}</p>
            <p><CalendarClock size={16} /> <strong>Fecha límite:</strong> {fechaLimite || 'No especificada'}</p>
            <p><CalendarClock size={16} /> <strong>Jornada:</strong> {jornada || 'No especificada'}</p>
            <p><Clock size={16} /> <strong>Turno:</strong> {turno || 'No especificado'}</p>
            <p><Clock size={16} /> <strong>Disponibilidad:</strong> {trabajo.disponibilidad || 'No especificada'}</p>
            <p><Info size={16} />  {descripcion || 'No especificada'}</p>
            <h3>Actividades a realizar</h3>
            <p><Info size={16} />  {actividadesRealizar || 'No especificadas'}</p>
            <h3>Requisitos</h3>
            <p><ClipboardList size={16} /> {requisitos || 'No especificados'}</p>
            <h3>Ubicación</h3>
            <p><MapPin size={16} /> {ubicacion ? `${ubicacion.parroquia}, ` : 'No especificada'}</p>
            <p><MapPin size={16} /> {ubicacion ? `${ubicacion.canton}, ` : 'No especificada'}</p>
            <p><MapPin size={16} /> {ubicacion ? `${ubicacion.provincia}, ` : 'No especificada'}</p>
            <h3>Datos del contratante</h3>
            <p><User2 size={16} /> <strong>Nombre del publicador:</strong> {publicador}</p>
            <p><User2 size={16} /> <strong>Correo de contacto:</strong> {trabajo.correo || 'No especificado'}</p>
            <button className="card-boton" onClick={() => setModalAbierto(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </>
  );
};

export default CardTrabajo;
