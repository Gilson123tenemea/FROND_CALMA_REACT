// src/servicios/cvService.js
import axios from 'axios';

const API_URL = 'http://localhost:8090/api/cvs';

export const getCVs = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const getCVById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const createCV = async (cvData) => {
    const response = await axios.post(API_URL, cvData);
    return response.data;
};

export const updateCV = async (id, cvData) => {
    const response = await axios.put(`${API_URL}/${id}`, cvData);
    return response.data;
};

export const deleteCV = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
};