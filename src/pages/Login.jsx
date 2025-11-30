// src/pages/Login.jsx
import React, { useState } from "react";
import Signup from "./Signup";
import Window from "../components/Window";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({ username: "", password: "" });
    const [openWindow, setOpenWindow] = useState(null); //para manejar el signuppopup

    const renderWindowContent = () => {
        switch (openWindow) {
            case "signup":
                return <Signup onClose={() => setOpenWindow(null)} />;
            default:
                return null;
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();

        // Simple validation example
        const newErrors = { username: "", password: "" };
        if (!username) newErrors.username = "El nombre de usuario es obligatorio.";
        if (!password) newErrors.password = "La contraseña es obligatoria.";
        setErrors(newErrors);

        if (!newErrors.username && !newErrors.password) {
            console.log("Logging in with", { username, password });
            // Handle login logic here
        }
    };

    return (
        <div className="form-wrapper">
            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Nombre de usuario:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        maxLength={100}
                        required
                    />
                    <div className="error-message">{errors.username}</div>
                </div>

                <div className="form-group">
                    <label htmlFor="password">Contraseña:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={4}
                        maxLength={10}
                        required
                    />
                    <div className="error-message">{errors.password}</div>
                </div>

                <button type="submit" className="pixel-button">Ingresar</button>

            </form>

            <p>
                ¿No tienes cuenta?{" "}
                <span
                    style={{ color: "blue", cursor: "pointer" }}
                    onClick={() => setOpenWindow("signup")}
                >
                    Regístrate aquí
                </span>
            </p>

            <Window
                title={openWindow ? openWindow.toUpperCase() : ""}
                isOpen={!!openWindow}
                onClose={() => setOpenWindow(null)}
            >
                {renderWindowContent()}
            </Window>
        </div>

    );
}
