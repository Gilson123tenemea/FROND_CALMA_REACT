// src/hooks/useFormPersistence.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useFormPersistence = (id, formState, setFormState, formType) => {
  const location = useLocation();

  // Función para normalizar las claves de almacenamiento
  const getStorageKeys = () => {
    const keys = [`form_${formType}_${id}`]; // Clave principal
    
    // Agregar variantes de ruta según el tipo de formulario
    if (formType === 'recomendaciones') {
      keys.push(`form_${formType}_/recomendaciones/${id}`);
      keys.push(`form_${formType}_/cv/${id}/recomendaciones`);
    }
    // Agregar más casos si es necesario para otros formularios
    
    return keys;
  };

  // Guardar al salir del componente
  useEffect(() => {
    const keys = getStorageKeys();
    return () => {
      keys.forEach(key => {
        localStorage.setItem(key, JSON.stringify(formState));
      });
    };
  }, [formState, id, formType]);

  // Cargar al entrar al componente
  useEffect(() => {
    const keys = getStorageKeys();
    for (const key of keys) {
      const savedState = localStorage.getItem(key);
      if (savedState) {
        setFormState(JSON.parse(savedState));
        break;
      }
    }
  }, [id, formType, setFormState]);
};