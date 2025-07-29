import axios from 'axios';

const API_URL = 'http://backend-alb-283290471.us-east-2.elb.amazonaws.com:8090/api/cantones';

export const getCantones = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const getCantonById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const createCanton = async (canton) => {
    const response = await axios.post(API_URL, canton);
    return response.data;
};

export const updateCanton = async (id, canton) => {
    const response = await axios.put(`${API_URL}/${id}`, canton);
    return response.data;
};

export const deleteCanton = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
};

export const getCantonesByProvinciaId = async (provinciaId) => {
    const response = await axios.get(`${API_URL}/provincia/${provinciaId}`);
    return response.data;
};