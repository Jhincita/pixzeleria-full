import { useState } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import Dashboard from '../components/admin/Dashboard';

const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <div>Gestión de Productos (próximamente)</div>;
      case 'users':
        return <div>Gestión de Usuarios (próximamente)</div>;
      case 'orders':
        return <div>Gestión de Órdenes (próximamente)</div>;
      case 'reports':
        return <div>Reportes (próximamente)</div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AdminLayout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      {renderSection()}
    </AdminLayout>
  );
};

export default AdminPanel;