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
    return response.data.map(cert => ({
      ...cert,
      // Asegurar que los archivos se manejen correctamente
      archivo: cert.tiene_archivo ? { name: 'certificado_adjunto.pdf' } : null
    }));
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
    
    // Guardar en localStorage para persistencia
    const certificadoData = {
      nombre_certificado: formData.get('nombre_certificado'),
      nombre_institucion: formData.get('nombre_institucion'),
      fecha: formData.get('fecha'),
      archivo: formData.get('archivo')?.name || null
    };
    
    localStorage.setItem(`current_certificado_form_${formData.get('cv.id_cv')}`, JSON.stringify(certificadoData));
    
    return response.data;
  } catch (error) {
    console.error('Error al crear certificado:', error);
    throw new Error('No se pudo crear el certificado');
  }
};

export const updateCertificado = async (id, certificadoData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, certificadoData);
    
    // Actualizar localStorage si es necesario
    if (certificadoData.cv?.id_cv) {
      localStorage.setItem(`current_certificado_form_${certificadoData.cv.id_cv}`, JSON.stringify(certificadoData));
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar certificado con ID ${id}:`, error);
    throw new Error('No se pudo actualizar el certificado');
  }
};

export const deleteCertificado = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    // No eliminamos de localStorage para mantener persistencia
  } catch (error) {
    console.error(`Error al eliminar certificado con ID ${id}:`, error);
    throw new Error('No se pudo eliminar el certificado');
  }
};

// Función para cargar el estado persistido
export const loadPersistedCertificadoForm = (cvId) => {
  const savedData = localStorage.getItem(`current_certificado_form_${cvId}`);
  return savedData ? JSON.parse(savedData) : null;
};