// src/servicios/habilidadesService.js
import axios from "axios";

const API_URL = "http://localhost:8090/api/habilidades";

export const createHabilidad = async (habilidadData) => {
  const response = await axios.post(API_URL, habilidadData);
  return response.data;
};
