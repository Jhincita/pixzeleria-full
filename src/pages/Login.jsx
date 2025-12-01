import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // If using React Router
import { authAPI } from "../services/api";
import Signup from "./Signup";
import Window from "../components/Window";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({ username: "", password: "", general: "" });
    const [openWindow, setOpenWindow] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    // const navigate = useNavigate(); // Uncomment if using React Router

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

        // Validation
        const newErrors = { username: "", password: "", general: "" };
        if (!username) newErrors.username = "El nombre de usuario es obligatorio.";
        if (!password) newErrors.password = "La contraseña es obligatoria.";

        setErrors(newErrors);

        if (newErrors.username || newErrors.password) {
            setIsLoading(false);
            return;
        }

        try {
            // Call backend login endpoint
            const response = await authAPI.login({
                username: username,
                password: password
            });

            // Save token to localStorage
            const token = response.data.token;
            localStorage.setItem('token', token);

            // Optionally save user info
            localStorage.setItem('user', JSON.stringify({ username }));

            console.log("Login successful!", response.data);
            alert("¡Inicio de sesión exitoso! ✨");

            // Redirect to home or dashboard
            // navigate('/'); // Uncomment if using React Router
            window.location.href = '/'; // Or use this for simple redirect

        } catch (error) {
            console.error("Login error:", error);

            if (error.response) {
                // Backend returned an error
                if (error.response.status === 401 || error.response.status === 403) {
                    setErrors({
                        ...newErrors,
                        general: "Usuario o contraseña incorrectos"
                    });
                } else {
                    setErrors({
                        ...newErrors,
                        general: "Error al iniciar sesión. Intenta de nuevo."
                    });
                }
            } else {
                setErrors({
                    ...newErrors,
                    general: "Error de conexión. Verifica que el servidor esté corriendo."
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="form-wrapper">
            <form className="auth-form" onSubmit={handleSubmit}>
                {errors.general && (
                    <div className="error-message general-error" style={{
                        color: 'red',
                        marginBottom: '15px',
                        padding: '10px',
                        border: '2px solid red',
                        backgroundColor: '#ffe6e6'
                    }}>
                        {errors.general}
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="username">Nombre de usuario:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        maxLength={100}
                        disabled={isLoading}
                        required
                    />
                    {errors.username && (
                        <div className="error-message">{errors.username}</div>
                    )}
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
                        disabled={isLoading}
                        required
                    />
                    {errors.password && (
                        <div className="error-message">{errors.password}</div>
                    )}
                </div>

                <button
                    type="submit"
                    className="pixel-button"
                    disabled={isLoading}
                >
                    {isLoading ? "Ingresando..." : "Ingresar"}
                </button>
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