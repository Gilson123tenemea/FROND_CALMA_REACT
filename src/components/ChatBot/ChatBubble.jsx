// src/components/chatbot/ChatBubble.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './ChatBubble.css';

const ChatBubble = () => {
  const [abierto, setAbierto] = useState(false);
  const [pregunta, setPregunta] = useState('');
  const [conversacion, setConversacion] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const toggleChat = () => setAbierto(!abierto);

  const enviarPregunta = async () => {
    if (!pregunta.trim()) return;

    setConversacion(prev => [...prev, { from: 'user', text: pregunta }]);
    setPregunta('');
    setCargando(true);
    setError(null);

    try {
      const res = await axios.post('http://localhost:8090/api/chatbot/preguntar', { pregunta });
      console.log("Respuesta completa del backend:", res.data);

      if (res.data && res.data.respuesta) {
        setConversacion(prev => [...prev, { from: 'bot', text: res.data.respuesta }]);
      } else {
        setConversacion(prev => [...prev, {
          from: 'bot',
          text: '⚠️ No se pudo obtener una respuesta válida del chatbot.',
        }]);
      }
    } catch (e) {
      setError('Error al comunicarse con el chatbot.');
      setConversacion(prev => [...prev, { from: 'bot', text: '⚠️ Hubo un error al obtener respuesta.' }]);
    } finally {
      setCargando(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    enviarPregunta();
  };

  return (
    <>
      {/* Burbuja flotante */}
      <button className="chat-bubble" onClick={toggleChat} aria-label="Abrir chat">
        💬
      </button>

      {/* Panel de chat */}
      {abierto && (
        <div className="chat-panel">
          <div className="chat-header">
            <h4>🤖 Asistente de Empleos</h4>
            <button className="close-btn" onClick={toggleChat} aria-label="Cerrar chat">×</button>
          </div>

          <div className="chat-messages">
            {conversacion.length === 0 && <p className="chat-placeholder">Haz una pregunta sobre empleos temporales.</p>}

            {conversacion.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.from}`}>
                {msg.from === 'user' ? '👤' : '🤖'} {msg.text}
              </div>
            ))}

            {cargando && <div className="chat-message bot">🤖 Escribiendo...</div>}
          </div>

          <form onSubmit={handleSubmit} className="chat-form">
            <input
              type="text"
              value={pregunta}
              onChange={e => setPregunta(e.target.value)}
              placeholder="Escribe tu pregunta..."
              disabled={cargando}
            />
            <button type="submit" disabled={cargando || !pregunta.trim()}>
              Enviar
            </button>
          </form>

          {error && <p className="chat-error">{error}</p>}
        </div>
      )}
    </>
  );
};

export default ChatBubble;
