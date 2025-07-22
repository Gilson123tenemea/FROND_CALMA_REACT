import axios from 'axios';

const API_URL = 'http://localhost:8090/api/fichas';

export const getFichas = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener fichas: ' + error.message);
  }
};

export const getFichaById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener ficha: ' + error.message);
  }
};

export const createFicha = async (ficha) => {
  try {
    const response = await axios.post(API_URL, ficha);
    return response.data;
  } catch (error) {
    throw new Error('Error al crear ficha: ' + error.message);
  }
};

export const updateFicha = async (id, ficha) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, ficha);
    return response.data;
  } catch (error) {
    console.error('Error detallado:', error.response?.data || error.message);
    throw new Error('Error al actualizar ficha: ' + (error.response?.data?.message || error.message));
  }
};


export const deleteFicha = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    throw new Error('Error al eliminar ficha: ' + error.message);
  }
};

export const getFichasByPaciente = async (idPaciente) => {
  try {
    const response = await axios.get(`${API_URL}/paciente/${idPaciente}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener fichas por paciente: ' + error.message);
  }
};
