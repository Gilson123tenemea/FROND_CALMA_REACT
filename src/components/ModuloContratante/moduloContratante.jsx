import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeaderContratante from './HeaderContratante/headerContratante';
import ListaPublicaciones from './ListaPublicaciones/listaPublicaciones';
import FormPublicacion from './FormularioPublicacion/formularioPublicacion';
import './moduloContratante.css';

const ModuloContratante = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('publicaciones');
  const [userId, setUserId] = useState(null);
  const [jobPosts, setJobPosts] = useState([]);
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    careType: 'Elderly Care',
    location: '',
    salary: '',
    schedule: 'Full-time'
  });

  useEffect(() => {
    if (location.state?.userId) {
      setUserId(location.state.userId);
    } else {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (userData?.usuarioId) {
        setUserId(userData.usuarioId);
      }
    }

    // Datos de ejemplo
    setJobPosts([
      {
        id: 1,
        title: "Cuidado para mujer mayor",
        description: "Buscamos un cuidador compasivo para una mujer mayor en su hogar. Responsabilidades incluyen preparación de comidas, recordatorios de medicación y compañía.",
        status: "activo",
        applicants: 5,
        datePosted: "Hace 2 días"
      },
      {
        id: 2,
        title: "Acompañante tiempo parcial para hombre mayor",
        description: "Buscamos un acompañante de tiempo parcial para un hombre mayor que disfruta de actividades ligeras y conversación. Horarios flexibles disponibles.",
        status: "activo",
        applicants: 3,
        datePosted: "Hace 1 semana"
      }
    ]);
  }, [location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitJob = (e) => {
    e.preventDefault();
    const newJobPost = {
      id: jobPosts.length + 1,
      title: newJob.title,
      description: newJob.description,
      status: "activo",
      applicants: 0,
      datePosted: "Recién publicado"
    };
    setJobPosts([...jobPosts, newJobPost]);
    setNewJob({
      title: '',
      description: '',
      careType: 'Elderly Care',
      location: '',
      salary: '',
      schedule: 'Full-time'
    });
    setActiveTab('publicaciones');
  };

  const toggleJobStatus = (id) => {
    setJobPosts(jobPosts.map(job => 
      job.id === id ? { ...job, status: job.status === "activo" ? "inactivo" : "activo" } : job
    ));
  };

  if (!userId) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="modulo-contratante">
      <HeaderContratante userId={userId} />
      
      <main className="main-content">
        <div className="tabs-container">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'publicaciones' ? 'active' : ''}`}
              onClick={() => setActiveTab('publicaciones')}
            >
              Mis Publicaciones
            </button>
            <button 
              className={`tab ${activeTab === 'nueva' ? 'active' : ''}`}
              onClick={() => setActiveTab('nueva')}
            >
              Crear Nueva Publicación
            </button>
          </div>
        </div>

        <div className="tab-content">
          {activeTab === 'publicaciones' ? (
            <ListaPublicaciones 
              publicaciones={jobPosts} 
              onToggleStatus={toggleJobStatus}
              onCreateNew={() => setActiveTab('nueva')}
            />
          ) : (
            <FormPublicacion 
              newJob={newJob}
              onInputChange={handleInputChange}
              onSubmit={handleSubmitJob}
              onCancel={() => setActiveTab('publicaciones')}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default ModuloContratante;