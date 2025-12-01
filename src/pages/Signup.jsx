import React, { useState } from "react";
import { authAPI } from "../services/api";

export default function Signup({ onClose }) {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        password: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = "El nombre es obligatorio";
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = "El apellido es obligatorio";
        }

        if (!formData.username.trim()) {
            newErrors.username = "El nombre de usuario es obligatorio";
        } else if (formData.username.length < 3) {
            newErrors.username = "El nombre de usuario debe tener al menos 3 caracteres";
        }

        if (!formData.password) {
            newErrors.password = "La contraseña es obligatoria";
        } else if (formData.password.length < 4) {
            newErrors.password = "La contraseña debe tener al menos 4 caracteres";
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Las contraseñas no coinciden";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Call backend register endpoint
            const response = await authAPI.register({
                firstName: formData.firstName,
                lastName: formData.lastName,
                username: formData.username,
                password: formData.password,
                role: "CLIENTE" // Default role
            });

            // Save token from registration
            const token = response.data.token;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify({
                username: formData.username,
                firstName: formData.firstName,
                lastName: formData.lastName
            }));

            console.log("Registration successful!", response.data);
            alert("¡Registro exitoso! Bienvenido a Pixzelería ✨");

            // Close signup window and redirect
            onClose();
            window.location.href = '/'; // Or use navigate if using React Router

        } catch (error) {
            console.error("Registration error:", error);

            if (error.response) {
                if (error.response.status === 409) {
                    setErrors({
                        general: "El nombre de usuario ya existe"
                    });
                } else if (error.response.data?.message) {
                    setErrors({
                        general: error.response.data.message
                    });
                } else {
                    setErrors({
                        general: "Error al registrarse. Intenta de nuevo."
                    });
                }
            } else {
                setErrors({
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
                    <label htmlFor="firstName">Nombre:</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        disabled={isLoading}
                        required
                    />
                    {errors.firstName && (
                        <div className="error-message">{errors.firstName}</div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="lastName">Apellido:</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        disabled={isLoading}
                        required
                    />
                    {errors.lastName && (
                        <div className="error-message">{errors.lastName}</div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="username">Nombre de usuario:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
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
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        minLength={4}
                        maxLength={10}
                        disabled={isLoading}
                        required
                    />
                    {errors.password && (
                        <div className="error-message">{errors.password}</div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirmar contraseña:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        minLength={4}
                        maxLength={10}
                        disabled={isLoading}
                        required
                    />
                    {errors.confirmPassword && (
                        <div className="error-message">{errors.confirmPassword}</div>
                    )}
                </div>

                <button
                    type="submit"
                    className="pixel-button"
                    disabled={isLoading}
                >
                    {isLoading ? "Registrando..." : "Registrarse"}
                </button>
            </form>
        </div>
    );
}