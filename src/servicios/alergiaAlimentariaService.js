import axios from 'axios';

const API_URL = 'http://localhost:8090/api/alergias_alimentarias';


export const getAlergias = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener las alergias alimentarias: ' + error.message);
  }
};

// Obtener una alergia alimentaria por ID
export const getAlergiaById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener la alergia: ' + error.message);
  }
};

// Crear una nueva alergia alimentaria
export const crearAlergia = async (alergia) => {
  try {
    const response = await axios.post(API_URL, alergia);
    return response.data;
  } catch (error) {
    throw new Error('Error al crear la alergia: ' + error.response?.data || error.message);
  }
};

// Actualizar una alergia alimentaria existente
export const actualizarAlergia = async (id, alergia) => {
  try {
    const response = await axios.put('${API_URL}/${id}', alergia);
    return response.data;
  } catch (error) {
    throw new Error('Error al actualizar la alergia: ' + error.response?.data || error.message);
  }
};


export const eliminarAlergia = async (id) => {
  try {
    const response = await axios.delete('${API_URL}/${id}');
    return response.data;
  } catch (error) {
    throw new Error('Error al eliminar la alergia: ' + error.response?.data || error.message);
  }
};

