import axios from 'axios';

const API_URL = 'http://localhost:8090/api/disponibilidades';

export const getDisponibilidades = async () => {
  const response = await axios.get(`${API_URL}`); 
  return response.data;
};

export const getDisponibilidadById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createDisponibilidad = async (disponibilidad) => {
  const response = await axios.post(`${API_URL}`, disponibilidad);
  return response.data;
};

export const updateDisponibilidad = async (id, disponibilidad) => {
  const response = await axios.put(`${API_URL}/${id}`, disponibilidad);
  return response.data;
};

export const deleteDisponibilidad = async (id) => {
  await axios.delete(`${API_URL}/eliminar/${id}`);
};