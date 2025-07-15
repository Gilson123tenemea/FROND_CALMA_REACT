import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CardTrabajo from "../CardTrabajo/cardTrabajo";
import './ListaTrabajos.css';

const ListaTrabajos = ({ idAspirante }) => {
  const [trabajos, setTrabajos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    titulo: '',
    fechaPublicacion: '',
    rangoSalario: [0, 9999]
  });

  useEffect(() => {
    const fetchTrabajos = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:8090/api/generar/publicaciones');

        const trabajosData = res.data.map(item => {
          const parroquia = item.publicacionempleo?.parroquia;
          const canton = parroquia?.canton;
          const provincia = canton?.provincia;

          return {
            id: item.publicacionempleo?.id_postulacion_empleo,
            titulo: item.publicacionempleo?.titulo || 'Sin título',
            descripcion: item.publicacionempleo?.descripcion || 'Sin descripción',
            salario: item.publicacionempleo?.salario_estimado || 0,
            fechaPublicacion: item.fechaPublicacion?.split('T')[0] || 'Sin fecha',
            contratante: item.contratante?.usuario?.nombres || 'Anónimo',
            empresa: item.contratante?.empresas?.[0]?.nombreEmpresa || null,
            requisitos: item.publicacionempleo?.requisitos || 'No especificado',
            jornada: item.publicacionempleo?.jornada || 'No especificada',
            turno: item.publicacionempleo?.turno || 'No especificado',
            actividadesRealizar: item.publicacionempleo?.actividades_realizar || 'No especificadas', // ✅ agregado
            ubicacion: {
              parroquia: parroquia?.nombre || '',
              canton: canton?.nombre || '',
              provincia: provincia?.nombre || ''
            },
            imagen: 'https://source.unsplash.com/400x250/?work'
          };
        });

        setTrabajos(trabajosData);
      } catch (err) {
        console.error('Error cargando trabajos:', err);
        setError('No se pudo cargar los trabajos. Intenta más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrabajos();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSalaryChange = (index, value) => {
    const rango = [...filters.rangoSalario];
    rango[index] = parseInt(value) || 0;
    setFilters(prev => ({ ...prev, rangoSalario: rango }));
  };

  const trabajosFiltrados = trabajos.filter(trabajo => {
    const tituloMatch = trabajo.titulo.toLowerCase().includes(filters.titulo.toLowerCase());
    const fechaMatch = filters.fechaPublicacion
      ? trabajo.fechaPublicacion === filters.fechaPublicacion
      : true;
    const salario = trabajo.salario || 0;
    const [min, max] = filters.rangoSalario;
    const salarioMatch = salario >= min && salario <= max;

    return tituloMatch && fechaMatch && salarioMatch;
  });

  return (
    <div className="contenedor-trabajos">
      <h1>Trabajos Disponibles</h1>

      <div className="filtros-superiores">
        <input
          type="text"
          name="titulo"
          placeholder="🔍 Buscar por título"
          value={filters.titulo}
          onChange={handleFilterChange}
        />
        <input
          type="date"
          name="fechaPublicacion"
          value={filters.fechaPublicacion}
          onChange={handleFilterChange}
        />
      </div>

      <div className="layout-trabajos">
        <div className="lista-trabajos">
          {loading && <p>Cargando trabajos...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {!loading && trabajosFiltrados.length === 0 && (
            <div>
              <h3>No se encontraron trabajos</h3>
              <p>Intenta ajustar tus filtros.</p>
            </div>
          )}

          {!loading && trabajosFiltrados.length > 0 && trabajosFiltrados.map(trabajo => (
            <CardTrabajo
              key={trabajo.id}
              trabajo={trabajo}
              idAspirante={idAspirante}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListaTrabajos;
