import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  getMedicamentoById,
  getMedicamentosByFicha,
  createMedicamento,
  updateMedicamento,
  deleteMedicamento
} from '../../servicios/medicacionService';

import FichaStepsNav from '../FichaPaciente/fichastepsNav';
import './medicaciones.css';

const MedicamentoForm = () => {
  const { id_ficha_paciente, idListaMedicamentos } = useParams();
  const navigate = useNavigate();

  const [medicamentos, setMedicamentos] = useState([]);
  const [medicamento, setMedicamento] = useState({
    medicacion: false,
    nombremedicamento: '',
    dosis_med: '',
    frecuencia_med: '',
    via_administracion: '',
    condicion_tratada: '',
    reacciones_esp: '',
    fichaPaciente: { id_ficha_paciente: Number(id_ficha_paciente) }
  });

  const [editando, setEditando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [errores, setErrores] = useState({});

  const cargarMedicamentos = async () => {
    setCargando(true);
    try {
      const data = await getMedicamentosByFicha(id_ficha_paciente);
      setMedicamentos(data);
    } catch (error) {
      console.error("Error al cargar medicamentos:", error);
      toast.error("Error al cargar la información de medicamentos", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setCargando(false);
    }
  };

  const cargarMedicamento = async () => {
    if (idListaMedicamentos && idListaMedicamentos !== 'nuevo') {
      setCargando(true);
      try {
        const data = await getMedicamentoById(idListaMedicamentos);
        setMedicamento({
          ...data,
          fichaPaciente: { id_ficha_paciente: Number(id_ficha_paciente) }
        });
        setEditando(true);
      } catch (error) {
        console.error("Error al cargar medicamento:", error);
        toast.error("No se pudo cargar la información del medicamento", {
          position: "top-right",
          autoClose: 4000,
        });
      } finally {
        setCargando(false);
      }
    } else {
      setEditando(false);
      resetearFormulario();
    }
  };

  useEffect(() => {
    cargarMedicamentos();
  }, [id_ficha_paciente]);

  useEffect(() => {
    cargarMedicamento();
  }, [idListaMedicamentos]);

  const resetearFormulario = () => {
    setMedicamento({
      medicacion: false,
      nombremedicamento: '',
      dosis_med: '',
      frecuencia_med: '',
      via_administracion: '',
      condicion_tratada: '',
      reacciones_esp: '',
      fichaPaciente: { id_ficha_paciente: Number(id_ficha_paciente) }
    });
    setErrores({});
  };

  const validarTexto = (valor, campo) => {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!valor.trim()) {
      return `${campo} es obligatorio`;
    }
    if (!regex.test(valor)) {
      return `${campo} solo debe contener letras y espacios`;
    }
    return '';
  };

  const validarNombreUnico = (nombre) => {
    if (!nombre.trim()) {
      return 'El nombre del medicamento es obligatorio';
    }
    
    // Verificar si el nombre ya existe (excluyendo el medicamento actual en edición)
    const nombreExistente = medicamentos.find(med => 
      med.nombremedicamento.toLowerCase() === nombre.toLowerCase() && 
      med.idListaMedicamentos !== medicamento.idListaMedicamentos
    );
    
    if (nombreExistente) {
      return 'Ya existe un medicamento con este nombre';
    }
    
    return validarTexto(nombre, 'El nombre del medicamento');
  };

  const validarDosis = (valor) => {
    if (!valor.trim()) {
      return 'La dosis es obligatoria';
    }
    const regex = /^[0-9]+(\.[0-9]+)?\s*(mg|g|ml|L|UI|mcg|µg)$/i;
    if (!regex.test(valor)) {
      return 'Formato inválido. Ejemplos: 500mg, 10ml, 2.5g';
    }
    return '';
  };

  const validarFrecuencia = (valor) => {
    if (!valor.trim()) {
      return 'La frecuencia es obligatoria';
    }
    const regex = /^(cada\s+\d+\s+(horas?|días?|semanas?)|[1-9]\s+vez(es)?\s+al\s+día|[1-9]\s+vez(es)?\s+por\s+semana)$/i;
    if (!regex.test(valor)) {
      return 'Formato inválido. Ejemplos: cada 8 horas, 2 veces al día';
    }
    return '';
  };

  const validarCampos = () => {
    const nuevosErrores = {};

    if (!medicamento.medicacion) {
      return nuevosErrores;
    }

    nuevosErrores.nombremedicamento = validarNombreUnico(medicamento.nombremedicamento);
    nuevosErrores.dosis_med = validarDosis(medicamento.dosis_med);
    nuevosErrores.frecuencia_med = validarFrecuencia(medicamento.frecuencia_med);
    nuevosErrores.condicion_tratada = validarTexto(medicamento.condicion_tratada, 'La condición tratada');
    
    if (!medicamento.via_administracion) {
      nuevosErrores.via_administracion = 'La vía de administración es obligatoria';
    }

    Object.keys(nuevosErrores).forEach(key => {
      if (!nuevosErrores[key]) {
        delete nuevosErrores[key];
      }
    });

    return nuevosErrores;
  };

  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;
    const nuevoValor = type === 'checkbox' ? checked : value;
    
    setMedicamento(prev => ({
      ...prev,
      [name]: nuevoValor
    }));

    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    if (name === 'medicacion' && !checked) {
      setMedicamento(prev => ({
        ...prev,
        nombremedicamento: '',
        dosis_med: '',
        frecuencia_med: '',
        via_administracion: '',
        condicion_tratada: '',
        reacciones_esp: ''
      }));
      setErrores({});
    }
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();

    if (!medicamento.medicacion) {
      toast.warning("Debe marcar 'En medicación' para continuar", {
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }

    const nuevosErrores = validarCampos();
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      toast.error("Por favor corrige los errores del formulario", {
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }

    setEnviando(true);
    try {
      const datosMedicamento = {
        ...medicamento,
        fichaPaciente: { id_ficha_paciente: Number(medicamento.fichaPaciente.id_ficha_paciente) }
      };

      if (editando) {
        await updateMedicamento(medicamento.idListaMedicamentos, datosMedicamento);
        toast.success("Medicamento actualizado correctamente", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        await createMedicamento(datosMedicamento);
        toast.success("Medicamento agregado correctamente", {
          position: "top-right",
          autoClose: 3000,
        });
      }
      
      await cargarMedicamentos();
      resetearFormulario();
      setEditando(false);
      navigate(`/fichas/${id_ficha_paciente}/medicamentos`);
    } catch (error) {
      console.error("Error al guardar medicamento:", error);
      toast.error("Error al guardar el medicamento. Por favor, intente nuevamente.", {
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setEnviando(false);
    }
  };

  const manejarEdicion = (med) => {
    setMedicamento({
      ...med,
      fichaPaciente: { id_ficha_paciente: Number(id_ficha_paciente) }
    });
    setEditando(true);
    setErrores({});
    navigate(`/fichas/${id_ficha_paciente}/medicamentos/${med.idListaMedicamentos}`);
  };

  const manejarEliminacion = async (id) => {
    if (window.confirm("¿Está seguro que desea eliminar este medicamento?")) {
      try {
        await deleteMedicamento(id);
        toast.success("Medicamento eliminado correctamente", {
          position: "top-right",
          autoClose: 3000,
        });
        await cargarMedicamentos();
        if (id === idListaMedicamentos) {
          resetearFormulario();
          setEditando(false);
          navigate(`/fichas/${id_ficha_paciente}/medicamentos`);
        }
      } catch (error) {
        console.error("Error al eliminar medicamento:", error);
        toast.error("No se pudo eliminar el medicamento", {
          position: "top-right",
          autoClose: 4000,
        });
      }
    }
  };

  return (
    <div className="contenedor-formulario-medicamento">
      <FichaStepsNav id_ficha_paciente={id_ficha_paciente} currentStep="medicamentos" />

      <div className="formulario-card">
        <h2 className="titulo-formulario">
          {editando ? 'Editar Medicamento' : 'Agregar Nuevo Medicamento'}
        </h2>
        
        <form onSubmit={manejarEnvio} className="formulario-medicamento">
          <div className="grupo-formulario grupo-checkbox">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="medicacion"
                checked={medicamento.medicacion || false}
                onChange={manejarCambio}
              />
              <span className="checkmark"></span>
              El paciente requiere medicación 
            </label>
          </div>

          <div className={`campos-medicamento ${!medicamento.medicacion ? 'campos-deshabilitados' : ''}`}>
            <div className="grupo-formulario">
              <label className="etiqueta-campo">
                Nombre del Medicamento *
              </label>
              <input
                type="text"
                name="nombremedicamento"
                value={medicamento.nombremedicamento || ''}
                onChange={manejarCambio}
                disabled={!medicamento.medicacion}
                className={errores.nombremedicamento ? 'campo-error' : ''}
                placeholder="Ingrese el nombre del medicamento"
              />
              {errores.nombremedicamento && (
                <span className="mensaje-error">{errores.nombremedicamento}</span>
              )}
            </div>

            <div className="fila-formulario">
              <div className="grupo-formulario">
                <label className="etiqueta-campo">
                  Dosis *
                </label>
                <input
                  type="text"
                  name="dosis_med"
                  value={medicamento.dosis_med || ''}
                  onChange={manejarCambio}
                  disabled={!medicamento.medicacion}
                  className={errores.dosis_med ? 'campo-error' : ''}
                  placeholder="Ej: 500mg"
                />
                {errores.dosis_med && (
                  <span className="mensaje-error">{errores.dosis_med}</span>
                )}
              </div>
              
              <div className="grupo-formulario">
                <label className="etiqueta-campo">
                  Frecuencia *
                </label>
                <input
                  type="text"
                  name="frecuencia_med"
                  value={medicamento.frecuencia_med || ''}
                  onChange={manejarCambio}
                  disabled={!medicamento.medicacion}
                  className={errores.frecuencia_med ? 'campo-error' : ''}
                  placeholder="Ej: cada 8 horas"
                />
                {errores.frecuencia_med && (
                  <span className="mensaje-error">{errores.frecuencia_med}</span>
                )}
              </div>
            </div>

            <div className="grupo-formulario">
              <label className="etiqueta-campo">
                Vía de Administración *
              </label>
              <select
                name="via_administracion"
                value={medicamento.via_administracion || ''}
                onChange={manejarCambio}
                disabled={!medicamento.medicacion}
                className={errores.via_administracion ? 'campo-error' : ''}
              >
                <option value="">Seleccione una opción</option>
                <option value="Oral">Oral</option>
                <option value="Intravenosa">Intravenosa</option>
                <option value="Subcutánea">Subcutánea</option>
                <option value="Tópica">Tópica</option>
                <option value="Inhalatoria">Inhalatoria</option>
              </select>
              {errores.via_administracion && (
                <span className="mensaje-error">{errores.via_administracion}</span>
              )}
            </div>

            <div className="grupo-formulario">
              <label className="etiqueta-campo">
                Condición Tratada *
              </label>
              <input
                type="text"
                name="condicion_tratada"
                value={medicamento.condicion_tratada || ''}
                onChange={manejarCambio}
                disabled={!medicamento.medicacion}
                className={errores.condicion_tratada ? 'campo-error' : ''}
                placeholder="Indique la condición médica tratada"
              />
              {errores.condicion_tratada && (
                <span className="mensaje-error">{errores.condicion_tratada}</span>
              )}
            </div>

            <div className="grupo-formulario">
              <label className="etiqueta-campo">
                Reacciones Especiales
              </label>
              <textarea
                name="reacciones_esp"
                value={medicamento.reacciones_esp || ''}
                onChange={manejarCambio}
                disabled={!medicamento.medicacion}
                rows={3}
                placeholder="Describa cualquier reacción adversa o especial observada"
              />
            </div>
          </div>

          <div className="acciones-formulario">
            <button 
              type="submit" 
              className="boton-primario" 
              disabled={enviando || !medicamento.medicacion}
            >
              {enviando ? 'Procesando...' : editando ? 'Actualizar' : 'Guardar'}
            </button>
            <button
              type="button"
              className="boton-secundario"
              onClick={() => {
                resetearFormulario();
                setEditando(false);
                navigate(`/fichas/${id_ficha_paciente}/medicamentos`);
              }}
              disabled={enviando}
            >
              Cancelar
            </button>
            
          </div>
        </form>
      </div>

      <div className="listado-card">
        <h3 className="titulo-listado">Listado de Medicamentos</h3>
        {cargando ? (
          <div className="cargando">
            <div className="spinner"></div>
            <p>Cargando información...</p>
          </div>
        ) : medicamentos.length === 0 ? (
          <div className="sin-datos">
            <p>No hay medicamentos registrados para este paciente</p>
          </div>
        ) : (
          <div className="tabla-responsive">
            <table className="tabla-datos">
              <thead>
                <tr>
                  <th>Medicamento</th>
                  <th>Dosis</th>
                  <th>Frecuencia</th>
                  <th>Vía</th>
                  <th>Condición</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {medicamentos.map((med) => (
                  <tr key={med.idListaMedicamentos}>
                    <td>
                      <div className="medicamento-cell">
                        <span className="medicamento-nombre">{med.nombremedicamento || 'Sin especificar'}</span>
                        
                      </div>
                    </td>
                    <td>
                      <span className="dosis-info">
                        {med.dosis_med || 'No especificada'}
                      </span>
                    </td>
                    <td>
                      <span className="frecuencia-info">
                        {med.frecuencia_med || 'No especificada'}
                      </span>
                    </td>
                    <td>
                      <span className="via-info">
                        {med.via_administracion || 'No especificada'}
                      </span>
                    </td>
                    <td>
                      <span className="condicion-info">
                        {med.condicion_tratada || 'No especificada'}
                      </span>
                    </td>
                    <td className="acciones-tabla">
                      <button 
                        className="boton-editar" 
                        onClick={() => manejarEdicion(med)}
                        disabled={enviando}
                        title="Editar medicamento"
                      >
                        ✏️ Editar
                      </button>
                      <button 
                        className="boton-eliminar" 
                        onClick={() => manejarEliminacion(med.idListaMedicamentos)}
                        disabled={enviando}
                        title="Eliminar medicamento"
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicamentoForm;