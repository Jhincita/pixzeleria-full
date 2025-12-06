import { useState, useEffect } from 'react';
import '../../styles/AdminPanel.css';

const UsersSection = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '', lastname: '', email: '', password: '', role: 'CLIENTE', run: '', status: 'active'
  });

  // Cargar usuarios
  const loadUsers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/users', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (response.ok) {
        const data = await response.json();
        // Mapeo Backend -> Frontend
        const mappedUsers = data.map(u => ({
            id: u.id,
            name: u.firstName,
            lastname: u.lastName,
            email: u.username,
            role: u.role === 'ADMIN' ? 'admin' : 'user', 
            rawRole: u.role, // Guardamos el rol original del backend para el form
            status: u.status || 'active',
            run: u.run || ''
        }));
        setUsers(mappedUsers);
      }
    } catch (error) { console.error(error); }
  };

  useEffect(() => { if(token) loadUsers(); }, [token]);

  // ABRIR FORMULARIO
  const handleOpenForm = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name || '',
        lastname: user.lastname || '',
        email: user.email || '',
        password: '', // Vacía al editar
        role: user.rawRole || 'CLIENTE', // Usamos el valor real del backend
        run: user.run || '',
        status: user.status || 'active'
      });
    } else {
      setEditingUser(null);
      setFormData({ name: '', lastname: '', email: '', password: '', role: 'CLIENTE', run: '', status: 'active' });
    }
    setShowForm(true);
  };

  // Validación explícita
  const validateForm = () => {
    if (!formData.name.trim()) { alert("Falta el Nombre"); return false; }
    if (!formData.lastname.trim()) { alert("Falta el Apellido"); return false; }
    if (!formData.email.trim()) { alert("Falta el Email"); return false; }
    
    // Solo pedimos contraseña si es NUEVO usuario. Si es editar, puede ir vacía.
    if (!editingUser && !formData.password) { 
        alert("Falta la Contraseña (es usuario nuevo)"); return false; 
    }
    
    return true;
  };

  // Guardar usuario
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Intentando guardar...", formData); // Mensajes de consola porque a veces falla en silencio XD

    if (!validateForm()) {
        console.log("Validación falló");
        return;
    }

    // Preparar datos para el backend
    const backendData = {
        firstName: formData.name,
        lastName: formData.lastname,
        username: formData.email,
        role: formData.role === 'admin' ? 'ADMIN' : formData.role, // Asegurar mayúsculas si es necesario
        run: formData.run,
        status: formData.status
    };

    // Agregar contraseña solo si se escribió algo
    if (formData.password && formData.password.trim() !== "") {
        backendData.password = formData.password;
    }

    try {
        let url = 'http://localhost:8080/api/v1/auth/register';
        let method = 'POST';

        if (editingUser) {
            url = `http://localhost:8080/api/v1/users/${editingUser.id}`;
            method = 'PUT';
            console.log("Enviando PUT a:", url); // <--- DEBUG
        }

        const response = await fetch(url, {
            method: method,
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token 
            },
            body: JSON.stringify(backendData)
        });

        if (response.ok) {
            alert(editingUser ? "Usuario actualizado ദ്ദി◝ ⩊ ◜.ᐟ" : "Usuario creado ദ്ദി◝ ⩊ ◜.ᐟ");
            loadUsers();
            setShowForm(false);
        } else {
            const errorText = await response.text();
            console.error("Error del servidor:", errorText);
            alert("Error al guardar. Revisa la consola.");
        }
    } catch (error) { 
        console.error(error);
        alert("Error de conexión"); 
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("¿Borrar usuario?")) return;
    await fetch(`http://localhost:8080/api/v1/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
    });
    loadUsers();
  };

  const handleInputChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  return (
    <div className="section-container">
      <div className="section-header" style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
        <h2>Gestión de Usuarios</h2>
        <button onClick={() => handleOpenForm()} style={{background:'#27ae60', color:'white', border:'none', padding:'10px', cursor:'pointer'}}>+ Nuevo Usuario</button>
      </div>

      {showForm && (
        <div style={{background:'#f9f9f9', padding:'20px', marginBottom:'20px', border:'1px solid #ddd'}}>
            <h3>{editingUser ? 'Editar Usuario' : 'Crear Usuario'}</h3>
            
            {/* Agregamos onSubmit aquí explícitamente */}
            <form onSubmit={handleSubmit} style={{display:'grid', gap:'10px'}}>
                <input name="name" placeholder="Nombre" value={formData.name} onChange={handleInputChange} required />
                <input name="lastname" placeholder="Apellido" value={formData.lastname} onChange={handleInputChange} required />
                <input name="email" placeholder="Usuario/Email" value={formData.email} onChange={handleInputChange} required />
                <input name="run" placeholder="RUN" value={formData.run} onChange={handleInputChange} />
                
                {/* Input de contraseña (opcional al editar) */}
                <input 
                    type="password" 
                    name="password" 
                    placeholder={editingUser ? "Nueva Contraseña (dejar en blanco para mantener)" : "Contraseña"} 
                    value={formData.password} 
                    onChange={handleInputChange} 
                    required={!editingUser} 
                />

                <select name="role" value={formData.role} onChange={handleInputChange}>
                    <option value="CLIENTE">Usuario</option>
                    <option value="ADMIN">Administrador</option>
                </select>
                
                <div style={{display:'flex', gap:'10px'}}>
                    <button type="button" onClick={() => setShowForm(false)}>Cancelar</button>
                    {/* Botón submit explícito*/}
                    <button type="submit" style={{background:'#2980b9', color:'white', cursor:'pointer'}}>Guardar</button>
                </div>
            </form>
        </div>
      )}

      <table className="admin-table" style={{width:'100%', borderCollapse:'collapse'}}>
        <thead>
          <tr style={{background:'#eee', textAlign:'left'}}><th>ID</th><th>Usuario</th><th>Nombre</th><th>Rol</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} style={{borderBottom:'1px solid #ddd'}}>
              <td>{u.id}</td>
              <td>{u.email}</td>
              <td>{u.name} {u.lastname}</td>
              <td>{u.role}</td>
              <td>
                <button onClick={() => handleOpenForm(u)} style={{marginRight:'10px', cursor:'pointer'}}>✏️ Editar</button>
                {u.role !== 'admin' && (
                    <button onClick={() => handleDelete(u.id)} style={{color:'red', cursor:'pointer'}}>🗑️ Borrar</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersSection;
