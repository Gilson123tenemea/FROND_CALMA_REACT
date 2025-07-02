import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './moduloContratante.css';

const ModuloContratante = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('publicaciones');
  const [jobPosts, setJobPosts] = useState([
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
    },
    {
      id: 3,
      title: "Cuidador interno para pareja mayor",
      description: "Buscamos un cuidador interno para una pareja mayor. Deberes incluyen cuidado personal, limpieza ligera y transporte a citas.",
      status: "inactivo",
      applicants: 8,
      datePosted: "Hace 3 días"
    }
  ]);

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
    console.log("ID del contratante (desde state):", location.state.userId);
  }

  const userData = JSON.parse(localStorage.getItem('userData'));
  if (userData?.usuarioId) {
    console.log("ID del contratante (desde localStorage):", userData.usuarioId);
  }
}, [location.state]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob(prev => ({
      ...prev,
      [name]: value
    }));
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
  };

  const toggleJobStatus = (id) => {
    setJobPosts(jobPosts.map(job => 
      job.id === id ? {
        ...job,
        status: job.status === "activo" ? "inactivo" : "activo"
      } : job
    ));
  };

  return (
    <div className="modulo-contratante">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="logo">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z"
                fill="currentColor"
              ></path>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M39.998 12.236C39.9944 12.2537 39.9875 12.2845 39.9748 12.3294C39.9436 12.4399 39.8949 12.5741 39.8346 12.7175C39.8168 12.7597 39.7989 12.8007 39.7813 12.8398C38.5103 13.7113 35.9788 14.9393 33.7095 15.4811C30.9875 16.131 27.6413 16.5217 24 16.5217C20.3587 16.5217 17.0125 16.131 14.2905 15.4811C12.0012 14.9346 9.44505 13.6897 8.18538 12.8168C8.17384 12.7925 8.16216 12.767 8.15052 12.7408C8.09919 12.6249 8.05721 12.5114 8.02977 12.411C8.00356 12.3152 8.00039 12.2667 8.00004 12.2612C8.00004 12.261 8 12.2607 8.00004 12.2612C8.00004 12.2359 8.0104 11.9233 8.68485 11.3686C9.34546 10.8254 10.4222 10.2469 11.9291 9.72276C14.9242 8.68098 19.1919 8 24 8C28.8081 8 33.0758 8.68098 36.0709 9.72276C37.5778 10.2469 38.6545 10.8254 39.3151 11.3686C39.9006 11.8501 39.9857 12.1489 39.998 12.236ZM4.95178 15.2312L21.4543 41.6973C22.6288 43.5809 25.3712 43.5809 26.5457 41.6973L43.0534 15.223C43.0709 15.1948 43.0878 15.1662 43.104 15.1371L41.3563 14.1648C43.104 15.1371 43.1038 15.1374 43.104 15.1371L43.1051 15.135L43.1065 15.1325L43.1101 15.1261L43.1199 15.1082C43.1276 15.094 43.1377 15.0754 43.1497 15.0527C43.1738 15.0075 43.2062 14.9455 43.244 14.8701C43.319 14.7208 43.4196 14.511 43.5217 14.2683C43.6901 13.8679 44 13.0689 44 12.2609C44 10.5573 43.003 9.22254 41.8558 8.2791C40.6947 7.32427 39.1354 6.55361 37.385 5.94477C33.8654 4.72057 29.133 4 24 4C18.867 4 14.1346 4.72057 10.615 5.94478C8.86463 6.55361 7.30529 7.32428 6.14419 8.27911C4.99695 9.22255 3.99999 10.5573 3.99999 12.2609C3.99999 13.1275 4.29264 13.9078 4.49321 14.3607C4.60375 14.6102 4.71348 14.8196 4.79687 14.9689C4.83898 15.0444 4.87547 15.1065 4.9035 15.1529C4.91754 15.1762 4.92954 15.1957 4.93916 15.2111L4.94662 15.223L4.95178 15.2312ZM35.9868 18.996L24 38.22L12.0131 18.996C12.4661 19.1391 12.9179 19.2658 13.3617 19.3718C16.4281 20.1039 20.0901 20.5217 24 20.5217C27.9099 20.5217 31.5719 20.1039 34.6383 19.3718C35.082 19.2658 35.5339 19.1391 35.9868 18.996Z"
                fill="currentColor"
              ></path>
            </svg>
            <h2>SeniorConnect</h2>
          </div>
          <nav className="nav-links">
            <a href="#">Inicio</a>
            <a href="#">Mi Red</a>
            <a href="#" className="active">Trabajos</a>
            <a href="#">Mensajes</a>
            <a href="#">Notificaciones</a>
            <a href="#">Mi Perfil</a>
          </nav>
        </div>
        <div className="header-right">
          <div className="search-bar">
            <div className="search-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
              </svg>
            </div>
            <input type="text" placeholder="Buscar" />
          </div>
          <div className="user-avatar" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC7xYeLgJw3HPuf8tUUBOx1JHnFFX4gdCdA8VqdY-DYJa-LG5ZJcdBGSet6h-kNMEYn0QQxnamguLQikjX8kePCzu93nzRd6hAzgyZKqio9beS5lzd--RPEo1e6M3c6dZowOKDssqZ-oMPRCtD4DjrHwLTrComL16-y7v1RnNfYoYXZNW3jypW5Q1nsSfGEzbaaLS5vMkW5KLUoA0t2aolswTQxmvbb3N4AoSTffpTChIWOhz3ZnPu17U7DIHm5YWpMrOBsE98O5R0")'}}></div>
        </div>
      </header>

      {/* Main Content */}
      <div className="main-content">
        {/* Tabs */}
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

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'publicaciones' ? (
            <div className="job-posts">
              <h1>Mis Publicaciones de Trabajo</h1>
              
              {jobPosts.length > 0 ? (
                jobPosts.map(job => (
                  <div key={job.id} className={`job-card ${job.status}`}>
                    <div className="job-content">
                      <div className="job-info">
                        <div className="job-header">
                          <h3>{job.title}</h3>
                          <span className={`status-badge ${job.status}`}>
                            {job.status === "activo" ? "Activo" : "Inactivo"}
                          </span>
                        </div>
                        <p>{job.description}</p>
                        <div className="job-meta">
                          <span className="applicants">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#4a6cf7" viewBox="0 0 256 256">
                              <path d="M160,40a32,32,0,1,0-32,32A32,32,0,0,0,160,40ZM128,56a16,16,0,1,1,16-16A16,16,0,0,1,128,56Zm32.19,120a48.05,48.05,0,0,1-64.38,0A56,56,0,0,0,72,144V120a8,8,0,0,1,8-8h96a8,8,0,0,1,8,8v24A56,56,0,0,0,160.19,176ZM216,144v24a8,8,0,0,1-16,0V144a40,40,0,0,0-40-40H136a8,8,0,0,1,0-16h24A56,56,0,0,1,216,144ZM56,112a8,8,0,0,0,0,16H80a8,8,0,0,1,8,8v24a40,40,0,0,0,40,40h0a8,8,0,0,0,0-16h0a24,24,0,0,1-24-24V136a24,24,0,0,0-24-24Z"></path>
                            </svg>
                            {job.applicants} solicitantes
                          </span>
                          <span className="date-posted">Publicado {job.datePosted}</span>
                        </div>
                      </div>
                      <div className="job-actions">
                        <button 
                          className={`status-button ${job.status}`}
                          onClick={() => toggleJobStatus(job.id)}
                        >
                          {job.status === "activo" ? "Desactivar" : "Activar"}
                        </button>
                        <button className="edit-button">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#737373" viewBox="0 0 256 256">
                            <path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z"></path>
                          </svg>
                          Editar
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-posts">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#999" viewBox="0 0 256 256">
                    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-16-56a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0Zm32,0a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0Z"></path>
                  </svg>
                  <h3>No tienes publicaciones aún</h3>
                  <p>Crea tu primera publicación para encontrar al cuidador ideal</p>
                  <button 
                    className="create-first-post"
                    onClick={() => setActiveTab('nueva')}
                  >
                    Crear Publicación
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="new-job-form">
              <h1>Crear Nueva Publicación</h1>
              
              <form onSubmit={handleSubmitJob}>
                <div className="form-group">
                  <label>Título del Trabajo*</label>
                  <input
                    type="text"
                    name="title"
                    value={newJob.title}
                    onChange={handleInputChange}
                    placeholder="Ej: Cuidador para adulto mayor"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Descripción Detallada*</label>
                  <textarea
                    name="description"
                    value={newJob.description}
                    onChange={handleInputChange}
                    placeholder="Describe las responsabilidades, requisitos y cualquier detalle importante..."
                    rows="5"
                    required
                  ></textarea>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Tipo de Cuidado*</label>
                    <select
                      name="careType"
                      value={newJob.careType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Elderly Care">Cuidado de Ancianos</option>
                      <option value="Disability Care">Cuidado de Discapacitados</option>
                      <option value="Post-Surgery Care">Cuidado Post-operatorio</option>
                      <option value="Companionship">Compañía</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Ubicación*</label>
                    <input
                      type="text"
                      name="location"
                      value={newJob.location}
                      onChange={handleInputChange}
                      placeholder="Ciudad, Dirección"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Salario Ofrecido*</label>
                    <input
                      type="text"
                      name="salary"
                      value={newJob.salary}
                      onChange={handleInputChange}
                      placeholder="Ej: $15 - $20 por hora"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Horario*</label>
                    <select
                      name="schedule"
                      value={newJob.schedule}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Full-time">Tiempo Completo</option>
                      <option value="Part-time">Medio Tiempo</option>
                      <option value="Flexible">Horario Flexible</option>
                      <option value="Live-in">Vivir en Casa</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="button" className="cancel-button">
                    Cancelar
                  </button>
                  <button type="submit" className="submit-button">
                    Publicar Trabajo
                  </button>
                </div>
                

              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModuloContratante;