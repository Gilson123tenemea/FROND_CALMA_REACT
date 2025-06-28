import axios from 'axios';

export const registrarPaciente = async (payload) => {
  try {
    const response = await axios.post('http://localhost:8090/api/registro/paciente', payload);
    return response.data;  // devuelve lo que retorna el backend
  } catch (error) {
    console.error('Error al registrar paciente:', error);
    throw error; // lanzar error para que el componente lo capture
  }
};
export const registrarAspirante = async (payload) => {
  try {
    const dataToSend = {
      ...payload,
      aspiracionSalarial: payload.aspiracionSalarial !== undefined ? 
                          Number(payload.aspiracionSalarial) : null
    };
    const response = await axios.post('http://localhost:8090/api/registro/aspirante', payload);
    return response.data;  // devuelve lo que retorna el backend
  } catch (error) {
    console.error('Error al registrar aspirante:', error);
    throw error; // lanzar error para que el componente lo capture
  }
};
export const registrarContratante = async (payload) => {
  try {
    const response = await axios.post('http://localhost:8090/api/registro/contratante', payload);
    return response.data;
  } catch (error) {
    console.error('Error al registrar contratante:', error);
    throw error;
  }
};
