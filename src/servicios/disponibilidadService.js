import axios from 'axios';

const API_URL = 'http://localhost:8090/api/disponibilidades';

// Configuración global de axios para manejar errores
axios.interceptors.response.use(
  response => response,
  error => {
    console.error('Error en la respuesta:', error);
    return Promise.reject(error);
  }
);

export const getDisponibilidadesByCVId = async (cvId) => {
  try {
    const response = await axios.get(`${API_URL}/cv/${cvId}`);
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    throw new Error('Formato de respuesta inesperado');
  } catch (error) {
    console.error(`Error al obtener disponibilidades para CV ${cvId}:`, error);
    const errorMsg = error.response?.data?.message || 
                   error.message || 
                   'Error al cargar disponibilidades';
    throw new Error(errorMsg);
  }
};

export const createDisponibilidad = async (data) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data;
  } catch (error) {
    console.error('Error al crear disponibilidad:', error);
    throw new Error(error.response?.data?.message || 'No se pudo crear la disponibilidad');
  }
};

export const updateDisponibilidad = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data; // Ahora recibe un DTO consistente
  } catch (error) {
    console.error(`Error al actualizar disponibilidad con ID ${id}:`, error);
    const errorMsg = error.response?.data?.message || 
                   error.message || 
                   'Error al actualizar disponibilidad';
    throw new Error(errorMsg);
  }
};

export const deleteDisponibilidad = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error(`Error al eliminar disponibilidad con ID ${id}:`, error);
    throw new Error('No se pudo eliminar la disponibilidad');
  }
};