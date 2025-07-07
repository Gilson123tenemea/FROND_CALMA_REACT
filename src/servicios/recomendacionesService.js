import axios from 'axios';

const API_URL = 'http://localhost:8090/api/recomendaciones';

// Configuración global de axios para manejar errores
axios.interceptors.response.use(
  response => response,
  error => {
    console.error('Error en la respuesta:', error);
    return Promise.reject(error);
  }
);

export const getRecomendacionesByCVId = async (cvId) => {
  try {
    const response = await axios.get(`${API_URL}?cvId=${cvId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener recomendaciones para CV ${cvId}:`, error);
    throw new Error('No se pudieron cargar las recomendaciones');
  }
};

export const createRecomendacion = async (formData) => {
  try {
    const response = await axios.post(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear recomendación:', error);
    throw new Error('No se pudo crear la recomendación');
  }
};

export const updateRecomendacion = async (id, recomendacionData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, recomendacionData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar recomendación con ID ${id}:`, error);
    throw new Error('No se pudo actualizar la recomendación');
  }
};

export const deleteRecomendacion = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error(`Error al eliminar recomendación con ID ${id}:`, error);
    throw new Error('No se pudo eliminar la recomendación');
  }
};