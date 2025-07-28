import axios from 'axios';

const API_URL = 'http://3.129.59.126:8090/api/habilidades';

// Configuración global de axios
axios.interceptors.response.use(
  response => response,
  error => {
    console.error('Error en la respuesta:', error);
    return Promise.reject(error);
  }
);

export const getHabilidadesByCVId = async (cvId) => {
  try {
    const response = await axios.get(`${API_URL}?cvId=${cvId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener habilidades para CV ${cvId}:`, error);
    throw new Error('No se pudieron cargar las habilidades');
  }
};

export const createHabilidad = async (habilidadData) => {
  try {
    const response = await axios.post(API_URL, habilidadData);
    
    // Persistir datos del formulario
    localStorage.setItem(
      `current_habilidad_form_${habilidadData.cv.id_cv}`, 
      JSON.stringify({
        descripcion: habilidadData.descripcion,
        nivel: habilidadData.nivel
      })
    );
    
    return response.data;
  } catch (error) {
    console.error('Error al crear habilidad:', error);
    throw new Error('No se pudo crear la habilidad');
  }
};

export const updateHabilidad = async (id, habilidadData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, habilidadData);
    
    // Actualizar datos persistentes
    if (habilidadData.cv?.id_cv) {
      localStorage.setItem(
        `current_habilidad_form_${habilidadData.cv.id_cv}`,
        JSON.stringify({
          descripcion: habilidadData.descripcion,
          nivel: habilidadData.nivel
        })
      );
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar habilidad con ID ${id}:`, error);
    throw new Error('No se pudo actualizar la habilidad');
  }
};

export const deleteHabilidad = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    // No eliminamos de localStorage para mantener persistencia
  } catch (error) {
    console.error(`Error al eliminar habilidad con ID ${id}:`, error);
    throw new Error('No se pudo eliminar la habilidad');
  }
};

// Función para cargar el estado persistido
export const loadPersistedHabilidadForm = (cvId) => {
  const savedData = localStorage.getItem(`current_habilidad_form_${cvId}`);
  return savedData ? JSON.parse(savedData) : null;
};