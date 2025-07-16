import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import HeaderContratante from "../HeaderContratante/HeaderContratante";
import styles from './visualizarpaciente.module.css';

const VisualizarPacientes = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const idContratante = searchParams.get('userId');
  const [pacientes, setPacientes] = useState([]);

  const handleEditar = (idPaciente) => {
    navigate(`/moduloContratante/registropaciente?userId=${idContratante}&idPaciente=${idPaciente}`);
  };

  useEffect(() => {
    if (idContratante) {
      axios.get(`http://localhost:8090/api/registro/paciente/contratante/${idContratante}`)
        .then(res => {
          if (res.data.success) {
            setPacientes(res.data.pacientes);
            console.log("Pacientes cargados:", res.data.pacientes); // <-- AGREGA ESTO
          }
        })
        .catch(err => {
          console.error('Error al obtener pacientes:', err);
        });
    }
  }, [idContratante]);

  return (
    <>
      <HeaderContratante userId={idContratante} />
      <div className={styles["pacientes-container-vistavisu"]}>
        <h2>Pacientes Registrados</h2>
        <div className={styles["pacientes-lista-vistavisu"]}>
{pacientes.map((paciente, index) => (
  <div key={index} className={styles["paciente-card-vistavisu"]}>
    
    {/* Contenedor de la imagen */}
    <div className={styles["paciente-foto-container"]}>
      <img
        src={`http://localhost:8090/api/registro/${paciente.foto}`}
        alt="foto"
        className={styles["paciente-foto-vistavisu"]}
      />
    </div>

    {/* Contenedor de toda la info textual */}
    <div className={styles["paciente-info-vistavisu"]}>
      
      {/* Nombre */}
      <div className={styles["paciente-nombre-container"]}>
        <h4>{paciente.nombres} {paciente.apellidos}</h4>
      </div>

      {/* Datos */}
      <div className={styles["paciente-datos-container"]}>
        <p><strong>Cédula:</strong> {paciente.cedula}</p>
        <p><strong>Género:</strong> {paciente.genero}</p>
        <p><strong>Dirección:</strong> {paciente.direccion}</p>
        <p><strong>Fecha Nacimiento:</strong> {new Date(paciente.fechaNacimiento).toLocaleDateString()}</p>
        <p><strong>Tipo de Sangre:</strong> {paciente.tipoSangre}</p>
        <p><strong>Provincia:</strong> {paciente.provincia}</p>
        <p><strong>Cantón:</strong> {paciente.canton}</p>
        <p><strong>Parroquia:</strong> {paciente.parroquia}</p>
        <p><strong>Alergia:</strong> {paciente.alergia}</p>
        <p><strong>Contacto Emergencia:</strong> {paciente.contactoEmergencia} ({paciente.parentesco})</p>
      </div>

      {/* Botón */}
      <div className={styles["paciente-boton-container"]}>
<Link
  to={`/moduloContratante/registropaciente?userId=${idContratante}&idPaciente=${paciente.idPaciente}`}
  className={styles["btn-editar-vistavisu"]}
  style={{ position: "relative", zIndex: 2 }}
>
  Editar
</Link>
      </div>

    </div>
  </div>
))}



        </div>
      </div>
    </>
  );
};

export default VisualizarPacientes;
