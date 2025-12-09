import axios from 'axios';

const API_BASE_URL = 'https://pixzeleria-backend-production.up.railway.app/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 🔥 Add token to all requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('🔐 Token agregado a:', config.url);
        } else {
            console.warn('⚠️ No hay token en localStorage para:', config.url);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Pizza API
export const pizzaAPI = {
    getAllPizzas: () => api.get('/pizzas').then(res => res.data),
    getPizzaById: (id) => api.get(`/pizzas/${id}`).then(res => res.data),
    createCustomPizza: (pizzaData) => api.post('/pizzas/custom', pizzaData).then(res => res.data),
};

// Client API
export const clientAPI = {
    register: (clientData) => api.post('/clients', clientData),
    getAllClients: () => api.get('/clients'),
    getClientById: (id) => api.get(`/clients/${id}`),
};

// Ingredient API
export const ingredientAPI = {
    getAllIngredients: () => api.get('/ingredients'),
    getIngredientById: (id) => api.get(`/ingredients/${id}`),
    getAvailableIngredients: () => api.get('/ingredients/available'),
    getIngredientsByType: (type) => api.get(`/ingredients/type/${type}`),
};

// Auth API
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
};

// Order API
export const orderAPI = {
    createOrder: (orderData) => api.post('/orders', orderData),
    getAllOrders: () => api.get('/orders'),
    getOrderById: (id) => api.get(`/orders/${id}`),
};

// Shorthand exports for convenience
export const getClients = () => api.get('/clients');
export const getClient = (id) => api.get(`/clients/${id}`);
export const createClient = (data) => api.post('/clients', data);
export const getAllPizzas = () => api.get('/pizzas');
export const createPizza = (data) => api.post('/pizzas/custom', data);

export default api;
