import { useState } from 'react';
import '../../styles/AdminLogin.css';

const AdminLogin = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    username: '', // Cambiamos email por username (tu backend usa username)
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name] || errors.general) {
      setErrors(prev => ({ ...prev, [name]: '', general: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'El usuario es obligatorio';
    if (!formData.password) newErrors.password = 'La contraseña es obligatoria';
    if (!editingUser) {
        if (!formData.password) errors.password = 'La contraseña es requerida';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // 1. LLAMADA AL BACKEND REAL 🚀
      // Asegúrate de que el puerto sea el correcto (8080 o 8085)
      const response = await fetch('http://localhost:8080/api/v1/auth/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Guardamos el token
        // El backend devuelve { token: "..." }
        sessionStorage.setItem('adminLoggedIn', 'true');
        sessionStorage.setItem('token', data.token); // Guardamos el token vital
        sessionStorage.setItem('adminUser', JSON.stringify({
            username: formData.username,
            role: 'ADMIN' // Asumimos admin si logró entrar
        }));

        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } else {
        // Error de credenciales
        setErrors({
          general: 'Usuario o contraseña incorrectos'
        });
      }
    } catch (error) {
      // Se apagó el backend
      console.error("Error conectando:", error);
      setErrors({
        general: 'Error de conexión con el servidor. Revisa que el backend esté corriendo.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>Pixzelería</h1>
          <p>Panel de Administración</p>
        </div>

        <div className="login-form">
          {errors.general && (
            <div className="alert alert-error">
              <i className="fas fa-exclamation-circle"></i> {errors.general}
            </div>
          )}

          {/* Input de username en vez de email */}
          <div className="form-group">
            <label htmlFor="username">
              <i className="fas fa-user"></i> Usuario
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Ej: admin"
              className={errors.username ? 'input-error' : ''}
            />
            {errors.username && <span className="error-message">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <i className="fas fa-lock"></i> Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <button 
            onClick={handleSubmit}
            className="btn btn-primary btn-full"
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
