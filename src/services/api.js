import axios from 'axios';

// Base URL of your backend
const BASE_URL = "http://localhost:8080/api";
export async function getClients() {
    const response = await fetch(`${BASE_URL}/clients`);
    return response.json();
}


// Example: delete a client
export const deleteClient = (id) => {
    return axios.delete(`${BASE_URL}/api/clients/${id}`);
};

// Example: add a client
export const addClient = (clientData) => {
    return axios.post(`${BASE_URL}/api/clients`, clientData);
};
