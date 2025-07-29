import axios from 'axios';

const API_URL = 'http://backend-alb-283290471.us-east-2.elb.amazonaws.com:8090/api/alergias';

export const getAlergias = async () => {
  const response = await axios.get(`${API_URL}/listar`);
  return response.data;
};

export const getAlergiaById = async (id) => {
  const response = await axios.get(`${API_URL}/listar/${id}`);
  return response.data;
};

export const createAlergia = async (alergia) => {
  const response = await axios.post(`${API_URL}/crear`, alergia);
  return response.data;
};

export const updateAlergia = async (id, alergia) => {
  const response = await axios.put(`${API_URL}/actualizar/${id}`, alergia);
  return response.data;
};

export const deleteAlergia = async (id) => {
  await axios.delete(`${API_URL}/eliminar/${id}`);
};
