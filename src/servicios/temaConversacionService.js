import axios from 'axios';

const API_URL = 'http://localhost:8090/api/temas_conversacion';


export const getTemasConversacion = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener los temas de conversación: ' + error.message);
  }
};


export const getTemaById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener el tema: ' + error.message);
  }
};

// Crear un nuevo tema
export const crearTema = async (tema) => {
  try {
    const response = await axios.post(API_URL, tema);
    return response.data;
  } catch (error) {
    throw new Error('Error al crear el tema: ' + error.response?.data || error.message);
  }
};

// Actualizar un tema existente
export const actualizarTema = async (id, tema) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, tema);
    return response.data;
  } catch (error) {
    throw new Error('Error al actualizar el tema: ' + error.response?.data || error.message);
  }
};

// Eliminar un tema
export const eliminarTema = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al eliminar el tema: ' + error.response?.data || error.message);
  }
};
