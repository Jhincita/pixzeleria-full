// src/components/Window.jsx
import React, { useRef, useEffect, useState } from "react";

import { useDrag } from "@use-gesture/react";
import { useSpring, animated } from "@react-spring/web";

export default function Window({
                                   title,
                                   children,
                                   isOpen,
                                   onClose,
                                   width = "420px",          // default small window
                                   maxWidth = "90vw"          // default safe limit
                               }) {
    const [styles, api] = useSpring(() => ({
        from: { opacity: 0, scale: 0.3 },
    }));

    // keep the element mounted until the closing animation ends
    const [visible, setVisible] = useState(isOpen);
    const wrapperRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            // ensure mounted, then play open animation
            setVisible(true);
            (async () => {
                await api.start({ opacity: 1, scale: 1.05, config: { duration: 90 } });
                await api.start({ scale: 1, config: { duration: 80 } });
            })();
        } else if (visible) {
            // play close animation, then unmount
            api.start({
                opacity: 0,
                scale: 0.3,
                config: { duration: 120 },
                onRest: () => setVisible(false),
            });
        }


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);


    // cerrar on click away del cmponent
    useEffect(() => {
        function handleClickOutside(e) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                onClose?.();
            }
        }
        if (visible) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("touchstart", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [visible, onClose]);


    if (!visible) return null;

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
            <animated.div ref={wrapperRef} className="win98-outline-effect crt-pop"
                          style={{
                              transform: styles.scale.to(s => `scale(${s})`),
                              opacity: styles.opacity,
                              willChange: "transform, opacity",
                          }}
            >

            <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        background: "white",
                        borderRadius: "0px",
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
