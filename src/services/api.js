import axios from 'axios';

const API_BASE_URL = 'https://pixzeleria-backend-production.up.railway.app/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to all requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.warn('⚠️ No hay token en localStorage para:', config.url);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Pizza API (menu only - no more /custom endpoint)
export const pizzaAPI = {
    getAllPizzas: () => api.get('/pizzas').then(res => res.data),
    getPizzaById: (id) => api.get(`/pizzas/${id}`).then(res => res.data),
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

// Order API - accepts the payload directly from CartPage
export const orderAPI = {
    createOrder: (orderPayload) => {
        console.log('📦 Enviando orden:', orderPayload);
        return api.post('/orders', orderPayload);
    },
    getAllOrders: () => api.get('/orders'),
    getOrderById: (id) => api.get(`/orders/${id}`),
    deleteOrder: (id) => api.delete(`/orders/${id}`),
};

// Client API
export const clientAPI = {
    register: (clientData) => api.post('/clients', clientData),
    getAllClients: () => api.get('/clients'),
    getClientById: (id) => api.get(`/clients/${id}`),
};

// Shorthand exports
export const getAllPizzas = () => api.get('/pizzas');

export default api;