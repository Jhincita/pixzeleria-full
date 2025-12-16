import { useNavigate } from 'react-router-dom';

const AdminSidebar = ({ activeSection, setActiveSection }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'orders', label: 'Pedidos' },
    { id: 'products', label: 'Productos' },
    { id: 'users', label: 'Usuarios' },
    { id: 'reports', label: 'Reportes' },
  ];

  return (
    <aside className="admin-sidebar" style={{ width: '250px', backgroundColor: '#2c3e50', color: 'white', display: 'flex', flexDirection: 'column' }}>
      <div className="sidebar-header" style={{ padding: '20px', borderBottom: '1px solid #34495e' }}>
        <h2 style={{ margin: 0, fontSize: '1.2em' }}>Admin Panel</h2>
      </div>

      <nav className="sidebar-nav" style={{ flex: 1, padding: '20px 0' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveSection(item.id)}
                style={{
                  width: '100%',
                  padding: '15px 20px',
                  textAlign: 'left',
                  background: activeSection === item.id ? '#34495e' : 'transparent',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '1em'
                }}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer" style={{ padding: '20px', borderTop: '1px solid #34495e' }}>
        <button 
          onClick={handleLogout}
          style={{ width: '100%', padding: '10px', background: '#c0392b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Volver al Home
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
