// src/components/Window.jsx
import React from "react";
import { useSpring, animated } from "@react-spring/web";

export default function Window({ title, children, isOpen, onClose }) {
    // Spring for open/close animation
    const styles = useSpring({
        transform: isOpen ? "scale(1)" : "scale(0.7)", // window grows/shrinks
        //opacity: isOpen ? 1 : 0,                       // fade in/out
        config: { tension: 80, friction: 20 },
    });

    if (!isOpen) return null;

    return (
        <animated.div style={{ ...styles, position: 'relative', transformOrigin: 'center', zIndex: 1000 }}>
            <div className="window">
                <div className="window-title">
                    {title}
                    <button onClick={onClose} style={{ float: "right" }}>X</button>
                </div>
                <div className="page-content">{children}</div>
            </div>
        </animated.div>
    );
}
