import axios from 'axios';

const API_URL = 'http://localhost:8090/api/certificados';

// Configuración global de axios para manejar errores
axios.interceptors.response.use(
  response => response,
  error => {
    console.error('Error en la respuesta:', error);
    return Promise.reject(error);
  }
);

export const getCertificadosByCVId = async (cvId) => {
  try {
    const response = await axios.get(`${API_URL}?cvId=${cvId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener certificados para CV ${cvId}:`, error);
    throw new Error('No se pudieron cargar los certificados');
  }
};

export const createCertificado = async (formData) => {
  try {
    const response = await axios.post(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear certificado:', error);
    throw new Error('No se pudo crear el certificado');
  }
};

export const updateCertificado = async (id, certificadoData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, certificadoData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar certificado con ID ${id}:`, error);
    throw new Error('No se pudo actualizar el certificado');
  }
};

export const deleteCertificado = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error(`Error al eliminar certificado con ID ${id}:`, error);
    throw new Error('No se pudo eliminar el certificado');
  }
};