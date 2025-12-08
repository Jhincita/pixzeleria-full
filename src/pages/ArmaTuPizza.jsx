import { pizzaAPI } from '../services/api';

import React, { useState, useRef, useEffect } from "react";
import GratedCheese from "../assets/armatupizza/gratedcheese.svg";
import Pepperoni from "../assets/armatupizza/pepperoni.svg";
import Tomato from "../assets/armatupizza/tomato.svg";
import styles from "./ArmaTuPizza.module.css";

export default function ArmaTuPizza({ cart, setCart }) {
    const canvasRef = useRef(null);
    const [ingredients, setIngredients] = useState([]);
    const [totalPrice, setTotalPrice] = useState(5000);
    const [loadedImages, setLoadedImages] = useState({});
    const [selectedIngredient, setSelectedIngredient] = useState(null);
    const [draggingOnCanvas, setDraggingOnCanvas] = useState(null);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    const availableIngredients = [
        { id: "salsa-roja", name: "Salsa de Tomate", price: 500, max: 1, color: "#DC2626", image: "src/assets/salsatomate.png", type: "salsa" },
        { id: "salsa-bbq", name: "Salsa BBQ", price: 600, max: 1, color: "#92400E", image: "src/assets/salsa_bbq.png", type: "salsa" },
        { id: "queso", name: "Queso", price: 500, max: 5, image: GratedCheese, type: "topping" },
        { id: "tomate", name: "Tomate", price: 200, max: 5, image: Tomato, type: "topping" },
        { id: "pepperoni", name: "Pepperoni", price: 250, max: 5, image: Pepperoni, type: "topping" },
        { id: "cebolla", name: "Cebolla", price: 150, max: 5, image: "src/assets/cebolla.png", type: "topping" },
        { id: "piña", name: "Piña", price: 250, max: 5, image: "src/assets/piña.png", type: "topping" },
    ];

    useEffect(() => {
        const images = {};
        let loadedCount = 0;
        const totalImages = availableIngredients.length;

        availableIngredients.forEach((ingredient) => {
            const img = new Image();
            img.onload = () => {
                loadedCount++;
                if (loadedCount === totalImages) setImagesLoaded(true);
            };
            img.onerror = () => {
                console.error(`Error cargando imagen: ${ingredient.image}`);
                loadedCount++;
                if (loadedCount === totalImages) setImagesLoaded(true);
            };
            img.src = ingredient.image;
            images[ingredient.id] = img;
        });

        setLoadedImages(images);
    }, []);

    const drawPixelSquare = (ctx, x, y, size, fillColor, borderColor = null, borderWidth = 0) => {
        const pixelSize = 4;
        const half = size / 2;

        for (let i = -half; i < half; i += pixelSize) {
            for (let j = -half; j < half; j += pixelSize) {
                const isBorder =
                    borderColor &&
                    (i < -half + borderWidth ||
                        i > half - borderWidth - pixelSize ||
                        j < -half + borderWidth ||
                        j > half - borderWidth - pixelSize);

                ctx.fillStyle = isBorder ? borderColor : fillColor;
                ctx.fillRect(x + i, y + j, pixelSize, pixelSize);
            }
        }
    };

    const drawPizza = () => {
        const canvas = canvasRef.current;
        if (!canvas || !imagesLoaded) return;

        const ctx = canvas.getContext("2d");
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 150;

        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Base
        drawPixelSquare(ctx, centerX, centerY, 260, "#F59E0B", "#D97706", 12);

        // Salsa
        const salsaIngredient = ingredients.find((i) =>
            availableIngredients.find((a) => a.id === i.id)?.type === "salsa"
        );
        if (salsaIngredient) {
            const salsaData = availableIngredients.find((a) => a.id === salsaIngredient.id);
            drawPixelSquare(ctx, centerX, centerY, 236, salsaData.color);
        }

        // Toppings
        ingredients.forEach((ing) => {
            const data = availableIngredients.find((a) => a.id === ing.id);
            if (data?.type === "topping" && loadedImages[ing.id]) {
                const img = loadedImages[ing.id];
                const size = 55;
                ctx.drawImage(img, ing.x - size / 2, ing.y - size / 2, size, size);
            }
        });

        // Dragging ingredient
        if (draggingOnCanvas && loadedImages[draggingOnCanvas.ingredientId]) {
            const img = loadedImages[draggingOnCanvas.ingredientId];
            const size = 55;
            ctx.globalAlpha = 0.7;
            ctx.drawImage(img, draggingOnCanvas.x - size / 2, draggingOnCanvas.y - size / 2, size, size);
            ctx.globalAlpha = 1.0;
        }
    };

    useEffect(() => {
        drawPizza();
    }, [ingredients, draggingOnCanvas, imagesLoaded]);

    const getIngredientCount = (id) => ingredients.filter((i) => i.id === id).length;

    const canAddIngredient = (ingredient) => {
        const count = getIngredientCount(ingredient.id);
        if (ingredient.type === "salsa")
            return !ingredients.some((i) => availableIngredients.find((ai) => ai.id === i.id)?.type === "salsa");
        return count < ingredient.max;
    };

    const handleIngredientClick = (ingredient) => {
        if (!canAddIngredient(ingredient)) return;

        if (ingredient.type === "salsa") {
            const others = ingredients.filter(
                (i) => availableIngredients.find((ai) => ai.id === i.id)?.type !== "salsa"
            );
            setIngredients([...others, { ...ingredient }]);
            setTotalPrice((prev) => prev + ingredient.price);
            setSelectedIngredient(null);
            return;
        }

        setSelectedIngredient(ingredient);
    };

    const handleCanvasClick = (e) => {
        if (!selectedIngredient) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);

        if (distance <= 135) {
            setIngredients([...ingredients, { ...selectedIngredient, x, y, instanceId: Date.now() }]);
            setTotalPrice((prev) => prev + selectedIngredient.price);
            setSelectedIngredient(null);
        }
    };

    const handleCanvasMouseDown = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        for (let i = ingredients.length - 1; i >= 0; i--) {
            const ing = ingredients[i];
            const data = availableIngredients.find((ai) => ai.id === ing.id);
            if (data?.type === "topping") {
                const size = 55;
                if (Math.abs(mouseX - ing.x) < size / 2 && Math.abs(mouseY - ing.y) < size / 2) {
                    setDraggingOnCanvas({
                        index: i,
                        ingredientId: ing.id,
                        x: ing.x,
                        y: ing.y,
                        offsetX: mouseX - ing.x,
                        offsetY: mouseY - ing.y,
                    });
                    return;
                }
            }
        }

        handleCanvasClick(e);
    };

    const handleCanvasMouseMove = (e) => {
        if (!draggingOnCanvas) return;
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left - draggingOnCanvas.offsetX;
        const y = e.clientY - rect.top - draggingOnCanvas.offsetY;
        setDraggingOnCanvas({ ...draggingOnCanvas, x, y });
    };

    const handleCanvasMouseUp = (e) => {
        if (!draggingOnCanvas) return;
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left - draggingOnCanvas.offsetX;
        const y = e.clientY - rect.top - draggingOnCanvas.offsetY;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);

        if (distance <= 135) {
            const newIngredients = [...ingredients];
            newIngredients[draggingOnCanvas.index] = {
                ...newIngredients[draggingOnCanvas.index],
                x,
                y,
            };
            setIngredients(newIngredients);
        }
        setDraggingOnCanvas(null);
    };

    const resetPizza = () => {
        setIngredients([]);
        setTotalPrice(5000);
        setSelectedIngredient(null);
    };

    const saveImage = () => {
        const canvas = canvasRef.current;
        const link = document.createElement("a");
        link.download = "mi-propia-pixza.png";
        link.href = canvas.toDataURL();
        link.click();
    };

    const addToCart = async () => {
        if (ingredients.length === 0) {
            alert("Agrega al menos un ingrediente antes de guardar tu pixza (⇀‸↼‶)");
            return;
        }

        try {
            // Prepare pizza data for backend
            const pizzaData = {
                name: "Pixza Personalizada",
                basePrice: 5000,
                size: "Medium",
                ingredients: ingredients.map((ing) => {
                    const data = availableIngredients.find((a) => a.id === ing.id);
                    return {
                        ingredientId: ing.id,
                        name: data.name,
                        price: data.price,
                        positionX: ing.x || 0,
                        positionY: ing.y || 0,
                    };
                }),
                totalPrice: totalPrice,
            };

            // Save to backend
            console.log('Saving pizza to backend...', pizzaData);
            const response = await pizzaAPI.createCustomPizza(pizzaData);
            console.log('Pizza saved!', response.data);

            // Add to local cart with backend ID
            const ingredientsList = ingredients.map((ing) => {
                const data = availableIngredients.find((a) => a.id === ing.id);
                return data.name;
            });

            const newPizza = {
                id: response.data.id, // Use backend ID
                name: `Pixza Personalizada (${ingredientsList.join(", ")})`,
                price: totalPrice,
                quantity: 1,
            };

            setCart([...cart, newPizza]);
            alert(`¡Pixza agregada al carrito! ＼(￣▽￣)／ Total: ${totalPrice.toLocaleString("es-CL")}`);
            resetPizza();

        } catch (error) {
            console.error('Error saving pizza:', error);
            alert('Error al guardar la pixza en el servidor. Se guardó localmente.');

            // Fallback: save to cart locally even if backend fails
            const ingredientsList = ingredients.map((ing) => {
                const data = availableIngredients.find((a) => a.id === ing.id);
                return data.name;
            });

            const newPizza = {
                id: Date.now(),
                name: `Pixza Personalizada (${ingredientsList.join(", ")})`,
                price: totalPrice,
                quantity: 1,
            };

            setCart([...cart, newPizza]);
            resetPizza();
        }
    };

    const getCanvasClassName = () => {
        if (selectedIngredient) return `${styles.canvas} ${styles.selectedIngredient}`;
        if (draggingOnCanvas) return `${styles.canvas} ${styles.dragging}`;
        return `${styles.canvas} ${styles.default}`;
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Crea tu propia Pixza</h2>
                <p className={styles.subtitle}>
                    Haz clic en un ingrediente para seleccionarlo, luego haz clic en la pixza para colocarlo (˶ᵔ ᵕ ᵔ˶)
                </p>
            </div>

            <div className={styles.layout}>
                {/* DIV1 - Pizza Canvas */}
                <div className={styles.canvasContainer}>
                    <canvas
                        ref={canvasRef}
                        width={400}
                        height={400}
                        onMouseDown={handleCanvasMouseDown}
                        onMouseMove={handleCanvasMouseMove}
                        onMouseUp={handleCanvasMouseUp}
                        onMouseLeave={handleCanvasMouseUp}
                        className={getCanvasClassName()}
                    />
                    <div className={styles.priceDisplay}>
                        Precio total: ${totalPrice.toLocaleString("es-CL")}
                    </div>
                </div>

                {/* DIV2 - Sidebar */}
                <div className={styles.sidebar}>
                    {/* DIV2.1 - Ingredients Section */}
                    <div className={styles.ingredientsSection}>
                        <h3 className={styles.sectionTitle}>Ingredientes Disponibles</h3>
                        <div className={styles.ingredientsGrid}>
                            {availableIngredients.map((ingredient) => {
                                const canAdd = canAddIngredient(ingredient);
                                const selected = selectedIngredient?.id === ingredient.id;
                                const count = getIngredientCount(ingredient.id);

                                return (
                                    <div
                                        key={ingredient.id}
                                        onClick={() => handleIngredientClick(ingredient)}
                                        className={`${styles.ingredientCard} ${
                                            selected ? styles.selected : ""
                                        } ${!canAdd ? styles.disabled : ""}`}
                                    >
                                        <img
                                            src={ingredient.image}
                                            alt={ingredient.name}
                                            className={styles.ingredientImage}
                                        />
                                        <div className={styles.ingredientName}>{ingredient.name}</div>
                                        <div className={styles.ingredientPrice}>
                                            ${ingredient.price.toLocaleString("es-CL")}
                                        </div>
                                        <div className={`${styles.ingredientCount} ${
                                            ingredient.type === "salsa" ? styles.salsa : ""
                                        }`}>
                                            {ingredient.type === "salsa" ? "1 salsa" : `${count}/${ingredient.max}`}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* DIV2.2 - Controls Section */}
                    <div className={styles.controlsSection}>
                        <div className={styles.buttonGroup}>
                            <button
                                onClick={resetPizza}
                                className={`${styles.button} ${styles.buttonReset}`}
                            >
                                Todo de nuevo Σ(°ロ°)
                            </button>
                            <button
                                onClick={saveImage}
                                className={`${styles.button} ${styles.buttonSave}`}
                            >
                                Guardar como ∑d(°∀°d)
                            </button>
                        </div>
                        <button
                            onClick={addToCart}
                            className={`${styles.button} ${styles.buttonAddToCart}`}
                        >
                            Agregar al Carrito (´ᵔ⤙ᵔ`)
                        </button>
                    </div>

                    {/* Ingredients Summary */}
                    {ingredients.length > 0 && (
                        <div className={styles.ingredientsSummary}>
                            <h3 className={styles.summaryTitle}>
                                Ingredientes en tu pixza ({ingredients.length})
                            </h3>
                            <div className={styles.ingredientsList}>
                                {ingredients.map((ing) => {
                                    const data = availableIngredients.find((ai) => ai.id === ing.id);
                                    return (
                                        <span key={ing.instanceId} className={styles.ingredientTag}>
                      <img
                          src={data.image}
                          alt={data.name}
                          className={styles.ingredientTagImage}
                      />
                                            {data.name}
                    </span>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
