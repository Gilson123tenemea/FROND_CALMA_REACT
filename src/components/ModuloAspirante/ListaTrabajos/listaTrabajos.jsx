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
            id: item.id_genera,
            titulo: item.publicacionempleo?.titulo || 'Sin título',
            descripcion: item.publicacionempleo?.descripcion || 'Sin descripción',
            salario: item.publicacionempleo?.salario_estimado || 0,
            fechaPublicacion: item.fechaPublicacion?.split('T')[0] || 'Sin fecha',
            contratante: item.contratante?.usuario?.nombres || 'Anónimo',
            empresa: item.contratante?.empresas?.[0]?.nombreEmpresa || null,
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

  // Filtrado combinado
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
    <div className="contenedor-trabajos" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Trabajos Disponibles</h1>

      {/* Filtros de título y fecha */}
      <div className="filtros-superiores" style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '25px' }}>
        <input
          type="text"
          name="titulo"
          placeholder="🔍 Buscar por título"
          value={filters.titulo}
          onChange={handleFilterChange}
          style={{
            padding: '10px 15px',
            fontSize: '1rem',
            borderRadius: '8px',
            border: '1px solid #ccc',
            width: '280px',
            maxWidth: '90%',
            boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
            outline: 'none'
          }}
        />
        <input
          type="date"
          name="fechaPublicacion"
          value={filters.fechaPublicacion}
          onChange={handleFilterChange}
          style={{
            padding: '10px 15px',
            fontSize: '1rem',
            borderRadius: '8px',
            border: '1px solid #ccc',
            width: '180px',
            maxWidth: '90%',
            boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
            outline: 'none'
          }}
        />
      </div>

      <div className="layout-trabajos" style={{ display: 'flex', gap: '20px' }}>
        <div className="lista-trabajos" style={{ flex: 3 }}>
          {loading && <p style={{ textAlign: 'center' }}>Cargando trabajos...</p>}
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

          {!loading && trabajosFiltrados.length === 0 && (
            <div className="sin-resultados" style={{ textAlign: 'center', marginTop: '40px' }}>
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
