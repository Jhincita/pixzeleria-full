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
      setUsers(response. data);
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
    setFormData({ username: '', password: '', firstName:  '', lastName: '' });
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.user?. username || user.username || '',
      password: '',
      firstName: user.user?. firstName || user.firstName || '',
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
      if (! formData.password) delete payload.password;

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
    if (! window.confirm("¿Eliminar este usuario?")) return;

    try {
      await api.delete(`/clients/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error("Error:", error);
      alert("Error al eliminar");
    }
  };

  if (loading) return <div>Cargando... </div>;

  return (
    <div className="section-container">
      <div className="section-header">
        <h2>Gestión de Clientes</h2>
        <button className="btn-primary" onClick={openCreateModal}>
          + Agregar Cliente
        </button>
      </div>
      
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Puntos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ?  users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.user?. username || user.username || "N/A"}</td>
              <td>{user.user?.firstName || user.firstName || "N/A"}</td>
              <td>{user.user?.lastName || user.lastName || "N/A"}</td>
              <td>{user.loyaltyPoints || 0}</td>
              <td>
                <button onClick={() => openEditModal(user)}>✏️</button>
                <button onClick={() => handleDelete(user.id)}>🗑️</button>
              </td>
            </tr>
          )) : (
            <tr><td colSpan="6">No hay clientes</td></tr>
          )}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingUser ? 'Editar' : 'Nuevo'} Cliente</h3>
            <form onSubmit={handleSubmit}>
              <input
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Usuario"
                required
              />
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Contraseña"
                required={!editingUser}
              />
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Nombre"
                required
              />
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Apellido"
                required
              />
              <button type="submit">Guardar</button>
              <button type="button" onClick={() => setShowModal(false)}>Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSection;

