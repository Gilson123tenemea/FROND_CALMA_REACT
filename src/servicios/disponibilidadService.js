// src/servicios/disponibilidadService.js
import axios from "axios";

const API_URL = "http://localhost:8090/api/disponibilidades";

export const createDisponibilidad = (data) => {
  return axios.post(API_URL, data).then((res) => res.data);
};
