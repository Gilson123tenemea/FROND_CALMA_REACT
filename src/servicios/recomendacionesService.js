import axios from "axios";

const API_URL = "http://localhost:8090/api/recomendaciones";

export const createRecomendacion = async (formData) => {
  const response = await axios.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};


