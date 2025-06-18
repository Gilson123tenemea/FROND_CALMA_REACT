let localStream;
let peerConnection;
let stompClient;
const servers = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
};

const urlParams = new URLSearchParams(window.location.search);
const emisor = urlParams.get("emisor");
const receptor = urlParams.get("receptor");
const soyElEmisor = urlParams.get("soyElEmisor") === "true";

// Elementos HTML
const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
const estado = document.getElementById("estado");

// Inicializa cámara
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then((stream) => {
    localVideo.srcObject = stream;
    localStream = stream;
    estado.textContent = "Cámara activa.";
    conectarWebSocket();
  })
  .catch((error) => {
    estado.textContent = "Error al acceder a la cámara.";
    console.error(error);
  });

// Conexión STOMP
function conectarWebSocket() {
  const socket = new SockJS("http://localhost:8080/ws");
  stompClient = Stomp.over(socket);

  stompClient.connect({}, () => {
    estado.textContent = "Conectado a STOMP.";

    stompClient.subscribe(`/usuario/${emisor}/respuestas`, (msg) => {
      const data = JSON.parse(msg.body);
      manejarSeñal(data);
    });

    if (soyElEmisor) iniciarLlamada();
  });
}

// Oferta de conexión
function iniciarLlamada() {
  peerConnection = new RTCPeerConnection(servers);

  // Agrega el stream local
  localStream.getTracks().forEach(track => {
    peerConnection.addTrack(track, localStream);
  });

  peerConnection.ontrack = (event) => {
    remoteVideo.srcObject = event.streams[0];
  };

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      enviarSeñal({
        tipo: "ice",
        candidato: event.candidate
      });
    }
  };

  peerConnection.createOffer()
    .then((oferta) => {
      return peerConnection.setLocalDescription(oferta);
    })
    .then(() => {
      enviarSeñal({
        tipo: "oferta",
        descripcion: peerConnection.localDescription
      });
    });
}

// Manejo de señales (oferta, respuesta, ICE)
function manejarSeñal(data) {
  if (!peerConnection) {
    peerConnection = new RTCPeerConnection(servers);

    peerConnection.ontrack = (event) => {
      remoteVideo.srcObject = event.streams[0];
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        enviarSeñal({
          tipo: "ice",
          candidato: event.candidate
        });
      }
    };

    localStream.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream);
    });
  }

  if (data.tipo === "oferta") {
    peerConnection.setRemoteDescription(new RTCSessionDescription(data.descripcion))
      .then(() => peerConnection.createAnswer())
      .then((respuesta) => {
        return peerConnection.setLocalDescription(respuesta);
      })
      .then(() => {
        enviarSeñal({
          tipo: "respuesta",
          descripcion: peerConnection.localDescription
        });
      });
  } else if (data.tipo === "respuesta") {
    peerConnection.setRemoteDescription(new RTCSessionDescription(data.descripcion));
  } else if (data.tipo === "ice" && data.candidato) {
    peerConnection.addIceCandidate(new RTCIceCandidate(data.candidato));
  }
}

// Enviar señal por STOMP
function enviarSeñal(mensaje) {
  stompClient.send(
    `/app/llamada/${receptor}`,
    {},
    JSON.stringify(mensaje)
  );
}

// Colgar
document.getElementById("colgarBtn").addEventListener("click", () => {
  if (peerConnection) peerConnection.close();
  localStream.getTracks().forEach(track => track.stop());
  window.close();
});
