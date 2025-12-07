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
                Muchas gracias a todos los participantes del torneo de pixzas. Ha sido un evento increíble lleno de emoción y sabor pixelado.
                Pero dejemos de ser tan Internet Explorer y vayamos al grano: los ganadores son... <br></br>
                ... <p></p>
                ...<p></p>
                ¡Gathilda Meowística!<p></p>
                Muchas gracias Gathilda por participar, nos estaremos poniendo en contacto en breve para hacerte
                la entrega de tu premio: un año de pixzas gratis en la Pixzelería!<p>
                Felicidades a todos los participantes por su esfuerzo y dedicación!
                </p>

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
