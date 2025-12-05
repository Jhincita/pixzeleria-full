import { useState } from 'react';
import { motion } from 'framer-motion';

const anim = {
    initial: {
        opacity: 0
    },
    enter: (delay) => ({
        opacity: 1,
        transition: { duration: 0, delay: 0.02 * delay }
    }),
    exit: (delay) => ({
        opacity: 0,
        transition: { duration: 0, delay: 0.02 * delay }
    })
};

export default function PixelHoverImage({ src, alt }) {
    const [isHovered, setIsHovered] = useState(false);

    const shuffle = (array) => {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    };

    const getBlocks = (columnIndex) => {
        const blockSize = 20; // 20px blocks
        const columns = 10;
        const rows = 10;
        const shuffledIndexes = shuffle([...Array(rows)].map((_, i) => i));

        return shuffledIndexes.map((randomIndex, index) => {
            const delay = columnIndex + randomIndex;
            return (
                <motion.div
                    key={index}
                    style={{
                        width: '100%',
                        height: '20px',
                        backgroundColor: '#ff6a00',
                    }}
                    variants={anim}
                    initial="initial"
                    animate={isHovered ? "enter" : "exit"}
                    custom={delay}
                />
            );
        });
    };

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                position: 'relative',
                width: '200px',
                height: '200px',
                cursor: 'pointer',
            }}
        >
            {/* Original Image */}
            <img
                src={src}
                alt={alt}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    opacity: isHovered ? 0 : 1,
                    transition: 'opacity 0.3s',
                }}
            />

            {/* Pixel Grid Overlay */}
            {isHovered && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                    }}
                >
                    {[...Array(10)].map((_, columnIndex) => (
                        <div
                            key={columnIndex}
                            style={{
                                width: '10%',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            {getBlocks(columnIndex)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}