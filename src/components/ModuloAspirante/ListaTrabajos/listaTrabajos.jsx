import React, { useState } from 'react';
import FiltrosTrabajos from "../FiltrosTrabajos/filtrosTrabajos";
import CardTrabajo from "../CardTrabajo/cardTrabajo";
import './ListaTrabajos.css';

const ListaTrabajos = ({ userId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    ubicacion: 'Cualquier lugar',
    tipoCuidado: 'Cualquiera',
    recomendacion: 'Todas',
    fechaPublicacion: 'Cualquier fecha',
    rangoSalario: [20, 50]
  });

  // Datos de ejemplo (luego puedes reemplazar con una API)
  const trabajos = [
    {
      id: 1,
      titulo: "Cuidador para mujer mayor",
      descripcion: "Buscamos un cuidador compasivo para una mujer mayor en su hogar. Responsabilidades incluyen preparación de comidas, recordatorios de medicación y compañía.",
      imagen: "https://example.com/image1.jpg",
      fechaPublicacion: "Hace 2 días",
      recomendaciones: 5
    },
    // Más trabajos...
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSalaryChange = (index, value) => {
    const newSalaryRange = [...filters.rangoSalario];
    newSalaryRange[index] = parseInt(value);
    setFilters(prev => ({ ...prev, rangoSalario: newSalaryRange }));
  };

  const trabajosFiltrados = trabajos.filter(trabajo => {
    // Lógica de filtrado...
    return true;
  });

  return (
    <div className="contenedor-trabajos">
      <h1>Trabajos Disponibles</h1>
      
      <div className="layout-trabajos">
        <FiltrosTrabajos 
          filters={filters} 
          onFilterChange={handleFilterChange} 
          onSalaryChange={handleSalaryChange} 
        />
        
        <div className="lista-trabajos">
          {trabajosFiltrados.length > 0 ? (
            trabajosFiltrados.map(trabajo => (
              <CardTrabajo key={trabajo.id} trabajo={trabajo} userId={userId} />
            ))
          ) : (
            <div className="sin-resultados">
              <h3>No se encontraron trabajos</h3>
              <p>Intenta ajustar tus filtros o término de búsqueda</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListaTrabajos;