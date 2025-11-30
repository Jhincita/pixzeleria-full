import { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import '../../styles/AdminPanel.css'

const AdminLayout = ({ children, activeSection, onSectionChange }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    const user = sessionStorage.getItem('adminUser');

    if (!isLoggedIn || isLoggedIn !== 'true') {
      // Redirige al login si no hay sesión
      window.location.href = '/';
    } else {
      setAdminUser(JSON.parse(user));
    }
  }, []);

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      sessionStorage.removeItem('adminLoggedIn');
      sessionStorage.removeItem('adminUser');
      window.location.href = '/';
    }
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  if (!adminUser) {
    return (
      <div className="admin-loading">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <AdminSidebar
        isCollapsed={isSidebarCollapsed}
        activeSection={activeSection}
        onSectionChange={onSectionChange}
        onLogout={handleLogout}
      />

      <main className={`admin-main ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <AdminHeader
          adminUser={adminUser}
          activeSection={activeSection}
          onToggleSidebar={toggleSidebar}
        />

        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;