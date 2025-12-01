import React, { useEffect, useState } from "react";
import { getClients } from "../services/api"; // make sure path is correct

export default function Home() {
    const [clients, setClients] = useState([]);

    useEffect(() => {
        getClients()
            .then(res => setClients(res.data))
            .catch(err => console.error("Error fetching clients:", err));
    }, []);

    return (
        <div>
            <h2>Clients List</h2>
            {clients.length === 0 ? (
                <p>Loading...</p>
            ) : (
                <table border="1" cellPadding="5">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                    </tr>
                    </thead>
                    <tbody>
                    {clients.map(c => (
                        <tr key={c.id}>
                            <td>{c.id}</td>
                            <td>{c.username || "(null)"}</td>
                            <td>{c.firstName}</td>
                            <td>{c.lastName}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
