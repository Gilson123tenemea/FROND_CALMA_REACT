import axios from 'axios';

const API_URL = 'http://3.129.59.126:8090/api/cvs';

// Configuración global de axios para manejar errores
axios.interceptors.response.use(
  response => response,
  error => {
    console.error('Error en la respuesta:', error);
    return Promise.reject(error);
  }
);

export const getCVs = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error al obtener todos los CVs:', error);
    throw new Error('No se pudieron cargar los CVs');
  }
};

export const getCVById = async (id) => {
  try {
    console.log(`Obteniendo CV con ID: ${id}`); // Debug
    const response = await axios.get(`${API_URL}/${id}`);
    console.log('Respuesta del servidor:', response); // Debug
    return response.data;
  } catch (error) {
    console.error(`Error al obtener CV con ID ${id}:`, error);
    
    // Mensaje más detallado para el usuario
    let errorMessage = 'Error al cargar el CV';
    if (error.response) {
      if (error.response.status === 404) {
        errorMessage = 'El CV solicitado no existe';
      } else if (error.response.status === 500) {
        errorMessage = 'Error en el servidor al procesar tu solicitud';
      }
      console.error('Detalles del error:', error.response.data);
    }
    
    throw new Error(errorMessage);
  }
};

export const createCV = async (cvData) => {
  try {
    const response = await axios.post(API_URL, cvData);
    return response.data;
  } catch (error) {
    console.error('Error al crear CV:', error);
    throw new Error('No se pudo crear el CV');
  }
};

export const updateCV = async (id, cvData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, cvData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar CV con ID ${id}:`, error);
    throw new Error('No se pudo actualizar el CV');
  }
};

export const deleteCV = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error(`Error al eliminar CV con ID ${id}:`, error);
    throw new Error('No se pudo eliminar el CV');
  }
};

export const checkIfAspiranteHasCV = async (aspiranteId) => {
  try {
    const response = await axios.get(`${API_URL}/existe-por-aspirante/${aspiranteId}`);
    return response.data === true; // Asegurar que es booleano
  } catch (error) {
    console.error(`Error verificando CV para aspirante ${aspiranteId}:`, error);
    return false;
  }
};

export const getCVByAspiranteId = async (aspiranteId) => {
  try {
    const response = await axios.get(`${API_URL}/por-aspirante/${aspiranteId}`);
    
    // Verificar si la respuesta tiene datos válidos
    if (!response.data || !response.data.id_cv) {
      console.log(`No se encontró CV para el aspirante ${aspiranteId}`);
      return null;
    }
    
    // Validación explícita de pertenencia
    if (response.data.aspirante?.idAspirante?.toString() !== aspiranteId?.toString()) {
      console.error('El CV no pertenece al aspirante solicitado');
      return null;
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error al obtener CV para aspirante ${aspiranteId}:`, error);
    throw new Error('Error al verificar el CV');
  }
};