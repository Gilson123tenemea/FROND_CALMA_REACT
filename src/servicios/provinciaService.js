import axios from 'axios';

const API_URL = 'http://3.133.11.0:8090/api/provincias';

export const getProvincias = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const getProvinciaById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data; 
};

export const createProvincia = async (provincia) => {
    const response = await axios.post(API_URL, provincia);
    return response.data; 
};

export const updateProvincia = async (id, provincia) => {
    const response = await axios.put(`${API_URL}/${id}`, provincia);
    return response.data; 
};

export const deleteProvincia = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
};