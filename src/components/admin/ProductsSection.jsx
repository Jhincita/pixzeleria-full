import { useState, useEffect } from 'react';
import api from '../../services/api';
import '../../styles/AdminPanel.css';

const ProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados del Formulario
  const [editingPizza, setEditingPizza] = useState(null);
  
  // Datos
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    ingredientIds: []
  });

  // Cargar datos al montar
  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
        // 1. Cargar Pizzas
        const resPizzas = await api.get('/pizzas');
        setProducts(resPizzas.data);

        // 2. Cargar Ingredientes
        const resIng = await api.get('/ingredients');
        setIngredients(resIng.data);

    } catch (error) { 
        console.error("Error cargando productos:", error); 
    } finally { 
        setLoading(false); 
    }
  };

  // Preparar edición
  const handleEdit = (pizza) => {
    setEditingPizza(pizza);
    setFormData({
        name: pizza.name,
        price: pizza.price || '',
        stock: pizza.stock || '',
        ingredientIds: pizza.ingredients ? pizza.ingredients.map(i => i.id) : []
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingPizza(null);
    setFormData({ name: '', price: '', stock: '', ingredientIds: [] });
  };

  // Checkboxes
  const handleCheckboxChange = (ingredientId) => {
    const currentIds = formData.ingredientIds;
    if (currentIds.includes(ingredientId)) {
      setFormData({ ...formData, ingredientIds: currentIds.filter(id => id !== ingredientId) });
    } else {
      setFormData({ ...formData, ingredientIds: [...currentIds, ingredientId] });
    }
  };

  // Guardar pizza (Crear o Editar)
  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert("Nombre obligatorio");
    // if (formData.ingredientIds.length === 0) return alert("Selecciona ingredientes"); // Opcional

    const pizzaDTO = { 
        name: formData.name, 
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock) || 0,
        ingredientIds: formData.ingredientIds 
    }; 
    
    try {
        if (editingPizza) {
            // EDITAR (PUT)
            await api.put(`/pizzas/${editingPizza.id}`, pizzaDTO);
            alert("Pizza actualizada ദ്ദി◝ ⩊ ◜.ᐟ");
        } else {
            // CREAR (POST)
            await api.post('/pizzas', pizzaDTO); // Nota: Revisa si tu backend tiene POST /api/pizzas implementado para admins
            alert("Pizza creada ദ്ദി◝ ⩊ ◜.ᐟ");
        }

        handleCancel();
        fetchData(); 
    } catch (error) { 
        console.error(error); 
        alert("Error al guardar. Revisa la consola."); 
    }
  };

  // Eliminar
  const handleDelete = async (id) => {
    if(!window.confirm("¿Borrar pizza?")) return;
    try {
        await api.delete(`/pizzas/${id}`);
        fetchData();
    } catch (error) {
        console.error(error);
        alert("Error al borrar.");
    }
  };

  if (loading) return <div style={{padding:'20px', textAlign:'center'}}>Cargando menú... 🍕</div>;

  return (
    <div className="section-container">
      <div className="section-header">
        <h2>Gestión de Pizzas</h2>
      </div>
      
      {/* FORMULARIO */}
      <div style={{marginBottom: '30px', padding:'20px', background: editingPizza ? '#fff8e1' : '#fff', border:'1px solid #ddd', borderRadius:'8px'}}>
        <h3 style={{marginTop: 0}}>
            {editingPizza ? `✏️ Editando: ${editingPizza.name}` : 'Agregar Nueva Pizza'}
        </h3>
        
        <form onSubmit={handleSave}>
            <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '15px', marginBottom: '15px'}}>
                <div>
                    <label style={{fontWeight:'bold'}}>Nombre:</label>
                    <input 
                        type="text" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        required
                        style={{width: '100%', padding: '10px'}}
                    />
                </div>
                <div>
                    <label style={{fontWeight:'bold'}}>Precio ($):</label>
                    <input 
                        type="number" 
                        value={formData.price}
                        onChange={e => setFormData({...formData, price: e.target.value})}
                        required
                        placeholder="Ej: 8000"
                        style={{width: '100%', padding: '10px'}}
                    />
                </div>
                <div>
                    <label style={{fontWeight:'bold'}}>Stock:</label>
                    <input 
                        type="number" 
                        value={formData.stock}
                        onChange={e => setFormData({...formData, stock: e.target.value})}
                        placeholder="Ej: 50"
                        style={{width: '100%', padding: '10px'}}
                    />
                </div>
            </div>

            <div style={{marginBottom: '20px'}}>
                <label style={{display:'block', marginBottom:'10px', fontWeight:'bold'}}>Ingredientes (Opcional):</label>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
                    {ingredients.length > 0 ? ingredients.map(ing => (
                        <label key={ing.id} style={{
                            display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 10px', 
                            background: formData.ingredientIds.includes(ing.id) ? '#e8f5e9' : '#f5f5f5',
                            border: formData.ingredientIds.includes(ing.id) ? '1px solid #4CAF50' : '1px solid #ddd',
                            borderRadius: '15px', cursor: 'pointer'
                        }}>
                            <input 
                                type="checkbox" 
                                checked={formData.ingredientIds.includes(ing.id)}
                                onChange={() => handleCheckboxChange(ing.id)}
                            />
                            {ing.name}
                        </label>
                    )) : <p>No hay ingredientes cargados.</p>}
                </div>
            </div>

            <div style={{display:'flex', gap:'10px'}}>
                {editingPizza && (
                    <button type="button" onClick={handleCancel} style={{background:'#95a5a6', color:'white', border:'none', padding:'10px 20px', borderRadius:'5px', cursor:'pointer'}}>
                        Cancelar
                    </button>
                )}
                <button type="submit" style={{background: editingPizza ? '#f39c12' : '#27ae60', color:'white', border:'none', padding:'10px 20px', borderRadius:'5px', cursor:'pointer', fontWeight:'bold'}}>
                    {editingPizza ? 'Guardar Cambios' : 'Guardar Pizza'}
                </button>
            </div>
        </form>
      </div>

      {/* Tabla */}
      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr><th>ID</th><th>Nombre</th><th>Precio</th><th>Stock</th><th>Ingredientes</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td><strong>{p.name}</strong></td>
                <td>${(p.price || 0).toLocaleString('es-CL')}</td>
                <td>{p.stock || 0}</td>
                <td>
                    {p.ingredients?.map(i => i.name).join(", ")}
                </td>
                <td>
                  <button onClick={() => handleEdit(p)} style={{marginRight:'10px', cursor:'pointer'}}>✏️</button>
                  <button onClick={() => handleDelete(p.id)} style={{color:'red', cursor:'pointer'}}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsSection;

