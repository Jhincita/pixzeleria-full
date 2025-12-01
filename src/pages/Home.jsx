import React, { useEffect, useState } from 'react';
import { getClients } from "../services/api";

export default function Home({ User, setUser }) {
    const [clients, setClients] = useState([]);

    useEffect(() => {
        getClients()
            .then(res => setClients(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div>
            <h2>Bienvenido {User ? User.name : "Invitado"}</h2>

            <ul>
                {clients.map(c => <li key={c.id}>{c.name}</li>)}
            </ul>
        </div>
    );
}
