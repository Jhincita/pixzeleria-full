import React, { useState, useRef, useEffect } from "react";

import GratedCheese from "../assets/armatupizza/gratedcheese.svg"
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
    { id: "tomate", name: "Tomate", price: 200, max: 5, image: "src/assets/tomate.png", type: "topping" },
    { id: "pepperoni", name: "Pepperoni", price: 250, max: 5, image: "src/assets/pepperoni.png", type: "topping" },
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

  // Aquí se le da forma de pixel a la pipsha
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

    // base
    drawPixelSquare(ctx, centerX, centerY, 260, "#F59E0B", "#D97706", 12); // pizza base

    // salsa
    const salsaIngredient = ingredients.find((i) =>
      availableIngredients.find((a) => a.id === i.id)?.type === "salsa"
    );
    if (salsaIngredient) {
      const salsaData = availableIngredients.find((a) => a.id === salsaIngredient.id);
      drawPixelSquare(ctx, centerX, centerY, radius - 15, salsaData.color);
    }

    // toppings
    ingredients.forEach((ing) => {
      const data = availableIngredients.find((a) => a.id === ing.id);
      if (data?.type === "topping" && loadedImages[ing.id]) {
        const img = loadedImages[ing.id];
        const size = 55;
        ctx.drawImage(img, ing.x - size / 2, ing.y - size / 2, size, size);
      }
    });

    // ingrediente arrastrado
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

  const addToCart = () => {
    if (ingredients.length === 0) {
      alert("Agrega al menos un ingrediente antes de guardar tu pixza (⇀‸↼‶)");
      return;
    }

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

    // Agregar al carrito
    setCart([...cart, newPizza]);
    
    alert(`¡Pixza agregada al carrito! ＼(￣▽￣)／	Total: ${totalPrice.toLocaleString("es-CL")}`);
    resetPizza();
  };

  return (
    <div className="form-wrapper" style={{ maxWidth: "700px", margin: "0 auto" }}>
      <h2>Crea tu propia Pixza</h2>
      <p style={{ fontSize: "0.9em", color: "#666", marginBottom: "15px" }}>
          Haz clic en un ingrediente para seleccionarlo, luego haz clic en la pixza para colocarlo (˶ᵔ ᵕ ᵔ˶)
        </p>

      <div style={{ marginBottom: "30px" }}>
        <h3>Ingredientes Disponibles:</h3>
        
        <div style={{ 
          display: "flex", 
          flexWrap: "wrap", 
          gap: "10px",
          justifyContent: "center",
        }}>
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
                  padding: "10px",
                  textAlign: "center",
                  cursor: canAdd ? "pointer" : "not-allowed",
                  width: "100px",
                  transition: "all 0.2s",
                  transform: selected ? "scale(1.05)" : "scale(1)",
                }}
              >
                <img
                  src={ingredient.image}
                  alt={ingredient.name}
                  style={{
                    width: "55px",
                    height: "55px",
                    objectFit: "contain",
                    imageRendering: "pixelated",
                  }}
                />
                <div style={{ fontWeight: "bold", fontSize: "0.85em", marginTop: "5px" }}>
                  {ingredient.name}
                </div>
                <div style={{ fontSize: "0.8em", color: "#666" }}>
                  ${ingredient.price.toLocaleString("es-CL")}
                </div>
                <div style={{ fontSize: "0.75em", color: ingredient.type === "salsa" ? "#7b68ee" : "#666", marginTop: "3px" }}>
                  {ingredient.type === "salsa" ? "1 salsa" : `${count}/${ingredient.max}`}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
          style={{
            border: "3px solid #000",
            borderRadius: "10px",
            imageRendering: "pixelated",
            cursor: selectedIngredient ? "crosshair" : draggingOnCanvas ? "grabbing" : "grab",
            maxWidth: "100%",
          }}
        />
      </div>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <strong style={{ fontSize: "1.3em" }}>Precio total: ${totalPrice.toLocaleString("es-CL")}</strong>
      </div>

      {/* Aquí loh CTA */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button
          onClick={resetPizza}
          style={{
            flex: 1,
            padding: "12px",
            backgroundColor: "#cfffd3ff",
            color: "#2d2d2dff",
            border: "2px solid #000",
            fontWeight: "normal",
            cursor: "pointer",
            fontSize: "1em",
          }}
        >
          Todo de nuevo Σ(°ロ°)
        </button>
        <button
          onClick={saveImage}
          style={{
            flex: 1,
            padding: "12px",
            backgroundColor: "#c4e0ffff",
            color: "#2d2d2dff",
            border: "2px solid #000",
            fontWeight: "normal",
            cursor: "pointer",
            fontSize: "1em",
          }}
        >
          Guardar como ∑d(°∀°d)	
        </button>
      </div>

      <button
        onClick={addToCart}
        style={{
          width: "100%",
          padding: "15px",
          backgroundColor: "#ffd7d0ff",
          color: "#2d2d2dff",
          border: "2px solid #000",
          fontWeight: "normal",
          cursor: "pointer",
          fontSize: "1.1em",
        }}
      >
        Agregar al Carrito	(´ᵔ⤙ᵔ`)
      </button>

      {/* Resumen de los ingredientes agregados ⸜( *ˊᵕˋ* )⸝ */}
      {ingredients.length > 0 && (
        <div style={{ marginTop: "30px", padding: "15px", backgroundColor: "#f8f9fa", border: "2px solid #000", borderRadius: "5px" }}>
          <h3 style={{ marginBottom: "10px" }}>Ingredientes en tu pixza ({ingredients.length})</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {ingredients.map((ing) => {
              const data = availableIngredients.find((ai) => ai.id === ing.id);
              return (
                <span
                  key={ing.instanceId}
                  style={{
                    padding: "5px 12px",
                    backgroundColor: "#fff",
                    border: "2px solid #000",
                    borderRadius: "20px",
                    fontSize: "0.85em",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <img 
                    src={data.image} 
                    alt={data.name}
                    style={{ 
                      width: "20px", 
                      height: "20px",
                      imageRendering: "pixelated",
                    }}
                  />
                  {data.name}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}