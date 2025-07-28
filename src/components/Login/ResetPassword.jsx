import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const hasMinLength = newPassword.length >= 8;
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasLowerCase = /[a-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSymbol = /[@$!%*?&]/.test(newPassword);
  const passwordsMatch = newPassword === confirmPassword;

  const validatePassword = () =>
    hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSymbol && passwordsMatch;

  useEffect(() => {
    if (!token) {
      toast.error("Token no proporcionado. No puedes acceder a esta página.");
      setTimeout(() => navigate("/login"), 3000);
    }
  }, [token, navigate]);

  const handleReset = async () => {
    if (!validatePassword()) {
      if (!passwordsMatch) {
        toast.error("❌ Las contraseñas no coinciden.");
      } else {
        toast.error("❌ La contraseña no cumple con los requisitos mínimos.");
      }
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://3.129.59.126:8090/api/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, nuevaPassword: newPassword }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (errorText.includes("Token inválido o expirado")) {
          toast.error(
            "Tu enlace ha expirado por seguridad. Solicita uno nuevo para continuar"
          );
          setTimeout(() => navigate("/login"), 3000);
        } else {
          toast.error("❌ " + errorText);
        }
        setLoading(false);
        return;
      }

      toast.success("✅ Contraseña actualizada correctamente. Ahora puedes iniciar sesión.");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error("❌ " + (error.message || "Error al restablecer contraseña"));
    } finally {
      setLoading(false);
    }
  };

  const Rule = ({ condition, label }) => (
    <div
      style={{
        color: condition ? "#2e7d32" : "#c62828",
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 6,
        fontWeight: "600",
        fontSize: 14,
      }}
    >
      {condition ? "✔️" : "❌"} {label}
    </div>
  );

  return (
    <div style={styles.container}>
      <ToastContainer position="top-right" autoClose={3000} />
      <div style={styles.card}>
        <h1 style={styles.title}>Restablece tu contraseña</h1>
        <p style={styles.subtitle}>Introduce una nueva contraseña segura para continuar.</p>

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Nueva contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={styles.input}
          disabled={loading}
        />

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Repite la contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={{ ...styles.input, marginBottom: 8 }}
          disabled={loading}
        />

        <div style={{ marginBottom: 16, fontSize: 14 }}>
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword((prev) => !prev)}
            disabled={loading}
            style={{ marginRight: 8 }}
          />
          Mostrar contraseñas
        </div>

        <div style={{ marginBottom: 24 }}>
          <Rule condition={hasMinLength} label="Mínimo 8 caracteres" />
          <Rule condition={hasUpperCase} label="Una letra mayúscula" />
          <Rule condition={hasLowerCase} label="Una letra minúscula" />
          <Rule condition={hasNumber} label="Un número" />
          <Rule condition={hasSymbol} label="Un símbolo (@$!%*?&)" />
          <Rule condition={passwordsMatch} label="Las contraseñas coinciden" />
        </div>

        <button
          onClick={handleReset}
          style={loading || !validatePassword() ? styles.buttonDisabled : styles.button}
          disabled={loading || !validatePassword()}
        >
          {loading ? "Procesando..." : "Cambiar contraseña"}
        </button>

        <p style={styles.note}>
          ¿No solicitaste este cambio? <br />
          <span
            onClick={() => navigate("/login")}
            style={{ color: "#1565c0", cursor: "pointer", textDecoration: "underline" }}
          >
            Regresa al inicio de sesión
          </span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #f0f4f8 0%, #cfe0fc 100%)",
    padding: "24px",
  },
  card: {
    background: "#fff",
    padding: "40px 48px",
    borderRadius: 12,
    boxShadow: "0 10px 20px rgba(21, 101, 192, 0.15), 0 6px 6px rgba(21, 101, 192, 0.1)",
    maxWidth: 420,
    width: "100%",
    textAlign: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: {
    fontWeight: 700,
    color: "#0d47a1",
    fontSize: 28,
    marginBottom: 8,
  },
  subtitle: {
    color: "#455a64",
    fontSize: 16,
    marginBottom: 28,
  },
  input: {
    width: "100%",
    padding: "14px 18px",
    marginBottom: 12,
    borderRadius: 8,
    border: "1.5px solid #90caf9",
    fontSize: 16,
    outline: "none",
    transition: "border-color 0.3s",
    boxShadow: "0 0 8px rgba(144, 202, 249, 0.5)",
  },
  button: {
    width: "100%",
    padding: 14,
    borderRadius: 8,
    border: "none",
    backgroundColor: "#1565c0",
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    cursor: "pointer",
    boxShadow: "0 5px 12px rgba(21, 101, 192, 0.3)",
    transition: "background-color 0.3s ease",
  },
  buttonDisabled: {
    width: "100%",
    padding: 14,
    borderRadius: 8,
    border: "none",
    backgroundColor: "#90a4ae",
    color: "#e0e0e0",
    fontWeight: "700",
    fontSize: 16,
    cursor: "not-allowed",
  },
  note: {
    marginTop: 20,
    fontSize: 14,
    color: "#546e7a",
    userSelect: "none",
  },
};

export default ResetPassword;
