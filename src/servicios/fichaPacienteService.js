import axios from 'axios';

const API_URL = 'http://localhost:8090/api/fichas';


// Crear una ficha
export const crearFicha = async (ficha) => {
  try {
    const response = await axios.post(API_URL, ficha);
    return response.data;
  } catch (error) {
    throw new Error('Error al crear ficha: ' + (error.response?.data || error.message));
  }
};

// Obtener ficha por ID
export const obtenerFichaPorId = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener ficha: ' + error.message);
  }
};

// Obtener todas las fichas
export const obtenerTodasLasFichas = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener fichas: ' + error.message);
  }
};

// Actualizar ficha
export const actualizarFicha = async (id, ficha) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, ficha);
    return response.data;
  } catch (error) {
    throw new Error('Error al actualizar ficha: ' + (error.response?.data || error.message));
  }
};

// Eliminar ficha
export const eliminarFicha = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    throw new Error('Error al eliminar ficha: ' + (error.response?.data || error.message));
  }
};
