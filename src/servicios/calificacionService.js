import axios from 'axios';

const API_URL = 'http://backend-alb-283290471.us-east-2.elb.amazonaws.com:8090/api/calificaciones';

// GET all
export const getCalificaciones = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

// GET by ID
export const getCalificacionById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

// POST (create)
export const createCalificacion = async (calificacion) => {
    const response = await axios.post(API_URL, calificacion);
    return response.data;
};

// PUT (update)
export const updateCalificacion = async (id, calificacion) => {
    const response = await axios.put(`${API_URL}/${id}`, calificacion);
    return response.data;
};

// DELETE
export const deleteCalificacion = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
};