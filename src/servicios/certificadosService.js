  import axios from 'axios';

const API_URL = 'http://backend-alb-283290471.us-east-2.elb.amazonaws.com:8090/api/certificados';

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
      throw new Error(error.response?.data?.message || 'No se pudo crear el certificado');
    }
  };

  export const updateCertificado = async (id, formData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar certificado con ID ${id}:`, error.response?.data || error);
      throw new Error(error.response?.data?.message || 'No se pudo actualizar el certificado');
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

  export const downloadCertificadoFile = async (id, fileName = null) => {
    try {
      const response = await axios.get(`${API_URL}/${id}/descargar`, {
        responseType: 'blob',
        validateStatus: function (status) {
          // Aceptar tanto 200 como 404/500 para manejar errores mejor
          return status >= 200 && status < 300 || status === 404 || status === 500;
        }
      });

      // Verificar si la respuesta es un error
      if (response.status === 404) {
        throw new Error('El certificado no fue encontrado');
      }
      
      if (response.status === 500) {
        // Verificar si hay mensaje de error en el blob
        const errorText = await response.data.text();
        if (errorText) {
          try {
            const errorData = JSON.parse(errorText);
            throw new Error(errorData.message || 'Error en el servidor al descargar el certificado');
          } catch {
            throw new Error('Error en el servidor al procesar el certificado');
          }
        }
        throw new Error('Error interno del servidor');
      }

      // Verificar si el blob contiene datos
      if (response.data.size <= 0) {
        throw new Error('El certificado no tiene archivo adjunto');
      }

      // Crear URL del blob
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      
      // Usar el nombre de archivo proporcionado o uno por defecto
      link.setAttribute('download', fileName || `certificado_${id}.pdf`);
      document.body.appendChild(link);
      link.click();

      // Limpieza
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);

      return true;
    } catch (error) {
      console.error(`Error al descargar archivo de certificado ${id}:`, error);
      
      // Mensajes más específicos según el tipo de error
      let errorMessage = 'No se pudo descargar el archivo';
      if (error.message.includes('404')) {
        errorMessage = 'El certificado no fue encontrado';
      } else if (error.message.includes('500')) {
        errorMessage = 'Error en el servidor al procesar la solicitud';
      } else if (error.message.includes('adjunto')) {
        errorMessage = 'El certificado no tiene archivo adjunto';
      }
      
      throw new Error(errorMessage);
    }
  };