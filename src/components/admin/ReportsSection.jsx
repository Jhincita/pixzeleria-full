import { useState, useEffect } from 'react';
import api from '../../services/api';
import '../../styles/AdminPanel.css';

const ReportSection = () => {
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateReports = async () => {
      try {
        // 1. Traemos todas las órdenes
        const response = await api.get('/orders');
        const orders = response.data;

        // 2. Calculamos ventas por producto manualmente
        const productSales = {};

        orders.forEach(order => {
            if (order.items) {
                order.items.forEach(item => {
                    const prodName = item.product?.name || "Producto desconocido";
                    if (!productSales[prodName]) {
                        productSales[prodName] = 0;
                    }
                    productSales[prodName] += item.quantity;
                });
            }
        });

        // 3. Convertimos a array y ordenamos
        const sortedProducts = Object.entries(productSales)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count); // Ordenar de mayor a menor

        setTopProducts(sortedProducts);

      } catch (error) {
        console.error("Error generando reportes:", error);
      } finally {
        setLoading(false);
      }
    };

    generateReports();
  }, []);

  if (loading) return <div className="loading-msg">Generando reportes... 📈</div>;

  return (
    <div className="section-container">
      <div className="section-header">
        <h2>Reportes de Ventas</h2>
      </div>

      <div style={{display: 'flex', gap: '20px', flexWrap: 'wrap'}}>
        
        {/* Tarjeta: Producto Estrella */}
        <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white', padding: '20px', borderRadius: '10px', flex: 1, minWidth: '250px'
        }}>
            <h3 style={{marginTop: 0}}>⭐ Pizza Más Vendida</h3>
            {topProducts.length > 0 ? (
                <div>
                    <h1 style={{fontSize: '2.5em', margin: '10px 0'}}>{topProducts[0].name}</h1>
                    <p>Con <strong>{topProducts[0].count}</strong> unidades vendidas</p>
                </div>
            ) : <p>Aún no hay datos suficientes</p>}
        </div>

        {/* Tabla: Ranking Completo */}
        <div style={{flex: 2, background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'}}>
            <h3>🏆 Ranking de Popularidad</h3>
            <table className="admin-table" style={{marginTop: '10px'}}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Producto</th>
                        <th>Ventas Totales</th>
                    </tr>
                </thead>
                <tbody>
                    {topProducts.map((p, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{p.name}</td>
                            <td>{p.count}</td>
                        </tr>
                    ))}
                    {topProducts.length === 0 && <tr><td colSpan="3">Sin ventas registradas</td></tr>}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default ReportSection;
