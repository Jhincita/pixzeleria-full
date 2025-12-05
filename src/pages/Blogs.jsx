// src/pages/Home.jsx

import React from "react";

const PixzaCup = "https://7f3a8e9d8e6f68a8be533b8e35df1c8f.r2.cloudflarestorage.com/pixzeleria/bigger_jpg/pixzacup.png";
const PixzaTrophy = "https://7f3a8e9d8e6f68a8be533b8e35df1c8f.r2.cloudflarestorage.com/pixzeleria/bigger_jpg/pizzatrophies.jpg";

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