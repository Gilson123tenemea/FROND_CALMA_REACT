import React, { useState, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";

function App({ nombrePropio = "1", destinatarioProp = "2", onCerrarChat }) {
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [conectado, setConectado] = useState(false);
  const [stompCliente, setStompCliente] = useState(null);
  
  // Referencias
  const mensajesIds = useRef(new Set());

  // Cargar historial al inicio
  useEffect(() => {
    const cargarHistorial = async () => {
      if (nombrePropio && destinatarioProp) {
        try {
          console.log("🔄 Cargando historial...");
          console.log("📋 Parámetros:", { nombrePropio, destinatarioProp });
          
          const response = await fetch(`http://localhost:8090/api/chat/historial?aspiranteId=${nombrePropio}&contratistaId=${destinatarioProp}`);
          
          if (response.ok) {
            const data = await response.json();
            console.log("✅ Historial cargado:", data);
            console.log("📊 Cantidad de mensajes recibidos:", data.length);
            
            // Debug: mostrar cada mensaje
            data.forEach((msg, index) => {
              console.log(`📝 Mensaje ${index + 1}:`, {
                id: msg.id,
                nombre: msg.nombre,
                contenido: msg.contenido,
                aspiranteId: msg.aspiranteId,
                contratistaId: msg.contratistaId
              });
            });
            
            // NO filtrar por IDs duplicados por ahora, mostrar todo
            setMensajes(data);
            
            // Agregar IDs al Set para evitar duplicados futuros
            data.forEach(msg => {
              if (msg.id) {
                mensajesIds.current.add(msg.id);
              }
            });
            
            console.log("📦 Mensajes establecidos en estado:", data.length);
            
          } else {
            console.log("⚠️ No se pudo cargar historial:", response.status);
          }
        } catch (error) {
          console.error("❌ Error al cargar historial:", error);
        }
      }
    };

    cargarHistorial();
  }, [nombrePropio, destinatarioProp]);

  // Debug: mostrar cuando cambia el estado de mensajes
  useEffect(() => {
    console.log("🔄 Estado de mensajes actualizado:", mensajes.length, "mensajes");
    console.log("📋 Mensajes actuales:", mensajes);
  }, [mensajes]);

  // Conectar WebSocket
  useEffect(() => {
    if (!nombrePropio) return;

    console.log("🔌 Conectando WebSocket...");
    
    const cliente = new Client({
      brokerURL: "ws://localhost:8090/ws",
      debug: function (str) {
        console.log("📡 WebSocket:", str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    cliente.onConnect = () => {
      console.log("✅ WebSocket conectado");
      setConectado(true);

      // Suscribirse a mensajes
      cliente.subscribe("/tema/mensajes", (mensaje) => {
        console.log("📩 Mensaje recibido:", mensaje.body);
        const nuevoMsg = JSON.parse(mensaje.body);
        
        console.log("🔍 Analizando mensaje:", {
          aspiranteId: nuevoMsg.aspiranteId,
          contratistaId: nuevoMsg.contratistaId,
          miId: nombrePropio,
          destinatarioId: destinatarioProp
        });
        
        // Mostrar mensaje si es de esta conversación
        const esDeEstaConversacion = 
          (String(nuevoMsg.aspiranteId) === String(nombrePropio) && String(nuevoMsg.contratistaId) === String(destinatarioProp)) ||
          (String(nuevoMsg.aspiranteId) === String(destinatarioProp) && String(nuevoMsg.contratistaId) === String(nombrePropio));
        
        console.log("📨 ¿Es de esta conversación?", esDeEstaConversacion);
        
        if (esDeEstaConversacion) {
          if (!mensajesIds.current.has(nuevoMsg.id)) {
            console.log("➕ Agregando nuevo mensaje");
            mensajesIds.current.add(nuevoMsg.id);
            setMensajes((prev) => {
              const nuevosMensajes = [...prev, nuevoMsg];
              console.log("📦 Nuevos mensajes totales:", nuevosMensajes.length);
              return nuevosMensajes;
            });
          } else {
            console.log("⚠️ Mensaje duplicado ignorado");
          }
        } else {
          console.log("❌ Mensaje ignorado - no es de esta conversación");
        }
      });
    };

    cliente.onDisconnect = () => {
      console.log("❌ WebSocket desconectado");
      setConectado(false);
    };

    cliente.onStompError = (frame) => {
      console.error("❌ Error STOMP:", frame);
      setConectado(false);
    };

    cliente.activate();
    setStompCliente(cliente);

    // Cleanup
    return () => {
      if (cliente) {
        console.log("🔌 Desconectando WebSocket...");
        cliente.deactivate();
      }
      setConectado(false);
      // NO limpiar mensajes al desconectar para debug
      mensajesIds.current.clear();
    };
  }, [nombrePropio]);

  // Enviar mensaje
  const enviarMensaje = () => {
    if (stompCliente && conectado && mensaje.trim() && nombrePropio && destinatarioProp) {
      console.log("📤 Enviando mensaje:", mensaje);
      console.log("📋 Datos del mensaje:", {
        nombre: nombrePropio,
        aspiranteId: nombrePropio,
        contratistaId: destinatarioProp
      });
      
      stompCliente.publish({
        destination: "/app/envio",
        body: JSON.stringify({
          nombre: nombrePropio,
          contenido: mensaje.trim(),
          color: "#1976d2",
          aspiranteId: nombrePropio,
          contratistaId: destinatarioProp,
          remitenteId: nombrePropio,
        }),
      });
      
      setMensaje("");
    } else {
      console.log("⚠️ No se puede enviar - WebSocket:", conectado, "Mensaje:", mensaje.trim());
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "";
    return new Date(fecha).toLocaleString("es-EC", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  console.log("🎨 Renderizando con", mensajes.length, "mensajes");

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999
    }}>
      <div style={{
        width: "450px",
        height: "600px",
        backgroundColor: "white",
        borderRadius: "15px",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        overflow: "hidden"
      }}>
        
        {/* Header */}
        <div style={{
          padding: "15px 20px",
          backgroundColor: "#1976d2",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "16px" }}>
              Chat con Usuario {destinatarioProp}
            </h3>
            <small style={{ opacity: 0.9, fontSize: "12px" }}>
              {conectado ? "🟢 Conectado" : "🔴 Desconectado"} | {mensajes.length} mensajes
            </small>
          </div>
          <button 
            onClick={onCerrarChat}
            style={{
              background: "none",
              border: "none",
              color: "white",
              fontSize: "20px",
              cursor: "pointer",
              padding: "0",
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            ×
          </button>
        </div>

        {/* Debug Info */}
        <div style={{
          padding: "10px",
          backgroundColor: "#f0f0f0",
          fontSize: "12px",
          borderBottom: "1px solid #ddd"
        }}>
          <strong>Debug:</strong> YoID={nombrePropio} | DestinatarioID={destinatarioProp} | Mensajes={mensajes.length}
        </div>

        {/* Área de mensajes */}
        <div style={{
          flex: 1,
          padding: "15px",
          overflowY: "auto",
          backgroundColor: "#f5f5f5",
          display: "flex",
          flexDirection: "column",
          gap: "10px"
        }}>
          {mensajes.length === 0 ? (
            <div style={{
              textAlign: "center",
              color: "#666",
              fontStyle: "italic",
              marginTop: "50px"
            }}>
              {conectado ? "No hay mensajes. ¡Envía el primero!" : "Conectando..."}
            </div>
          ) : (
            mensajes.map((msg, index) => {
              const esPropio = String(msg.nombre) === String(nombrePropio);
              const fecha = formatearFecha(msg.fechaEnvio);
              
              console.log(`🎨 Renderizando mensaje ${index + 1}:`, {
                id: msg.id,
                nombre: msg.nombre,
                contenido: msg.contenido,
                esPropio
              });
              
              return (
                <div 
                  key={msg.id || index}
                  style={{
                    display: "flex",
                    justifyContent: esPropio ? "flex-end" : "flex-start"
                  }}
                >
                  <div style={{
                    maxWidth: "75%",
                    padding: "12px 16px",
                    borderRadius: esPropio ? "18px 18px 5px 18px" : "18px 18px 18px 5px",
                    backgroundColor: esPropio ? "#1976d2" : "white",
                    color: esPropio ? "white" : "black",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    border: esPropio ? "none" : "1px solid #e0e0e0"
                  }}>
                    <div style={{ 
                      fontWeight: "bold", 
                      fontSize: "12px", 
                      marginBottom: "5px",
                      opacity: 0.8
                    }}>
                      {msg.nombre} {esPropio ? "(Tú)" : ""}
                    </div>
                    <div style={{ marginBottom: "5px" }}>
                      {msg.contenido}
                    </div>
                    {fecha && (
                      <div style={{ 
                        fontSize: "10px", 
                        opacity: 0.7,
                        textAlign: "right"
                      }}>
                        {fecha}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer de escritura */}
        <div style={{
          padding: "15px",
          backgroundColor: "white",
          borderTop: "1px solid #e0e0e0",
          display: "flex",
          gap: "10px",
          alignItems: "center"
        }}>
          <input
            type="text"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder={conectado ? "Escribe un mensaje..." : "Conectando..."}
            disabled={!conectado}
            style={{
              flex: 1,
              padding: "12px 16px",
              border: `2px solid ${conectado ? "#1976d2" : "#ccc"}`,
              borderRadius: "20px",
              outline: "none",
              fontSize: "14px",
              backgroundColor: conectado ? "white" : "#f5f5f5"
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                enviarMensaje();
              }
            }}
            maxLength={500}
          />
          
          <button
            onClick={enviarMensaje}
            disabled={!mensaje.trim() || !conectado}
            style={{
              padding: "12px 20px",
              backgroundColor: (mensaje.trim() && conectado) ? "#1976d2" : "#ccc",
              color: "white",
              border: "none",
              borderRadius: "20px",
              cursor: (mensaje.trim() && conectado) ? "pointer" : "not-allowed",
              fontSize: "14px",
              fontWeight: "500"
            }}
          >
            {conectado ? "Enviar" : "●●●"}
          </button>
        </div>

        {/* Contador */}
        <div style={{
          padding: "5px 15px",
          backgroundColor: "#f9f9f9",
          fontSize: "11px",
          color: "#666",
          textAlign: "right",
          borderTop: "1px solid #f0f0f0"
        }}>
          {mensaje.length}/500
        </div>
      </div>
    </div>
  );
}

export default App;