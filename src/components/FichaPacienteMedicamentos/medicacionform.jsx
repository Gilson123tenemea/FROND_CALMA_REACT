import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [medicamentoToDelete, setMedicamentoToDelete] = useState(null);

  const cargarMedicamentos = async () => {
    setCargando(true);
    try {
      const data = await getMedicamentosByFicha(id_ficha_paciente);
      setMedicamentos(data);
    } catch (error) {
      console.error("Error al cargar medicamentos:", error);

      // Mensajes de error específicos para carga
      if (error.response?.status === 404) {
        toast.info("ℹ No se encontraron medicamentos registrados para este paciente");
      } else if (error.response?.status === 403) {
        toast.error(" No tienes permisos para acceder a esta información");
      } else if (error.response?.status >= 500) {
        toast.error(" Error del servidor. Por favor, intenta más tarde");
      } else if (error.name === 'NetworkError' || !error.response) {
        toast.error(" Error de conexión. Verifica tu conexión a internet");
      } else {
        toast.error("Error inesperado al cargar los medicamentos");
      }
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

        // Mensajes de error específicos para carga individual
        if (error.response?.status === 404) {
          toast.error(" El medicamento seleccionado no existe o ha sido eliminado");
          navigate(`/fichas/${id_ficha_paciente}/medicamentos/nuevo`);
        } else if (error.response?.status === 403) {
          toast.error(" No tienes permisos para editar este medicamento");
        } else if (error.response?.status >= 500) {
          toast.error(" Error del servidor al cargar el medicamento");
        } else if (error.name === 'NetworkError' || !error.response) {
          toast.error(" Error de conexión al cargar el medicamento");
        } else {
          toast.error(" No se pudo cargar la información del medicamento");
        }
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

  // Función validarDosis mejorada con validación específica por vía de administración
  const validarDosis = (valor, viaAdministracion) => {
    if (!valor.trim()) {
      return 'La dosis es obligatoria';
    }

    // Si no hay vía de administración seleccionada, usar validación básica
    if (!viaAdministracion) {
      const regex = /^[0-9]+(\.[0-9]+)?\s*(mg|g|ml|L|UI|mcg|µg|tableta|tabletas|cápsula|cápsulas|gota|gotas|aplicación|aplicaciones)$/i;
      if (!regex.test(valor)) {
        return 'Formato inválido. Ejemplos: 500mg, 10ml, 2.5g, 1 tableta';
      }
      return '';
    }

    // Validaciones específicas por vía de administración
    let regex;
    let ejemplos;
    let errorMessage;

    switch (viaAdministracion.toLowerCase()) {
      case 'oral':
        // Acepta tabletas, cápsulas, ml (jarabes), gotas
        regex = /^([0-9]+(\.[0-9]+)?\s*(tableta|tabletas|cápsula|cápsulas|comprimido|comprimidos)|[0-9]+(\.[0-9]+)?\s*(ml|gotas?)|[0-9]+(\.[0-9]+)?\s*(mg|g|mcg|µg))$/i;
        ejemplos = '1 tableta, 2 cápsulas, 10ml, 5 gotas, 500mg';
        errorMessage = `Para vía oral use: ${ejemplos}`;
        break;

      case 'intravenosa':
        // Acepta ml, mg, g, UI, mcg (líquidos y medicamentos IV)
        regex = /^[0-9]+(\.[0-9]+)?\s*(ml|mg|g|UI|mcg|µg|ampolla|ampollas|vial|viales)$/i;
        ejemplos = '10ml, 500mg, 1 ampolla, 2000UI';
        errorMessage = `Para vía intravenosa use: ${ejemplos}`;
        break;

      case 'intramuscular':
        // Acepta ml, mg, UI, mcg (inyecciones IM)
        regex = /^[0-9]+(\.[0-9]+)?\s*(ml|mg|UI|mcg|µg|ampolla|ampollas|jeringa|jeringas)$/i;
        ejemplos = '2ml, 250mg, 1 ampolla, 5000UI';
        errorMessage = `Para vía intramuscular use: ${ejemplos}`;
        break;

      case 'subcutánea':
        // Acepta ml, mg, UI (inyecciones subcutáneas como insulina)
        regex = /^[0-9]+(\.[0-9]+)?\s*(ml|mg|UI|unidades?|jeringa|jeringas)$/i;
        ejemplos = '0.5ml, 10 unidades, 1 jeringa';
        errorMessage = `Para vía subcutánea use: ${ejemplos}`;
        break;

      case 'rectal':
        // Acepta supositorios, enemas, mg
        regex = /^([0-9]+(\.[0-9]+)?\s*(supositorio|supositorios)|[0-9]+(\.[0-9]+)?\s*(ml|enema|enemas)|[0-9]+(\.[0-9]+)?\s*(mg|g))$/i;
        ejemplos = '1 supositorio, 120ml (enema), 500mg';
        errorMessage = `Para vía rectal use: ${ejemplos}`;
        break;

      case 'transdérmica':
        // Acepta parches, mg, aplicaciones
        regex = /^([0-9]+(\.[0-9]+)?\s*(parche|parches|aplicación|aplicaciones)|[0-9]+(\.[0-9]+)?\s*(mg|g|mcg|µg))$/i;
        ejemplos = '1 parche, 25mcg, 1 aplicación';
        errorMessage = `Para vía transdérmica use: ${ejemplos}`;
        break;

      case 'inhalatoria':
        // Acepta puff, inhalaciones, mg, mcg
        regex = /^([0-9]+(\.[0-9]+)?\s*(puff|puffs|inhalación|inhalaciones|nebulización|nebulizaciones)|[0-9]+(\.[0-9]+)?\s*(mg|mcg|µg|ml))$/i;
        ejemplos = '2 puffs, 1 inhalación, 2.5mg, 5ml (nebulización)';
        errorMessage = `Para vía inhalatoria use: ${ejemplos}`;
        break;

      default:
        // Validación genérica para vías no especificadas
        regex = /^[0-9]+(\.[0-9]+)?\s*(mg|g|ml|L|UI|mcg|µg|tableta|tabletas|cápsula|cápsulas|gota|gotas|aplicación|aplicaciones)$/i;
        ejemplos = '500mg, 10ml, 2.5g, 1 tableta';
        errorMessage = `Formato inválido. Ejemplos: ${ejemplos}`;
        break;
    }

    if (!regex.test(valor)) {
      return errorMessage;
    }

    // Validaciones adicionales de rangos lógicos
    const numero = parseFloat(valor.match(/[0-9]+(\.[0-9]+)?/)[0]);

    // Validar que los números no sean excesivamente altos o bajos
    if (numero <= 0) {
      return 'La dosis debe ser mayor a 0';
    }

    // Validaciones específicas de rangos por unidad
    if (valor.toLowerCase().includes('tableta') || valor.toLowerCase().includes('cápsula') || valor.toLowerCase().includes('comprimido')) {
      if (numero > 20) {
        return 'Número de tabletas/cápsulas parece excesivo (máximo recomendado: 20)';
      }
    }

    if (valor.toLowerCase().includes('ml')) {
      if (numero > 1000) {
        return 'Volumen en ml parece excesivo (máximo recomendado: 1000ml)';
      }
    }

    if (valor.toLowerCase().includes('mg')) {
      if (numero > 10000) {
        return 'Dosis en mg parece excesiva (máximo recomendado: 10000mg)';
      }
    }

    if (valor.toLowerCase().includes('g') && !valor.toLowerCase().includes('mg') && !valor.toLowerCase().includes('mcg')) {
      if (numero > 50) {
        return 'Dosis en gramos parece excesiva (máximo recomendado: 50g)';
      }
    }

    return '';
  };

  const validarFrecuencia = (valor) => {
    if (!valor.trim()) {
      return 'La frecuencia es obligatoria';
    }

    const regex = new RegExp(
      '^(' +
      // Cada X tiempo
      'cada\\s+\\d+\\s+(hora|horas|día|días|semana|semanas|mes|meses)' +
      '|' +
      // X veces por período
      '(una|dos|tres|cuatro|cinco|seis|[1-9]\\d*)\\s+veces?\\s+(al|por)\\s+(día|semana|mes)' +
      '|' +
      // Una vez en momento específico
      'una\\s+vez\\s+(en\\s+la\\s+(mañana|tarde|noche)|al\\s+(día|semana|mes))' +
      '|' +
      // Combinaciones con horarios específicos como "1 vez al día por la noche"
      '(una|[1-9]\\d*)\\s+vez\\s+al\\s+día\\s+(por\\s+la\\s+(mañana|tarde|noche)|en\\s+la\\s+(mañana|tarde|noche))' +
      '|' +
      // "una vez cada X horas/días"
      'una\\s+vez\\s+cada\\s+\\d+\\s+(hora|horas|día|días)' +
      '|' +
      // Con las comidas - muy común en tercera edad
      '(una|dos|tres|[1-9]\\d*)\\s+(vez|veces)\\s+(con\\s+cada\\s+comida|con\\s+las\\s+comidas|antes\\s+de\\s+cada\\s+comida|después\\s+de\\s+cada\\s+comida)' +
      '|' +
      // Horarios específicos del día
      '(al\\s+despertar|cuando\\s+se\\s+despierte|al\\s+levantarse)' +
      '|' +
      '(antes\\s+de\\s+dormir|cuando\\s+se\\s+duerma|al\\s+acostarse)' +
      '|' +
      // Combinaciones con números específicos en diferentes momentos
      '\\d+\\s+(al\\s+despertar|cuando\\s+se\\s+despierte)\\s+y\\s+\\d+\\s+(al\\s+dormir|cuando\\s+se\\s+duerma|antes\\s+de\\s+dormir)' +
      '|' +
      '\\d+\\s+(por\\s+la\\s+mañana|en\\s+la\\s+mañana)\\s+y\\s+\\d+\\s+(por\\s+la\\s+noche|en\\s+la\\s+noche)' +
      '|' +
      // Instrucciones relacionadas con alimentos
      '(con\\s+el\\s+desayuno|con\\s+el\\s+almuerzo|con\\s+la\\s+cena)' +
      '|' +
      '(antes\\s+del\\s+desayuno|después\\s+del\\s+desayuno|antes\\s+del\\s+almuerzo|después\\s+del\\s+almuerzo|antes\\s+de\\s+la\\s+cena|después\\s+de\\s+la\\s+cena)' +
      '|' +
      // Instrucciones especiales comunes
      '(en\\s+ayunas|con\\s+el\\s+estómago\\s+vacío)' +
      '|' +
      '(solo\\s+cuando\\s+(sea\\s+)?necesario|según\\s+indicación\\s+médica|según\\s+necesidad)' +
      '|' +
      // Frecuencias específicas para tercera edad
      '(media\\s+hora\\s+antes\\s+de\\s+(comer|las\\s+comidas)|30\\s+minutos\\s+antes\\s+de\\s+(comer|las\\s+comidas))' +
      '|' +
      '(una\\s+hora\\s+después\\s+de\\s+(comer|las\\s+comidas)|60\\s+minutos\\s+después\\s+de\\s+(comer|las\\s+comidas))' +
      ')$',
      'i'
    );

    if (!regex.test(valor)) {
      return 'Formato inválido. Ejemplos: cada 8 horas, 2 veces con cada comida, 1 al despertar y 2 al dormir, con el desayuno, antes de dormir, en ayunas, según necesidad';
    }

    return '';
  };

  // Función validarCampos actualizada para usar la nueva validación
  const validarCampos = () => {
    const nuevosErrores = {};

    if (!medicamento.medicacion) {
      return nuevosErrores;
    }

    nuevosErrores.nombremedicamento = validarNombreUnico(medicamento.nombremedicamento);
    nuevosErrores.dosis_med = validarDosis(medicamento.dosis_med, medicamento.via_administracion);
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

  // Función para manejar cambios con validación en tiempo real
  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;
    const nuevoValor = type === 'checkbox' ? checked : value;

    setMedicamento(prev => ({
      ...prev,
      [name]: nuevoValor
    }));

    // Limpiar error del campo actual
    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Si cambia la vía de administración, revalidar la dosis
    if (name === 'via_administracion' && medicamento.dosis_med) {
      const errorDosis = validarDosis(medicamento.dosis_med, nuevoValor);
      setErrores(prev => ({
        ...prev,
        dosis_med: errorDosis
      }));
    }

    // Si cambia la dosis, revalidar con la vía actual
    if (name === 'dosis_med' && medicamento.via_administracion) {
      const errorDosis = validarDosis(nuevoValor, medicamento.via_administracion);
      setErrores(prev => ({
        ...prev,
        dosis_med: errorDosis
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
      toast.warning("⚠️ Debe marcar 'En medicación' para continuar");
      return;
    }

    const nuevosErrores = validarCampos();
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      toast.error(" Por favor corrige los errores del formulario");
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
        toast.success(` Medicamento "${medicamento.nombremedicamento}" actualizado exitosamente`);
      } else {
        await createMedicamento(datosMedicamento);
        toast.success(` Medicamento "${medicamento.nombremedicamento}" registrado exitosamente`);
      }

      await cargarMedicamentos();
      resetearFormulario();
      setEditando(false);
      navigate(`/fichas/${id_ficha_paciente}/medicamentos`);
    } catch (error) {
      console.error("Error al guardar medicamento:", error);

      // Mensajes de error específicos para guardar
      if (error.response?.status === 400) {
        toast.error(" Datos inválidos. Por favor, verifica la información ingresada");
      } else if (error.response?.status === 409) {
        toast.error(" Este medicamento ya existe para este paciente");
      } else if (error.response?.status === 403) {
        toast.error(" No tienes permisos para realizar esta acción");
      } else if (error.response?.status === 413) {
        toast.error(" Los datos ingresados son demasiado largos");
      } else if (error.response?.status >= 500) {
        toast.error(" Error del servidor. No se pudo guardar el medicamento");
      } else if (error.name === 'NetworkError' || !error.response) {
        toast.error(" Error de conexión. Verifica tu internet e intenta nuevamente");
      } else {
        toast.error(` Error inesperado al ${editando ? 'actualizar' : 'guardar'} el medicamento`);
      }
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
    // Encontrar el nombre del medicamento para mostrarlo en los mensajes
    const medicamentoAEliminar = medicamentos.find(m => m.idListaMedicamentos === id);
    const nombreMedicamento = medicamentoAEliminar?.nombremedicamento || 'el medicamento';

    // Mostrar modal de confirmación personalizado
    setMedicamentoToDelete({ id, nombre: nombreMedicamento });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!medicamentoToDelete) return;

    setShowDeleteModal(false);
    setEnviando(true);

    try {
      await deleteMedicamento(medicamentoToDelete.id);
      toast.success(` Medicamento "${medicamentoToDelete.nombre}" eliminado exitosamente`);
      await cargarMedicamentos();

      if (medicamentoToDelete.id === idListaMedicamentos) {
        resetearFormulario();
        setEditando(false);
        navigate(`/fichas/${id_ficha_paciente}/medicamentos`);
      }
    } catch (error) {
      console.error("Error al eliminar medicamento:", error);

      // Mensajes de error específicos para eliminación
      if (error.response?.status === 404) {
        toast.error(` El medicamento "${medicamentoToDelete.nombre}" ya no existe o fue eliminado previamente`);
        cargarMedicamentos(); // Recargar para actualizar la lista
      } else if (error.response?.status === 403) {
        toast.error(` No tienes permisos para eliminar el medicamento "${medicamentoToDelete.nombre}"`);
      } else if (error.response?.status === 409) {
        toast.error(` No se puede eliminar el medicamento "${medicamentoToDelete.nombre}" porque está siendo utilizado en otros registros`);
      } else if (error.response?.status >= 500) {
        toast.error(` Error del servidor. No se pudo eliminar el medicamento "${medicamentoToDelete.nombre}"`);
      } else if (error.name === 'NetworkError' || !error.response) {
        toast.error(` Error de conexión. No se pudo eliminar el medicamento "${medicamentoToDelete.nombre}"`);
      } else {
        toast.error(` Error inesperado al eliminar el medicamento "${medicamentoToDelete.nombre}"`);
      }
    } finally {
      setEnviando(false);
      setMedicamentoToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setMedicamentoToDelete(null);
  };

  const handleCancel = () => {
    if (editando && (medicamento.nombremedicamento.trim() || medicamento.dosis_med.trim() || medicamento.frecuencia_med.trim())) {
      if (window.confirm("¿Estás seguro de que deseas cancelar? Los cambios no guardados se perderán.")) {
        resetearFormulario();
        setEditando(false);
        navigate(`/fichas/${id_ficha_paciente}/medicamentos`);
      }
    } else {
      resetearFormulario();
      setEditando(false);
      navigate(`/fichas/${id_ficha_paciente}/medicamentos`);
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
                <option value="">Selecciona una vía</option>
                <option value="oral">Oral</option>
                <option value="intravenosa">Intravenosa</option>
                <option value="intramuscular">Intramuscular</option>
                <option value="subcutánea">Subcutánea</option>
                <option value="rectal">Rectal</option>
                <option value="transdérmica">Transdérmica</option>
                <option value="inhalatoria">Inhalatoria</option>
              </select>
              {errores.via_administracion && (
                <span className="mensaje-error">{errores.via_administracion}</span>
              )}
            </div>

            <div className="fila-formulario">
              <div className="grupo-formulario">
                <label className="etiqueta-campo">
                  Dosis *
                  {medicamento.via_administracion && (
                    <small style={{ display: 'block', color: '#666', fontSize: '12px', marginTop: '4px' }}>
                      {medicamento.via_administracion === 'oral' && 'Ej: 1 tableta, 2 cápsulas, 10ml, 5 gotas, 500mg'}
                      {medicamento.via_administracion === 'intravenosa' && 'Ej: 10ml, 500mg, 1 ampolla, 2000UI'}
                      {medicamento.via_administracion === 'intramuscular' && 'Ej: 2ml, 250mg, 1 ampolla, 5000UI'}
                      {medicamento.via_administracion === 'subcutánea' && 'Ej: 0.5ml, 10 unidades, 1 jeringa'}
                      {medicamento.via_administracion === 'rectal' && 'Ej: 1 supositorio, 120ml (enema), 500mg'}
                      {medicamento.via_administracion === 'transdérmica' && 'Ej: 1 parche, 25mcg, 1 aplicación'}
                      {medicamento.via_administracion === 'inhalatoria' && 'Ej: 2 puffs, 1 inhalación, 2.5mg, 5ml (nebulización)'}
                    </small>
                  )}
                </label>
                <input
                  type="text"
                  name="dosis_med"
                  value={medicamento.dosis_med || ''}
                  onChange={manejarCambio}
                  disabled={!medicamento.medicacion}
                  className={errores.dosis_med ? 'campo-error' : ''}
                  placeholder={
                    !medicamento.via_administracion
                      ? "Primero seleccione la vía de administración"
                      : medicamento.via_administracion === 'oral'
                        ? "Ej: 1 tableta"
                        : medicamento.via_administracion === 'intravenosa'
                          ? "Ej: 10ml"
                          : medicamento.via_administracion === 'intramuscular'
                            ? "Ej: 2ml"
                            : medicamento.via_administracion === 'subcutánea'
                              ? "Ej: 0.5ml"
                              : medicamento.via_administracion === 'rectal'
                                ? "Ej: 1 supositorio"
                                : medicamento.via_administracion === 'transdérmica'
                                  ? "Ej: 1 parche"
                                  : medicamento.via_administracion === 'inhalatoria'
                                    ? "Ej: 2 puffs"
                                    : "Ingrese la dosis"
                  }
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
              {enviando ? (
                <>⏳ {editando ? 'Actualizando...' : 'Guardando...'}</>
              ) : (
                editando ? 'Actualizar' : 'Guardar'
              )}
            </button>
            <button
              type="button"
              className="boton-secundario"
              onClick={handleCancel}
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
            <p>⏳ Cargando medicamentos...</p>
          </div>
        ) : medicamentos.length === 0 ? (
          <div className="sin-datos">
            <p>💊 No hay medicamentos registrados para este paciente</p>
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
                        Editar
                      </button>
                      <button
                        className="boton-eliminar"
                        onClick={() => manejarEliminacion(med.idListaMedicamentos)}
                        disabled={enviando}
                        title="Eliminar medicamento"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de confirmación para eliminar */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            border: '1px solid #e9ecef'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '16px',
              color: '#dc3545'
            }}>
              <span style={{ fontSize: '24px', marginRight: '12px' }}>⚠️</span>
              <h3 style={{ margin: 0, color: '#dc3545', fontSize: '18px' }}>
                Confirmar Eliminación
              </h3>
            </div>

            <p style={{
              margin: '0 0 20px 0',
              color: '#495057',
              lineHeight: '1.5',
              fontSize: '14px'
            }}>
              ¿Estás seguro de que deseas eliminar el medicamento{' '}
              <strong style={{ color: '#dc3545' }}>"{medicamentoToDelete?.nombre}"</strong>?
            </p>

            <div style={{
              backgroundColor: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: '6px',
              padding: '12px',
              marginBottom: '20px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '13px',
                color: '#856404'
              }}>
                <span style={{ marginRight: '8px' }}>💡</span>
                <strong>Esta acción no se puede deshacer.</strong>
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                type="button"
                onClick={cancelDelete}
                disabled={enviando}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #6c757d',
                  backgroundColor: '#fff',
                  color: '#6c757d',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#6c757d';
                  e.target.style.color = '#fff';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#fff';
                  e.target.style.color = '#6c757d';
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={enviando}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #dc3545',
                  backgroundColor: '#dc3545',
                  color: '#fff',
                  borderRadius: '6px',
                  cursor: enviando ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  opacity: enviando ? 0.7 : 1,
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  if (!enviando) {
                    e.target.style.backgroundColor = '#c82333';
                    e.target.style.borderColor = '#c82333';
                  }
                }}
                onMouseOut={(e) => {
                  if (!enviando) {
                    e.target.style.backgroundColor = '#dc3545';
                    e.target.style.borderColor = '#dc3545';
                  }
                }}
              >
                {enviando ? (
                  <>⏳ Eliminando...</>
                ) : (
                  <>🗑️ Eliminar</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Configuración del ToastContainer */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{
          fontSize: '14px',
          fontWeight: '500'
        }}
        toastStyle={{
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          border: '1px solid rgba(0, 0, 0, 0.1)'
        }}
      />
    </div>
  );
};

export default MedicamentoForm;