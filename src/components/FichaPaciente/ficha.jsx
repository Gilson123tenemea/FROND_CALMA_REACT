import './ficha.css';
import React, { useEffect, useState } from 'react';
import { crearFicha } from '../../servicios/fichaPacienteService';
import { getAlergias } from '../../servicios/alergiaAlimentariaService';
import { getTemasConversacion } from '../../servicios/temaConversacionService';
import { getIntereses } from '../../servicios/interesesPersonalesService';
import { getEnfermedades } from '../../servicios/enfermedadAnteriorService';
import { getCondiciones } from '../../servicios/condicionService';
import { getListaMedicamentos } from '../../servicios/medicacionService';
import { useNavigate } from 'react-router-dom';

const pasos = [
  'Información General',
  'Medicamentos y Condiciones',
  'Comunicación y Dieta',
  'Rutinas y Observaciones',
  'Relaciones y Registros'
];

const opciones = {
  nivel_conciencia: [
    'Alerta', 'Somnoliento', 'Estuporoso', 'Coma', 'Confuso', 'Orientado', 'Desorientado'
  ],
  estado_animo: [
    'Tranquilo', 'Ansioso', 'Agitado', 'Eufórico', 'Deprimido', 'Irritable', 'Apatía'
  ],
  diagnostico_mental: [
    'Sin diagnóstico', 'Ansiedad', 'Depresión', 'Esquizofrenia', 'Bipolaridad', 'Trastorno de la personalidad'
  ],
  autonomia: [
    'Total', 'Parcial', 'Dependiente', 'Necesita supervisión'
  ],
  tipo_dieta: [
    'Normal', 'Hipocalórica', 'Hiperproteica', 'Vegetariana', 'Vegana', 'Blanda', 'Líquida', 'Diabética', 'Baja en sodio'
  ]
};

const FichaPacienteForm = () => {
  const [form, setForm] = useState({
    diagnostico_me_actual: '', condiciones_fisicas: '', medicacion: false, requiere_inyecciones: false,
    ayuda_toma_medicina: false, nivel_conciencia: '', estado_animo: '', diagnostico_mental: '', autonomia: '',
    comunicacion: false, lenguale_señas: false, otras_comunicaciones: '', tipo_dieta: '', alimentacion_asistida: '',
    hora_levantarse: '', hora_acostarse: '', frecuencia_siestas: '', frecuencia_baño: '', rutina_medica: '',
    acompañado: false, observaciones: '', caidas: '', fecha_registro: new Date(), paciente: null,
    listamedicamentos: '', alergiasalimenarias: '', temaconversacion: '', interesespersonales: '',
    enfermedadanterior: '', condicion: ''
  });

  const [listas, setListas] = useState({ medicamentos: [], alergias: [], temas: [], intereses: [], enfermedades: [], condiciones: [] });
  const [paso, setPaso] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      getListaMedicamentos(), getAlergias(), getTemasConversacion(), getIntereses(), getEnfermedades(), getCondiciones()
    ]).then(([medicamentos, alergias, temas, intereses, enfermedades, condiciones]) => {
      setListas({ medicamentos, alergias, temas, intereses, enfermedades, condiciones });
    });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await crearFicha({
        ...form,
        listamedicamentos: { idListaMedicamentos: form.listamedicamentos },
        alergiasalimenarias: { id_alergias_alimentarias: form.alergiasalimenarias },
        temaconversacion: { idTemaConversacion: form.temaconversacion },
        interesespersonales: { idInteresesPersonales: form.interesespersonales },
        enfermedadanterior: { idEnfermedadAnterior: form.enfermedadanterior },
        condicion: { idCondicion: form.condicion },
        paciente: null
      });
      alert('Ficha creada exitosamente');
      setForm({
        diagnostico_me_actual: '', condiciones_fisicas: '', medicacion: false, requiere_inyecciones: false,
        ayuda_toma_medicina: false, nivel_conciencia: '', estado_animo: '', diagnostico_mental: '', autonomia: '',
        comunicacion: false, lenguale_señas: false, otras_comunicaciones: '', tipo_dieta: '', alimentacion_asistida: '',
        hora_levantarse: '', hora_acostarse: '', frecuencia_siestas: '', frecuencia_baño: '', rutina_medica: '',
        acompañado: false, observaciones: '', caidas: '', fecha_registro: new Date(), paciente: null,
        listamedicamentos: '', alergiasalimenarias: '', temaconversacion: '', interesespersonales: '',
        enfermedadanterior: '', condicion: ''
      });
      setPaso(0);
    } catch (err) {
      console.error(err);
    }
  };

  const renderSelect = (label, name, items, idField, textField, addRoute) => (
    <div className="form-group">
      <label>{label}</label>
      <div className="select-with-button">
        <select name={name} value={form[name]} onChange={handleChange} required>
          <option value="">Seleccione...</option>
          {items.map(item => (
            <option key={item[idField]} value={item[idField]}>{item[textField]}</option>
          ))}
        </select>
        <button type="button" onClick={() => navigate(addRoute)}>Agregar</button>
      </div>
    </div>
  );

  const renderCombo = (label, name) => (
    <div className="form-group">
      <label>{label}</label>
      <select name={name} value={form[name]} onChange={handleChange} required>
        <option value="">Seleccione...</option>
        {opciones[name].map((val, idx) => (
          <option key={idx} value={val}>{val}</option>
        ))}
      </select>
    </div>
  );

  const cards = [
    <div className="card" key="general">
      <div className="form-group"><label>Diagnóstico Médico Actual</label><input name="diagnostico_me_actual" value={form.diagnostico_me_actual} onChange={handleChange} /></div>
      <div className="form-group"><label>Condiciones Físicas</label><input name="condiciones_fisicas" value={form.condiciones_fisicas} onChange={handleChange} /></div>
      {renderCombo('Nivel de Conciencia', 'nivel_conciencia')}
      {renderCombo('Estado de Ánimo', 'estado_animo')}
      {renderCombo('Diagnóstico Mental', 'diagnostico_mental')}
      {renderCombo('Autonomía', 'autonomia')}
    </div>,
    <div className="card" key="medicamentos">
      <div className="checkbox-group"><input type="checkbox" name="medicacion" checked={form.medicacion} onChange={handleChange} /><label>Usa Medicación</label></div>
      <div className="checkbox-group"><input type="checkbox" name="requiere_inyecciones" checked={form.requiere_inyecciones} onChange={handleChange} /><label>Requiere Inyecciones</label></div>
      <div className="checkbox-group"><input type="checkbox" name="ayuda_toma_medicina" checked={form.ayuda_toma_medicina} onChange={handleChange} /><label>Ayuda para Tomar Medicina</label></div>
      {renderSelect('Medicamentos', 'listamedicamentos', listas.medicamentos, 'idListaMedicamentos', 'nombremedicamento', '/agregar-medicamento')}
      {renderSelect('Alergia Alimentaria', 'alergiasalimenarias', listas.alergias, 'id_alergias_alimentarias', 'alergiaAlimentaria', '/alergiaali')}
      {renderSelect('Condición Médica', 'condicion', listas.condiciones, 'idCondicion', 'condicionesFisicas', '/agregar-condicion')}
    </div>,
    <div className="card" key="comunicacion">
      <div className="checkbox-group"><input type="checkbox" name="comunicacion" checked={form.comunicacion} onChange={handleChange} /><label>Se Comunica</label></div>
      <div className="checkbox-group"><input type="checkbox" name="lenguale_señas" checked={form.lenguale_señas} onChange={handleChange} /><label>Usa Lenguaje de Señas</label></div>
      <div className="form-group"><label>Otras Comunicaciones</label><input name="otras_comunicaciones" value={form.otras_comunicaciones} onChange={handleChange} /></div>
      {renderCombo('Tipo de Dieta', 'tipo_dieta')}
      <div className="form-group"><label>Alimentación Asistida</label><input name="alimentacion_asistida" value={form.alimentacion_asistida} onChange={handleChange} /></div>
    </div>,
    <div className="card" key="rutina">
      <div className="form-group"><label>Hora de Levantarse</label><input type="time" name="hora_levantarse" value={form.hora_levantarse} onChange={handleChange} /></div>
      <div className="form-group"><label>Hora de Acostarse</label><input type="time" name="hora_acostarse" value={form.hora_acostarse} onChange={handleChange} /></div>
      <div className="form-group"><label>Frecuencia de Siestas</label><input name="frecuencia_siestas" value={form.frecuencia_siestas} onChange={handleChange} /></div>
      <div className="form-group"><label>Frecuencia de Baño</label><input name="frecuencia_baño" value={form.frecuencia_baño} onChange={handleChange} /></div>
      <div className="form-group"><label>Rutina Médica</label><input name="rutina_medica" value={form.rutina_medica} onChange={handleChange} /></div>
      <div className="checkbox-group"><input type="checkbox" name="acompañado" checked={form.acompañado} onChange={handleChange} /><label>Acompañado</label></div>
    </div>,
    <div className="card" key="social">
      <div className="form-group"><label>Observaciones</label><input name="observaciones" value={form.observaciones} onChange={handleChange} /></div>
      <div className="form-group"><label>Caídas</label><input name="caidas" value={form.caidas} onChange={handleChange} /></div>
      {renderSelect('Tema de Conversación', 'temaconversacion', listas.temas, 'idTemaConversacion', 'tema', '/agregar-tema')}
      {renderSelect('Interés Personal', 'interesespersonales', listas.intereses, 'idInteresesPersonales', 'interesPersonal', '/agregar-interes')}
      {renderSelect('Enfermedad Anterior', 'enfermedadanterior', listas.enfermedades, 'idEnfermedadAnterior', 'nombre_enf', '/agregar-enfermedad')}
    </div>
  ];

  return (
    <div className="ficha-form-container">
      <form className="ficha-form" onSubmit={handleSubmit}>
        <div className="steps-nav">
          {pasos.map((p, i) => (
            <div key={i} className={i === paso ? 'active' : ''} onClick={() => setPaso(i)}>{p}</div>
          ))}
        </div>
        {cards[paso]}
        <div className="navigation-buttons">
          {paso > 0 && <button type="button" onClick={() => setPaso(paso - 1)}>Atrás</button>}
          {paso < cards.length - 1 && (
            <button type="button" onClick={() => setPaso(paso + 1)}>Siguiente</button>
          )}
        </div>
        {paso === cards.length - 1 && (
          <button type="submit">Guardar Ficha</button>
        )}
      </form>
    </div>
  );
};

export default FichaPacienteForm;
