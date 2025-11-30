// src/pages/Signup.jsx
import React, { useState, useEffect } from "react";

// Datos de regiones y comunas de Chile
const chileData = {
    regiones: [
        {
            id: 1,
            nombre: "Región Metropolitana",
            comunas: [
                "Las Condes",
                "Providencia",
                "Vitacura",
                "La Reina",
                "Maipú",
                "Puente Alto",
                "Santiago Centro",
                "La Florida",
                "Peñalolén",
                "Ñuñoa"
            ]
        },
        { id: 2, nombre: "Arica y Parinacota", comunas: ["Arica", "Putre"] },
        { id: 3, nombre: "Tarapacá", comunas: ["Iquique", "Alto Hospicio"] },
        { id: 4, nombre: "Antofagasta", comunas: ["Antofagasta", "Calama"] },
        { id: 5, nombre: "Atacama", comunas: ["Copiapó", "Vallenar"] },
        { id: 6, nombre: "Coquimbo", comunas: ["La Serena", "Coquimbo"] },
        { id: 7, nombre: "Valparaíso", comunas: ["Valparaíso", "Viña del Mar"] },
        { id: 8, nombre: "O’Higgins", comunas: ["Rancagua", "San Fernando"] },
        { id: 9, nombre: "Maule", comunas: ["Talca", "Curicó"] },
        { id: 10, nombre: "Ñuble", comunas: ["Chillán", "San Carlos"] },
        { id: 11, nombre: "Biobío", comunas: ["Concepción", "Los Ángeles"] },
        { id: 12, nombre: "La Araucanía", comunas: ["Temuco", "Villarrica"] },
        { id: 13, nombre: "Los Ríos", comunas: ["Valdivia", "Panguipulli"] },
        { id: 14, nombre: "Los Lagos", comunas: ["Puerto Montt", "Osorno"] },
        { id: 15, nombre: "Aysén", comunas: ["Coyhaique", "Puerto Aysén"] },
        { id: 16, nombre: "Magallanes", comunas: ["Punta Arenas", "Puerto Natales"] }
    ]
};

export default function Signup() {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        region: "",
        comuna: "",
        favoritePizza: ""
    });
    const [errors, setErrors] = useState({});
    const [comunas, setComunas] = useState([]);

    useEffect(() => {
        // Cuando cambia la región, actualizar comunas
        const selectedRegion = chileData.regiones.find(r => r.nombre === form.region);
        if (selectedRegion) setComunas(selectedRegion.comunas);
        else setComunas([]);
    }, [form.region]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        // Validaciones
        if (!form.username) newErrors.username = "El nombre de usuario es obligatorio.";
        else if (form.username.length > 100) newErrors.username = "Máximo 100 caracteres.";

        if (!form.email) newErrors.email = "El email es obligatorio.";
        else if (!isValidEmail(form.email)) newErrors.email = "Email inválido.";

        if (!form.password) newErrors.password = "La contraseña es obligatoria.";
        else if (form.password.length < 4 || form.password.length > 10)
            newErrors.password = "Debe tener entre 4 y 10 caracteres.";

        if (!form.confirmPassword) newErrors.confirmPassword = "Confirma tu contraseña.";
        else if (form.password !== form.confirmPassword)
            newErrors.confirmPassword = "Las contraseñas no coinciden.";

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            // Guardar en localStorage (igual que en tu JS)
            const users = JSON.parse(localStorage.getItem("pixeleriaUsers")) || [];
            if (users.some(u => u.username === form.username)) {
                setErrors({ username: "Este nombre de usuario ya está registrado" });
                return;
            }
            if (users.some(u => u.email === form.email)) {
                setErrors({ email: "Este email ya está registrado" });
                return;
            }

            const newUser = { ...form, registrationDate: new Date().toISOString() };
            users.push(newUser);
            localStorage.setItem("pixeleriaUsers", JSON.stringify(users));

            alert("Registro exitoso. Ahora puedes iniciar sesión.");
            window.location.href = "/"; // Redirigir
        }
    };

    return (
        <div className="form-wrapper" >
            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nombre de usuario:</label>
                    <input name="username" value={form.username} onChange={handleChange} maxLength={100} />
                    <div className="error-message">{errors.username}</div>
                </div>

                <div className="form-group">
                    <label>Email:</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} />
                    <div className="error-message">{errors.email}</div>
                </div>

                <div className="form-group">
                    <label>Contraseña (4-10 caracteres):</label>
                    <input name="password" type="password" value={form.password} onChange={handleChange} minLength={4} maxLength={10} />
                    <div className="error-message">{errors.password}</div>
                </div>

                <div className="form-group">
                    <label>Repetir contraseña:</label>
                    <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} minLength={4} maxLength={10} />
                    <div className="error-message">{errors.confirmPassword}</div>
                </div>

                <div className="form-group">
                    <label>Región:</label>
                    <select name="region" value={form.region} onChange={handleChange}>
                        <option value="">Selecciona una región</option>
                        {chileData.regiones.map(r => <option key={r.id} value={r.nombre}>{r.nombre}</option>)}
                    </select>
                </div>

                <div className="form-group">
                    <label>Comuna:</label>
                    <select name="comuna" value={form.comuna} onChange={handleChange} disabled={!form.region}>
                        <option value="">{form.region ? "Selecciona una comuna" : "Primero selecciona una región"}</option>
                        {comunas.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                <div className="form-group">
                    <label>Pizza favorita (opcional):</label>
                    <input name="favoritePizza" value={form.favoritePizza} onChange={handleChange} maxLength={100} />
                </div>

                <button type="submit" className="pixel-button">Registrarse</button>
            </form>

            <p>
                ¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a>
            </p>
        </div>
    );
}
