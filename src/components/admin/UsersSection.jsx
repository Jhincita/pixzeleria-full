import { useState, useEffect } from 'react';
import api from '../../services/api';
import '../../styles/AdminPanel.css';

const UserSection = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/clients');
      setUsers(response.data);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({ username: '', password: '', firstName: '', lastName: '' });
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.user?.username || user.username || '',
      password: '',
      firstName: user.user?.firstName || user.firstName || '',
      lastName: user.user?.lastName || user.lastName || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.firstName || !formData.lastName) {
      alert("Completa todos los campos obligatorios");
      return;
    }

    try {
      const payload = { ...formData };
      if (!formData.password) delete payload.password;

      if (editingUser) {
        await api.put(`/clients/${editingUser.id}`, payload);
      } else {
        await api.post('/clients', payload);
      }

      setShowModal(false);
      fetchUsers();
    } catch (error) {
      console.error("Error:", error);
      alert("Error al guardar");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("¿Eliminar este usuario?")) return;

    try {
      await api.delete(`/clients/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error("Error:", error);
      alert("Error al eliminar");
    }
  };

  if (loading) return <div style={{padding: '20px'}}>Cargando usuarios...</div>;

  return (
    <div className="section-container">
      <div className="section-header">
        <h2>Gestión de Clientes</h2>
        <button className="btn-primary" onClick={openCreateModal}>
          + Agregar Cliente
        </button>
      </div>
      
      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario (Email)</th>
              <th>Nombre</th>
              <th>Apellido</th>
              {/* Se eliminó la columna Puntos */}
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.user?.username || user.username || "N/A"}</td>
                <td>{user.user?.firstName || user.firstName || "N/A"}</td>
                <td>{user.user?.lastName || user.lastName || "N/A"}</td>
                {/* Se eliminó la celda Puntos */}
                <td>
                  <button className="action-btn edit" onClick={() => openEditModal(user)} title="Editar">✏️</button>
                  <button className="action-btn delete" onClick={() => handleDelete(user.id)} title="Eliminar" style={{marginLeft: '10px'}}>🗑️</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>No hay clientes registrados</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
            style={{
                width: '600px', // Más ancho
                maxWidth: '95%',
                padding: '30px',
                border: '4px solid #000', // Borde grueso retro
                borderRadius: '0px', // Cuadrado pixel art
                boxShadow: '10px 10px 0px rgba(0,0,0,0.2)' // Sombra dura retro
            }}
          >
            <h3 style={{
                marginBottom: '25px', 
                borderBottom: '2px solid #ddd', 
                paddingBottom: '10px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
            }}>
                {editingUser ? 'Editar' : 'Nuevo'} Cliente
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
              
              {/* Fila 1: Nombre y Apellido */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{fontWeight: 'bold', fontSize: '0.9em'}}>Nombre:</label>
                    <input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Ej: Juan"
                        required
                        style={{ padding: '10px', border: '2px solid #000' }}
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{fontWeight: 'bold', fontSize: '0.9em'}}>Apellido:</label>
                    <input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Ej: Pérez"
                        required
                        style={{ padding: '10px', border: '2px solid #000' }}
                    />
                </div>
              </div>

              {/* Fila 2: Usuario */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{fontWeight: 'bold', fontSize: '0.9em'}}>Correo / Usuario:</label>
                <input
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="usuario@email.com"
                    required
                    style={{ padding: '10px', border: '2px solid #000' }}
                />
              </div>

              {/* Fila 3: Contraseña (Full width) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{fontWeight: 'bold', fontSize: '0.9em'}}>
                    Contraseña: {editingUser && <span style={{fontWeight:'normal', fontSize:'0.8em', color:'#666'}}>(Dejar en blanco para mantener actual)</span>}
                </label>
                <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="********"
                    required={!editingUser}
                    style={{ padding: '10px', border: '2px solid #000' }}
                />
              </div>

              {/* Botones de acción */}
              <div style={{ display: 'flex', gap: '15px', marginTop: '10px', justifyContent: 'flex-end' }}>
                <button 
                    type="button" 
                    onClick={() => setShowModal(false)}
                    style={{
                        padding: '10px 20px',
                        background: '#f4f4f4',
                        border: '2px solid #000',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    Cancelar
                </button>
                <button 
                    type="submit"
                    style={{
                        padding: '10px 20px',
                        background: '#e84444',
                        color: 'white',
                        border: '2px solid #000',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    Guardar Cambios
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSection;


