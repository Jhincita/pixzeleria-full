const AdminHeader = () => {
  const user = JSON.parse(sessionStorage.getItem('user')) || { username: 'Admin' };

  return (
    <header style={{ background: 'white', padding: '15px 20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h3 style={{ margin: 0, color: '#333' }}>Pixzelería Management</h3>
      <div className="user-info" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontWeight: 'bold' }}>Hola, {user.username}</span>
        <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: '#3498db', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {user.username.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
