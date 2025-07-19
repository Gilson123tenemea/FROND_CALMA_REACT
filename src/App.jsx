import React, { useState, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import "./App.css";
import { listaColores } from "./components/colores/Informacion";

function App({ nombrePropio, destinatarioProp, onCerrarChat }) {
  const [stompCliente, setStompCliente] = useState(null);
  const [conectado, setConectado] = useState(false);
  const [mensajes, setMensajes] = useState([]);
  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [destinatario, setDestinatario] = useState("");
  const [coloresUsuarios, setColoresUsuarios] = useState({});
  const [usuariosEscribiendo, setUsuariosEscribiendo] = useState({});

  const mensajesIds = useRef(new Set());
  const contenedorMensajesRef = useRef(null);

  // Función que detecta si el scroll está cerca del final para hacer autoscroll
  const estaCercaDelFinal = () => {
    const cont = contenedorMensajesRef.current;
    if (!cont) return false;
    const distanciaAlFinal = cont.scrollHeight - cont.scrollTop - cont.clientHeight;
    return distanciaAlFinal < 100; // margen 100px para autoscroll
  };

  // Al cambiar mensajes, hacer scroll solo si estaba cerca del final
  useEffect(() => {
    const cont = contenedorMensajesRef.current;
    if (!cont) return;
    if (estaCercaDelFinal()) {
      cont.scrollTo({ top: cont.scrollHeight, behavior: "smooth" });
    }
  }, [mensajes]);

  // Actualizar nombre y destinatario si cambian props
  useEffect(() => {
    if (nombrePropio) setNombre(String(nombrePropio));
    if (destinatarioProp) setDestinatario(String(destinatarioProp));
  }, [nombrePropio, destinatarioProp]);

  // Cargar historial de mensajes cuando nombre o destinatario cambian
  useEffect(() => {
    const cargarHistorial = async () => {
      if (nombre && destinatario) {
        try {
          const response = await axios.get("http://localhost:8090/api/usuarios/historial", {
            params: {
              aspiranteId: Number(nombre),
              contratistaId: Number(destinatario),
            },
          });

          const mensajesFiltrados = response.data.filter((msg) => {
            if (!mensajesIds.current.has(msg.id)) {
              mensajesIds.current.add(msg.id);
              return true;
            }
            return false;
          });

          setMensajes((prev) => [...prev, ...mensajesFiltrados]);
        } catch (error) {
          console.error("Error al cargar historial:", error);
        }
      }
    };

    cargarHistorial();
  }, [nombre, destinatario]);

  // Inicializar cliente STOMP y suscribirse a topics
  useEffect(() => {
    if (!nombre) return;

    const cliente = new Client({
      brokerURL: "ws://localhost:8090/ws",
    });

    cliente.onConnect = () => {
      setConectado(true);

      cliente.subscribe("/tema/mensajes", (mensaje) => {
        const nuevoMsg = JSON.parse(mensaje.body);

        // Mostrar solo mensajes donde soy aspirante o contratista
        if (
          String(nuevoMsg.aspiranteId) === String(nombre) ||
          String(nuevoMsg.contratistaId) === String(nombre)
        ) {
          if (!mensajesIds.current.has(nuevoMsg.id)) {
            mensajesIds.current.add(nuevoMsg.id);
            setMensajes((prev) => [...prev, nuevoMsg]);
          }
        }
      });

      cliente.subscribe(`/tema/escribiendo/${nombre}`, (mensaje) => {
        const { nombre: nombreEscribiendo } = JSON.parse(mensaje.body);
        if (nombreEscribiendo !== nombre) {
          setUsuariosEscribiendo((prev) => ({ ...prev, [nombreEscribiendo]: true }));
          setTimeout(() => {
            setUsuariosEscribiendo((prev) => {
              const copia = { ...prev };
              delete copia[nombreEscribiendo];
              return copia;
            });
          }, 3000);
        }
      });
    };

    cliente.onDisconnect = () => setConectado(false);
    cliente.activate();
    setStompCliente(cliente);

    return () => {
      if (cliente) cliente.deactivate();
      setConectado(false);
      setMensajes([]);
      mensajesIds.current.clear();
    };
  }, [nombre]);

  // Enviar mensaje
  const enviarMensaje = () => {
    if (stompCliente && conectado && nombre && mensaje && destinatario) {
      const color = getColorByName(nombre);
      stompCliente.publish({
        destination: "/app/envio",
        body: JSON.stringify({
          nombre,
          contenido: mensaje,
          color,
          aspiranteId: nombre,
          contratistaId: destinatario,
        }),
      });
      setMensaje("");
    } else {
      alert("No se puede enviar el mensaje. Verifica conexión e información.");
    }
  };

  // Notificar que está escribiendo
  const notificarEscribiendo = () => {
    if (stompCliente && conectado && nombre && destinatario) {
      stompCliente.publish({
        destination: "/app/escribiendo",
        body: JSON.stringify({
          nombre,
          aspiranteId: nombre,
          contratistaId: destinatario,
        }),
      });
    }
  };

  // Obtener color asignado a un usuario o generarlo
  const getColorByName = (nombre) => {
    if (coloresUsuarios[nombre]) return coloresUsuarios[nombre];
    const color = generateColorFromName(nombre);
    setColoresUsuarios((prev) => ({ ...prev, [nombre]: color }));
    return color;
  };

  // Generar color según hash del nombre
  const generateColorFromName = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % listaColores.length;
    return listaColores[index];
  };

  return (
    <main
      className="contenedor_mjs pt-5 d-flex justify-content-center"
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        className="border p-3 rounded-3 contenedor_msj_chat"
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Campos ocultos */}
        <article className="row mb-3" style={{ display: "none" }}>
          <section className="col-6">
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              id="textNombre"
              type="hidden"
            />
          </section>

          <section className="col-6">
            <input
              value={destinatario}
              onChange={(e) => setDestinatario(e.target.value)}
              id="textDestinatario"
              type="hidden"
            />
          </section>
        </article>

        {/* Área de mensajes con scroll */}
        <article
          ref={contenedorMensajesRef}
          className="contenedor_msj chat-content row border rounded-3 p-2"
          style={{
            flex: "1 1 auto",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <article className="col-12" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {mensajes.map((msg, i) => {
              const esPropio = msg.nombre === nombre;
              const fecha = msg.fechaEnvio
                ? new Date(msg.fechaEnvio).toLocaleString("es-EC", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "";

              return (
                <div key={i} className={`row w-100 m-0 ${esPropio ? "mensaje-container-propio" : "mensaje-container-otro"}`}>
                  <div
                    style={{
                      backgroundColor: msg.color,
                      color: esPropio ? "#fff" : "#000",
                      maxWidth: "60%",
                      padding: "10px 15px",
                      border: "1px solid #ccc",
                      borderRadius: esPropio
                        ? "15px 15px 0px 15px"
                        : "15px 15px 15px 0px",
                      textAlign: "left",
                      wordBreak: "break-word",
                      boxShadow: esPropio
                        ? "0 0 8px rgba(0,123,255,0.5)"
                        : "0 0 8px rgba(200,200,200,0.5)",
                    }}
                    className={esPropio ? "mensaje mensaje-propio" : "mensaje mensaje-otro"}
                  >
                    <div style={{ fontWeight: "bold", marginBottom: "4px" }}>{msg.nombre}</div>
                    <div>{msg.contenido}</div>
                    {fecha && (
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#555",
                          marginTop: "6px",
                          textAlign: "right",
                        }}
                      >
                        {fecha}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {Object.keys(usuariosEscribiendo).map((user, index) => (
              <div
                key={`writing-${index}`}
                style={{
                  fontStyle: "italic",
                  color: "#888",
                  fontSize: "14px",
                  paddingLeft: "10px",
                }}
              >
                {user} está escribiendo <span className="puntos">...</span>
              </div>
            ))}
          </article>
        </article>

        {/* Zona fija de escribir mensaje */}
        <div
          className="chat-footer"
          style={{
            flex: "0 0 auto",
            padding: "12px 16px",
            backgroundColor: "#fff",
            borderTop: "1px solid #e0e0e0",
            boxShadow: "0 -2px 5px rgba(0,0,0,0.05)",
            borderBottomLeftRadius: "20px",
            borderBottomRightRadius: "20px",
            display: "flex",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <input
            value={mensaje}
            onChange={(e) => {
              setMensaje(e.target.value);
              notificarEscribiendo();
            }}
            id="textMensaje"
            type="text"
            placeholder="Mensaje"
            style={{
              flex: 1,
              padding: "10px 16px",
              borderRadius: "24px",
              border: "1px solid #ccc",
              fontSize: "15px",
              outline: "none",
              backgroundColor: "#f1f3f5",
              transition: "all 0.2s ease",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") enviarMensaje();
            }}
          />

          <button
            onClick={enviarMensaje}
            style={{
              padding: "10px 18px",
              borderRadius: "24px",
              cursor: "pointer",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              fontWeight: "500",
              fontSize: "14px",
              transition: "background-color 0.3s ease, transform 0.1s ease",
            }}
          >
            Enviar
          </button>
        </div>
      </div>
    </main>
  );
}

export default App;
