import { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import "./App.css";
import { listaColores } from "./components/colores/Informacion";

function App() {
  const [stompCliente, setStompCliente] = useState(null);
  const [mensajes, setmensajes] = useState([]);
  const [nombre, setnombre] = useState("");
  const [mensaje, setmensaje] = useState("");
  const [destinatario, setDestinatario] = useState("");
  const [coloresUsuarios, setColoresUsuarios] = useState({});
  const [usuariosEscribiendo, setUsuariosEscribiendo] = useState({});
  const [ventanaLlamada, setVentanaLlamada] = useState(null);

  useEffect(() => {
    const cliente = new Client({
      brokerURL: "ws://localhost:8080/websocket",
    });

    cliente.onConnect = () => {
      cliente.subscribe("/tema/mensajes", (mensaje) => {
        const nuevoMsg = JSON.parse(mensaje.body);
        setmensajes((p) => [...p, nuevoMsg]);
      });

      if (nombre) {
        cliente.subscribe(`/tema/escribiendo/${nombre}`, (mensaje) => {
          const { nombre: nombreEscribiendo } = JSON.parse(mensaje.body);
          if (nombreEscribiendo !== nombre) {
            setUsuariosEscribiendo((prev) => ({
              ...prev,
              [nombreEscribiendo]: true,
            }));
            setTimeout(() => {
              setUsuariosEscribiendo((prev) => {
                const copia = { ...prev };
                delete copia[nombreEscribiendo];
                return copia;
              });
            }, 3000);
          }
        });
      }
    };

    cliente.activate();
    setStompCliente(cliente);

    return () => {
      if (cliente) cliente.deactivate();
    };
  }, [nombre]);

  const enviarMensaje = () => {
    if (stompCliente && nombre && mensaje && destinatario) {
      const color = getColorByName(nombre);
      stompCliente.publish({
        destination: "/app/envio",
        body: JSON.stringify({
          nombre: nombre,
          contenido: mensaje,
          color: color,
          aspiranteId: nombre,
          contratistaId: destinatario,
        }),
      });
      setmensaje("");
    }
  };

  const notificarEscribiendo = () => {
    if (stompCliente && nombre && destinatario) {
      stompCliente.publish({
        destination: "/app/escribiendo",
        body: JSON.stringify({
          nombre: nombre,
          aspiranteId: nombre,
          contratistaId: destinatario,
        }),
      });
    }
  };

  const getColorByName = (nombre) => {
    if (coloresUsuarios[nombre]) {
      return coloresUsuarios[nombre];
    }

    const color = generateColorFromName(nombre);
    setColoresUsuarios((prev) => ({
      ...prev,
      [nombre]: color,
    }));
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

  // SOLO AÑADIDO: función para abrir videollamada en nueva ventana
  const abrirVentanaLlamada = () => {
    if (!nombre || !destinatario) {
      alert("Debes ingresar tu nombre y el destinatario para iniciar la videollamada.");
      return;
    }

    const width = 600;
    const height = 500;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const ventana = window.open(
      `/videollamada.html?emisor=${encodeURIComponent(nombre)}&receptor=${encodeURIComponent(destinatario)}&soyElEmisor=true`,
      "Videollamada",
      `width=${width},height=${height},left=${left},top=${top},resizable=yes`
    );

    setVentanaLlamada(ventana);
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
        <article className="row mb-3">
          <section className="col-6">
            <section className="form-floating">
              <input
                value={nombre}
                onChange={(e) => setnombre(e.target.value)}
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

        <article
          className="contenedor_msj row border rounded-3 p-2"
          style={{ height: "50vh", overflowY: "auto" }}
        >
          <article className="col-12 d-flex flex-column gap-2">
            {mensajes.map((msg, i) => {
              const esPropio = msg.nombre === nombre;
              return (
                <div
                  key={i}
                  className="p-2 rounded-2"
                  style={{
                    backgroundColor: msg.color,
                    maxWidth: "70%",
                    alignSelf: esPropio ? "flex-end" : "flex-start",
                    textAlign: esPropio ? "right" : "left",
                    border: "1px solid #ccc",
                    borderRadius: "20px",
                    padding: "10px 15px",
                  }}
                >
                  <b>{msg.nombre}</b>
                  <br />
                  {msg.contenido}
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

        <article className="row mt-3 align-items-center">
          <section className="col-2">
            <input
              type="file"
              id="inputImagen"
              className="form-control"
              accept="image/*"
              title="Seleccionar imagen"
            />
          </section>

          <section className="col-6">
            <section className="form-floating">
              <input
                value={mensaje}
                onChange={(e) => {
                  setmensaje(e.target.value);
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

          <section className="col-2 d-grid">
            <button onClick={enviarMensaje} className="btn btn-success">
              Enviar
            </button>
          </section>

          <section className="col-2 d-grid">
            <button onClick={abrirVentanaLlamada} className="btn btn-primary">
              Entrevistar
            </button>
          </section>
        </article>
      </div>
    </main>
  );
}

export default App;
