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
    lastName: '',
    loyaltyPoints: 0
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
      alert("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'loyaltyPoints' ? Number(value) : value
    }));
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({
      username:  '',
      password: '',
      firstName: '',
      lastName: '',
      loyaltyPoints: 0
    });
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      username: user. user?.username || user.username || '',
      password: '', // No mostramos la contraseña por seguridad
      firstName: user.user?.firstName || user.firstName || '',
      lastName: user. user?.lastName || user.lastName || '',
      loyaltyPoints:  user.loyaltyPoints || 0
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData. username || !formData.firstName || !formData.lastName) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    if (! editingUser && !formData.password) {
      alert("La contraseña es obligatoria para nuevos usuarios");
      return;
    }

    try {
      const payload = {
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        .. .(formData.password && { password: formData.password }) // Solo enviar si hay contraseña
      };

      if (editingUser) {
        // Actualizar usuario existente
        await api.put(`/clients/${editingUser.id}`, payload);
        alert("Usuario actualizado exitosamente");
      } else {
        // Crear nuevo usuario
        await api.post('/clients', payload);
        alert("Usuario creado exitosamente");
      }

      setShowModal(false);
      fetchUsers(); // Recargar la lista
    } catch (error) {
      console.error("Error guardando usuario:", error);
      alert(error.response?.data?.message || "Error al guardar usuario");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este usuario?  Esta acción no se puede deshacer.")) {
      return;
    }

    try {
      await api.delete(`/clients/${userId}`);
      alert("Usuario eliminado exitosamente");
      fetchUsers(); // Recargar la lista
    } catch (error) {
      console.error("Error eliminando usuario:", error);
      alert("Error al eliminar usuario.  Puede que tenga órdenes asociadas.");
    }
  };

  if (loading) return <div className="loading-msg">Cargando usuarios... </div>;

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
              <th>Usuario</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Puntos</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users. length > 0 ? users. map(profile => (
              <tr key={profile.id}>
                <td>{profile.id}</td>
                <td><strong>{profile.user?.username || profile.username || "N/A"}</strong></td>
                <td>{profile. user?. firstName || profile.firstName || "N/A"}</td>
                <td>{profile.user?.lastName || profile.lastName || "N/A"}</td>
                <td className="loyalty-points">{profile.loyaltyPoints || 0} pts</td>
                <td>
                  <span className="badge badge-success">
                    {profile.user?.role || "CLIENTE"}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn-edit" 
                      onClick={() => openEditModal(profile)}
                      title="Editar usuario"
                    >
                      ✏️
                    </button>
                    <button 
                      className="btn-delete" 
                      onClick={() => handleDelete(profile.id)}
                      title="Eliminar usuario"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="7" className="empty-state">
                  No hay clientes registrados aún.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para Crear/Editar */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingUser ?  'Editar Cliente' : 'Nuevo Cliente'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="user-form">
              <div className="form-group">
                <label htmlFor="username">Usuario *</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  placeholder="nombre.usuario"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  Contraseña {editingUser ?  '(dejar en blanco para no cambiar)' : '*'}
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required={! editingUser}
                  placeholder="••••••••"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">Nombre *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    placeholder="Juan"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Apellido *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    placeholder="Pérez"
                  />
                </div>
              </div>

              {editingUser && (
                <div className="form-group">
                  <label htmlFor="loyaltyPoints">Puntos de Fidelidad</label>
                  <input
                    type="number"
                    id="loyaltyPoints"
                    name="loyaltyPoints"
                    value={formData.loyaltyPoints}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
              )}

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingUser ? 'Actualizar' : 'Crear'} Cliente
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


