import axios from 'axios';

const API_URL = 'http://localhost:8090/api/fichas';

export const getFichas = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const getFichaById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const createFicha = async (ficha) => {
    const response = await axios.post(API_URL, ficha);
    return response.data;
};

export const updateFicha = async (id, ficha) => {
    const response = await axios.put(`${API_URL}/${id}`, ficha);
    return response.data;
};

export const deleteFicha = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
};

// Métodos adicionales según necesidades específicas
export const getFichasByPacienteId = async (pacienteId) => {
    const response = await axios.get(`${API_URL}/paciente/${pacienteId}`);
    return response.data;
};