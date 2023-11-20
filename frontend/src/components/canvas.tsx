import * as React from "react";
import { useEffect, useRef, useState } from "react";

const Canvas = () => {
    const canvasRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const speed = 5;

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        const handleKeydown = (e: { key: any; }) => {
            switch (e.key) {
                case "ArrowUp":
                    setPosition({ ...position, y: position.y - speed });
                    break;
                case "ArrowDown":
                    setPosition({ ...position, y: position.y + speed });
                    break;
                case "ArrowLeft":
                    setPosition({ ...position, x: position.x - speed });
                    break;
                case "ArrowRight":
                    setPosition({ ...position, x: position.x + speed });
                    break;
                default:
                    break;
            }
        };

        window.addEventListener("keydown", handleKeydown);

        const draw = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.fillRect(position.x, position.y, 50, 50);
            requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener("keydown", handleKeydown);
        };
    }, [position]);

    return <canvas ref={canvasRef} width={800} height={600} />;
};

export default Canvas;