const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-shopping-bag"></i>
          </div>
          <div className="stat-info">
            <h3>Ventas Hoy</h3>
            <p className="stat-number">$152,800</p>
            <p className="stat-change positive">+12%</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-info">
            <h3>Usuarios Registrados</h3>
            <p className="stat-number">1,258</p>
            <p className="stat-change positive">+8%</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-pizza-slice"></i>
          </div>
          <div className="stat-info">
            <h3>Órdenes Pendientes</h3>
            <p className="stat-number">24</p>
            <p className="stat-change negative">-3%</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-star"></i>
          </div>
          <div className="stat-info">
            <h3>Productos Más Vendidos</h3>
            <p className="stat-number">5</p>
            <p className="stat-change">Destacados</p>
          </div>
        </div>
      </div>

      <div className="content-grid">
        <div className="content-card">
          <h3>Productos Más Vendidos</h3>
          <div className="best-sellers-list">
            {[
              { name: "Pixza Pepperoni", sales: 152, revenue: "1.4M" },
              { name: "Pixza Margarita", sales: 128, revenue: "1.1M" },
              { name: "Pixza Hawaiana", sales: 98, revenue: "890K" },
              { name: "Pixza Cuatro Quesos", sales: 76, revenue: "720K" },
              { name: "Pixza Vegetariana", sales: 64, revenue: "580K" }
            ].map((product, index) => (
              <div key={index} className="product-item">
                <div className="product-info">
                  <span className="product-rank">{index + 1}</span>
                  <span className="product-name">{product.name}</span>
                </div>
                <div className="product-stats">
                  <span className="sales-count">{product.sales} ventas</span>
                  <span className="revenue">${product.revenue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="content-card">
          <h3>Nuevos Usuarios Registrados</h3>
          <div className="new-users-list">
            {[
              { name: "Juan Perez", time: "Hoy, 14:30" },
              { name: "Maria Gonzalez", time: "Hoy, 12:45" },
              { name: "Carlos Lopez", time: "Hoy, 10:20" },
              { name: "Ana Martinez", time: "Ayer, 18:40" }
            ].map((user, index) => (
              <div key={index} className="user-item">
                <div className="user-avatar-small">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="user-info">
                  <span className="user-name">{user.name}</span>
                  <span className="user-time">{user.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;