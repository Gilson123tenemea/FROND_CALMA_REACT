import axios from 'axios';

const API_URL = 'http://localhost:8090/api/temas-conversacion';

export const getTemasConversacion = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener temas de conversación: ' + error.message);
  }
};

export const getTemaConversacionById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener tema de conversación: ' + error.message);
  }
};

export const getTemasConversacionByFicha = async (idFicha) => {
  try {
    const response = await axios.get(`${API_URL}/ficha/${idFicha}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener temas de conversación por ficha: ' + error.message);
  }
};

export const createTemaConversacion = async (tema) => {
  try {
    const response = await axios.post(API_URL, tema);
    return response.data;
  } catch (error) {
    throw new Error('Error al crear tema de conversación: ' + error.message);
  }
};

export const updateTemaConversacion = async (id, tema) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, tema);
    return response.data;
  } catch (error) {
    throw new Error('Error al actualizar tema de conversación: ' + error.message);
  }
};

export const deleteTemaConversacion = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    throw new Error('Error al eliminar tema de conversación: ' + error.message);
  }
};