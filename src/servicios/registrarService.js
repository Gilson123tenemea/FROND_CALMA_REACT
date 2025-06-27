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
