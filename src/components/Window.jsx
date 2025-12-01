// src/components/Window.jsx
import React from "react";
import { useSpring, animated } from "@react-spring/web";

export default function Window({ title, children, isOpen, onClose }) {
    const styles = useSpring({
        y: isOpen ? 0 : -40,
        opacity: isOpen ? 1 : 0,
        scale: isOpen ? 1 : 0.96,
        config: { tension: 160, friction: 20 }
    });

    if (!isOpen) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: "5%",
                left: "50%",
                transform: "translateX(-50%)",   // ONLY horizontal centering
                zIndex: 9999,
                width: "420px",
                maxHeight: "85vh",
                pointerEvents: "auto",
                boxSizing: "border-box",
            }}
        >
            {/* inner animated wrapper does NOT own the layout */}
            <animated.div
                style={{
                    transform: styles.y.to((y) => `translateY(${y}px)`)
                        .to((t) => `${t}`),   // animation only
                    scale: styles.scale,
                    opacity: styles.opacity,
                    willChange: "transform, opacity"
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        background: "white",
                        borderRadius: "12px",
                        overflow: "hidden",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                        maxHeight: "85vh",
                        height: "auto",
                    }}
                >
                    <div
                        style={{
                            padding: "12px 16px",
                            borderBottom: "1px solid rgba(0,0,0,0.1)",
                            background: "#f7f7f7",
                            flex: "0 0 auto",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <strong>{title}</strong>
                        <button
                            onClick={onClose}
                            style={{
                                background: "transparent",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "16px",
                                lineHeight: 1,
                            }}
                        >
                            ✕
                        </button>
                    </div>

                    <div
                        style={{
                            padding: "12px",
                            overflowY: "auto",
                            flex: 1,
                            WebkitOverflowScrolling: "touch"
                        }}
                    >
                        {children}
                    </div>
                </div>
            </animated.div>
        </div>
    );
}
