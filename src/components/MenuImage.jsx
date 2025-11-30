import { useState } from "react";
import { useSpring, animated } from "@react-spring/web";

export default function MenuImage({ normalSrc, pixelSrc, alt }) {
    const [hovered, setHovered] = useState(false);

    const normalStyles = useSpring({
        opacity: hovered ? 0 : 1,
        config: { duration: 500 },
    });

    const pixelStyles = useSpring({
        opacity: hovered ? 1 : 0,
        config: { duration: 500 },
    });

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                position: "relative",
                width: 200,
                height: 200,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
            }}
        >
            <animated.img
                src={normalSrc}
                alt={alt}
                style={{
                    ...normalStyles,
                    position: "absolute",
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                }}
            />
            <animated.img
                src={pixelSrc}
                alt={alt}
                style={{
                    ...pixelStyles,
                    position: "absolute",
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                }}
            />
        </div>
    );
}
