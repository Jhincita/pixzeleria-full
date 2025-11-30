export const createDefaultAdmin = () => {
  const users = JSON.parse(localStorage.getItem('pixeleriaUsers')) || [];
  
  const adminExists = users.some(user => user.email === 'admin@pixzeleria.com');
  
  if (!adminExists) {
    users.push({
      run: '12345678-9',
      name: 'Admin',
      lastname: 'Principal',
      email: 'admin@pixzeleria.com',
      password: 'admin123',
      role: 'admin',
      status: 'active'
    });
    localStorage.setItem('pixeleriaUsers', JSON.stringify(users));
    console.log('Usuario Admin creado exitosamente');
  } else {
    console.log('El usuario admin ya existe');
  }
};