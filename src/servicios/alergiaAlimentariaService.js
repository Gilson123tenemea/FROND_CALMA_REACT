import axios from 'axios';

const API_URL = 'http://3.129.59.126:8090/api/alergias-alimentarias';

export const getAlergiasAlimentarias = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener alergias alimentarias: ' + error.message);
  }
};

export const getAlergiaAlimentariaById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener alergia alimentaria: ' + error.message);
  }
};

export const getAlergiasAlimentariasByFicha = async (idFicha) => {
  try {
    const response = await axios.get(`${API_URL}/ficha/${idFicha}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener alergias alimentarias por ficha: ' + error.message);
  }
};

export const createAlergiaAlimentaria = async (alergia) => {
  try {
    const response = await axios.post(API_URL, alergia);
    return response.data;
  } catch (error) {
    throw new Error('Error al crear alergia alimentaria: ' + error.message);
  }
};

export const updateAlergiaAlimentaria = async (id, alergia) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, alergia);
    return response.data;
  } catch (error) {
    throw new Error('Error al actualizar alergia alimentaria: ' + error.message);
  }
};

export const deleteAlergiaAlimentaria = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    throw new Error('Error al eliminar alergia alimentaria: ' + error.message);
  }
};