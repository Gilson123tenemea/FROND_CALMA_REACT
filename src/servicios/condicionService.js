import axios from 'axios';

const API_URL = 'http://localhost:8090/api/condicion';


// Obtener todas las condiciones
export const getCondiciones = async () => {
  try {
    const response = await axios.get('${API_URL}/listar');
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener las condiciones: ' + error.message);
  }
};

// Obtener condición por ID
export const getCondicionById = async (id) => {
  try {
    const response = await axios.get('${API_URL}/listar/${id}');
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener la condición: ' + error.message);
  }
};

// Crear nueva condición
export const crearCondicion = async (condicion) => {
  try {
    const response = await axios.post('${API_URL}/crear', condicion);
    return response.data;
  } catch (error) {
    throw new Error('Error al crear la condición: ' + error.response?.data || error.message);
  }
};

// Actualizar condición existente
export const actualizarCondicion = async (id, condicion) => {
  try {
    const response = await axios.put('${API_URL}/actualizar/${id}', condicion);
    return response.data;
  } catch (error) {
    throw new Error('Error al actualizar la condición: ' + error.response?.data || error.message);
  }
};

// Eliminar condición
export const eliminarCondicion = async (id) => {
  try {
    const response = await axios.delete('${API_URL}/eliminar/${id}');
    return response.data;
  } catch (error) {
    throw new Error('Error al eliminar la condición: ' + error.response?.data || error.message);
  }
};