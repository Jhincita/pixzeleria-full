import { useState, useEffect } from 'react';
import api from '../../services/api';
import '../../styles/AdminPanel.css';

const UserSection = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchUsers();
  }, []);

  if (loading) return <div className="loading-msg">Cargando usuarios... </div>;

  return (
    <div className="section-container">
      <div className="section-header">
        <h2>Gestión de Clientes</h2>
      </div>
      
      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Nombre Completo</th>
              <th>Puntos Fidelidad</th>
              <th>Rol</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? users.map(profile => (
              <tr key={profile.id}>
                <td>{profile.id}</td>
                {/* Accedemos a los datos anidados del usuario */}
                <td><strong>{profile.user?.username || "N/A"}</strong></td>
                <td>{profile.user ? `${profile.user.firstName} ${profile.user.lastName}` : "Sin datos"}</td>
                <td style={{color: '#d35400', fontWeight: 'bold'}}>{profile.loyaltyPoints} pts</td>
                <td>
                    <span style={{
                        background: '#e8f6f3', color: '#1abc9c', 
                        padding: '4px 8px', borderRadius: '4px', fontSize: '0.9em'
                    }}>
                        {profile.user?.role || "CLIENTE"}
                    </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>
                  No hay clientes registrados aún.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserSection;

