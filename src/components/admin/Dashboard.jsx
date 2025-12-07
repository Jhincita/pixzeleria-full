import { useState, useEffect } from 'react';
import api from '../../services/api';
import '../../styles/AdminPanel.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    ordersCount: 0,
    salesTotal: 0,
    usersCount: 0
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
        try {
            setLoading(true);

            const resOrders = await api.get('/orders');
            const orders = resOrders.data;

            const totalMoney = orders.reduce((acc, order) => {
                const orderItems = order.items || [];
                const orderSum = orderItems.reduce((s, i) => s + (i.price * i.quantity), 0);
                return acc + orderSum;
            }, 0);

            const resUsers = await api.get('/clients'); 
            const users = resUsers.data;

            setStats({
                ordersCount: orders.length,
                salesTotal: totalMoney,
                usersCount: users.length
            });

        } catch (error) {
            console.error("Error cargando dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    loadData();
  }, []);

  const cardStyle = {
    background: 'white', padding: '20px', borderRadius: '8px', 
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)', flex: 1, textAlign: 'center',
    minWidth: '200px'
  };

  if (loading) {
      return <div style={{padding: '20px', textAlign: 'center'}}>Cargando datos... ⏳</div>;
  }

  return (
    <div className="dashboard-container">
      <h2>Panel General</h2>
      <p>Resumen de actividad de la Pixzelería</p>
      
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px', flexWrap: 'wrap' }}>
        
        {/* Tarjeta de Pedidos */}
        <div style={cardStyle}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}></div>
          <h3>Pedidos Totales</h3>
          <p style={{ fontSize: '2em', fontWeight: 'bold', margin: 0 }}>{stats.ordersCount}</p>
        </div>

        {/* Tarjeta de Dinero */}
        <div style={cardStyle}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}></div>
          <h3>Ingresos Totales</h3>
          <p style={{ fontSize: '2em', fontWeight: 'bold', margin: 0, color: '#27ae60' }}>
            ${stats.salesTotal.toLocaleString('es-CL')}
          </p>
        </div>

        {/* Tarjeta de Usuarios */}
        <div style={cardStyle}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}></div>
          <h3>Clientes Registrados</h3>
          <p style={{ fontSize: '2em', fontWeight: 'bold', margin: 0, color: '#2980b9' }}>
            {stats.usersCount}
          </p>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
