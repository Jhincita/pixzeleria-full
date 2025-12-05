// src/App.jsx
import { Routes, Route } from "react-router-dom";
import { useState } from "react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Menu from "./pages/Menu";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blogs from "./pages/Blogs";
import CartPage from "./pages/CartPage.jsx";
import ArmaTuPizza from "./pages/ArmaTuPizza.jsx";

import HomeSvg from "./assets/navbar/home.svg";
import AboutSvg from "./assets/navbar/about.svg";
import ContactSvg from "./assets/navbar/contact.svg";
import LoginSvg from "./assets/navbar/login.svg";
import ArmaTuPizzaSvg from "./assets/navbar/armaTuPizza.svg";
import BlogsSvg from "./assets/navbar/blogs.svg";
import CartSvg from "./assets/navbar/cart.svg";
import MenuSvg from "./assets/navbar/menu.svg";

// Admin components
import AdminPanel from "./pages/AdminPanel";

import Window from "./components/Window";
import './App.css';

export default function App() {
    const [openWindow, setOpenWindow] = useState(null);
    const [User, setUser] = useState(null);
    const [cart, setCart] = useState([]);

    const pages = {
        home: {
            label: "HOME",
            icon: HomeSvg,
            element: <Home User={User} setUser={setUser} />,
            windowProps: {}
        },
        login: {
            label: "LOGIN",
            icon: LoginSvg,
            element: <Login User={User} setUser={setUser} />,
            windowProps: {}
        },
        menu: {
            label: "MENU",
            icon: MenuSvg,
            element: <Menu cart={cart} setCart={setCart} />,
            windowProps: {}
        },
        about: {
            label: "ABOUT",
            icon: AboutSvg,
            element: <About />,
            windowProps: {}
        },
        contact: {
            label: "CONTACT",
            icon: ContactSvg,
            element: <Contact />,
            windowProps: {}
        },
        blogs: {
            label: "BLOGS",
            icon: BlogsSvg,
            element: <Blogs />,
            windowProps: {}
        },
        cart: {
            label: "CART",
            icon: CartSvg,
            element: <CartPage cart={cart} setCart={setCart} />,
            windowProps: { width: "800px" }
        },
        armatupizza: {
            label: "ARMA TU PIZZA",
            icon: ArmaTuPizzaSvg,
            element: <ArmaTuPizza cart={cart} setCart={setCart} />,
            windowProps: { width: "1200px", maxWidth: "95vw" }
        }
    };

    return (
        <Routes>
            {/* Ruta principal */}
            <Route path="/" element={
                <div className="page-wrapper">
                    <header className="header">
                        <h1>
                            <img src="pixzeleria-logo.svg" alt="Pixzelería" />
                        </h1>
                    </header>

                    <p className="description">Pizzería en Pixeles</p>

                    <nav className="window">
                        <p className="window-title">Nav</p>
                        <div className="container">
                            {Object.keys(pages).map((key) => (
                                <button
                                    key={key}
                                    className="nav-button"
                                    onClick={() => setOpenWindow(key)}
                                >
                                    <img className="nav-icon" src={pages[key].icon} alt={key} />
                                    <span className="nav-label">{pages[key].label}</span>
                                </button>
                            ))}
                        </div>
                    </nav>

                    <Window
                        title={openWindow ? openWindow.toUpperCase() : ""}
                        isOpen={!!openWindow}
                        onClose={() => setOpenWindow(null)}
                        {...(openWindow ? pages[openWindow].windowProps : {})}
                    >
                        {openWindow && pages[openWindow].element}
                    </Window>
                </div>
            } />

            {/* Ruta del panel de administración */}
            <Route path="/admin" element={<AdminPanel />} />
        </Routes>
    );
}
