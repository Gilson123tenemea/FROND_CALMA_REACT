import axios from 'axios';

const API_URL = 'http://3.129.59.126:8090/api/intereses';

export const getIntereses = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener intereses personales: ' + error.message);
  }
};

export const getInteresById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener interés personal: ' + error.message);
  }
};

export const getInteresesByFicha = async (idFicha) => {
  try {
    const response = await axios.get(`${API_URL}/ficha/${idFicha}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener intereses personales por ficha: ' + error.message);
  }
};

export const createInteres = async (interes) => {
  try {
    const response = await axios.post(API_URL, interes);
    return response.data;
  } catch (error) {
    throw new Error('Error al crear interés personal: ' + error.message);
  }
};

export const updateInteres = async (id, interes) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, interes);
    return response.data;
  } catch (error) {
    throw new Error('Error al actualizar interés personal: ' + error.message);
  }
};

export const deleteInteres = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    throw new Error('Error al eliminar interés personal: ' + error.message);
  }
};