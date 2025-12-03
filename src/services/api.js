import axios from 'axios';

const API_BASE_URL = '/api';


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
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Pizza API
export const pizzaAPI = {
    // Create custom pizza
    createCustomPizza: (pizzaData) => api.post('/pizzas/custom', pizzaData),

    // Get all pizzas
    getAllPizzas: () => api.get('/pizzas'),

    // Get pizza by ID
    getPizzaById: (id) => api.get(`/pizzas/${id}`),
};

// Client API
export const clientAPI = {
    // Register new client
    register: (clientData) => api.post('/clients', clientData),

    // Get all clients
    getAllClients: () => api.get('/clients'),

    // Get client by ID
    getClientById: (id) => api.get(`/clients/${id}`),
};

// Auth API
export const authAPI = {
    // Login
    login: (credentials) => api.post('/auth/login', credentials),

    // Register
    register: (userData) => api.post('/auth/register', userData),

    // Logout (clear token from localStorage)
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Check if user is logged in
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    // Get current user
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
};

// Shorthand exports for convenience
export const getClients = () => api.get('/clients');
export const getClient = (id) => api.get(`/clients/${id}`);
export const createClient = (data) => api.post('/clients', data);
export const getAllPizzas = () => api.get('/pizzas');
export const createPizza = (data) => api.post('/pizzas/custom', data);

export default api;