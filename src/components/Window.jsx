// src/components/Window.jsx
import React from "react";
import { useSpring, animated } from "@react-spring/web";

export default function Window({
                                   title,
                                   children,
                                   isOpen,
                                   onClose,
                                   width = "420px",          // default small window
                                   maxWidth = "90vw"          // default safe limit
                               }) {
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
                transform: "translateX(-50%)",
                zIndex: 9999,
                pointerEvents: "auto",
                boxSizing: "border-box",
                width,
                maxWidth,
                maxHeight: "90vh",
            }}
        >
            <animated.div
                style={{
                    transform: styles.y
                        .to((y) => `translateY(${y}px)`)
                        .to((t) => `${t}`),
                    scale: styles.scale,
                    opacity: styles.opacity,
                    willChange: "transform, opacity",
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
                        height: "100%",
                        maxHeight: "90vh",
                    }}
                >
                    {/* HEADER */}
                    <div
                        style={{
                            padding: "12px 16px",
                            borderBottom: "1px solid rgba(0,0,0,0.1)",
                            background: "#f7f7f7",
                            flexShrink: 0,
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
                                fontSize: "18px",
                            }}
                        >
                            ✕
                        </button>
                    </div>

                    {/* MAIN CONTENT */}
                    <div
                        style={{
                            padding: "16px",
                            overflowY: "auto",
                            flexGrow: 1,
                            WebkitOverflowScrolling: "touch",
                        }}
                    >
                        {children}
                    </div>
                </div>
            </animated.div>
        </div>
    );
}
