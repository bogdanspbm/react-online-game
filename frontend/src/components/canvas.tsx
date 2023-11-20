import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {ConstantBackoff, Websocket, WebsocketBuilder, WebsocketEvent} from "websocket-ts"
import Player from "../player/player";
import {Message} from "effector/inspect";

const Canvas = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [playersMap, setPlayersMap] = useState<Map<string, Player>>(new Map());
    const [controlledPlayer, setControlledPlayer] = useState<Player | null>(new Player(100,100));

    const websocket = new WebsocketBuilder("ws://127.0.0.1:8080/ws")
        .withBackoff(new ConstantBackoff(10 * 1000))
        .build();

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");

        if (!context) {
            return;
        }

        const handleKeydown = (e: KeyboardEvent) => {
            const key = e.key.toUpperCase();
            if (controlledPlayer) {
                controlledPlayer.setKeyState(key, true);
            }
        };

        const handleKeyup = (e: KeyboardEvent) => {
            const key = e.key.toUpperCase();
            if (controlledPlayer) {
                controlledPlayer.setKeyState(key, false);
            }
        };

        window.addEventListener("keydown", handleKeydown);
        window.addEventListener("keyup", handleKeyup);

        const draw = () => {
            if (!context) {
                return;
            }

            context.clearRect(0, 0, canvas?.width || 0, canvas?.height || 0);

            if (controlledPlayer) {
                controlledPlayer.move();
                controlledPlayer.draw(context);

                if (controlledPlayer.isMoving() && websocket && websocket.readyState === 1) {
                    const replicatePlayerMessage = controlledPlayer.getReplicateMessage();
                    websocket.send(JSON.stringify(replicatePlayerMessage));
                }
            }

            playersMap.forEach((player) => {
                player.draw(context);
            });
            requestAnimationFrame(draw);
        };

        websocket.addEventListener(WebsocketEvent.open, () => {
            console.log("Connected to WebSocket server");
        });

        websocket.addEventListener(WebsocketEvent.close, () => {
            console.log("WebSocket connection closed");
        });

        websocket.addEventListener(WebsocketEvent.error, (error) => {
            console.error("WebSocket error:", error);
        });

        websocket.addEventListener(WebsocketEvent.message, (websocket, event) => {
            console.log("Received message:", event.data);
            const message = JSON.parse(event.data);
            const {uid, x, y} = message;

            if (!playersMap.has(uid)) {
                const newPlayer = new Player(x, y);
                playersMap.set(uid, newPlayer);

                if (websocket && websocket.readyState === 1) {
                    const replicatePlayerMessage = newPlayer.getReplicateMessage();
                    websocket.send(JSON.stringify(replicatePlayerMessage));
                }

                return;
            }

            const updatedPlayer = playersMap.get(uid);

            if (updatedPlayer) {
                updatedPlayer.setX(x);
                updatedPlayer.setY(y);

                // If the controlled player UID matches, set it as the controlled player
                if (controlledPlayer && controlledPlayer.getUID() === uid) {
                    setControlledPlayer(updatedPlayer);
                }
            }

            setPlayersMap(new Map(playersMap));
        });

        draw();

        return () => {
            window.removeEventListener("keydown", handleKeydown);
            window.removeEventListener("keyup", handleKeyup);

            if (websocket && websocket.readyState === 1) {
                websocket.close()
            }
        };
    }, [playersMap, controlledPlayer]);

    return <canvas ref={canvasRef} width={800} height={600}/>;
};

export default Canvas;