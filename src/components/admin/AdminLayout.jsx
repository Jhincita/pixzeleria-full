import { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import '../../styles/AdminPanel.css'

const AdminLayout = ({ children, activeSection, setActiveSection }) => {
  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f6f9' }}>
      {/* Barra Lateral */}
      <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Contenido Principal */}
      <div className="admin-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AdminHeader />
        <main style={{ padding: '20px', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
