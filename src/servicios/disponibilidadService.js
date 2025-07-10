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
    return response.data;
  } catch (error) {
    console.error(`Error al obtener disponibilidades para CV ${cvId}:`, error);
    throw new Error('No se pudieron cargar las disponibilidades');
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
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar disponibilidad con ID ${id}:`, error.response?.data || error);
    throw new Error(error.response?.data?.message || 'No se pudo actualizar la disponibilidad');
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