// servicios/paciente.js
import axios from 'axios';

const API_URL = 'http://backend-alb-283290471.us-east-2.elb.amazonaws.com:8090/api/pacientes';

// Obtener todos los pacientes
export const getPacientes = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los pacientes:', error);
    throw error;
  }
};

// Obtener un paciente por ID
export const getPacienteById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el paciente con id ${id}:`, error);
    throw error;
  }
};

// Crear un nuevo paciente
export const createPaciente = async (paciente) => {
  try {
    const response = await axios.post(API_URL, paciente);
    return response.data;
  } catch (error) {
    console.error('Error al crear el paciente:', error);
    throw error;
  }
};

// Actualizar un paciente existente
export const updatePaciente = async (id, paciente) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, paciente);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el paciente con id ${id}:`, error);
    throw error;
  }
};

// Eliminar un paciente
export const deletePaciente = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar el paciente con id ${id}:`, error);
    throw error;
  }
};
