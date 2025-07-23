import React from 'react';
import styles from './Politicas.module.css';

const PoliticasDePrivacidad = () => {
  return (
    <div className={styles.privacidadpoliContainer}>
      <header className={styles.privacidadpoliHeader}>
        <div className={styles.privacidadpoliLogo}>CALMA</div>
        <h1 className={styles.privacidadpoliTitle}>Políticas de Privacidad</h1>
        <p className={styles.privacidadpoliSubtitle}>Última actualización: {new Date().toLocaleDateString()}</p>
      </header>

      <main className={styles.privacidadpoliContent}>
        <section className={styles.privacidadpoliSection}>
          <h2 className={styles.privacidadpoliSectionTitle}>1. Información que recopilamos</h2>
          <p className={styles.privacidadpoliText}>
            En CALMA recopilamos información personal que nos proporcionas al registrarte como cuidador o contratante, 
            incluyendo nombre, dirección de correo electrónico, información de contacto, datos profesionales (para cuidadores) 
            y detalles sobre necesidades de cuidado (para contratantes).
          </p>
        </section>

        <section className={styles.privacidadpoliSection}>
          <h2 className={styles.privacidadpoliSectionTitle}>2. Uso de la información</h2>
          <p className={styles.privacidadpoliText}>
            Utilizamos tu información para:
          </p>
          <ul className={styles.privacidadpoliList}>
            <li className={styles.privacidadpoliListItem}>Facilitar conexiones entre cuidadores y contratantes</li>
            <li className={styles.privacidadpoliListItem}>Mejorar nuestros servicios</li>
            <li className={styles.privacidadpoliListItem}>Comunicarnos contigo sobre tu cuenta o servicios</li>
            <li className={styles.privacidadpoliListItem}>Garantizar la seguridad de nuestra plataforma</li>
          </ul>
        </section>

        <section className={styles.privacidadpoliSection}>
          <h2 className={styles.privacidadpoliSectionTitle}>3. Compartir información</h2>
          <p className={styles.privacidadpoliText}>
            No vendemos ni alquilamos tu información personal a terceros. Compartimos información limitada:
          </p>
          <ul className={styles.privacidadpoliList}>
            <li className={styles.privacidadpoliListItem}>Entre cuidadores y contratantes para facilitar el servicio</li>
            <li className={styles.privacidadpoliListItem}>Con proveedores de servicios que nos ayudan a operar (con estrictos acuerdos de confidencialidad)</li>
            <li className={styles.privacidadpoliListItem}>Cuando es requerido por ley</li>
          </ul>
        </section>

        <section className={styles.privacidadpoliSection}>
          <h2 className={styles.privacidadpoliSectionTitle}>4. Seguridad de datos</h2>
          <p className={styles.privacidadpoliText}>
            Implementamos medidas de seguridad técnicas y organizativas para proteger tu información personal, 
            incluyendo cifrado de datos, controles de acceso y revisiones periódicas de seguridad.
          </p>
        </section>

        <section className={styles.privacidadpoliSection}>
          <h2 className={styles.privacidadpoliSectionTitle}>5. Tus derechos</h2>
          <p className={styles.privacidadpoliText}>
            Tienes derecho a:
          </p>
          <ul className={styles.privacidadpoliList}>
            <li className={styles.privacidadpoliListItem}>Acceder a tu información personal</li>
            <li className={styles.privacidadpoliListItem}>Corregir información inexacta</li>
            <li className={styles.privacidadpoliListItem}>Solicitar la eliminación de tus datos</li>
            <li className={styles.privacidadpoliListItem}>Oponerte al procesamiento de tus datos</li>
          </ul>
          <p className={styles.privacidadpoliText}>
            Para ejercer estos derechos, contáctanos en privacidad@calma.com.
          </p>
        </section>

        <section className={styles.privacidadpoliSection}>
          <h2 className={styles.privacidadpoliSectionTitle}>6. Cambios a esta política</h2>
          <p className={styles.privacidadpoliText}>
            Podemos actualizar esta política ocasionalmente. Te notificaremos sobre cambios significativos 
            y siempre publicaremos la versión más reciente en nuestro sitio web.
          </p>
        </section>

        <section className={styles.privacidadpoliSection}>
          <h2 className={styles.privacidadpoliSectionTitle}>7. Contacto</h2>
          <p className={styles.privacidadpoliText}>
            Si tienes preguntas sobre esta política, contáctanos en:
          </p>
          <p className={styles.privacidadpoliContact}>
            CALMA Servicios Geriátricos<br />
            Email: calmasoporte2025@gmail.com<br />
            Teléfono: +593 989784180<br />
          </p>
        </section>
      </main>

      <footer className={styles.privacidadpoliFooter}>
        <p className={styles.privacidadpoliFooterText}>
          © {new Date().getFullYear()} CALMA. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
};

export default PoliticasDePrivacidad;