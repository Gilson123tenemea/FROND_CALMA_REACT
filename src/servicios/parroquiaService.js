import axios from 'axios';

const API_URL = 'http://backend-alb-283290471.us-east-2.elb.amazonaws.com:8090/api/parroquias';

export const getParroquias = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const getParroquiaById = async (id) => {
    const response = await axios.get(`${API_URL}/listar/${id}`);
    return response.data;
};

export const createParroquia = async (parroquia) => {
    const response = await axios.post(`${API_URL}/crear`, parroquia);
    return response.data;
};

export const updateParroquia = async (id, parroquia) => {
    const response = await axios.put(`${API_URL}/actualizar/${id}`, parroquia);
    return response.data;
};

export const deleteParroquia = async (id) => {
    await axios.delete(`${API_URL}/eliminar/${id}`);
};

export const getParroquiasByCantonId = async (cantonId) => {
    const response = await axios.get(`${API_URL}/canton/${cantonId}`);
    return response.data;
};