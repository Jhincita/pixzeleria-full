import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; 

const DEFAULT_INGREDIENTS = [
  { id: "salsa-roja", name: "Salsa de Tomate", price: 500, max: 1, color: "#DC2626", image: "/src/assets/salsatomate.png", type: "salsa", stock: 99 },
  { id: "salsa-bbq", name: "Salsa BBQ", price: 600, max: 1, color: "#92400E", image: "/src/assets/salsa_bbq.png", type: "salsa", stock: 99 },
  { id: "queso", name: "Queso Mozzarella", price: 500, max: 5, image: "/src/assets/queso_rallado.png", type: "topping", stock: 99 },
  { id: "tomate", name: "Tomate", price: 200, max: 5, image: "/src/assets/tomate.png", type: "topping", stock: 99 },
  { id: "pepperoni", name: "Pepperoni", price: 250, max: 5, image: "/src/assets/pepperoni.png", type: "topping", stock: 99 },
  { id: "cebolla", name: "Cebolla", price: 150, max: 5, image: "/src/assets/cebolla.png", type: "topping", stock: 99 },
  { id: "piña", name: "Piña", price: 250, max: 5, image: "/src/assets/piña.png", type: "topping", stock: 99 },
];

const IMAGE_MAP = {
  "Salsa de Tomate": "/src/assets/salsatomate.png",
  "Salsa BBQ": "/src/assets/salsa_bbq.png",
  "Queso Mozzarella": "/src/assets/queso_rallado.png",
  "Tomate": "/src/assets/tomate.png",
  "Pepperoni": "/src/assets/pepperoni.png",
  "Cebolla": "/src/assets/cebolla.png",
  "Piña": "/src/assets/piña.png"
};

export default function ArmaTuPizza({ cart, setCart }) {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  
  const [availableIngredients, setAvailableIngredients] = useState(DEFAULT_INGREDIENTS);
  const [ingredients, setIngredients] = useState([]); 
  const [totalPrice, setTotalPrice] = useState(5000);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [draggingOnCanvas, setDraggingOnCanvas] = useState(null);
  
  const [loadedImages, setLoadedImages] = useState({});
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const fetchIngredients = async () => {
        try {
            const response = await api.get('/ingredients'); 
            const dbData = response.data;

            if (!dbData || dbData.length === 0) return;

            console.log("¡Ingredientes cargados del Backend!");
            
            const mergedData = dbData.map(dbItem => {
              const localMatch = DEFAULT_INGREDIENTS.find(d => d.name === dbItem.name) || {};
              
              return {
                ...localMatch, 
                id: dbItem.id, 
                name: dbItem.name,
                stock: dbItem.stock,
                image: IMAGE_MAP[dbItem.name] || localMatch.image, 
                type: localMatch.type || (dbItem.name.includes("Salsa") ? "salsa" : "topping"),
                color: localMatch.color || "#FFD700",
                max: localMatch.max || 5,
                price: 500 
              };
            });
            
            const toppingsOnly = mergedData.filter(i => i.name !== "Masa Tradicional" && i.image);
            
            setAvailableIngredients(toppingsOnly);

        } catch (err) {
            console.warn("Usando ingredientes locales (Backend offline o error):", err);
        }
    };

    fetchIngredients();
  }, []);

  useEffect(() => {
    const images = {};
    let loadedCount = 0;
    const validIngredients = availableIngredients.filter(i => i.image);
    const totalImages = validIngredients.length;

    if (totalImages === 0) {
        setImagesLoaded(true);
        return;
    }

    validIngredients.forEach((ingredient) => {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalImages) setImagesLoaded(true);
      };
      img.onerror = () => {
        console.error("Error cargando imagen:", ingredient.image);
        loadedCount++;
        if (loadedCount === totalImages) setImagesLoaded(true);
      };
      img.src = ingredient.image;
      images[ingredient.id] = img; 
    });

    setLoadedImages(images);
  }, [availableIngredients]);

  const drawPixelCircle = (ctx, x, y, radius, fillColor, borderColor = null, borderWidth = 0) => {
    const pixelSize = 4;
    for (let i = -radius; i < radius; i += pixelSize) {
      for (let j = -radius; j < radius; j += pixelSize) {
        const distance = Math.sqrt(i * i + j * j);
        if (distance <= radius) {
          ctx.fillStyle = borderColor && distance > radius - borderWidth ? borderColor : fillColor;
          ctx.fillRect(x + i, y + j, pixelSize, pixelSize);
        }
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

    drawPixelCircle(ctx, centerX, centerY, radius, "#F59E0B", "#D97706", 8);

    const salsaIngredient = ingredients.find((i) => i.type === "salsa");
    if (salsaIngredient) {
      const originalData = availableIngredients.find(a => a.id === salsaIngredient.id);
      drawPixelCircle(ctx, centerX, centerY, radius - 15, originalData?.color || "#DC2626");
    }

    ingredients.forEach((ing) => {
      if (ing.type === "topping" && loadedImages[ing.id]) {
        const img = loadedImages[ing.id];
        const size = 55;
        ctx.drawImage(img, ing.x - size / 2, ing.y - size / 2, size, size);
      }
    });


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
  }, [ingredients, draggingOnCanvas, imagesLoaded, availableIngredients]);

  const getIngredientCount = (id) => ingredients.filter((i) => i.id === id).length;

  const canAddIngredient = (ingredient) => {
    const count = getIngredientCount(ingredient.id);
    if (ingredient.type === "salsa") {
      return !ingredients.some((i) => i.type === "salsa");
    }
    return count < ingredient.max;
  };

  const handleIngredientClick = (ingredient) => {
    if (!canAddIngredient(ingredient)) return;

    if (ingredient.type === "salsa") {
      const others = ingredients.filter((i) => i.type !== "salsa");
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

    if (Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2) <= 135) {
      setIngredients([...ingredients, { ...selectedIngredient, x, y, instanceId: Date.now() }]);
      setTotalPrice((prev) => prev + selectedIngredient.price);
      setSelectedIngredient(null);
    }
  };

  const handleCanvasMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    for (let i = ingredients.length - 1; i >= 0; i--) {
      const ing = ingredients[i];
      if (ing.type === "topping") {
        if (Math.abs(mouseX - ing.x) < 27 && Math.abs(mouseY - ing.y) < 27) {
          setDraggingOnCanvas({
            index: i, ingredientId: ing.id, x: ing.x, y: ing.y,
            offsetX: mouseX - ing.x, offsetY: mouseY - ing.y,
          });
          return;
        }
      }
    }
    handleCanvasClick(e);
  };

  const handleCanvasMouseMove = (e) => {
    if (!draggingOnCanvas) return;
    const x = e.clientX - canvasRef.current.getBoundingClientRect().left - draggingOnCanvas.offsetX;
    const y = e.clientY - canvasRef.current.getBoundingClientRect().top - draggingOnCanvas.offsetY;
    setDraggingOnCanvas({ ...draggingOnCanvas, x, y });
  };

  const handleCanvasMouseUp = (e) => {
    if (draggingOnCanvas) {
      const x = e.clientX - canvasRef.current.getBoundingClientRect().left - draggingOnCanvas.offsetX;
      const y = e.clientY - canvasRef.current.getBoundingClientRect().top - draggingOnCanvas.offsetY;
      const centerX = 200, centerY = 200; 
      
      if (Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2) <= 135) {
        const newIngs = [...ingredients];
        newIngs[draggingOnCanvas.index] = { ...newIngs[draggingOnCanvas.index], x, y };
        setIngredients(newIngs);
      }
      setDraggingOnCanvas(null);
    }
  };

  const resetPizza = () => {
    setIngredients([]);
    setTotalPrice(5000);
    setSelectedIngredient(null);
  };

  const saveImage = () => {
    const link = document.createElement("a");
    link.download = "mi-propia-pixza.png";
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  const addToCart = () => {
    if (ingredients.length === 0) {
      alert("Agrega al menos un ingrediente antes de guardar tu pixza (⇀‸↼‶)");
      return;
    }

    const ingredientsNames = ingredients.map(i => i.name).join(", ");
    
    const newPizza = {
      id: Date.now(), 
      name: `Pixza Custom`,
      description: `Ingredientes: ${ingredientsNames}`,
      price: totalPrice,
      quantity: 1,
      type: 'CUSTOM',
      customIngredients: ingredients.map(i => i.id) 
    };

    setCart([...cart, newPizza]);
    alert(`¡Pixza agregada! Total: $${totalPrice.toLocaleString("es-CL")}`);
    navigate('/cart');
    resetPizza();
  };

  return (
    <div className="form-wrapper" style={{ maxWidth: "700px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>Crea tu propia Pixza</h2>
      <p style={{ textAlign: "center", color: "#666", marginBottom: "20px" }}>
          Haz clic en un ingrediente y luego en la pizza para colocarlo (˶ᵔ ᵕ ᵔ˶)
      </p>

      {/* SECCIÓN DE INGREDIENTES */}
      <div style={{ marginBottom: "30px" }}>
        <h3>Ingredientes Disponibles:</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
          {availableIngredients.map((ingredient) => {
            const canAdd = canAddIngredient(ingredient);
            const selected = selectedIngredient?.id === ingredient.id;
            const count = getIngredientCount(ingredient.id);
            
            return (
              <div
                key={ingredient.id}
                onClick={() => handleIngredientClick(ingredient)}
                style={{
                  border: selected ? "3px solid #ff6347" : "2px solid #000",
                  backgroundColor: selected ? "#ffb3b3" : canAdd ? "#fff" : "#ddd",
                  padding: "8px", textAlign: "center", cursor: canAdd ? "pointer" : "not-allowed",
                  width: "100px", borderRadius: "8px",
                  transform: selected ? "scale(1.05)" : "scale(1)", transition: "all 0.2s",
                  opacity: canAdd ? 1 : 0.6
                }}
              >
                <img 
                    src={ingredient.image} 
                    alt={ingredient.name} 
                    style={{ width: "50px", height: "50px", objectFit: "contain", imageRendering: "pixelated" }} 
                />
                
                <div style={{ fontWeight: "bold", fontSize: "0.85em", marginTop: "5px" }}>{ingredient.name}</div>
                <div style={{ fontSize: "0.8em", color: "#666" }}>${ingredient.price}</div>
                <div style={{ fontSize: "0.75em", color: ingredient.type === "salsa" ? "#7b68ee" : "#666" }}>
                    {ingredient.type === "salsa" ? "1 salsa" : `${count}/${ingredient.max}`}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ textAlign: "center", marginBottom: "20px", display: "flex", justifyContent: "center" }}>
        <canvas
          ref={canvasRef}
          width={400} height={400}
          onMouseDown={handleCanvasMouseDown} onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp} onMouseLeave={handleCanvasMouseUp}
          style={{
            border: "3px solid #000", borderRadius: "10px", imageRendering: "pixelated",
            cursor: selectedIngredient ? "crosshair" : draggingOnCanvas ? "grabbing" : "grab",
            maxWidth: "100%", backgroundColor: "white"
          }}
        />
      </div>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <strong style={{ fontSize: "1.3em" }}>Precio total: ${totalPrice.toLocaleString("es-CL")}</strong>
      </div>

      {/* BOTONES */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button onClick={resetPizza} style={{ flex: 1, padding: "12px", background: "#cfffd3", color: "#000", border: "2px solid #000", cursor: "pointer" }}>
          Todo de nuevo Σ(°ロ°)
        </button>
        <button onClick={saveImage} style={{ flex: 1, padding: "12px", background: "#c4e0ff", color: "#000", border: "2px solid #000", cursor: "pointer" }}>
          Guardar como ∑d(°∀°d)
        </button>
      </div>

      <button onClick={addToCart} style={{ width: "100%", padding: "15px", background: "#ffd7d0", color: "#000", border: "2px solid #000", cursor: "pointer", fontSize: "1.2em", fontWeight: "bold" }}>
        Agregar al Carrito (´ᵔ⤙ᵔ`)
      </button>
    </div>
  );
}
