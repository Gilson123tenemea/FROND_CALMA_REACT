import React, { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import "./App.css";
import { listaColores } from "./components/colores/Informacion";

function App() {
  const [stompCliente, setStompCliente] = useState(null);
  const [conectado, setConectado] = useState(false);
  const [mensajes, setMensajes] = useState([]);
  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [destinatario, setDestinatario] = useState("");
  const [coloresUsuarios, setColoresUsuarios] = useState({});
  const [usuariosEscribiendo, setUsuariosEscribiendo] = useState({});

  useEffect(() => {
    if (!nombre) return;

    const cliente = new Client({
      brokerURL: "ws://localhost:8090/ws",
    });

    cliente.onConnect = () => {
      setConectado(true);
      cliente.subscribe("/tema/mensajes", (mensaje) => {
        const nuevoMsg = JSON.parse(mensaje.body);
        setMensajes((prev) => [...prev, nuevoMsg]);
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
    };
  }, [nombre]);

  const enviarMensaje = () => {
    if (stompCliente && conectado && nombre && mensaje && destinatario) {
      const color = getColorByName(nombre);
      stompCliente.publish({
        destination: "/app/envio",
        body: JSON.stringify({ nombre, contenido: mensaje, color, aspiranteId: nombre, contratistaId: destinatario }),
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
        body: JSON.stringify({ nombre, aspiranteId: nombre, contratistaId: destinatario }),
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
        style={{ width: "60%", minWidth: "400px", maxWidth: "800px", height: "70vh", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
      >
        <article className="row mb-3">
          <section className="col-6">
            <section className="form-floating">
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                id="textNombre"
                type="text"
                className="form-control"
                placeholder="Tu nombre"
              />
              <label htmlFor="textNombre">Tu nombre</label>
            </section>
          </section>

          <section className="col-6">
            <section className="form-floating">
              <input
                value={destinatario}
                onChange={(e) => setDestinatario(e.target.value)}
                id="textDestinatario"
                type="text"
                className="form-control"
                placeholder="Destinatario"
              />
              <label htmlFor="textDestinatario">Destinatario</label>
            </section>
          </section>
        </article>

        <article className="contenedor_msj row border rounded-3 p-2" style={{ height: "50vh", overflowY: "auto" }}>
          <article className="col-12 d-flex flex-column gap-2">
            {mensajes.map((msg, i) => {
              const esPropio = msg.nombre === nombre;
              const fecha = msg.fechaEnvio ? new Date(msg.fechaEnvio).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
              return (
                <div key={i} className="p-2 rounded-2" style={{ backgroundColor: msg.color, maxWidth: "70%", alignSelf: esPropio ? "flex-end" : "flex-start", textAlign: esPropio ? "right" : "left", border: "1px solid #ccc", borderRadius: "20px", padding: "10px 15px" }}>
                  <b>{msg.nombre}</b>
                  <br />
                  {msg.contenido}
                  {fecha && (
                    <div style={{ fontSize: "12px", color: "#555", marginTop: "4px" }}>{fecha}</div>
                  )}
                </div>
              );
            })}

            {Object.keys(usuariosEscribiendo).map((user, index) => (
              <div key={`writing-${index}`} style={{ fontStyle: "italic", color: "#888", fontSize: "14px", paddingLeft: "10px" }}>
                {user} está escribiendo <span className="puntos">...</span>
              </div>
            ))}
          </article>
        </article>

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
            <button
              onClick={enviarMensaje}
              className="btn btn-success"
            >
              Enviar
            </button>
          </section>
        </article>
      </div>
    </main>
  );
}

export default App;
