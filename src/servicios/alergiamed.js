import axios from 'axios';

const API_URL = 'http://3.129.59.126:8090/api/alergias-medicamentos';

export const getAlergiasMedicamentos = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener alergias a medicamentos: ' + error.message);
  }
};

export const getAlergiaMedicamentoById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener alergia a medicamento: ' + error.message);
  }
};

export const getAlergiasMedicamentosByFicha = async (idFicha) => {
  try {
    const response = await axios.get(`${API_URL}/ficha/${idFicha}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener alergias a medicamentos por ficha: ' + error.message);
  }
};

export const createAlergiaMedicamento = async (alergia) => {
  try {
    const response = await axios.post(API_URL, alergia);
    return response.data;
  } catch (error) {
    throw new Error('Error al crear alergia a medicamento: ' + error.message);
  }
};

export const updateAlergiaMedicamento = async (id, alergia) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, alergia);
    return response.data;
  } catch (error) {
    throw new Error('Error al actualizar alergia a medicamento: ' + error.message);
  }
};

export const deleteAlergiaMedicamento = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    throw new Error('Error al eliminar alergia a medicamento: ' + error.message);
  }
};