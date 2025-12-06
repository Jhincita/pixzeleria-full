import { useState, useEffect } from 'react';
import '../../styles/AdminPanel.css';

const OrdersSection = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data.sort((a, b) => b.id - a.id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás segura de eliminar este historial de pedido?")) return;
    try {
        await fetch(`http://localhost:8080/api/v1/orders/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchOrders();
    } catch (error) { console.error(error); }
  };

  const calculateOrderTotal = (items) => {
    return items ? items.reduce((sum, item) => sum + (item.price * item.quantity), 0) : 0;
  };

  return (
    <div className="section-container">
      <div className="section-header">
        <h2>Gestión de Pedidos</h2>
        <p>Historial de compras realizadas</p>
      </div>

      {loading ? <p>Cargando pedidos...</p> : (
      <div className="table-responsive" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
        <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
          <thead style={{ background: '#34495e', color: 'white' }}>
            <tr>
              <th style={{ padding: '15px' }}>#ID</th>
              <th style={{ padding: '15px' }}>Cliente</th>
              <th style={{ padding: '15px' }}>Detalle del Pedido</th>
              <th style={{ padding: '15px' }}>Total</th>
              <th style={{ padding: '15px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '15px', fontWeight: 'bold' }}>#{order.id}</td>
                
                <td style={{ padding: '15px' }}>
                    <div style={{fontWeight:'bold'}}>{order.client ? order.client.username : "Anon"}</div>
                    <div style={{fontSize:'0.8em', color:'#666'}}>{order.client?.firstName} {order.client?.lastName}</div>
                </td>
                
                {/* --- Detalle con ingredientes --- */}
                <td style={{ padding: '15px' }}>
                    {order.items && order.items.map((item, idx) => (
                        <div key={idx} style={{ marginBottom: '8px', paddingBottom: '5px', borderBottom: '1px dotted #eee' }}>
                            <div style={{fontWeight: 'bold', color: '#2c3e50'}}>
                                <span style={{ color: '#e67e22' }}>{item.quantity}x</span> 
                                {' '}
                                {item.product ? item.product.name : "Producto Desconocido"}
                            </div>
                            
                            {/* Lista de Ingredientes pequeña */}
                            <div style={{ fontSize: '0.85em', color: '#7f8c8d', fontStyle: 'italic', marginLeft: '25px' }}>
                                {item.product && item.product.ingredients && item.product.ingredients.length > 0 
                                    ? item.product.ingredients.map(ing => ing.name).join(", ")
                                    : ""
                                }
                            </div>
                        </div>
                    ))}
                </td>

                <td style={{ padding: '15px', fontWeight: 'bold', color: '#27ae60' }}>
                    ${calculateOrderTotal(order.items).toLocaleString('es-CL')}
                </td>
                
                <td style={{ padding: '15px' }}>
                  <button 
                    onClick={() => handleDelete(order.id)} 
                    style={{
                        background: '#ffeded', color: '#e74c3c', border: '1px solid #e74c3c', 
                        padding: '5px 10px', borderRadius: '4px', cursor: 'pointer'
                    }}
                  >
                    🗑️ Borrar
                  </button>
                </td>
              </tr>
            ))}
            
            {orders.length === 0 && (
                <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>No hay pedidos registrados</td></tr>
            )}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
};

export default OrdersSection;
