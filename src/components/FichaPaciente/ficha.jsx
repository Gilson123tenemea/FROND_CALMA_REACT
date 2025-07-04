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

const FichaPacienteForm = () => {
  const [form, setForm] = useState({
    diagnostico_me_actual: '',
    condiciones_fisicas: '',
    medicacion: false,
    requiere_inyecciones: false,
    ayuda_toma_medicina: false,
    nivel_conciencia: '',
    estado_animo: '',
    diagnostico_mental: '',
    autonomia: '',
    comunicacion: false,
    lenguale_señas: false,
    otras_comunicaciones: '',
    tipo_dieta: '',
    alimentacion_asistida: '',
    hora_levantarse: '',
    hora_acostarse: '',
    frecuencia_siestas: '',
    frecuencia_baño: '',
    rutina_medica: '',
    acompañado: false,
    observaciones: '',
    caidas: '',
    fecha_registro: new Date(),
    paciente: null,
    listamedicamentos: '',
    alergiasalimenarias: '',
    temaconversacion: '',
    interesespersonales: '',
    enfermedadanterior: '',
    condicion: ''
  });

  const [listas, setListas] = useState({
    medicamentos: [],
    alergias: [],
    temas: [],
    intereses: [],
    enfermedades: [],
    condiciones: []
  });

  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      getListaMedicamentos(),
      getAlergias(),
      getTemasConversacion(),
      getIntereses(),
      getEnfermedades(),
      getCondiciones()
    ]).then(([medicamentos, alergias, temas, intereses, enfermedades, condiciones]) => {
      setListas({ medicamentos, alergias, temas, intereses, enfermedades, condiciones });
    });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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
            <option key={item[idField]} value={item[idField]}>
              {item[textField]}
            </option>
          ))}
        </select>
        <button type="button" onClick={() => navigate(addRoute)}>Agregar</button>
      </div>
    </div>
  );

  return (
    <form className="ficha-form" onSubmit={handleSubmit}>
      <h2>Registro de Ficha Paciente</h2>
      <input name="diagnostico_me_actual" placeholder="Diagnóstico médico actual" onChange={handleChange} />
      <input name="condiciones_fisicas" placeholder="Condiciones físicas" onChange={handleChange} />
      <label><input type="checkbox" name="medicacion" onChange={handleChange} /> Usa medicación</label>
      <label><input type="checkbox" name="requiere_inyecciones" onChange={handleChange} /> Requiere inyecciones</label>
      <label><input type="checkbox" name="ayuda_toma_medicina" onChange={handleChange} /> Ayuda para tomar medicina</label>
      <input name="nivel_conciencia" placeholder="Nivel de conciencia" onChange={handleChange} />
      <input name="estado_animo" placeholder="Estado de ánimo" onChange={handleChange} />
      <input name="diagnostico_mental" placeholder="Diagnóstico mental" onChange={handleChange} />
      <input name="autonomia" placeholder="Autonomía" onChange={handleChange} />
      <label><input type="checkbox" name="comunicacion" onChange={handleChange} /> Se comunica</label>
      <label><input type="checkbox" name="lenguale_señas" onChange={handleChange} /> Usa lenguaje de señas</label>
      <input name="otras_comunicaciones" placeholder="Otras formas de comunicación" onChange={handleChange} />
      <input name="tipo_dieta" placeholder="Tipo de dieta" onChange={handleChange} />
      <input name="alimentacion_asistida" placeholder="Alimentación asistida" onChange={handleChange} />
      <input name="hora_levantarse" placeholder="Hora de levantarse" onChange={handleChange} />
      <input name="hora_acostarse" placeholder="Hora de acostarse" onChange={handleChange} />
      <input name="frecuencia_siestas" placeholder="Frecuencia de siestas" onChange={handleChange} />
      <input name="frecuencia_baño" placeholder="Frecuencia de baño" onChange={handleChange} />
      <input name="rutina_medica" placeholder="Rutina médica" onChange={handleChange} />
      <label><input type="checkbox" name="acompañado" onChange={handleChange} /> Acompañado</label>
      <input name="observaciones" placeholder="Observaciones" onChange={handleChange} />
      <input name="caidas" placeholder="Historial de caídas" onChange={handleChange} />

      {renderSelect('Medicamentos', 'listamedicamentos', listas.medicamentos, 'idListaMedicamentos', 'nombremedicamento', '/agregar-medicamento')}
      {renderSelect('Alergia Alimentaria', 'alergiasalimenarias', listas.alergias, 'id_alergias_alimentarias', 'alergiaAlimentaria', '/alergiaali')}
      {renderSelect('Tema de Conversación', 'temaconversacion', listas.temas, 'idTemaConversacion', 'tema', '/agregar-tema')}
      {renderSelect('Interés Personal', 'interesespersonales', listas.intereses, 'idInteresesPersonales', 'interesPersonal', '/agregar-interes')}
      {renderSelect('Enfermedad Anterior', 'enfermedadanterior', listas.enfermedades, 'idEnfermedadAnterior', 'nombre_enf', '/agregar-enfermedad')}
      {renderSelect('Condición Médica', 'condicion', listas.condiciones, 'idCondicion', 'condicionesFisicas', '/agregar-condicion')}

      <button type="submit">Guardar Ficha</button>
    </form>
  );
};

export default FichaPacienteForm;