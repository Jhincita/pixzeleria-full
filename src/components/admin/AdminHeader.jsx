const AdminHeader = ({ adminUser, activeSection, onToggleSidebar }) => {
  const getSectionTitle = (section) => {
    const titles = {
      dashboard: 'Dashboard',
      products: 'Gestión de Productos',
      users: 'Gestión de Usuarios',
      orders: 'Gestión de Órdenes',
      reports: 'Reportes'
    };
    return titles[section] || 'Panel de Administración';
  };

  const getInitials = (name) => {
    if (!name) return 'AD';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="admin-header">
      <div className="header-left">
        <button className="toggle-sidebar" onClick={onToggleSidebar}>
          <i className="fas fa-bars"></i>
        </button>
        <h2>{getSectionTitle(activeSection)}</h2>
      </div>

      <div className="header-right">
        <div className="admin-user">
          <div className="user-avatar">
            {getInitials(adminUser?.name)}
          </div>
          <div className="user-info">
            <span className="user-name">{adminUser?.name || 'Administrador'}</span>
            <span className="user-role">{adminUser?.role || 'admin'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;