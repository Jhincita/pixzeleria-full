import React from "react";

export default function CheckoutResult({ order, onClose }) {
    const orderNumber = Math.floor(100000 + Math.random() * 900000);
    const orderDate = new Date().toLocaleDateString('es-CL');
    const orderTime = new Date().toLocaleTimeString('es-CL');

    return (
        <div className="form-wrapper" style={{ textAlign: 'center' }}>
            <div style={{
                backgroundColor: '#e6ffe6',
                border: '2px solid green',
                padding: '20px',
                marginBottom: '20px',
                borderRadius: '8px'
            }}>
                <h2 style={{ color: 'green', margin: '0 0 10px 0' }}>
                    ¡Pedido Confirmado!
                </h2>
                <p style={{ margin: '5px 0' }}>
                    Tu pedido ha sido recibido y está siendo preparado
                </p>
            </div>

            <div style={{
                backgroundColor: '#fff',
                border: '2px solid #000',
                padding: '20px',
                marginBottom: '20px',
                textAlign: 'left'
            }}>
                <h3 style={{ marginTop: 0, borderBottom: '2px solid #000', paddingBottom: '10px' }}>
                    Detalles del Pedido
                </h3>

                <p><strong>Número de Orden:</strong> #{orderNumber}</p>
                <p><strong>Fecha:</strong> {orderDate}</p>
                <p><strong>Hora:</strong> {orderTime}</p>

                <h4 style={{ marginTop: '20px', marginBottom: '10px' }}>
                    Productos Ordenados:
                </h4>

                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {order.items.map((item, index) => (
                        <li key={index} style={{
                            padding: '10px',
                            backgroundColor: '#f4f4f4',
                            marginBottom: '8px',
                            border: '1px solid #ddd',
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}>
                            <div>
                                <strong>{item.name}</strong>
                                <br />
                                <span style={{ fontSize: '0.9em', color: '#666' }}>
                                    Cantidad: {item.quantity} × ${item.price.toFixed(2)}
                                </span>
                            </div>
                            <div style={{ fontWeight: 'bold' }}>
                                ${(item.price * item.quantity).toFixed(2)}
                            </div>
                        </li>
                    ))}
                </ul>

                <div style={{
                    marginTop: '20px',
                    paddingTop: '15px',
                    borderTop: '2px solid #000',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '1.2em',
                    fontWeight: 'bold'
                }}>
                    <span>TOTAL:</span>
                    <span>${order.total.toFixed(2)}</span>
                </div>
            </div>

            <div style={{
                backgroundColor: '#fffacd',
                border: '2px solid #ffd700',
                padding: '15px',
                marginBottom: '20px',
                borderRadius: '8px'
            }}>
                <p style={{ margin: '5px 0', fontSize: '0.95em' }}>
                    🍕 Tiempo estimado de entrega: <strong>30-45 minutos</strong>
                </p>
                <p style={{ margin: '5px 0', fontSize: '0.9em', color: '#666' }}>
                    Recibirás una notificación cuando tu pedido esté en camino
                </p>
            </div>

            <button
                onClick={onClose}
                className="pixel-button"
                style={{
                    width: '100%',
                    padding: '15px',
                    fontSize: '1.1em'
                }}
            >
                Continuar Comprando
            </button>
        </div>
    );
}