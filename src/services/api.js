import axios from 'axios';

// Base URL of your backend
const BASE_URL = 'http://localhost:8080';

// Example: get all clients
export const getClients = () => {
    return axios.get(`${BASE_URL}/api/clients`);
};

// Example: delete a client
export const deleteClient = (id) => {
    return axios.delete(`${BASE_URL}/api/clients/${id}`);
};

// Example: add a client
export const addClient = (clientData) => {
    return axios.post(`${BASE_URL}/api/clients`, clientData);
};
