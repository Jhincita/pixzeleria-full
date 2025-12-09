import { useState, useEffect } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import Dashboard from '../components/admin/Dashboard';
import OrdersSection from '../components/admin/OrdersSection';
import ProductsSection from '../components/admin/ProductsSection';
import UsersSection from '../components/admin/UsersSection';
import ReportsSection from '../components/admin/ReportsSection';

const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
    
    console.log('🔐 Token en AdminPanel:', storedToken ? 'SÍ existe' : '❌ NO existe');
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard token={token} />;
      case 'orders':
        return <OrdersSection token={token} />;
      case 'products':
        return <ProductsSection token={token} />;
      case 'users':
        return <UsersSection token={token} />;
      case 'reports':
        return <ReportsSection token={token} />;
      default:
        return <Dashboard token={token} />;
    }
  };

  return (
    <AdminLayout activeSection={activeSection} setActiveSection={setActiveSection}>
      {renderSection()}
    </AdminLayout>
  );
};

export default AdminPanel;
