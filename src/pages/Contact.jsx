// src/pages/ContactForm.jsx
import React, { useState } from "react";
import Window from "../components/Window";

export default function Contact() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        message: "",
    });

    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    // const [openWindow, setOpenWindow] = useState(true); // revisar

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const isValidEmail = (email) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!form.name) newErrors.name = "El nombre es obligatorio.";
        if (!form.email) newErrors.email = "El email es obligatorio.";
        else if (!isValidEmail(form.email)) newErrors.email = "Email inválido.";
        if (!form.message) newErrors.message = "El mensaje no puede estar vacío.";

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            // Here you can send data to backend or email service
            console.log("Form submitted:", form);
            setSuccess(true);
            setForm({ name: "", email: "", message: "" });
        } else {
            setSuccess(false);
        }
    };

    return (

        <div className="form-wrapper">

            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nombre:</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                    />
                    <div className="error-message">{errors.name}</div>
                </div>

                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                    />
                    <div className="error-message">{errors.email}</div>
                </div>

                <div className="form-group">
                    <label>Mensaje:</label>
                    <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        rows={4}
                    />
                    <div className="error-message">{errors.message}</div>
                </div>

                <button type="submit" className="pixel-button">
                    Enviar
                </button>

                {success && <div className="message success">Mensaje enviado con éxito.</div>}
            </form>
        </div>
    );
}
