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

  useEffect(() => {
    if (nombrePropio) setNombre(String(nombrePropio));
    if (destinatarioProp) setDestinatario(String(destinatarioProp));
  }, [nombrePropio, destinatarioProp]);

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

  useEffect(() => {
    if (!nombre) return;

    const cliente = new Client({
      brokerURL: "ws://localhost:8090/ws",
    });

    cliente.onConnect = () => {
      setConectado(true);

      cliente.subscribe("/tema/mensajes", (mensaje) => {
        const nuevoMsg = JSON.parse(mensaje.body);

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

  const getColorByName = (nombre) => {
    if (coloresUsuarios[nombre]) return coloresUsuarios[nombre];
    const color = generateColorFromName(nombre);
    setColoresUsuarios((prev) => ({ ...prev, [nombre]: color }));
    return color;
  };

  const generateColorFromName = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % listaColores.length;
    return listaColores[index];
  };

  return (
    <main className="contenedor_mjs pt-5 d-flex justify-content-center">
      <div
        className="border p-3 rounded-3 contenedor_msj_chat"
        style={{
          width: "60%",
          minWidth: "400px",
          maxWidth: "800px",
          height: "70vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
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

        {/* Mensajes */}
        <article
          className="contenedor_msj row border rounded-3 p-2"
          style={{ height: "50vh", overflowY: "auto" }}
        >
          <article className="col-12">
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
                <div key={i} className="row w-100 m-0">
                  <div
                    className={`col-12 d-flex ${
                      esPropio ? "justify-content-end" : "justify-content-start"
                    }`}
                  >
                    <div
                      style={{
                        backgroundColor: msg.color,
                        color: "#000",
                        maxWidth: "60%",
                        padding: "10px 15px",
                        border: "1px solid #ccc",
                        borderRadius: esPropio
                          ? "15px 15px 0px 15px"
                          : "15px 15px 15px 0px",
                        textAlign: "left",
                        wordBreak: "break-word",
                      }}
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

        {/* Entrada de mensaje */}
        <article className="row mt-3 align-items-center">
          <section className="col-8">
            <section className="form-floating">
              <input
                value={mensaje}
                onChange={(e) => {
                  setMensaje(e.target.value);
                  notificarEscribiendo();
                }}
                id="textMensaje"
                type="text"
                className="form-control"
                placeholder="Mensaje"
              />
              <label htmlFor="textMensaje">Mensaje</label>
            </section>
          </section>

          <section className="col-4 d-grid">
            <button onClick={enviarMensaje} className="btn btn-success">
              Enviar
            </button>
          </section>
        </article>
      </div>
    </main>
  );
}

export default App;
