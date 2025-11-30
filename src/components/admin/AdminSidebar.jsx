const AdminSidebar = ({ isCollapsed, activeSection, onSectionChange, onLogout }) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'fas fa-home'
    },
    {
      id: 'products',
      label: 'Gestión de Productos',
      icon: 'fas fa-pizza-slice'
    },
    {
      id: 'users',
      label: 'Gestión de Usuarios',
      icon: 'fas fa-users'
    },
    {
      id: 'orders',
      label: 'Gestión de Órdenes',
      icon: 'fas fa-shopping-cart'
    },
    {
      id: 'reports',
      label: 'Reportes',
      icon: 'fas fa-chart-bar'
    }
  ];

  return (
    <aside className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h1>Pixzelería</h1>
        {!isCollapsed && <p>Panel de Administración</p>}
      </div>

      <nav className="sidebar-nav">
        <ul>
          {menuItems.map(item => (
            <li
              key={item.id}
              className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => onSectionChange(item.id)}
            >
              <i className={item.icon}></i>
              {!isCollapsed && <span>{item.label}</span>}
            </li>
          ))}

          <li className="nav-item logout-btn" onClick={onLogout}>
            <i className="fas fa-sign-out-alt"></i>
            {!isCollapsed && <span>Cerrar Sesión</span>}
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;