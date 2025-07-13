import axios from 'axios';

const API_URL = 'http://localhost:8090/api/medicamentos';

export const getMedicamentos = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener medicamentos: ' + error.message);
  }
};

export const getMedicamentoById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener medicamento: ' + error.message);
  }
};

export const getMedicamentosByFicha = async (idFicha) => {
  try {
    const response = await axios.get(`${API_URL}/ficha/${idFicha}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener medicamentos por ficha: ' + error.message);
  }
};

export const createMedicamento = async (medicamento) => {
  try {
    const response = await axios.post(API_URL, medicamento);
    return response.data;
  } catch (error) {
    throw new Error('Error al crear medicamento: ' + error.message);
  }
};

export const updateMedicamento = async (id, medicamento) => {
  try {
    // Asegúrate de que el ID sea numérico
    const numericId = Number(id);
    if (isNaN(numericId)) {
      throw new Error('ID no válido');
    }
    
    const response = await axios.put(`${API_URL}/${numericId}`, medicamento);
    return response.data;
  } catch (error) {
    // Mejor manejo de errores
    const errorMsg = error.response?.data?.message || error.message;
    throw new Error(`Error al actualizar medicamento: ${errorMsg}`);
  }
};

export const deleteMedicamento = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    throw new Error('Error al eliminar medicamento: ' + error.message);
  }
};