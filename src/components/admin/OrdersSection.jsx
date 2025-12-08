import { useState, useEffect } from 'react';
import '../../styles/AdminPanel.css';

const OrderSection = ({ token }) => { 
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/orders', {
        headers: { 
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.sort((a, b) => b.id - a.id));
      } else {
        console.error("Error al cargar órdenes:", response.status);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm(`¿Estás segura de eliminar el pedido #${id}?`)) return;

    try {
        const response = await fetch(`http://localhost:8080/api/v1/orders/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        if (response.ok) {
            fetchOrders();
        } else {
            alert("No se pudo eliminar el pedido.");
        }
    } catch (error) {
        console.error(error);
    }
  };


  const calculateTotal = (items) => {
    if (!items) return 0;
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  if (loading) return <div style={{padding:'20px'}}>Cargando pedidos...</div>;

  return (
    <div className="section-container">
      <div className="section-header">
        <h2>Historial de Pedidos</h2>
      </div>

      <div className="table-responsive">
        <table className="admin-table" style={{width: '100%', borderCollapse: 'collapse'}}>
          <thead>
            <tr style={{background: '#f4f4f4', textAlign: 'left'}}>
              <th style={{padding:'10px'}}>ID</th>
              <th style={{padding:'10px'}}>Cliente</th>
              <th style={{padding:'10px'}}>Detalles del Pedido (Ingredientes)</th>
              <th style={{padding:'10px'}}>Total ($)</th>
              <th style={{padding:'10px'}}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} style={{borderBottom: '1px solid #ddd'}}>
                <td style={{padding:'10px'}}>#{order.id}</td>
                
                <td style={{padding:'10px'}}>
                    {order.client ? (
                        <span>
                            <strong>{order.client.username}</strong>
                            <br/>
                            <small style={{color:'#666'}}>{order.client.firstName} {order.client.lastName}</small>
                        </span>
                    ) : "Cliente Desconocido"}
                </td>
                
                <td style={{padding:'10px'}}>
                    <ul style={{margin: 0, paddingLeft: '15px', fontSize: '0.9em'}}>
                        {order.items?.map((item, idx) => (
                            <li key={idx} style={{marginBottom: '5px'}}>
                                <strong>{item.quantity}x {item.product?.name || "Producto"}</strong>
                                <br/>
                                <span style={{fontSize: '0.85em', color: '#777', fontStyle: 'italic'}}>
                                    {item.product && item.product.ingredients && item.product.ingredients.length > 0 
                                        ? `[ ${item.product.ingredients.map(i => i.name).join(", ")} ]`
                                        : "(Sin ingredientes extra)"
                                    }
                                </span>
                            </li>
                        ))}
                    </ul>
                </td>

                <td style={{fontWeight: 'bold', color: '#27ae60', padding:'10px'}}>
                    ${calculateTotal(order.items).toLocaleString('es-CL')}
                </td>
                
                <td style={{padding:'10px'}}>
                    <button 
                        onClick={() => handleDelete(order.id)}
                        style={{
                            background: '#ffeded', color: '#e74c3c', 
                            border: '1px solid #e74c3c', borderRadius: '4px',
                            cursor: 'pointer', padding: '5px 10px'
                        }}
                    >
                        🗑️ Borrar
                    </button>
                </td>
              </tr>
            ))}
            
            {orders.length === 0 && (
                <tr><td colSpan="5" style={{padding:'20px', textAlign:'center'}}>No hay pedidos registrados.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderSection;
