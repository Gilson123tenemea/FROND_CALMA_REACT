// src/components/colores/Informacion.js

export const listaColores = [
  "#FF6B6B", // Rojo coral
  "#4ECDC4", // Turquesa
  "#45B7D1", // Azul cielo
  "#96CEB4", // Verde menta
  "#FECA57", // Amarillo dorado
  "#FF9FF3", // Rosa
  "#54A0FF", // Azul brillante
  "#5F27CD", // Púrpura
  "#00D2D3", // Cian
  "#FF9F43", // Naranja
  "#10AC84", // Verde esmeralda
  "#EE5A24", // Naranja rojizo
  "#0ABDE3", // Azul agua
  "#FD79A8", // Rosa chicle
  "#FDCB6E", // Amarillo suave
  "#6C5CE7", // Lavanda
  "#A29BFE", // Púrpura claro
  "#74B9FF", // Azul suave
  "#00B894", // Verde agua
  "#E17055", // Salmón
  "#81ECEC", // Aguamarina
  "#FAB1A0", // Melocotón
  "#00CEC9", // Turquesa oscuro
  "#E84393", // Rosa fucsia
  "#FDCB6E", // Mostaza
  "#6C5CE7", // Índigo
  "#FD79A8", // Rosa brillante
  "#FDCB6E", // Oro pálido
  "#00B894", // Verde océano
  "#E17055"  // Terracota
];

export const coloresTema = {
  primario: "#667eea",
  secundario: "#764ba2", 
  exito: "#10ac84",
  peligro: "#ee5a24",
  advertencia: "#feca57",
  info: "#54a0ff",
  claro: "#f1f2f6",
  oscuro: "#2f3542"
};

export const gradientes = {
  azulPurpura: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  verdeAzul: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
  naranjaRosa: "linear-gradient(135deg, #fc4a1a 0%, #f7b733 100%)",
  purpuraRosa: "linear-gradient(135deg, #667eea 0%, #f093fb 100%)",
  azulVerde: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
};

// Función para obtener color aleatorio
export const obtenerColorAleatorio = () => {
  return listaColores[Math.floor(Math.random() * listaColores.length)];
};

// Función para generar color basado en string
export const generarColorDesdeTexto = (texto) => {
  let hash = 0;
  for (let i = 0; i < texto.length; i++) {
    hash = texto.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % listaColores.length;
  return listaColores[index];
};

// Función para determinar si un color es claro u oscuro
export const esColorClaro = (color) => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return brightness > 155;
};