
import axios from 'axios';

const API_URL = 'http://localhost:8090/api/lista_medicamentos';

export const getListaMedicamentos = async () => {
    try {
        const response = await axios.get(`${API_URL}/listarmed`);
        return response.data;
    } catch (error) {
        throw new Error('Error al obtener la lista de medicamentos: ' + error.message);
    }
};

export const getMedicamentoById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/listarmed/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Error al obtener el medicamento: ' + error.message);
    }
};

export const crearMedicamento = async (medicamento) => {
    try {
        const response = await axios.post(`${API_URL}/crearmed`, medicamento);
        return response.data;
    } catch (error) {
        throw new Error('Error al crear el medicamento: ' + error.response?.data || error.message);
    }
};

export const actualizarMedicamento = async (id, medicamento) => {
    try {
        const response = await axios.put(`${API_URL}/actualizarmed/${id}`, medicamento);
        return response.data;
    } catch (error) {
        throw new Error('Error al actualizar el medicamento: ' + error.response?.data || error.message);
    }
};

export const eliminarMedicamento = async (id) => {
    try {
        await axios.delete(`${API_URL}/eliminarmed/${id}`);
    } catch (error) {
        throw new Error('Error al eliminar el medicamento: ' + error.response?.data || error.message);
    }
};