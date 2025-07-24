import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import axios from 'axios';

function App({
  nombrePropio = "1",
  destinatarioProp = "2",
  onCerrarChat,
  // 🆕 NUEVAS PROPS PARA MOSTRAR NOMBRES REALES
  nombreUsuarioActual = null,
  nombreDestinatario = null,
  datosDestinatario = null // Objeto completo con información del destinatario
}) {
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [conectado, setConectado] = useState(false);

  const mensajesIds = useRef(new Set());
  const mensajesEndRef = useRef(null);
  const stompRef = useRef(null);
  const isConnecting = useRef(false);

  // OPTIMIZACIÓN: Memoizar normalización de IDs
  const normalizarId = useCallback((id) => {
    if (id === null || id === undefined) return null;
    if (typeof id === 'number') return id;
    const parsed = parseInt(id, 10);
    return isNaN(parsed) ? id : parsed;
  }, []);

  const validarYNormalizarIds = useCallback((nombrePropio, destinatarioProp, contexto = '') => {
    console.log(`🔍 [${contexto}] VALIDACIÓN DE IDS`);
    console.log(`🔍 [${contexto}] Input - nombrePropio:`, nombrePropio, typeof nombrePropio);
    console.log(`🔍 [${contexto}] Input - destinatarioProp:`, destinatarioProp, typeof destinatarioProp);

    const usuarioActualId = normalizarId(nombrePropio);
    const destinatarioId = normalizarId(destinatarioProp);

    console.log(`🔍 [${contexto}] IDs normalizados - Usuario: ${usuarioActualId}, Destinatario: ${destinatarioId}`);

    // ✅ VALIDACIONES CRÍTICAS MEJORADAS
    if (usuarioActualId === null || destinatarioId === null) {
      return {
        valido: false,
        error: 'IDs no pueden ser nulos',
        usuarioActualId: null,
        destinatarioId: null
      };
    }

    if (isNaN(usuarioActualId) || isNaN(destinatarioId)) {
      return {
        valido: false,
        error: 'IDs deben ser números válidos',
        usuarioActualId,
        destinatarioId
      };
    }

    if (usuarioActualId <= 0 || destinatarioId <= 0) {
      return {
        valido: false,
        error: 'IDs deben ser positivos',
        usuarioActualId,
        destinatarioId
      };
    }

    if (usuarioActualId === destinatarioId) {
      return {
        valido: false,
        error: 'Usuario no puede chatear consigo mismo',
        usuarioActualId,
        destinatarioId
      };
    }

    return {
      valido: true,
      usuarioActualId: Number(usuarioActualId), // 🆕 Asegurar tipo número
      destinatarioId: Number(destinatarioId),  // 🆕 Asegurar tipo número
      error: null
    };
  }, [normalizarId]);


  // OPTIMIZACIÓN: Memoizar IDs normalizados
  const usuarioActual = useMemo(() => normalizarId(nombrePropio), [nombrePropio, normalizarId]);
  const destinatario = useMemo(() => normalizarId(destinatarioProp), [destinatarioProp, normalizarId]);

  // 🆕 MEMOIZAR NOMBRES PARA MOSTRAR
  const nombreMostrarUsuario = useMemo(() => {
    return nombreUsuarioActual || `Usuario ${usuarioActual}`;
  }, [nombreUsuarioActual, usuarioActual]);

  const nombreMostrarDestinatario = useMemo(() => {
    if (datosDestinatario) {
      return `${datosDestinatario.nombres} ${datosDestinatario.apellidos}`;
    }
    return nombreDestinatario || `Usuario ${destinatario}`;
  }, [datosDestinatario, nombreDestinatario, destinatario]);

  // 🆕 INFORMACIÓN ADICIONAL DEL TRABAJO (si existe)
  const infoTrabajo = useMemo(() => {
    if (datosDestinatario?.trabajoTitulo) {
      return `📋 ${datosDestinatario.trabajoTitulo}`;
    }
    return '';
  }, [datosDestinatario]);

  // OPTIMIZACIÓN: Memoizar canal de conversación
  const canalConversacion = useMemo(() => {
    if (!usuarioActual || !destinatario) return null;
    const menor = Math.min(usuarioActual, destinatario);
    const mayor = Math.max(usuarioActual, destinatario);
    return `/tema/conversacion/${menor}-${mayor}`;
  }, [usuarioActual, destinatario]);

  // OPTIMIZACIÓN: Memoizar debug info
  const debugInfo = useMemo(() =>
    `Chat: ${nombreMostrarUsuario} ↔ ${nombreMostrarDestinatario} | Mensajes: ${mensajes.length} | Conectado: ${conectado}`,
    [nombreMostrarUsuario, nombreMostrarDestinatario, mensajes.length, conectado]
  );

  console.log(`🔍 INIT: Usuario=${usuarioActual} (${nombreMostrarUsuario}), Destinatario=${destinatario} (${nombreMostrarDestinatario}), Canal=${canalConversacion}`);

  // 🆕 FUNCIÓN PARA ENVIAR NOTIFICACIÓN DE MENSAJE
  const enviarNotificacionMensaje = useCallback(async (remitenteId, destinatarioId, contenido) => {
    try {
      console.log('📤 [NOTIFICACION] ===================');
      console.log('📤 [NOTIFICACION] Remitente ID:', remitenteId, '(tipo:', typeof remitenteId, ')');
      console.log('📤 [NOTIFICACION] Destinatario ID:', destinatarioId, '(tipo:', typeof destinatarioId, ')');

      // ✅ VERIFICACIÓN MEJORADA DE TIPOS
      if (typeof remitenteId !== 'number' || typeof destinatarioId !== 'number') {
        throw new Error(`IDs deben ser números: remitente=${typeof remitenteId}, destinatario=${typeof destinatarioId}`);
      }

      // ✅ VALIDACIÓN DE ROLES (opcional, si tienes la información)
      if (datosDestinatario?.rol) {
        console.log('📤 [NOTIFICACION] Rol destinatario:', datosDestinatario.rol);
      }

      const payload = {
        remitenteId: remitenteId,
        destinatarioId: destinatarioId,
        contenido: contenido,
        // 🆕 Añadir tipo de notificación si es necesario
        tipo: "MENSAJE_DIRECTO"
      };

      console.log('📤 [NOTIFICACION] Payload final:', payload);

      const response = await axios.post(
        'http://localhost:8090/api/notificaciones/crear-notificacion-mensaje',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` // 🆕 Si usas autenticación
          },
          timeout: 10000
        }
      );

      // ✅ VERIFICACIÓN MEJORADA DE RESPUESTA
      if (response.status >= 200 && response.status < 300) {
        console.log('✅ [NOTIFICACION] Enviada exitosamente. Respuesta:', response.data);
        return true;
      } else {
        console.warn('⚠️ [NOTIFICACION] Respuesta inesperada:', {
          status: response.status,
          data: response.data
        });
        return false;
      }

    } catch (error) {
      console.error('❌ [NOTIFICACION] Error detallado:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        stack: error.stack // 🆕 Para debugging más detallado
      });

      if (process.env.NODE_ENV === 'development') {
        alert(`Error de notificación: ${error.message}`); // 🆕 Solo en desarrollo
      }
      return false;
    }
  }, [datosDestinatario?.rol]); // 🆕 Dependencia opcional

  // Cargar historial - OPTIMIZADO
  useEffect(() => {
    if (!usuarioActual || !destinatario) {
      console.log("❌ Faltan parámetros para cargar historial");
      return;
    }

    const cargarHistorial = async () => {
      try {
        console.log(`📥 Cargando historial: ${usuarioActual} ↔ ${destinatario}`);
        const response = await fetch(
          `http://localhost:8090/api/chat/historial?aspiranteId=${usuarioActual}&contratistaId=${destinatario}`
        );

        if (response.ok) {
          const data = await response.json();
          console.log("📥 Historial recibido:", data.length, "mensajes");

          // Limpiar y procesar mensajes
          mensajesIds.current.clear();
          const mensajesUnicos = data.filter(m => {
            if (!m.id) return false;
            if (mensajesIds.current.has(m.id)) return false;
            mensajesIds.current.add(m.id);
            return true;
          });

          setMensajes(mensajesUnicos);
        } else {
          console.warn("⚠️ Error historial:", response.status);
          setMensajes([]);
        }
      } catch (e) {
        console.error("❌ Error historial:", e);
        setMensajes([]);
      }
    };

    cargarHistorial();
  }, [usuarioActual, destinatario]);

  // Scroll automático - OPTIMIZADO
  useEffect(() => {
    if (mensajesEndRef.current && mensajes.length > 0) {
      const timeoutId = setTimeout(() => {
        mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [mensajes.length]);

  // Conexión WebSocket - OPTIMIZADA
  useEffect(() => {
    if (!usuarioActual || !destinatario || !canalConversacion || isConnecting.current) return;

    // Cleanup anterior
    if (stompRef.current) {
      console.log("♻️ Desconectando cliente anterior");
      stompRef.current.deactivate();
      stompRef.current = null;
    }

    isConnecting.current = true;
    console.log(`🔌 Conectando WebSocket: ${usuarioActual} ↔ ${destinatario}`);
    console.log(`🔗 Canal objetivo: ${canalConversacion}`);

    const cliente = new Client({
      brokerURL: "ws://localhost:8090/ws",
      debug: str => console.log("📡", str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompRef.current = cliente;

    cliente.onConnect = () => {
      console.log("✅ WebSocket Conectado");
      setConectado(true);
      isConnecting.current = false;

      // Suscribirse al canal de conversación
      console.log("🔔 Suscribiéndose a:", canalConversacion);
      cliente.subscribe(canalConversacion, (msg) => {
        try {
          const data = JSON.parse(msg.body);
          console.log("📨 Mensaje recibido:", data.contenido, "de usuario", data.remitenteId);

          if (data.id && data.contenido && !mensajesIds.current.has(data.id)) {
            mensajesIds.current.add(data.id);
            setMensajes(prev => [...prev, data]);
          }
        } catch (e) {
          console.error("❌ Error procesando mensaje:", e);
        }
      });

      // Notificaciones personales
      cliente.subscribe(`/tema/notificacion/${usuarioActual}`, (msg) => {
        try {
          const notificacion = JSON.parse(msg.body);
          console.log("🔔 Notificación personal recibida:", notificacion.tipo);
        } catch (e) {
          console.error("❌ Error notificación:", e);
        }
      });
    };

    cliente.onDisconnect = () => {
      console.log("❌ WebSocket Desconectado");
      setConectado(false);
      isConnecting.current = false;
    };

    cliente.onStompError = (frame) => {
      console.error("❌ STOMP error:", frame);
      setConectado(false);
      isConnecting.current = false;
    };

    cliente.activate();

    return () => {
      console.log("🧹 Cleanup WebSocket");
      isConnecting.current = false;
      if (cliente) {
        cliente.deactivate();
      }
      setConectado(false);
    };
  }, [usuarioActual, destinatario, canalConversacion]);

  const enviarMensaje = useCallback(async () => {
    const contenido = mensaje.trim();
    if (!stompRef.current?.connected || !contenido) {
      console.log("❌ No se puede enviar mensaje - Conexión o contenido inválido");
      return;
    }

    // 🔍 VALIDACIÓN EXHAUSTIVA
    const validacion = validarYNormalizarIds(nombrePropio, destinatarioProp, 'ENVIO_MENSAJE');
    if (!validacion.valido) {
      console.error(`❌ [ENVIO] Validación falló: ${validacion.error}`);
      alert(`Error de validación: ${validacion.error}`); // 🆕 Feedback al usuario
      return;
    }

    const { usuarioActualId, destinatarioId } = validacion;

    console.log("🔍 [ENVIO] ===================");
    console.log("🔍 [ENVIO] Usuario remitente:", usuarioActualId);
    console.log("🔍 [ENVIO] Usuario destinatario:", destinatarioId);
    console.log("🔍 [ENVIO] Contenido:", contenido.substring(0, 50));
    console.log("🔍 [ENVIO] Datos destinatario:", datosDestinatario); // 🆕 Log adicional
    console.log("🔍 [ENVIO] ===================");

    const mensajeData = {
      nombre: String(usuarioActualId),
      contenido,
      color: "#1976d2",
      aspiranteId: usuarioActualId,
      contratistaId: destinatarioId,
      remitenteId: usuarioActualId,
      fechaEnvio: new Date().toISOString(),
      // 🆕 Campos adicionales para tracking
      tipo: "MENSAJE_CHAT",
      sessionId: sessionStorage.getItem('sessionId') // Opcional
    };

    try {
      // 1. Enviar mensaje por WebSocket
      console.log("📤 [ENVIO] Enviando mensaje por WebSocket...");
      stompRef.current.publish({
        destination: "/app/envio",
        body: JSON.stringify(mensajeData),
        headers: {
          'content-type': 'application/json',
          'priority': 'high' // 🆕 Opcional
        }
      });

      // 2. Enviar notificación
      console.log("📤 [NOTIFICACION] Enviando notificación...");
      const notificacionEnviada = await enviarNotificacionMensaje(
        Number(usuarioActualId),
        Number(destinatarioId),
        contenido
      );

      if (notificacionEnviada) {
        setMensaje("");
        console.log("✅ [ENVIO] Mensaje y notificación enviados correctamente");
      } else {
        console.warn("⚠️ [ENVIO] Mensaje enviado pero notificación falló");
        // 🆕 Puedes decidir si quieres limpiar el mensaje igualmente
      }

    } catch (error) {
      console.error("❌ [ENVIO] Error completo:", {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });

      // 🆕 Feedback al usuario
      alert("Error al enviar el mensaje. Por favor intenta nuevamente.");
    }
  }, [mensaje, nombrePropio, destinatarioProp, validarYNormalizarIds, enviarNotificacionMensaje, datosDestinatario]);

  const formatearFecha = useCallback((fecha) => {
    if (!fecha) return "";
    try {
      return new Date(fecha).toLocaleString("es-EC", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      console.error("Error formateando fecha:", e);
      return "Fecha inválida";
    }
  }, []);

  // 🆕 FUNCIÓN PARA OBTENER NOMBRE DEL REMITENTE
  const obtenerNombreRemitente = useCallback((msg) => {
    const remitenteId = normalizarId(msg.remitenteId || msg.nombre);
    const esPropio = remitenteId === usuarioActual;

    if (esPropio) {
      return nombreMostrarUsuario;
    } else {
      return nombreMostrarDestinatario;
    }
  }, [usuarioActual, nombreMostrarUsuario, nombreMostrarDestinatario, normalizarId]);

  // Renderizado de mensajes optimizado
  const mensajesRenderizados = useMemo(() => {
    return mensajes.map((msg, index) => {
      const esPropio = normalizarId(msg.remitenteId || msg.nombre) === usuarioActual;
      const nombreRemitente = obtenerNombreRemitente(msg);

      return (
        <div
          key={`msg-${msg.id || index}`}
          style={{
            display: "flex",
            justifyContent: esPropio ? "flex-end" : "flex-start",
            marginBottom: "10px"
          }}
        >
          <div style={{
            maxWidth: "75%",
            padding: "12px 16px",
            borderRadius: esPropio ? "18px 18px 5px 18px" : "18px 18px 18px 5px",
            backgroundColor: esPropio ? "#1976d2" : "white",
            color: esPropio ? "white" : "black",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            border: esPropio ? "none" : "1px solid #e0e0e0",
            minHeight: "20px"
          }}>
            <div style={{
              fontWeight: "bold", fontSize: "12px", marginBottom: "5px", opacity: 0.8
            }}>
              {esPropio ? "Tú" : nombreRemitente}
            </div>
            <div style={{ wordBreak: "break-word" }}>
              {msg.contenido || "Sin contenido"}
            </div>
            <div style={{ fontSize: "10px", opacity: 0.7, textAlign: "right", marginTop: "5px" }}>
              {formatearFecha(msg.fechaEnvio)}
            </div>
          </div>
        </div>
      );
    });
  }, [mensajes, usuarioActual, formatearFecha, normalizarId, obtenerNombreRemitente]);

  // 🆕 VALIDACIÓN MEJORADA DE PARÁMETROS
  if (!usuarioActual || !destinatario) {
    return (
      <div style={{
        padding: "20px",
        textAlign: "center",
        backgroundColor: "#fff3cd",
        border: "1px solid #ffeaa7",
        borderRadius: "8px",
        margin: "20px"
      }}>
        <h3>❌ Error: Parámetros de usuario incorrectos</h3>
        <p><strong>nombrePropio:</strong> {String(nombrePropio)} (tipo: {typeof nombrePropio})</p>
        <p><strong>destinatarioProp:</strong> {String(destinatarioProp)} (tipo: {typeof destinatarioProp})</p>
        <p><strong>usuarioActual calculado:</strong> {String(usuarioActual)}</p>
        <p><strong>destinatario calculado:</strong> {String(destinatario)}</p>
        <button onClick={onCerrarChat} style={{
          marginTop: "10px",
          padding: "8px 16px",
          backgroundColor: "#dc3545",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}>
          Cerrar Chat
        </button>
      </div>
    );
  }

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center",
      alignItems: "center", zIndex: 9999
    }}>
      <div style={{
        width: "450px", height: "600px", backgroundColor: "white", borderRadius: "15px",
        display: "flex", flexDirection: "column", boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        overflow: "hidden"
      }}>

        {/* Header mejorado */}
        <div style={{
          padding: "15px 20px", backgroundColor: "#1976d2", color: "white", display: "flex",
          justifyContent: "space-between", alignItems: "center"
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "16px" }}>
              💬 Chat con {nombreMostrarDestinatario}
            </h3>
            <small style={{ fontSize: "11px" }}>
              <span style={{
                display: "inline-block", width: "8px", height: "8px", borderRadius: "50%",
                backgroundColor: conectado ? "#4caf50" : "#f44336", marginRight: "5px"
              }}></span>
              {conectado ? "En línea" : "Conectando..."} • {mensajes.length} mensajes
              {/* 🆕 MOSTRAR INFO DEL TRABAJO SI EXISTE */}
              {infoTrabajo && (
                <div style={{ fontSize: "10px", marginTop: "2px", opacity: 0.9 }}>
                  {infoTrabajo}
                </div>
              )}
            </small>
          </div>
          <button onClick={onCerrarChat} style={{
            background: "none", border: "none", color: "white", fontSize: "20px", cursor: "pointer",
            padding: "5px", borderRadius: "50%", width: "30px", height: "30px",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>×</button>
        </div>

        {/* Mensajes */}
        <div style={{
          flex: 1, padding: "15px", overflowY: "auto", backgroundColor: "#f5f5f5",
          display: "flex", flexDirection: "column", gap: "10px", minHeight: "400px"
        }}>
          {/* Debug info simplificado */}
          <div style={{
            fontSize: "12px", padding: "8px 12px", backgroundColor: "#e3f2fd",
            borderRadius: "8px", marginBottom: "10px", color: "#1565c0"
          }}>
            📊 {mensajes.length} mensajes | {conectado ? "🟢 Conectado" : "🔴 Desconectado"}
          </div>

          {mensajes.length === 0 ? (
            <div style={{
              textAlign: "center", color: "#666", fontStyle: "italic", marginTop: "50px",
              padding: "20px", backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e0e0e0"
            }}>
              {conectado ? `💭 Inicia la conversación con ${nombreMostrarDestinatario}` : "🔄 Conectando al chat..."}
            </div>
          ) : (
            mensajesRenderizados
          )}
          <div ref={mensajesEndRef} />
        </div>

        {/* Footer */}
        <div style={{
          padding: "15px", backgroundColor: "white", borderTop: "1px solid #e0e0e0",
          display: "flex", gap: "10px", alignItems: "center", minHeight: "70px"
        }}>
          <input
            type="text"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder={conectado ? `Escribe a ${nombreMostrarDestinatario}...` : "Conectando..."}
            disabled={!conectado}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                enviarMensaje();
              }
            }}
            maxLength={500}
            style={{
              flex: 1, padding: "12px 16px",
              border: `2px solid ${conectado ? "#1976d2" : "#ccc"}`,
              borderRadius: "20px", outline: "none", fontSize: "14px",
              backgroundColor: conectado ? "white" : "#f5f5f5",
              transition: "all 0.2s ease"
            }}
          />
          <button
            onClick={enviarMensaje}
            disabled={!mensaje.trim() || !conectado}
            style={{
              padding: "12px 20px",
              backgroundColor: mensaje.trim() && conectado ? "#1976d2" : "#ccc",
              color: "white", border: "none", borderRadius: "20px",
              cursor: mensaje.trim() && conectado ? "pointer" : "not-allowed",
              minWidth: "80px", fontWeight: "500",
              transition: "all 0.2s ease",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}
          >
            {conectado ? "📤 Enviar" : "🔄 ●●●"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;