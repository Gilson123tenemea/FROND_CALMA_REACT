import axios from 'axios';

const API_URL = 'http://localhost:8090/api/enfermedades';


// Obtener todas las enfermedades anteriores
export const getEnfermedades = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener enfermedades anteriores: ' + error.message);
  }
};

// Obtener una enfermedad por ID
export const getEnfermedadById = async (id) => {
  try {
    const response = await axios.get('${API_URL}/${id}');
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener la enfermedad: ' + error.message);
  }
};

// Crear una nueva enfermedad
export const crearEnfermedad = async (enfermedad) => {
  try {
    const response = await axios.post(API_URL, enfermedad);
    return response.data;
  } catch (error) {
    throw new Error('Error al crear la enfermedad: ' + error.response?.data || error.message);
  }
};

// Actualizar una enfermedad existente
export const actualizarEnfermedad = async (id, enfermedad) => {
  try {
    const response = await axios.put('${API_URL}/${id}', enfermedad);
    return response.data;
  } catch (error) {
    throw new Error('Error al actualizar la enfermedad: ' + error.response?.data || error.message);
  }
};

// Eliminar una enfermedad
export const eliminarEnfermedad = async (id) => {
  try {
    const response = await axios.delete('${API_URL}/${id}');
    return response.data;
  } catch (error) {
    throw new Error('Error al eliminar la enfermedad: ' + error.response?.data || error.message);
  }
};