import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useFormPersistence = (id, formState, setFormState, formType) => {
  const location = useLocation();

  // Función para obtener todas las posibles claves de almacenamiento
  const getStorageKeys = () => {
    const baseKeys = [
      `form_${formType}_${id}`,                   // Clave básica
      `current_${formType}_form_${id}`,           // Clave alternativa
      `form_${formType}_/cv/${id}/${formType}`    // Ruta estándar CV
    ];

    // Rutas específicas para cada tipo de formulario
    const routeKeys = {
      recomendaciones: [
        `form_${formType}_/recomendaciones/${id}`,
        `form_${formType}_/cv/${id}/recomendaciones`
      ],
      certificados: [
        `form_${formType}_/certificados/${id}`,
        `form_${formType}_/cv/${id}/certificados`,
        `form_${formType}_/cv/${id}/certificados` // Duplicado para mayor compatibilidad
      ],
      habilidades: [
        `form_${formType}_/habilidades/${id}`,
        `form_${formType}_/cv/${id}/habilidades`  // Nueva ruta consistente
      ]
    };

    return [...baseKeys, ...(routeKeys[formType] || [])];
  };

  // Efecto para guardar los datos al desmontar el componente
  useEffect(() => {
    const keys = getStorageKeys();
    
    return () => {
      keys.forEach(key => {
        try {
          // Excluimos archivos del guardado en localStorage
          const { archivo, ...dataToSave } = formState;
          
          // Solo guardamos si hay datos válidos
          if (Object.keys(dataToSave).length > 0) {
            localStorage.setItem(key, JSON.stringify(dataToSave));
          }
        } catch (error) {
          console.error(`Error al guardar en ${key}:`, error);
        }
      });
    };
  }, [formState, id, formType]);

  // Efecto para cargar los datos al montar el componente
  useEffect(() => {
    const keys = getStorageKeys();
    let loaded = false;

    for (const key of keys) {
      try {
        const savedState = localStorage.getItem(key);
        if (savedState && !loaded) {
          const parsedData = JSON.parse(savedState);
          
          // Validación básica de datos
          if (parsedData && typeof parsedData === 'object') {
            setFormState(prev => ({
              ...prev,
              ...parsedData
            }));
            loaded = true;
          }
        }
      } catch (error) {
        console.error(`Error al cargar de ${key}:`, error);
      }
    }
  }, [id, formType, setFormState]);

  // Efecto opcional para limpieza
  useEffect(() => {
    return () => {
      // Ejemplo: Limpiar solo las claves temporales
      // localStorage.removeItem(`current_${formType}_form_${id}`);
    };
  }, [id, formType]);
};