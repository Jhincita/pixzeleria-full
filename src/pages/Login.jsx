// src/pages/Login.jsx
import React, { useState } from "react";
import { authAPI } from "../services/api";
import Signup from "./Signup";
import Window from "../components/Window";

export default function Login({ User, setUser }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({ username: "", password: "", general: "" });
    const [openWindow, setOpenWindow] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const renderWindowContent = () => {
        switch (openWindow) {
            case "signup":
                return <Signup onClose={() => setOpenWindow(null)} />;
            default:
                return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const newErrors = { username: "", password: "", general: "" };
        if (!username) newErrors.username = "El nombre de usuario es obligatorio.";
        if (!password) newErrors.password = "La contraseña es obligatoria.";

        setErrors(newErrors);

        if (newErrors.username || newErrors.password) {
            setIsLoading(false);
            return;
        }

        try {
            const response = await authAPI.login({
                username: username,
                password: password
            });

            const token = response.data.token;
            localStorage.setItem('token', token);
            
            const userData = {
                username: response.data.username,
                firstName: response.data.firstName,
                role: response.data.role 
            };
            
            localStorage.setItem('user', JSON.stringify(userData));

            console.log("Datos guardados:", userData); 
            alert("¡Inicio de sesión pixi-exitoso! ✨");

            window.location.href = '/'; 

        } catch (error) {
            console.error("Login error:", error);
            if (error.response) {
                if (error.response.status === 401 || error.response.status === 403) {
                    setErrors({ ...newErrors, general: "Usuario o contraseña incorrectos" });
                } else {
                    setErrors({ ...newErrors, general: "Error al iniciar sesión. Estás soñando, intenta de nuevo." });
                }
            } else {
                setErrors({ ...newErrors, general: "Error de conexión. Estás soñando, verifica que el servidor esté corriendo." });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="form-wrapper">
            <form className="auth-form" onSubmit={handleSubmit}>
                {errors.general && (
                    <div className="error-message general-error" style={{ color: 'red', marginBottom: '15px', padding: '10px', border: '2px solid red', backgroundColor: '#ffe6e6' }}>
                        {errors.general}
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="username">Nombre de usuario:</label>
                    <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} maxLength={100} disabled={isLoading} required />
                    {errors.username && <div className="error-message">{errors.username}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="password">Contraseña:</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={4} maxLength={10} disabled={isLoading} required />
                    {errors.password && <div className="error-message">{errors.password}</div>}
                </div>

                <button type="submit" className="pixel-button" disabled={isLoading}>
                    {isLoading ? "Ingresando..." : "Ingresar"}
                </button>
            </form>

            <p>
                ¿No tienes cuenta?{" "}
                <span style={{ color: "blue", cursor: "pointer" }} onClick={() => setOpenWindow("signup")}>
                    Regístrate aquí
                </span>
            </p>

            <Window title={openWindow ? openWindow.toUpperCase() : ""} isOpen={!!openWindow} onClose={() => setOpenWindow(null)}>
                {renderWindowContent()}
            </Window>
        </div>
    );
}
