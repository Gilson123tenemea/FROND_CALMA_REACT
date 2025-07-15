import React, { useState } from 'react';
import { Clock, Home, Phone, DollarSign, Users, Heart, X } from 'lucide-react';
import './Soluciones.css';
import Footer from "../Footer/footer";
import Navbar from '../Shared/Navbar';

const Soluciones = () => {
  const [selectedSolution, setSelectedSolution] = useState(null);

  const solutions = [
    {
      id: 1,
      title: "Cuidadores por horas",
      icon: <Clock size={32} />,
      description: "Apoyo puntual para mantener la autonomía e independencia de tus seres queridos",
      features: [
        "Supervisión en la toma de medicación",
        "Ayuda en tareas del hogar y comidas",
        "Acompañamiento en paseos y visitas médicas"
      ],
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      title: "Cuidadores internos",
      icon: <Home size={32} />,
      description: "Tranquilidad 24/7 con atención constante en el hogar",
      features: [
        "Supervisión continua para prevenir accidentes",
        "Apoyo en aseo, alimentación y movilidad",
        "Compañía y atención personalizada"
      ],
      image: "https://images.unsplash.com/photo-1601758003122-53c40e686a19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "Teleasistencia",
      icon: <Phone size={32} />,
      description: "Seguridad inmediata con solo presionar un botón",
      features: [
        "Respuesta rápida ante emergencias",
        "Seguimiento remoto del bienestar",
        "Ideal para personas independientes"
      ],
      image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 4,
      title: "Ayudas económicas",
      icon: <DollarSign size={32} />,
      description: "Asesoramiento completo para obtener beneficios económicos",
      features: [
        "Evaluación del grado de dependencia",
        "Gestión integral de trámites",
        "Hasta $747 mensuales en ayudas"
      ],
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 5,
      title: "Trae a tu cuidador",
      icon: <Users size={32} />,
      description: "Regularizamos la situación de tu cuidador de confianza",
      features: [
        "Contratación y cumplimiento legal",
        "Gestión de nóminas y sustituciones",
        "Asesoramiento administrativo"
      ],
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    }
  ];

  const teamPhotos = [
    {
      id: 1,
      title: "Enfermeras especializadas",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      title: "Cuidadores geriátricos",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "Equipo de apoyo",
      image: "https://images.unsplash.com/photo-1581056771107-24ca5f033842?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 4,
      title: "Profesionales certificados",
      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 5,
      title: "Atención personalizada",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 6,
      title: "Supervisión médica",
      image: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div className="soluciones-page">
      <Navbar />

      {/* Hero Banner */}
      <header className="soluciones-hero">
        <div className="hero-content">
          <h1>Soluciones de cuidado personalizado</h1>
          <p>Encuentra el apoyo perfecto para tus seres queridos</p>
          <div className="hero-description">
            <p>
              En CALMA entendemos que cada familia tiene necesidades únicas.
              Nuestras soluciones flexibles se adaptan a tu situación particular,
              brindando la tranquilidad que mereces.
            </p>
          </div>
        </div>
        <div className="hero-image"></div>
      </header>

      {/* Solutions Grid */}
      <section className="soluciones-grid-section">
        <div className="section-header">
          <h2-soluciones>Nuestras soluciones</h2-soluciones>
          <p>Descubre cómo podemos ayudarte</p>
        </div>

        <div className="soluciones-grid">
          {solutions.map((solution) => (
            <div key={solution.id} className="solucion-card">
              <div
                className="card-image"
                style={{ backgroundImage: `url(${solution.image})` }}
              ></div>
              <div className="card-content">
                <div className="card-icon">{solution.icon}</div>
                <h3>{solution.title}</h3>
                <p className="card-description">{solution.description}</p>
                <ul className="card-features">
                  {solution.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
                <button
                  className="card-button"
                  onClick={() => setSelectedSolution(solution.id)}
                >
                  Más información
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="section-header">
          <h2-soluciones>Nuestro equipo de profesionales</h2-soluciones>
          <p>Profesionales capacitados con vocación de servicio</p>
        </div>

        <div className="team-grid">
          {teamPhotos.map((member) => (
            <div key={member.id} className="team-card">
              <div
                className="member-image"
                style={{ backgroundImage: `url(${member.image})` }}
              ></div>
              <div className="member-overlay">
                <h3>{member.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2-soluciones>¿Necesitas ayuda para elegir?</h2-soluciones>
          <p>Nuestros especialistas te guiarán para encontrar la mejor solución</p>
          <button className="cta-button">
            <Heart size={20} />
            <span>Contactar ahora</span>
          </button>
        </div>
      </section>

      {/* Modal */}
      {selectedSolution && (
        <div className="modal-overlay" onClick={() => setSelectedSolution(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setSelectedSolution(null)}
            >
              <X size={24} />
            </button>

            <div className="modal-image" style={{
              backgroundImage: `url(${solutions.find(s => s.id === selectedSolution)?.image})`
            }}></div>

            <div className="modal-details">
              <h3>{solutions.find(s => s.id === selectedSolution)?.title}</h3>
              <p>{solutions.find(s => s.id === selectedSolution)?.description}</p>

              <div className="modal-features">
                <h4>Beneficios:</h4>
                <ul>
                  {solutions.find(s => s.id === selectedSolution)?.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>

              <button className="modal-button">
                Solicitar información
              </button>
            </div>
          </div>
        </div>
      )}
       <Footer />
    </div>
  );
};

export default Soluciones;