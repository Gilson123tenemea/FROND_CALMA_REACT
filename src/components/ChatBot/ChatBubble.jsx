import React, { useState } from 'react';
import axios from 'axios';
import './ChatBubble.css';

const ChatBubble = () => {
  const [abierto, setAbierto] = useState(false);
  const [pregunta, setPregunta] = useState('');
  const [conversacion, setConversacion] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const toggleChat = () => {
    setAbierto(!abierto);
    if (!abierto && conversacion.length === 0) {
      // Mensaje bienvenida al abrir chat por primera vez
      setConversacion([
        {
          from: 'bot',
          type: 'welcome',
          text: `¡Bienvenida a Calma! Soy tu asistente virtual y estoy aquí para ayudarte.`,
        },
      ]);
    }
  };

  const enviarPregunta = async () => {
    if (!pregunta.trim()) return;

    setConversacion((prev) => [...prev, { from: 'user', text: pregunta }]);
    setPregunta('');
    setCargando(true);
    setError(null);

    try {
      if (
        pregunta.toLowerCase().includes('postular') ||
        pregunta.toLowerCase().includes('registrar')
      ) {
        setConversacion((prev) => [
          ...prev,
          {
            from: 'bot',
            text:
              'Para postularte a Calma, primero debes registrarte en nuestra plataforma. Puedes hacerlo desde aquí 👉 <a href="/registro" target="_blank" rel="noopener noreferrer">Ir al registro</a>',
          },
        ]);
      } else {
        const res = await axios.post('http://backend-alb-283290471.us-east-2.elb.amazonaws.com:8090/api/chatbot/preguntar', { pregunta });
        if (res.data && res.data.respuesta) {
          setConversacion((prev) => [...prev, { from: 'bot', text: res.data.respuesta }]);
        } else {
          setConversacion((prev) => [
            ...prev,
            { from: 'bot', text: '⚠️ No se pudo obtener una respuesta válida del chatbot.' },
          ]);
        }
      }
    } catch (e) {
      console.error(e);
      setError('Error al comunicarse con el chatbot.');
      setConversacion((prev) => [...prev, { from: 'bot', text: '⚠️ Hubo un error al obtener respuesta.' }]);
    } finally {
      setCargando(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    enviarPregunta();
  };

  // Animación "Escribiendo..."
  const TypingIndicator = () => (
    <div className="chat-message bot typing-indicator">
      🤖 Está escribiendo<span className="dots"><span>.</span><span>.</span><span>.</span></span>
    </div>
  );

  // Renderizado especial para mensajes de bot con ofertas
  const renderBotMessage = (text) => {
    if (text.includes('━━━━━━━━━━━━━━━━━━━━━━')) {
      const ofertas = text.split('━━━━━━━━━━━━━━━━━━━━━━').filter((o) => o.trim() !== '');
      return (
        <>
          <div className="bot-intro-bubble">🤖 Estas son algunas oportunidades activas hoy:</div>
          {ofertas.map((oferta, idx) => (
            <div
              key={idx}
              className="chat-message bot oferta-bubble"
              dangerouslySetInnerHTML={{ __html: oferta.trim().replace(/\n/g, '<br />') }}
            />
          ))}
        </>
      );
    }
    // Render con links en texto plano
    return (
      <span
        dangerouslySetInnerHTML={{
          __html: text.replace(
            /\[(.*?)\]\((.*?)\)/g,
            '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
          ),
        }}
      />
    );
  };

  return (
    <>
      <button className="chat-bubble" onClick={toggleChat} aria-label="Abrir chat">
        💬
      </button>

      {abierto && (
        <div className="chat-panel">
          <div className="chat-header">
            <h4>🤖 Asistente de Empleos</h4>
            <button className="close-btn" onClick={toggleChat} aria-label="Cerrar chat">
              ×
            </button>
          </div>

          <div className="chat-messages">
            {conversacion.length === 0 && (
              <p className="chat-placeholder">Haz una pregunta sobre empleos temporales.</p>
            )}

            {conversacion.map((msg, idx) => {
              if (msg.type === 'welcome') {
                return (
                  <div key={idx} className="chat-message bot">
                    <div className="chat-welcome">
                      <div className="chat-welcome-title">
                        <span>🤖</span> Bienvenida a Calma
                      </div>
                      <div>
                        Soy tu asistente virtual. Puedes preguntarme sobre:
                        <ul style={{ margin: '6px 0 0 18px' }}>
                          <li>Empleos disponibles</li>
                          <li>Cómo registrarte</li>
                          <li>Qué es Calma</li>
                          <li>Requisitos para postular</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              }

              return msg.from === 'user' ? (
                <div key={idx} className="chat-message user">
                  👤 {msg.text}
                </div>
              ) : (
                <div key={idx} className="bot-message-wrapper">{renderBotMessage(msg.text)}</div>
              );
            })}

            {cargando && <TypingIndicator />}
          </div>

          <form onSubmit={handleSubmit} className="chat-form">
            <input
              type="text"
              value={pregunta}
              onChange={(e) => setPregunta(e.target.value)}
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
