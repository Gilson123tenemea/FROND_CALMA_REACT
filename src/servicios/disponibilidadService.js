import axios from 'axios';

const API_URL = 'http://localhost:8090/api/disponibilidades';

// Configuración global de axios para manejar errores
axios.interceptors.response.use(
  response => response,
  error => {
    console.error('Error en la respuesta:', error);
    return Promise.reject(error);
  }
);

export const getDisponibilidadesByCVId = async (cvId) => {
  try {
    console.log(`Solicitando disponibilidades para CV: ${cvId}`);
    const response = await axios.get(`${API_URL}/cv/${cvId}`);
    
    console.log('Respuesta completa:', response);
    console.log('Status:', response.status);
    console.log('Data recibida:', response.data);
    console.log('Tipo de data:', typeof response.data);
    console.log('Es array:', Array.isArray(response.data));
    
    // Manejo más flexible de diferentes formatos de respuesta
    const data = response.data;
    
    // Caso 1: Respuesta es null o undefined (no hay datos)
    if (data === null || data === undefined) {
      console.log('No hay datos disponibles, devolviendo array vacío');
      return [];
    }
    
    // Caso 2: Respuesta es un array (formato esperado)
    if (Array.isArray(data)) {
      console.log(`Devolviendo ${data.length} disponibilidades`);
      return data;
    }
    
    // Caso 3: Respuesta es un objeto que contiene un array
    if (typeof data === 'object') {
      // Buscar propiedades comunes que podrían contener el array
      const possibleArrayKeys = ['disponibilidades', 'data', 'content', 'items', 'results'];
      
      for (const key of possibleArrayKeys) {
        if (data[key] && Array.isArray(data[key])) {
          console.log(`Encontrado array en propiedad '${key}' con ${data[key].length} elementos`);
          return data[key];
        }
      }
      
      // Si el objeto tiene propiedades de disponibilidad, convertirlo en array
      if (data.id_disponibilidad !== undefined) {
        console.log('Convirtiendo objeto único a array');
        return [data];
      }
    }
    
    // Caso 4: Respuesta es un string vacío o formato inesperado
    if (typeof data === 'string' && data.trim() === '') {
      console.log('Respuesta vacía, devolviendo array vacío');
      return [];
    }
    
    // Si llegamos aquí, logear para debugging y devolver array vacío en lugar de error
    console.warn('Formato de respuesta no reconocido, pero no es crítico:', data);
    console.warn('Devolviendo array vacío para continuar la ejecución');
    return [];
    
  } catch (error) {
    console.error(`Error al obtener disponibilidades para CV ${cvId}:`, error);
    
    // Si es un error 404 (no encontrado), devolver array vacío en lugar de error
    if (error.response?.status === 404) {
      console.log('CV no tiene disponibilidades registradas (404), devolviendo array vacío');
      return [];
    }
    
    // Para otros errores, mantener el comportamiento original
    const errorMsg = error.response?.data?.message || 
                   error.message || 
                   'Error al cargar disponibilidades';
    throw new Error(errorMsg);
  }
};

export const createDisponibilidad = async (data) => {
  try {
    console.log('Creando disponibilidad:', data);
    const response = await axios.post(API_URL, data);
    console.log('Disponibilidad creada exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al crear disponibilidad:', error);
    const errorMsg = error.response?.data?.message || 
                   error.message || 
                   'No se pudo crear la disponibilidad';
    throw new Error(errorMsg);
  }
};

export const updateDisponibilidad = async (id, data) => {
  try {
    console.log(`Actualizando disponibilidad ID ${id}:`, data);
    const response = await axios.put(`${API_URL}/${id}`, data);
    console.log('Disponibilidad actualizada exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar disponibilidad con ID ${id}:`, error);
    const errorMsg = error.response?.data?.message || 
                   error.message || 
                   'Error al actualizar disponibilidad';
    throw new Error(errorMsg);
  }
};

export const deleteDisponibilidad = async (id) => {
  try {
    console.log(`Eliminando disponibilidad ID: ${id}`);
    const response = await axios.delete(`${API_URL}/${id}`);
    console.log('Disponibilidad eliminada exitosamente');
    return response.data || { success: true };
  } catch (error) {
    console.error(`Error al eliminar disponibilidad con ID ${id}:`, error);
    const errorMsg = error.response?.data?.message || 
                   error.message || 
                   'No se pudo eliminar la disponibilidad';
    throw new Error(errorMsg);
  }
};