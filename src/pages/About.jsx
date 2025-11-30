// src/pages/About.jsx
import React from "react";
import Pixza from "../assets/pizzapixel.svg";

export default function About() {
    return (
        <div>
            <div>Sobre la Pixzelería</div>

            <h2>El concepto</h2>
            <p>
                La Pixzelería nace como una idea divertida para mezclar conceptos de nostalgia y nuestra aplicación de Fullstack II.
            </p>

            <h2>La historia</h2>
            <p>
                Esta historia está en progreso, esperando llegar a niveles inexplorados.
            </p>

            <div >
                <img src={Pixza} alt="Pizzería" />
            </div>
        </div>
    );
}
