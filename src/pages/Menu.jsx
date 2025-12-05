import "./Menu.css";
import MenuImage from "../components/MenuImage";
import { pizzaAPI } from "../services/api.js";
import PixelHoverImage from "../components/PixelHoverImage";

import { useEffect, useState } from "react";

export default function Menu({ cart, setCart }) {

    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedItem, setSelectedItem] = useState(null);


    useEffect(() => {
        async function fetchMenu() {
            try {
                const response = await pizzaAPI.getAllPizzas();
                setMenuItems(response.data);  // ← Must use .data
            } catch (err) {
                console.error("Failed to load menu:", err);
                setMenuItems([]);
            } finally {
                setLoading(false);
            }
        }
        fetchMenu();
    }, []);

    // menu hardcodeado , editar
/*
    const menuItems = [
        {id: 1, name: "Pizza Margherita", price: 8000, img: Pizzamargherita, pixelImg: PizzamargheritaPixel},
        {id: 2, name: "Pizza Prosciutto", price: 10000, img: ProsciuttoPistacchio, pixelImg: ProsciuttoPistacchioPixel},
        {id: 3, name: "Pizza Pepperoni", price: 9000, img: PizzaPepperoni},
        {id: 4, name: "Pizza Prosciutto", price: 10000, img: Prosciutto},
        {id: 5, name: "Pizza Datterini", price: 9000, img: PizzaDatterini},
        {id: 6, name: "Pizza Buffalina", price: 10000, img: PizzaBuffalina},

    ];
*/


    const addToCart = (item) => {
        const exists = cart.find(pizza => pizza.id === item.id);
        if (exists) {
            setCart(
                cart.map(pizza =>
                    pizza.id === item.id
                        ? { ...pizza, quantity: pizza.quantity + 1 }
                        : pizza
                )
            );
        } else {
            setCart([...cart, { ...item, quantity: 1 }]);
        }
    };

    const decreaseFromCart = (item) => {
        const exists = cart.find(pizza => pizza.id === item.id);
        if (!exists) return;
        if (exists.quantity === 1) {
            setCart(cart.filter(pizza => pizza.id !== item.id));
        } else {
            setCart(
                cart.map(pizza =>
                    pizza.id === item.id
                        ? { ...pizza, quantity: pizza.quantity - 1 }
                        : pizza
                )
            );
        }
    };

    const getQuantity = (id) => {
        const item = cart.find(pizza => pizza.id === id);
        return item ? item.quantity : 0;
    };
    if (loading) return <p>Loading menu...</p>;
    return (
        <div>
            <h2>Menú de Pizzas</h2>
            <ul className="menu-list">
                {menuItems.map((item) => (
                    <li key={item.id} className="menu-item" onClick={() => setSelectedItem(item)}  >
                        <MenuImage
                            normalSrc={item.imageUrl}
                            pixelSrc={item.imageUrl}
                            alt={item.name}
                        />
                        <div>
                            <h3>{item.name}</h3>
                            <h2>${item.price}</h2>
                            <div className="buttons">
                                <button
                                    className="buttons-minus"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        decreaseFromCart(item);
                                    }}
                                >
                                    -
                                </button>

                                <button
                                    className="button-plus"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        addToCart(item);
                                    }}
                                >
                                    +
                                </button>

                            </div>
                        </div>
                    </li>

                ))}
            </ul>

            {selectedItem && (
                <div className="detail-overlay" onClick={() => setSelectedItem(null)}>
                    <div className="detail-window" onClick={(e) => e.stopPropagation()}>
                        <img src={selectedItem.imageUrl} className="detail-img" />

                        <h2>{selectedItem.name}</h2>

                        {selectedItem.ingredients?.length > 0 && (
                            <ul>
                                {selectedItem.ingredients.map((i) => (
                                    <li key={i.id}>{i.name}</li>
                                ))}
                            </ul>
                        )}

                        <h3>${selectedItem.price}</h3>

                        <button onClick={() => addToCart(selectedItem)}>Add to Cart</button>
                        <button onClick={() => setSelectedItem(null)}>Close</button>
                    </div>
                </div>
            )}

        </div>
    );
}