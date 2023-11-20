import * as React from "react";
import { useEffect, useRef, useState } from "react";
import Player from "../player/player";

const Canvas = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const players = [
        new Player(100, 100),
        // Add more players here
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");

        if (!context) {
            return;
        }

        const handleKeydown = (e: KeyboardEvent) => {
            const key = e.key.toUpperCase();
            players.forEach((player) => {
                player.setKeyState(key, true); // Set key state to true on keydown
            });
        };

        const handleKeyup = (e: KeyboardEvent) => {
            const key = e.key.toUpperCase();
            players.forEach((player) => {
                player.setKeyState(key, false); // Set key state to false on keyup
            });
        };

        window.addEventListener("keydown", handleKeydown);
        window.addEventListener("keyup", handleKeyup);

        const draw = () => {
            if (!context) {
                return;
            }

            context.clearRect(0, 0, canvas?.width || 0, canvas?.height || 0);
            players.forEach((player) => {
                player.move(); // Move the player based on current key states
                player.draw(context);
            });
            requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener("keydown", handleKeydown);
            window.removeEventListener("keyup", handleKeyup);
        };
    }, [players]);

    return <canvas ref={canvasRef} width={800} height={600} />;
};

export default Canvas;