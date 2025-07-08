import axios from 'axios';

const API_URL = 'http://localhost:8090/api/recomendaciones';

// Configuración global de axios para manejar errores
axios.interceptors.response.use(
  response => response,
  error => {
    console.error('Error en la respuesta:', error);
    return Promise.reject(error);
  }
);

export const getRecomendacionesByCVId = async (cvId) => {
  try {
    const response = await axios.get(`${API_URL}?cvId=${cvId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener recomendaciones para CV ${cvId}:`, error);
    throw new Error('No se pudieron cargar las recomendaciones');
  }
};

export const createRecomendacion = async (formData) => {
  try {
    const response = await axios.post(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear recomendación:', error);
    throw new Error('No se pudo crear la recomendación');
  }
};

export const updateRecomendacion = async (id, formData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar recomendación con ID ${id}:`, error.response?.data || error);
    throw new Error(error.response?.data?.message || 'No se pudo actualizar la recomendación');
  }
};

export const deleteRecomendacion = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error(`Error al eliminar recomendación con ID ${id}:`, error);
    throw new Error('No se pudo eliminar la recomendación');
  }
};

export const downloadRecomendacionFile = async (id, fileName = null) => {
  try {
    const response = await axios.get(`${API_URL}/${id}/descargar`, {
      responseType: 'blob',
    });

    // Crear URL del blob
    const url = window.URL.createObjectURL(new Blob([response.data]));

    // Crear enlace y simular click
    const link = document.createElement('a');
    link.href = url;

    // Usar el nombre de archivo proporcionado o generar uno por defecto
    const filename = fileName || `recomendacion_${id}.pdf`;

    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();

    // Limpiar
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);

    return true;
  } catch (error) {
    console.error(`Error al descargar archivo de recomendación ${id}:`, error);
    throw new Error('No se pudo descargar el archivo');
  }
};