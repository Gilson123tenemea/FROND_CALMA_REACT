import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import HeaderContratante from "../HeaderContratante/headerContratante";
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
      axios.get(`http://softwave.online:8090/api/registro/paciente/contratante/${idContratante}`)
        .then(res => {
          if (res.data.success) {
            setPacientes(res.data.pacientes);
            console.log("Pacientes cargados:", res.data.pacientes);
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
        <h4>Pacientes Registrados</h4>
        <div className={styles["pacientes-lista-vistavisu"]}>
          {pacientes.map((paciente, index) => (
            <div key={index} className={styles["paciente-card-vistavisu"]}>

              {/* Contenedor de la imagen */}
              <div className={styles["paciente-foto-container"]}>
                <img
                  src={`http://softwave.online:8090/api/registro/${paciente.foto}`}
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
                <Link
                  to={`/moduloContratante/ficha/${paciente.idPaciente}`}
                  className={styles["btn-ver-ficha-vistavisu"]}
                >
                  Ver Ficha Clínica
                </Link>

                {/* Datos en cuadrícula elegante */}
                <div className={styles["paciente-datos-container"]}>
                  <p>
                    <strong data-field="cedula">Cédula</strong>
                    <span className="valor-dato">{paciente.cedula}</span>
                  </p>

                  <p>
                    <strong data-field="genero">Género</strong>
                    <span className="valor-dato">{paciente.genero}</span>
                  </p>

                  <p>
                    <strong data-field="fecha">Fecha de Nacimiento</strong>
                    <span className="valor-dato">{new Date(paciente.fechaNacimiento).toLocaleDateString()}</span>
                  </p>

                  <p>
                    <strong data-field="sangre">Tipo de Sangre</strong>
                    <span className="valor-dato">{paciente.tipoSangre}</span>
                  </p>

                  <p>
                    <strong data-field="provincia">Provincia</strong>
                    <span className="valor-dato">{paciente.provincia}</span>
                  </p>

                  <p>
                    <strong data-field="canton">Cantón</strong>
                    <span className="valor-dato">{paciente.canton}</span>
                  </p>

                  <p>
                    <strong data-field="parroquia">Parroquia</strong>
                    <span className="valor-dato">{paciente.parroquia}</span>
                  </p>

                  <p>
                    <strong data-field="direccion">Dirección</strong>
                    <span className="valor-dato">{paciente.direccion}</span>
                  </p>

                  <p>
                    <strong data-field="alergia">Alergias</strong>
                    <span className="valor-dato">{paciente.alergia}</span>
                  </p>

                  <p>
                    <strong data-field="contacto">Contacto de Emergencia</strong>
                    <span className="valor-dato">{paciente.contactoEmergencia} ({paciente.parentesco})</span>
                  </p>
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