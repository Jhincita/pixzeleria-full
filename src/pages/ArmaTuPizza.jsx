import { ingredientAPI } from '../services/api';

import React, { useState, useRef, useEffect } from "react";
import styles from "./ArmaTuPizza.module.css";

export default function ArmaTuPizza({ cart, setCart }) {
    const canvasRef = useRef(null);
    const [ingredients, setIngredients] = useState([]); // Toppings on pizza
    const [availableIngredients, setAvailableIngredients] = useState([]); // From backend
    const [selectedMasa, setSelectedMasa] = useState(null); // Selected dough
    const [selectedSalsa, setSelectedSalsa] = useState(null); // Selected sauce
    const [totalPrice, setTotalPrice] = useState(5000); // Base price
    const [loadedImages, setLoadedImages] = useState({});
    const [selectedIngredient, setSelectedIngredient] = useState(null);
    const [draggingOnCanvas, setDraggingOnCanvas] = useState(null);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [loading, setLoading] = useState(true);

    // Base price for pizza
    const BASE_PRICE = 5000;

    // Fetch ingredients from backend
    useEffect(() => {
        async function fetchIngredients() {
            try {
                setLoading(true);
                const response = await ingredientAPI.getAllIngredients();
                console.log("Ingredients response:", response);

                let data;
                if (Array.isArray(response)) {
                    data = response;
                } else if (response?.data && Array.isArray(response.data)) {
                    data = response.data;
                } else if (response?.data?.data && Array.isArray(response.data.data)) {
                    data = response.data.data;
                } else {
                    console.error("Unexpected response structure:", response);
                    data = [];
                }

                // Format ingredients - type comes from backend
                const formatted = data
                    .filter(ing => ing.stock > 0)
                    .map(ing => ({
                        id: ing.id,
                        name: ing.name,
                        price: ing.price || 500,
                        max: ing.type === 'topping' ? 5 : 1,
                        image: ing.imageUrl,
                        type: ing.type || 'topping', // 'masa', 'salsa', or 'topping'
                        color: ing.color || '#E53935', // For salsa color
                        stock: ing.stock
                    }));

                setAvailableIngredients(formatted);
                console.log('✅ Ingredientes cargados:', formatted);

                // Auto-select first masa if available
                const defaultMasa = formatted.find(i => i.type === 'masa');
                if (defaultMasa) {
                    setSelectedMasa(defaultMasa);
                    setTotalPrice(BASE_PRICE + defaultMasa.price);
                }

            } catch (error) {
                console.error('❌ Error fetching ingredients:', error);
                alert('Error al cargar ingredientes del servidor.');
                setAvailableIngredients([]);
            } finally {
                setLoading(false);
            }
        }

        fetchIngredients();
    }, []);

    // Load topping images (only for toppings)
    useEffect(() => {
        if (availableIngredients.length === 0) return;

        const toppings = availableIngredients.filter(i => i.type === 'topping');
        if (toppings.length === 0) {
            setImagesLoaded(true);
            return;
        }

        const images = {};
        let loadedCount = 0;
        const totalImages = toppings.length;

        toppings.forEach((ingredient) => {
            const img = new Image();
            img.onload = () => {
                loadedCount++;
                if (loadedCount === totalImages) setImagesLoaded(true);
            };
            img.onerror = () => {
                console.error(`❌ Error loading image: ${ingredient.image}`);
                loadedCount++;
                if (loadedCount === totalImages) setImagesLoaded(true);
            };
            img.src = ingredient.image;
            images[ingredient.id] = img;
        });

        setLoadedImages(images);
    }, [availableIngredients]);

    // Draw pixel square helper
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

    // Draw the pizza
    const drawPizza = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1. MASA (Dough) - Just the base square, masa is NOT visually shown
        // The dough affects price but the visual is always the same base
        drawPixelSquare(ctx, centerX, centerY, 260, "#F59E0B", "#D97706", 12);

        // 2. SALSA (Sauce) - Covers the pizza leaving crust visible
        if (selectedSalsa) {
            // Draw sauce inside the crust area (smaller square)
            drawPixelSquare(ctx, centerX, centerY, 220, selectedSalsa.color);
        }

        // 3. TOPPINGS - Draw on top of everything
        ingredients.forEach((ing) => {
            const data = availableIngredients.find((a) => a.id === ing.id);
            if (data?.type === "topping" && loadedImages[ing.id]) {
                const img = loadedImages[ing.id];
                const size = 55;
                ctx.drawImage(img, ing.x - size / 2, ing.y - size / 2, size, size);
            }
        });

        // Dragging ingredient preview
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
    }, [ingredients, selectedSalsa, draggingOnCanvas, imagesLoaded]);

    // Calculate total price
    const calculateTotalPrice = () => {
        let total = BASE_PRICE;

        if (selectedMasa) total += selectedMasa.price;
        if (selectedSalsa) total += selectedSalsa.price;

        // Add topping prices
        ingredients.forEach(ing => {
            const data = availableIngredients.find(a => a.id === ing.id);
            if (data) total += data.price;
        });

        return total;
    };

    // Update price when ingredients change
    useEffect(() => {
        setTotalPrice(calculateTotalPrice());
    }, [selectedMasa, selectedSalsa, ingredients]);

    const getIngredientCount = (id) => ingredients.filter((i) => i.id === id).length;

    const canAddTopping = (ingredient) => {
        const count = getIngredientCount(ingredient.id);
        return count < ingredient.max;
    };

    // Handle masa selection
    const handleMasaClick = (masa) => {
        setSelectedMasa(masa);
    };

    // Handle salsa selection
    const handleSalsaClick = (salsa) => {
        if (selectedSalsa?.id === salsa.id) {
            // Deselect if clicking same sauce
            setSelectedSalsa(null);
        } else {
            setSelectedSalsa(salsa);
        }
    };

    // Handle topping selection (for placing on canvas)
    const handleToppingClick = (topping) => {
        if (!canAddTopping(topping)) return;
        setSelectedIngredient(topping);
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

        // Only place within sauce area
        if (distance <= 110) {
            setIngredients([...ingredients, { ...selectedIngredient, x, y, instanceId: Date.now() }]);
            setSelectedIngredient(null);
        }
    };

    const handleCanvasMouseDown = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Check if clicking on existing topping
        for (let i = ingredients.length - 1; i >= 0; i--) {
            const ing = ingredients[i];
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

        if (distance <= 110) {
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
        setSelectedSalsa(null);
        // Keep masa selected
        setSelectedIngredient(null);
        setTotalPrice(BASE_PRICE + (selectedMasa?.price || 0));
    };

    const saveImage = () => {
        const canvas = canvasRef.current;
        const link = document.createElement("a");
        link.download = "mi-propia-pixza.png";
        link.href = canvas.toDataURL();
        link.click();
    };

    // Add to cart - NO backend call, just local
    const addToCart = () => {
        if (!selectedMasa) {
            alert("Selecciona una masa primero (⇀‸↼‶)");
            return;
        }

        // Collect all ingredient IDs
        const allIngredientIds = [];

        if (selectedMasa) allIngredientIds.push(selectedMasa.id);
        if (selectedSalsa) allIngredientIds.push(selectedSalsa.id);

        // Add topping IDs (can have duplicates)
        ingredients.forEach(ing => allIngredientIds.push(ing.id));

        // Create ingredient names for display
        const parts = [];
        if (selectedMasa) parts.push(selectedMasa.name);
        if (selectedSalsa) parts.push(selectedSalsa.name);

        const uniqueToppingIds = [...new Set(ingredients.map(i => i.id))];
        uniqueToppingIds.forEach(id => {
            const data = availableIngredients.find(a => a.id === id);
            if (data) parts.push(data.name);
        });

        const newPizza = {
            id: `custom-${Date.now()}`,
            name: `Pixza Personalizada (${parts.join(", ")})`,
            price: totalPrice,
            quantity: 1,
            // Data for backend
            isCustom: true,
            size: "Medium",
            ingredientIds: allIngredientIds,
            totalPrice: totalPrice,
        };

        setCart([...cart, newPizza]);
        alert(`¡Pixza agregada al carrito! ＼(￣▽￣)／ Total: $${totalPrice.toLocaleString("es-CL")}`);
        resetPizza();
    };

    const getCanvasClassName = () => {
        if (selectedIngredient) return `${styles.canvas} ${styles.selectedIngredient}`;
        if (draggingOnCanvas) return `${styles.canvas} ${styles.dragging}`;
        return `${styles.canvas} ${styles.default}`;
    };

    // Filter ingredients by type
    const masas = availableIngredients.filter(i => i.type === 'masa');
    const salsas = availableIngredients.filter(i => i.type === 'salsa');
    const toppings = availableIngredients.filter(i => i.type === 'topping');

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Cargando ingredientes... 🍕</h2>
                </div>
            </div>
        );
    }

    if (!availableIngredients || availableIngredients.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>No hay ingredientes disponibles</h2>
                    <p className={styles.subtitle}>Por favor, contacta al administrador</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Crea tu propia Pixza</h2>
                <p className={styles.subtitle}>
                    Selecciona masa, salsa y toppings para tu pixza (˶ᵔ ᵕ ᵔ˶)
                </p>
            </div>

            <div className={styles.layout}>
                {/* Pizza Canvas */}
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

                {/* Sidebar */}
                <div className={styles.sidebar}>

                    {/* MASA Section */}
                    {masas.length > 0 && (
                        <div className={styles.ingredientsSection}>
                            <h3 className={styles.sectionTitle}>🍞 Masa</h3>
                            <div className={styles.ingredientsGrid}>
                                {masas.map((masa) => (
                                    <div
                                        key={masa.id}
                                        onClick={() => handleMasaClick(masa)}
                                        className={`${styles.ingredientCard} ${
                                            selectedMasa?.id === masa.id ? styles.selected : ""
                                        }`}
                                    >
                                        <div className={styles.ingredientName}>{masa.name}</div>
                                        <div className={styles.ingredientPrice}>
                                            +${masa.price.toLocaleString("es-CL")}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SALSA Section */}
                    {salsas.length > 0 && (
                        <div className={styles.ingredientsSection}>
                            <h3 className={styles.sectionTitle}>🍅 Salsa</h3>
                            <div className={styles.ingredientsGrid}>
                                {salsas.map((salsa) => (
                                    <div
                                        key={salsa.id}
                                        onClick={() => handleSalsaClick(salsa)}
                                        className={`${styles.ingredientCard} ${
                                            selectedSalsa?.id === salsa.id ? styles.selected : ""
                                        }`}
                                    >
                                        <div
                                            className={styles.salsaColor}
                                            style={{ backgroundColor: salsa.color }}
                                        />
                                        <div className={styles.ingredientName}>{salsa.name}</div>
                                        <div className={styles.ingredientPrice}>
                                            +${salsa.price.toLocaleString("es-CL")}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TOPPINGS Section */}
                    {toppings.length > 0 && (
                        <div className={styles.ingredientsSection}>
                            <h3 className={styles.sectionTitle}>🧀 Toppings</h3>
                            <p className={styles.sectionHint}>
                                {selectedIngredient
                                    ? `Haz clic en la pizza para colocar ${selectedIngredient.name}`
                                    : "Selecciona un topping y colócalo en la pizza"
                                }
                            </p>
                            <div className={styles.ingredientsGrid}>
                                {toppings.map((topping) => {
                                    const canAdd = canAddTopping(topping);
                                    const selected = selectedIngredient?.id === topping.id;
                                    const count = getIngredientCount(topping.id);

                                    return (
                                        <div
                                            key={topping.id}
                                            onClick={() => handleToppingClick(topping)}
                                            className={`${styles.ingredientCard} ${
                                                selected ? styles.selected : ""
                                            } ${!canAdd ? styles.disabled : ""}`}
                                        >
                                            <img
                                                src={topping.image}
                                                alt={topping.name}
                                                className={styles.ingredientImage}
                                            />
                                            <div className={styles.ingredientName}>{topping.name}</div>
                                            <div className={styles.ingredientPrice}>
                                                +${topping.price.toLocaleString("es-CL")}
                                            </div>
                                            <div className={styles.ingredientCount}>
                                                {count}/{topping.max}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Controls */}
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

                    {/* Summary */}
                    <div className={styles.ingredientsSummary}>
                        <h3 className={styles.summaryTitle}>Tu Pixza</h3>
                        <div className={styles.summaryList}>
                            {selectedMasa && (
                                <div className={styles.summaryItem}>
                                    <span>🍞 {selectedMasa.name}</span>
                                    <span>+${selectedMasa.price.toLocaleString("es-CL")}</span>
                                </div>
                            )}
                            {selectedSalsa && (
                                <div className={styles.summaryItem}>
                                    <span>🍅 {selectedSalsa.name}</span>
                                    <span>+${selectedSalsa.price.toLocaleString("es-CL")}</span>
                                </div>
                            )}
                            {ingredients.length > 0 && (
                                <div className={styles.summaryItem}>
                                    <span>🧀 Toppings ({ingredients.length})</span>
                                    <span>
                                        +${ingredients.reduce((sum, ing) => {
                                        const data = availableIngredients.find(a => a.id === ing.id);
                                        return sum + (data?.price || 0);
                                    }, 0).toLocaleString("es-CL")}
                                    </span>
                                </div>
                            )}
                            <div className={styles.summaryTotal}>
                                <span>Base</span>
                                <span>${BASE_PRICE.toLocaleString("es-CL")}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}