// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:8090/api/login';

export const login = async (username, password) => {
  try {
    const params = new URLSearchParams();
    params.append('correo', username);
    params.append('contrasena', password);

    const response = await axios.post(`${API_URL}/auth`, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data; // Aquí nos aseguramos de devolver la respuesta completa
  } catch (err) {
    // Verificamos si el error tiene respuesta y manejamos el mensaje específico
    if (err.response) {
      // Verificamos el estado y el mensaje del servidor
      const errorMessage = err.response.data.message || 'Error desconocido';
      if (err.response.status === 401) {
        throw new Error(errorMessage); // Lanza el error con el mensaje del servidor
      } else {
        throw new Error('Error al conectar con el servidor');
      }
    }

    // En caso de otros errores como problemas de red
    throw new Error('No se pudo conectar con el servidor');
  }
};
