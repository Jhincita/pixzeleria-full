// src/pages/Home.jsx
import PixzaCup from "../assets/pixzacup.png";
import PixzaTrophy from "../assets/pizzatrophies.jpg";
import React from "react";

export default function Home() {
    return <div>
        <div className={"blog-post"}>
            <h1>¡Gracias por Intentar!</h1>
            <h2>Resultados del Torneo</h2>
            <p>
                En esta ocasión, la familia de Pixzelería se enorgullece de traerles un nuevo torneo de pixzas, patrocinado por Banco de Pizzas.
                En este torneo ganará quien sea capaz de comer más pixeles de pixzas (también conocidos como trozos de pizza, para los mortales)
            </p>

            <div >
                <img src={PixzaTrophy} alt="Pixza Cup" />
            </div></div>
        <div className={"blog-post"}>
            <h1>Torneo de Pixzas</h1>
            <p>
                En esta ocasión, la familia de Pixzelería se enorgullece de traerles un nuevo torneo de pixzas, patrocinado por Banco de Pizzas.
                En este torneo ganará quien sea capaz de comer más pixeles de pixzas (también conocidos como trozos de pizza, para los mortales)
            </p>

            <div >
                <img src={PixzaCup} alt="Pixza Cup" />
            </div></div>




    </div>
}