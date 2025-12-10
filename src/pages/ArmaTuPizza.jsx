import { pizzaAPI, ingredientAPI } from '../services/api';

import React, { useState, useRef, useEffect } from "react";
import styles from "./ArmaTuPizza.module.css";

export default function ArmaTuPizza({ cart, setCart }) {
    const canvasRef = useRef(null);
    const [ingredients, setIngredients] = useState([]);
    const [availableIngredients, setAvailableIngredients] = useState([]);
    const [totalPrice, setTotalPrice] = useState(5000);
    const [loadedImages, setLoadedImages] = useState({});
    const [selectedIngredient, setSelectedIngredient] = useState(null);
    const [draggingOnCanvas, setDraggingOnCanvas] = useState(null);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch ingredients from backend
    useEffect(() => {
        async function fetchIngredients() {
            try {
                setLoading(true);
                const response = await ingredientAPI.getAllIngredients();
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

                const formatted = data
                    .filter(ing => ing.stock > 0 && ing.name.toLowerCase() !== "masa tradicional")
                    .map(ing => ({
                        id: ing.id,
                        name: ing.name,
                        price: ing.price || 500,
                        max: 5,
                        image: ing.imageUrl,
                        type: ing.type || 'topping',
                        color: ing.color || null, // Add color for salsa
                        stock: ing.stock
                    }));

                setAvailableIngredients(formatted);
            } catch (error) {
                console.error('Error fetching ingredients:', error);
                alert('Error al cargar ingredientes del servidor.');
                setAvailableIngredients([]);
            } finally {
                setLoading(false);
            }
        }

        fetchIngredients();
    }, []);

    // Load ingredient images
    useEffect(() => {
        if (availableIngredients.length === 0) return;

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
                loadedCount++;
                if (loadedCount === totalImages) setImagesLoaded(true);
            };
            img.src = ingredient.image;
            images[ingredient.id] = img;
        });

        setLoadedImages(images);
    }, [availableIngredients]);

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
            drawPixelSquare(ctx, centerX, centerY, radius - 15, salsaData.color);
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

            const response = await pizzaAPI.createCustomPizza(pizzaData);
            const newPizza = {
                id: response.data.id,
                name: `Pixza Personalizada`,
                price: totalPrice,
                quantity: 1,
            };

            setCart([...cart, newPizza]);
            resetPizza();
        } catch (error) {
            console.error('Error saving pizza:', error);
            alert('Error al guardar la pixza en el servidor.');
        }
    };

    const getCanvasClassName = () => {
        if (selectedIngredient) return `${styles.canvas} ${styles.selectedIngredient}`;
        if (draggingOnCanvas) return `${styles.canvas} ${styles.dragging}`;
        return `${styles.canvas} ${styles.default}`;
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <h2>Cargando ingredientes... 🍕</h2>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Diseño omitido por simplicidad */}
        </div>
    );
}
