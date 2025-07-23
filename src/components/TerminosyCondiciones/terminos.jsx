// TerminosyCondiciones/terminos.jsx
import React from 'react';
import styles from './terminos.module.css';

const TerminosModal = ({ isOpen, onClose, onSave }) => {
  if (!isOpen) return null;

  const handleGuardar = () => {
    onSave(true); // Aceptó los términos
  };

  const handleCancelar = () => {
    onSave(false); // No aceptó
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Términos y Condiciones</h2>
        <div className={styles.modalBody}>
          <ol>
            <li>Al registrarte, aceptas que los datos que proporciones sean usados para facilitar la conexión entre cuidadores y solicitantes de servicios.</li>
            <li>CALMA no se hace responsable por acuerdos o servicios que se establezcan entre cuidadores y familias fuera de la plataforma.</li>
            <li>Tus datos personales serán manejados con confidencialidad y no se compartirán sin tu consentimiento, salvo para el funcionamiento del servicio.</li>
            <li>Debes proporcionar información veraz y actualizar tus datos cuando sea necesario.</li>
            <li>Al aceptar estos términos, confirmas que entiendes y aceptas las condiciones para usar CALMA.</li>
          </ol>
        </div>
        <div className={styles.buttonGroup}>
          <button className={styles.saveButton} onClick={handleGuardar}>Aceptar</button>
          <button className={styles.closeButton} onClick={handleCancelar}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default TerminosModal;
