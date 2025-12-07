import { useState, useEffect } from 'react';
import api from '../../services/api';
import '../../styles/AdminPanel.css';

const OrderSection = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders');
        setOrders(response.data);
      } catch (error) {
        console.error("Error cargando órdenes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Función auxiliar para calcular el total de una orden
  const calculateTotal = (items) => {
    if (!items) return 0;
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  if (loading) return <div className="loading-msg">Cargando pedidos... </div>;

  return (
    <div className="section-container">
      <div className="section-header">
        <h2>Historial de Pedidos</h2>
      </div>

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID Pedido</th>
              <th>Cliente</th>
              <th>Cant. Productos</th>
              <th>Total ($)</th>
              <th>Detalles</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>
                    {order.client ? (
                        <span>
                            <strong>{order.client.username}</strong>
                            <br/>
                            <small>{order.client.firstName} {order.client.lastName}</small>
                        </span>
                    ) : "Cliente Desconocido"}
                </td>
                <td>{order.items?.length || 0} ítems</td>
                <td style={{fontWeight: 'bold', color: '#27ae60'}}>
                    ${calculateTotal(order.items).toLocaleString('es-CL')}
                </td>
                <td>
                    <ul style={{margin: 0, paddingLeft: '20px', fontSize: '0.85em', textAlign: 'left'}}>
                        {order.items?.map((item, idx) => (
                            <li key={idx}>
                                {item.quantity}x {item.product?.name || "Producto"}
                            </li>
                        ))}
                    </ul>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
                <tr><td colSpan="5">No hay pedidos registrados.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderSection;

