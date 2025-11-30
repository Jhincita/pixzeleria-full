import React, { useState } from "react";
import Window from "../components/Window";
import CheckoutResult from "./CheckoutResult";

export default function CartPage({ cart, setCart }) {
    const [showCheckout, setShowCheckout] = useState(false);
    const [orderData, setOrderData] = useState(null);

    const removeItem = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const updateQuantity = (id, amount) => {
        setCart(cart.map(item =>
            item.id === id
                ? { ...item, quantity: Math.max(item.quantity + amount, 1) }
                : item
        ));
    };

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const handleCheckout = () => {
        setOrderData({
            items: [...cart],
            total: total,
            timestamp: new Date()
        });
        setCart([]);
        setShowCheckout(true);
    };

    const handleCloseCheckout = () => {
        setShowCheckout(false);
        setOrderData(null);
    };

    return (
        <div className="form-wrapper">
            <h2>Carrito</h2>

            {cart.length === 0 ? (
                <div style={{
                    padding: '40px 20px',
                    textAlign: 'center',
                    color: '#666'
                }}>
                    <p style={{ fontSize: '3em', margin: '0' }}>🛒</p>
                    <p style={{ fontSize: '1.2em', margin: '10px 0' }}>
                        Tu carrito está vacío
                    </p>
                    <p style={{ fontSize: '0.9em' }}>
                        ¡Agrega algunas pizzas deliciosas!
                    </p>
                </div>
            ) : (
                <>
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {cart.map(({ id, name, price, quantity }) => (
                            <li
                                key={id}
                                style={{
                                    marginBottom: "12px",
                                    padding: "12px",
                                    border: "2px solid #000",
                                    backgroundColor: "#fff"
                                }}
                            >
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '8px'
                                }}>
                                    <strong style={{ fontSize: '1.1em' }}>{name}</strong>
                                    <span style={{ color: '#666' }}>
                                        ${price.toFixed(2)} c/u
                                    </span>
                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        gap: "8px",
                                        marginTop: "10px"
                                    }}
                                >
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <button
                                            onClick={() => updateQuantity(id, -1)}
                                            style={{
                                                padding: '6px 12px',
                                                border: '2px solid #000',
                                                backgroundColor: '#f4f4f4',
                                                cursor: 'pointer',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            −
                                        </button>
                                        <span style={{
                                            minWidth: '30px',
                                            textAlign: 'center',
                                            fontWeight: 'bold'
                                        }}>
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(id, +1)}
                                            style={{
                                                padding: '6px 12px',
                                                border: '2px solid #000',
                                                backgroundColor: '#f4f4f4',
                                                cursor: 'pointer',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            +
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => removeItem(id)}
                                        style={{
                                            padding: '6px 12px',
                                            border: '2px solid #000',
                                            backgroundColor: '#ff6b6b',
                                            color: '#fff',
                                            cursor: 'pointer',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Eliminar
                                    </button>
                                </div>

                                <div style={{
                                    marginTop: '8px',
                                    textAlign: 'right',
                                    fontWeight: 'bold'
                                }}>
                                    Subtotal: ${(price * quantity).toFixed(2)}
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div style={{
                        marginTop: '20px',
                        padding: '15px',
                        border: '2px solid #000',
                        backgroundColor: '#f9f9f9'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '1.3em',
                            fontWeight: 'bold',
                            marginBottom: '15px'
                        }}>
                            <span>TOTAL:</span>
                            <span>${total.toFixed(2)}</span>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className="pixel-button"
                            style={{
                                width: '100%',
                                padding: '15px',
                                fontSize: '1.1em',
                                backgroundColor: '#4CAF50',
                                color: '#fff',
                                border: '2px solid #000',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            Finalizar Compra
                        </button>
                    </div>
                </>
            )}

            <Window
                title="CONFIRMACIÓN DE PEDIDO"
                isOpen={showCheckout}
                onClose={handleCloseCheckout}
            >
                {orderData && (
                    <CheckoutResult
                        order={orderData}
                        onClose={handleCloseCheckout}
                    />
                )}
            </Window>
        </div>
    );
}