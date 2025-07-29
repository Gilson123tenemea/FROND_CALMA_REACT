import React, { useState, useEffect } from 'react';
import {
  FaUser, FaIdCard, FaPhone, FaVenusMars,
  FaCalendarAlt, FaLock, FaTint, FaHeartbeat
} from 'react-icons/fa';
import { registrarPaciente } from "../../../servicios/registrarService";
import { getProvincias } from '../../../servicios/provinciaService';
import { getCantonesByProvinciaId } from '../../../servicios/cantonService';
import { getParroquiasByCantonId } from "../../../servicios/parroquiaService";
import styles from './registropaciente.module.css';
import HeaderContratante from "../HeaderContratante/headerContratante";
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import TerminosModal from "../../TerminosyCondiciones/terminos";

const RegistroPaciente = () => {
  const generos = ['Masculino', 'Femenino'];
  const tiposSangre = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');
  const alergias = ["Ninguna", "Otra", "Penicilina", "Ibuprofeno", "Sulfas", "Naproxeno", "Diclofenaco", "Soya", "Gluten", "Caspa de perro", "Caspa de gato", "Rinitis", "Dermatitis", "Urticaria", "Eczema", "Anafilaxia", "Conjuntivitis", "Angioedema", "Hipersensibilidad", "Atopia", "Vasculitis"];
  const [cedulasRegistradas, setCedulasRegistradas] = useState(new Set());

  const [provincias, setProvincias] = useState([]);
  const [cantones, setCantones] = useState([]);
  const [parroquias, setParroquias] = useState([]);
  const navigate = useNavigate();

  const [datosCargados, setDatosCargados] = useState(false);
  const rawIdPaciente = searchParams.get("idPaciente");
  const idPaciente = (rawIdPaciente && rawIdPaciente !== "undefined" && rawIdPaciente !== "null") ? rawIdPaciente : null;


  const [terminosAceptados, setTerminosAceptados] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const abrirModal = () => setModalAbierto(true);
  const cerrarModal = () => setModalAbierto(false);

  const [ubicacion, setUbicacion] = useState({
    provincia: '',
    canton: '',
    parroquia: ''
  });


  const [alergiasSeleccionadas, setAlergiasSeleccionadas] = useState([]);
  const [alergiaPersonalizada, setAlergiaPersonalizada] = useState('');

  const [alergiaSeleccionada, setAlergiaSeleccionada] = useState("");
  //Validaciones

  const validarCedulaEcuatoriana = (cedula) => {
    if (!/^\d{10}$/.test(cedula)) return false;

    const provincia = parseInt(cedula.substring(0, 2), 10);
    if (provincia < 1 || provincia > 24) return false;

    const digitos = cedula.split('').map(Number);
    const verificador = digitos.pop();

    let suma = 0;
    for (let i = 0; i < digitos.length; i++) {
      let valor = digitos[i];
      if (i % 2 === 0) {
        valor *= 2;
        if (valor > 9) valor -= 9;
      }
      suma += valor;
    }

    const decena = Math.ceil(suma / 10) * 10;
    const resultado = decena - suma;
    return resultado === verificador || (resultado === 10 && verificador === 0);
  };

  const validarTextoSinNumeros = (texto) => {
    return /^[A-Za-zÁÉÍÓÚáéíóúÑñüÜ\s]+$/.test(texto.trim());
  };


  //Estado errores mensaje

  const [errores, setErrores] = useState({
    cedula: '',
    nombres: '',
    apellidos: '',
    genero: '',
    direccion: '',
    fechaNacimiento: '',
    provincia: '',
    canton: '',
    parroquia: '',
    alergia: '',
    tipoSangre: '',
    contactoEmergencia: '',
    parentesco: '',
    foto: '',
  });



  const [formulario, setFormulario] = useState({
    nombres: '',
    apellidos: '',
    cedula: '',
    genero: '',
    direccion: '',
    fechaNacimiento: '',
    contactoEmergencia: '',
    parentesco: '',
    parroquia: '',
    tipoSangre: '',
    alergia: '',
    contrasena: '',
    confirmarContrasena: '',
    foto: ''
  });

  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    cedula: '',
    direccion: '',
    genero: '',
    fechaNacimiento: '',
    tipoSangre: '',
    alergia: '',
    contactoEmergencia: '',
    parentesco: '',
    idProvincia: '',
    idCanton: '',
    idParroquia: '',
    foto: ''
  });

  console.log("idPaciente:", idPaciente);
  useEffect(() => {
    if (idPaciente) {
      axios.get(`http://3.133.11.0:8090/api/registro/paciente/detalle/${idPaciente}`)
        .then(async (res) => {
          console.log("Respuesta API:", res.data);
          if (res.data.success) {
            const p = res.data.paciente;

            // Asignar formulario con imagen correctamente cargada
            setFormulario({
              nombres: p.nombres || '',
              apellidos: p.apellidos || '',
              cedula: p.cedula || '',
              direccion: p.direccion || '',
              genero: p.genero || '',
              fechaNacimiento: p.fechaNacimiento?.split("T")[0] || '',
              tipoSangre: p.tipoSangre || '',
              alergia: p.alergia || '',
              contactoEmergencia: p.contactoEmergencia || '',
              parentesco: p.parentesco || '',
              parroquia: p.idParroquia || '',
              contrasena: '',
              confirmarContrasena: '',
              foto: p.foto ? `http://3.133.11.0:8090/api/registro/${p.foto}` : ''
            });

            console.log("Contenido de p.foto:", p.foto);

            // Carga directa de cantones y parroquias sin depender de setUbicacion
            const provinciaId = p.idProvincia;
            const cantonId = p.idCanton;
            const parroquiaId = p.idParroquia;

            try {
              const cantonesData = await getCantonesByProvinciaId(provinciaId);
              const parroquiasData = await getParroquiasByCantonId(cantonId);

              setCantones(cantonesData);
              setParroquias(parroquiasData);

              // Set ubicación al final
              setUbicacion({
                provincia: provinciaId,
                canton: cantonId,
                parroquia: parroquiaId
              });
              setDatosCargados(true);
            } catch (err) {
              console.error("Error cargando cantones o parroquias:", err);
            }

            if (p.alergia) {
              const alergiasArray = p.alergia.split(',').map(a => a.trim());
              setAlergiasSeleccionadas(alergiasArray);
            }
          }
        })
        .catch(error => {
          console.error("Error al cargar datos del paciente:", error);
        });
    }
  }, [idPaciente]);

  const handleAbrirModal = () => {
    setModalAbierto(true);
  };

  const handleGuardarTerminos = (aceptado) => {
    setTerminosAceptados(aceptado);
    setModalAbierto(false);
  };



  useEffect(() => {
    const cargarCedulasRegistradas = async () => {
      try {
        const res = await axios.get('http://3.133.11.0:8090/api/registro/paciente/cedulas');
        setCedulasRegistradas(new Set(res.data.cedulas));
      } catch (error) {
        console.error("Error al obtener cédulas registradas:", error);
      }
    };
    cargarCedulasRegistradas();
  }, []);


  useEffect(() => {
    const cargarProvincias = async () => {
      try {
        const data = await getProvincias();
        setProvincias(data);
      } catch (error) {
        console.error('Error al obtener provincias:', error);
      }
    };
    cargarProvincias();
  }, []);

  useEffect(() => {
    const cargarCantones = async () => {
      if (ubicacion.provincia && !datosCargados) {
        try {
          const data = await getCantonesByProvinciaId(ubicacion.provincia);
          setCantones(data);
          setParroquias([]);
          setUbicacion((prev) => ({ ...prev, canton: '', parroquia: '' }));
        } catch (error) {
          console.error('Error al obtener cantones:', error);
        }
      }
    };
    cargarCantones();
  }, [ubicacion.provincia, datosCargados]);

  useEffect(() => {
    const cargarParroquias = async () => {
      if (ubicacion.canton && !datosCargados) {
        try {
          const data = await getParroquiasByCantonId(ubicacion.canton);
          setParroquias(data);
          setUbicacion((prev) => ({ ...prev, parroquia: '' }));
        } catch (error) {
          console.error('Error al obtener parroquias:', error);
        }
      }
    };
    cargarParroquias();
  }, [ubicacion.canton, datosCargados]);

  useEffect(() => {
    if (!idPaciente) {
      setFormulario({
        nombres: '',
        apellidos: '',
        cedula: '',
        genero: '',
        direccion: '',
        fechaNacimiento: '',
        contactoEmergencia: '',
        parentesco: '',
        parroquia: '',
        tipoSangre: '',
        alergia: '',
        contrasena: '',
        confirmarContrasena: '',
        foto: ''
      });
      setUbicacion({ provincia: '', canton: '', parroquia: '' });
      setAlergiasSeleccionadas([]);
      setAlergiaPersonalizada('');
      setAlergiaSeleccionada('');
      setErrores({});
      setDatosCargados(false);
      setCantones([]);
      setParroquias([]);
    }
  }, [idPaciente]);


  const handleActualizar = () => {
    axios.put(`http://3.133.11.0:8090/api/registro/paciente/${idPaciente}`, formData)
      .then(res => {
        if (res.data.success) {
          alert("Paciente actualizado correctamente");
          // Redirige o muestra un mensaje
        }
      })
      .catch(error => {
        console.error("Error al actualizar paciente:", error);
      });
  };


  const handleUbicacionChange = (e) => {
    const { name, value } = e.target;
    setUbicacion({ ...ubicacion, [name]: value });
  };

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormulario({ ...formulario, foto: reader.result });  // base64
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let nuevosErrores = {};
    let valid = true;

    // Cédula
    if (!formulario.cedula) {
      nuevosErrores.cedula = 'Ingrese la cédula';
      valid = false;
    } else if (!validarCedulaEcuatoriana(formulario.cedula)) {
      nuevosErrores.cedula = 'Cédula incorrecta';
      valid = false;
    } else if (!idPaciente && cedulasRegistradas.has(formulario.cedula)) {
      nuevosErrores.cedula = 'Cédula ya ingresada';
      valid = false;
    }

    // Nombres
    if (!formulario.nombres || !validarTextoSinNumeros(formulario.nombres)) {
      nuevosErrores.nombres = 'Ingrese los nombres correctamente';
      valid = false;
    }

    // Apellidos
    if (!formulario.apellidos || !validarTextoSinNumeros(formulario.apellidos)) {
      nuevosErrores.apellidos = 'Ingrese los apellidos correctamente';
      valid = false;
    }

    // Género
    if (!formulario.genero) {
      nuevosErrores.genero = 'Seleccione un género';
      valid = false;
    }

    // Dirección
    if (!formulario.direccion) {
      nuevosErrores.direccion = 'Ingrese la dirección correctamente';
      valid = false;
    }

    // Fecha de nacimiento
    if (!formulario.fechaNacimiento) {
      nuevosErrores.fechaNacimiento = 'Seleccione una fecha';
      valid = false;
    } else {
      const hoy = new Date();
      const fechaNac = new Date(formulario.fechaNacimiento);
      const edad = hoy.getFullYear() - fechaNac.getFullYear();
      const mes = hoy.getMonth() - fechaNac.getMonth();
      const dia = hoy.getDate() - fechaNac.getDate();

      if (
        edad < 18 ||
        (edad === 18 && (mes < 0 || (mes === 0 && dia < 0)))
      ) {
        nuevosErrores.fechaNacimiento = 'Debe tener al menos 18 años';
        valid = false;
      }
    }


    // Provincia
    if (!ubicacion.provincia) {
      nuevosErrores.provincia = 'Seleccione una provincia';
      valid = false;
    }

    // Cantón
    if (!ubicacion.canton) {
      nuevosErrores.canton = 'Seleccione un cantón';
      valid = false;
    }

    // Parroquia
    if (!ubicacion.parroquia) {
      nuevosErrores.parroquia = 'Seleccione una parroquia';
      valid = false;
    }



    // Tipo de sangre
    if (!formulario.tipoSangre) {
      nuevosErrores.tipoSangre = 'Seleccione un tipo de sangre';
      valid = false;
    }

    // Contacto de emergencia
    if (!formulario.contactoEmergencia) {
      nuevosErrores.contactoEmergencia = 'Ingrese el contacto de emergencia';
      valid = false;
    }

    // Parentesco
    if (!formulario.parentesco) {
      nuevosErrores.parentesco = 'Ingrese el parentesco';
      valid = false;
    }

    if (!formulario.foto) {
      nuevosErrores.foto = 'Debe cargar una imagen';
      valid = false;
    }
    if (alergiasSeleccionadas.length === 0) {
      nuevosErrores.alergia = 'Seleccione al menos una alergia o "Ninguna"';
      valid = false;
    }



    // Asignar errores al estado
    setErrores(nuevosErrores);

    if (!valid) return;
    let imagenBase64 = formulario.foto; // 👈 Agrega esto primero

    // Si es una URL, entonces la convertimos a base64
    if (formulario.foto && formulario.foto.startsWith("http")) {
      try {
        const respuesta = await fetch(formulario.foto);
        const blob = await respuesta.blob();
        const reader = new FileReader();

        const base64 = await new Promise((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });

        imagenBase64 = base64; // ✅ Se actualiza correctamente
      } catch (err) {
        console.error("Error al convertir imagen a base64:", err);
        toast.error("❌ No se pudo procesar la imagen");
        return;
      }
    }


    const payload = {
      nombres: formulario.nombres,
      apellidos: formulario.apellidos,
      cedula: formulario.cedula,
      genero: formulario.genero,
      direccion: formulario.direccion,
      fechaNacimiento: formulario.fechaNacimiento,
      contactoEmergencia: formulario.contactoEmergencia,
      parentesco: formulario.parentesco,
      tipoSangre: formulario.tipoSangre,
      idParroquia: parseInt(ubicacion.parroquia),
      alergia: alergiasSeleccionadas.join(', '),
      foto: imagenBase64,
      idContratante: parseInt(userId)
    };

    console.log(formulario.foto.length)

    // Encuentra esta sección en tu código (aproximadamente línea 450-470)
    // Y reemplaza la parte del try-catch con esto:

    // Modificar la sección del try-catch en handleSubmit
    // Reemplaza aproximadamente desde la línea 450-500

    try {
      if (idPaciente) {
        // ACTUALIZAR paciente
        const res = await axios.put(`http://3.133.11.0:8090/api/registro/paciente/${idPaciente}`, payload);
        if (res.data.success) {
          toast.success('✅ Paciente actualizado exitosamente');

          // ✅ NUEVA LÓGICA: Redirigir a visualizar pacientes después de actualizar
          setTimeout(() => {
            navigate(`/moduloContratante/visualizarpaciente?userId=${userId}`);
          }, 1500); // Delay para que el usuario vea el mensaje de éxito

        } else {
          toast.error(res.data.message || '❌ No se pudo actualizar el paciente.');
        }
      } else {
        // CREAR paciente (mantener la redirección actual)
        const payloadPost = {
          ...payload,
          tipo_sangre: payload.tipoSangre,
          contacto_emergencia: payload.contactoEmergencia
        };
        delete payloadPost.tipoSangre;
        delete payloadPost.contactoEmergencia;

        const data = await registrarPaciente(payloadPost);
        if (data.success) {
          toast.success('✅ Paciente registrado exitosamente');

          // ✅ MANTENER REDIRECCIÓN ACTUAL: Va a crear ficha
          navigate(`/fichas/nueva?idPaciente=${data.paciente.id_paciente}&userId=${userId}`);

          // Limpiar formulario después de registro
          setFormulario({
            nombres: '',
            apellidos: '',
            cedula: '',
            genero: '',
            direccion: '',
            fechaNacimiento: '',
            contactoEmergencia: '',
            parentesco: '',
            parroquia: '',
            tipoSangre: '',
            alergia: '',
            foto: ''
          });
          setUbicacion({ provincia: '', canton: '', parroquia: '' });
          setAlergiasSeleccionadas([]);
          setAlergiaPersonalizada('');
          setAlergiaSeleccionada('');
        } else {
          toast.error(data.message || '❌ No se pudo registrar al paciente.');
        }
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      if (error.response) {
        console.error("Respuesta error:", error.response.data);
      } else {
        toast.error('❌ Error en la solicitud');
      }
    }
  };

  return (
    <>
      <HeaderContratante userId={userId} />
      <div className={styles["registro-page-paci"]}>
        <div className={styles["registro-card-paci"]}>
          <h2>Registro Paciente</h2>
          <p className={styles["subtitle-paci"]}>Por favor completa tus datos</p>
          <form onSubmit={handleSubmit}>
            <h3 className={styles["form-section-title-paci"]}></h3>
            <h3></h3>
            <div style={{ display: 'flex', gap: '30px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <div className={styles["input-group-paci"]}>
                  <label><FaIdCard className={styles["input-icon-paci"]} /> Cédula</label>
                  <input
                    type="text"
                    name="cedula"
                    placeholder="Ingrese la cédula"
                    value={formulario.cedula}
                    onChange={(e) => {
                      handleChange(e);
                      setErrores(prev => ({ ...prev, cedula: '' }));
                    }}
                    className={errores.cedula ? styles["input-error-paci"] : ''}
                  />
                  {errores.cedula && <p className={styles["error-text-paci"]}>{errores.cedula}</p>}
                </div>
                <div style={{ display: 'flex', gap: '30px', marginBottom: '15px' }}>
                  <div style={{ flex: 1 }}>
                    <div className={styles["input-group-paci"]}>
                      <label><FaUser className={styles["input-icon-paci"]} /> Dirección</label>
                      <input
                        type="text"
                        name="direccion"
                        placeholder="Ingrese la dirección"
                        value={formulario.direccion}
                        onChange={(e) => {
                          handleChange(e);
                          setErrores(prev => ({ ...prev, direccion: '' }));
                        }}
                        className={errores.direccion ? styles["input-error-paci"] : ''}
                      />
                      {errores.direccion && <p className={styles["error-text-paci"]}>{errores.direccion}</p>}
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div className={styles["input-group-paci"]}>
                  <label><FaUser className={styles["input-icon-paci"]} /> Nombres</label>
                  <input
                    type="text"
                    name="nombres"
                    placeholder="Ingrese los nombres"
                    value={formulario.nombres}
                    onChange={(e) => {
                      handleChange(e);
                      setErrores(prev => ({ ...prev, nombres: '' }));
                    }}
                    className={errores.nombres ? styles["input-error-paci"] : ''}
                  />
                  {errores.nombres && <p className={styles["error-text-paci"]}>{errores.nombres}</p>}
                </div>
                <div style={{ flex: 1 }}>
                  <div className={styles["input-group-paci"]}>
                    <label><FaUser className={styles["input-icon-paci"]} /> Parentesco</label>
                    <input
                      type="text"
                      name="parentesco"
                      placeholder="Parentesco"
                      value={formulario.parentesco}
                      onChange={(e) => {
                        handleChange(e);
                        setErrores(prev => ({ ...prev, parentesco: '' }));
                      }}
                      className={errores.parentesco ? styles["input-error-paci"] : ''}
                    />
                    {errores.parentesco && <p className={styles["error-text-paci"]}>{errores.parentesco}</p>}
                  </div>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div className={styles["input-group-paci"]}>
                  <label><FaUser className={styles["input-icon-paci"]} /> Apellidos</label>
                  <input
                    type="text"
                    name="apellidos"
                    placeholder="Ingrese los apellidos"
                    value={formulario.apellidos}
                    onChange={(e) => {
                      handleChange(e);
                      setErrores(prev => ({ ...prev, apellidos: '' }));
                    }}
                    className={errores.apellidos ? styles["input-error-paci"] : ''}
                  />
                  {errores.apellidos && <p className={styles["error-text-paci"]}>{errores.apellidos}</p>}
                </div>
                <div style={{ flex: 1 }}>
                  <div className={styles["input-group-paci"]}>
                    <label><FaCalendarAlt className={styles["input-icon-paci"]} /> Fecha de nacimiento</label>
                    <input
                      type="date"
                      name="fechaNacimiento"
                      value={formulario.fechaNacimiento}
                      onChange={(e) => {
                        handleChange(e);
                        setErrores(prev => ({ ...prev, fechaNacimiento: '' }));
                      }}
                      className={errores.fechaNacimiento ? styles["input-error-paci"] : ''}
                    />
                    {errores.fechaNacimiento && <p className={styles["error-text-paci"]}>{errores.fechaNacimiento}</p>}
                  </div>
                </div>
              </div>
              {/* Foto a la derecha */}
              <div className={styles["foto-container-paci"]}>
                <div className={styles["ing-1-paci"]}>
                  {formulario.foto ? (
                    <img
                      src={formulario.foto}
                      alt="Foto cargada"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                    />
                  ) : (
                    <div style={{
                      width: '100%', height: '100%', display: 'flex',
                      justifyContent: 'center', alignItems: 'center', fontSize: '48px',
                      color: '#ccc'
                    }}></div>
                  )}
                </div>
                <input
                  type="file"
                  id="fotoPaciente"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFormulario(prev => ({ ...prev, foto: reader.result }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('fotoPaciente').click()}
                  className={styles["btn-cargar-foto-paci"]}
                >
                  Cargar Foto
                </button>
                {errores.foto && <p className={styles["error-foto-paci"]}>{errores.foto}</p>}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '30px', marginBottom: '15px' }}>
              {/* Contacto de emergencia */}
              <div style={{ flex: 1 }}>
                <div className={styles["input-groupv2-paci"]}>
                  <label style={{ color: 'black' }}>
                    <FaPhone className={styles["input-icon-paci"]} /> Contacto de emergencia
                  </label>
                  <input
                    type="text"
                    name="contactoEmergencia"
                    placeholder="Número de contacto"
                    value={formulario.contactoEmergencia}
                    onChange={(e) => {
                      handleChange(e);
                      setErrores(prev => ({ ...prev, contactoEmergencia: '' }));
                    }}
                    className={errores.contactoEmergencia ? styles["input-error-paci"] : ''}
                  />
                  {errores.contactoEmergencia && (
                    <p className={styles["error-text-paci"]}>{errores.contactoEmergencia}</p>
                  )}
                </div>
              </div>

              {/* Género */}
              <div style={{ flex: 1 }}>
                <div className={styles["input-groupv3-paci"]}>
                  <label style={{ color: 'black' }}>
                    <FaVenusMars className={styles["input-icon-paci"]} /> Género
                  </label>
                  <div className={styles["select-wrapper-paci"]}>
                    <select
                      name="genero"
                      value={formulario.genero}
                      onChange={(e) => {
                        handleChange(e);
                        setErrores(prev => ({ ...prev, genero: '' }));
                      }}
                      className={errores.genero ? styles["input-error-paci"] : ''}
                    >
                      <option value="">Seleccione...</option>
                      {generos.map((g, i) => (
                        <option key={i} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  {errores.genero && (
                    <p className={styles["error-text-paci"]}>Seleccione un género</p>
                  )}
                </div>
              </div>

              {/* Tipo de sangre */}
              <div style={{ flex: 1 }}>
                <div className={styles["input-groupv45-paci"]}>
                  <label style={{ color: 'black' }}>
                    <FaTint className={styles["input-icon-paci"]} /> Tipo de sangre
                  </label>
                  <div className={styles["select-wrapper-paci"]}>
                    <select
                      name="tipoSangre"
                      value={formulario.tipoSangre}
                      onChange={(e) => {
                        handleChange(e);
                        setErrores(prev => ({ ...prev, tipoSangre: '' }));
                      }}
                      className={errores.tipoSangre ? styles["input-error-paci"] : ''}
                    >
                      <option value="">Seleccione...</option>
                      {tiposSangre.map((t, i) => (
                        <option key={i} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  {errores.tipoSangre && (
                    <p className={styles["error-text-paci"]}>Seleccione un tipo de sangre</p>
                  )}
                </div>
              </div>



            </div>
            <div style={{ display: 'flex', gap: '30px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <div className={styles["input-group-paci"]}>
                  <label><FaUser className={styles["input-icon-paci"]} /> Provincia</label>
                  <div className={styles["select-wrapper-paci"]}>
                    <select
                      name="provincia"
                      value={ubicacion.provincia}
                      onChange={(e) => {
                        handleUbicacionChange(e);
                        setErrores(prev => ({ ...prev, provincia: '' }));
                      }}
                      className={errores.provincia ? styles["input-error-paci"] : ''}
                    >
                      <option value="">Seleccione...</option>
                      {provincias.map(p => (
                        <option key={p.id_provincia} value={p.id_provincia}>{p.nombre}</option>
                      ))}
                    </select>
                  </div>
                  {errores.provincia && <p className={styles["error-text-paci"]}>Seleccione una provincia</p>}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div className={styles["input-group-paci"]}>
                  <label><FaUser className={styles["input-icon-paci"]} /> Cantón</label>
                  <div className={styles["select-wrapper-paci"]}>
                    <select
                      name="canton"
                      value={ubicacion.canton}
                      onChange={(e) => {
                        handleUbicacionChange(e);
                        setErrores(prev => ({ ...prev, canton: '' }));
                      }}
                      className={errores.canton ? styles["input-error-paci"] : ''}
                    >
                      <option value="">Seleccione...</option>
                      {cantones.map(c => (
                        <option key={c.id_canton} value={c.id_canton}>{c.nombre}</option>
                      ))}
                    </select>
                  </div>
                  {errores.canton && <p className={styles["error-text-paci"]}>Seleccione un cantón</p>}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div className={styles["input-group-paci"]}>
                  <label><FaUser className={styles["input-icon-paci"]} /> Parroquia</label>
                  <div className={styles["select-wrapper-paci"]}>
                    <select
                      name="parroquia"
                      value={ubicacion.parroquia}
                      onChange={(e) => {
                        handleUbicacionChange(e);
                        setErrores(prev => ({ ...prev, parroquia: '' }));
                      }}
                      className={errores.parroquia ? styles["input-error-paci"] : ''}
                    >
                      <option value="">Seleccione...</option>
                      {parroquias.map(p => (
                        <option key={p.id_parroquia} value={p.id_parroquia}>{p.nombre}</option>
                      ))}
                    </select>
                  </div>
                  {errores.parroquia && <p className={styles["error-text-paci"]}>Seleccione una parroquia</p>}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', maxWidth: '700px' }}>
              {/* Combo de alergias */}
              <div className={styles["input-group-paci"]} style={{ flex: '0 0 320px' }}>
                <label><FaHeartbeat className={styles["input-icon-paci"]} /> Alergia</label>
                <select
                  name="alergia"
                  value={alergiaSeleccionada}
                  onChange={(e) => {
                    const nuevaAlergia = e.target.value;
                    if (nuevaAlergia === "Otra") {
                      setAlergiaSeleccionada("Otra");
                    } else {
                      setAlergiaSeleccionada("");
                      if (nuevaAlergia === "Ninguna") {
                        setAlergiasSeleccionadas(["Ninguna"]);
                      } else {
                        if (alergiasSeleccionadas.includes("Ninguna")) return;
                        if (nuevaAlergia && !alergiasSeleccionadas.includes(nuevaAlergia)) {
                          setAlergiasSeleccionadas([...alergiasSeleccionadas, nuevaAlergia]);
                        }
                      }
                    }
                  }}
                  disabled={alergiasSeleccionadas.includes("Ninguna")}
                  style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
                >
                  <option value="">Seleccione...</option>
                  {alergias.map((a, i) => (
                    <option key={i} value={a}>{a}</option>
                  ))}
                </select>
                {errores.alergia && <p className={styles["error-text-paci"]}>Seleccione al menos una alergia o "Ninguna"</p>}

              </div>
              {/* Input + botón a la derecha, solo si "Otra" está seleccionado */}
              {alergiaSeleccionada === "Otra" && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', flex: '1', marginTop: '30px' }}>
                  <input
                    type="text"
                    placeholder="Escribe tu alergia"
                    value={alergiaPersonalizada}
                    onChange={(e) => setAlergiaPersonalizada(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '5px',
                      border: '1px solid #ccc',
                      fontSize: '1rem'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!alergiaPersonalizada.trim()) {
                        alert('Por favor, escribe una alergia');
                        return;
                      }
                      if (!alergiasSeleccionadas.includes(alergiaPersonalizada.trim())) {
                        setAlergiasSeleccionadas([...alergiasSeleccionadas, alergiaPersonalizada.trim()]);
                      }
                      setAlergiaPersonalizada('');
                      setAlergiaSeleccionada('');
                    }}
                    style={{
                      padding: '8px 20px',
                      backgroundColor: '#0a3d62',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                    }}
                  >
                    Guardar
                  </button>
                </div>
              )}

              {/* Lista de alergias seleccionadas debajo (ocupa toda la fila) */}
            </div>
            {/* Lista abajo, con margenes separados */}
            <div className={styles["alergias-container-paci"]} style={{ marginTop: '-17px', maxWidth: '700px' }}>
              {alergiasSeleccionadas.map((alergia, index) => (
                <div
                  key={index}
                  className={styles["alergia-tag-paci"]}
                  style={{
                    padding: '5px 12px',
                    margin: '7px 8px 0 0',
                    backgroundColor: '#0a3d62',
                    color: 'white',
                    borderRadius: '10px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {alergia}
                  <button
                    type="button"
                    onClick={() =>
                      setAlergiasSeleccionadas(alergiasSeleccionadas.filter((a) => a !== alergia))
                    }
                    style={{
                      marginLeft: '10px',
                      background: 'none',
                      color: 'red',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button type="submit" className={styles["submit-btn-paci"]}>
              {idPaciente ? "Actualizar Paciente" : "Registrar Paciente"}
            </button>
          </form>

        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );


};
export default RegistroPaciente;
