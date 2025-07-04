import axios from 'axios';

const API_URL = 'http://localhost:8090/api/intereses';


// Obtener todos los intereses personales
export const getIntereses = async () => {
  try {
    const response = await axios.get(`${API_URL}/listar`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener intereses personales: ' + error.message);
  }
};

// Obtener un interés personal por ID
export const getInteresById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/listar/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener el interés personal: ' + error.message);
  }
};

// Crear nuevo interés personal
export const crearInteres = async (interes) => {
  try {
    const response = await axios.post(`${API_URL}/crear`, interes);
    return response.data;
  } catch (error) {
    throw new Error('Error al crear el interés personal: ' + error.response?.data || error.message);
  }
};

// Actualizar un interés personal existente
export const actualizarInteres = async (id, interes) => {
  try {
    const response = await axios.put(`${API_URL}/actualizar/${id}`, interes);
    return response.data;
  } catch (error) {
    throw new Error('Error al actualizar el interés personal: ' + error.response?.data || error.message);
  }
};

// Eliminar un interés personal
export const eliminarInteres = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/eliminar/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al eliminar el interés personal: ' + error.response?.data || error.message);
  }
};
