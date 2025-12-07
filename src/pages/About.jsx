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
                Todo empezó en una calurosa noche de verano, cuando Camión-san atropelló a un grupo de desarrolladoras locas
                y despertaron en nuevo mun-- no es cierto, esto no es un isekai (por desgracia).<br></br>
                En fin, volviendo a la realidad, todo empezó cuando estas desarrolladoras,
                absortas en líneas de código y píxeles, decidieron crear la pizzería más pixelada del mundo.
                Inspiradas por los videojuegos retro, la cultura geek, y un gran hambre que las atacaba cada vez
                que terminaban un proyecto, decidieron combinar sus dos pasiones: la programación y la pizza.
            </p>

            <div >
                <img src={Pixza} alt="Pizzería" />
            </div>
        </div>
    );
}
