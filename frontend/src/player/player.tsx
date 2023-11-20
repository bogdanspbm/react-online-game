import * as React from "react";
import {useEffect, useRef, useState} from "react";

class Player {
    private uid: string;
    private x: number;
    private y: number;
    private speed: number;
    private color: string;
    private keys: { [key: string]: boolean };

    constructor(x: number, y: number) {
        this.uid = this.generateUID();
        this.x = x;
        this.y = y;
        this.speed = 5;
        this.color = this.getRandomColor();
        this.keys = {
            W: false,
            A: false,
            S: false,
            D: false,
        };
    }

    public getUID() : string {
        return this.uid;
    }

    public setX(x: number) {
        this.x = x;
    }

    public setY(y: number) {
        this.y = y;
    }

    public setKeyState(key: string, state: boolean): void {
        this.keys[key] = state;
    }

    private getRandomColor(): string {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    private generateUID(): string {
        // Generate a random UID using alphanumeric characters
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let uid = "";
        for (let i = 0; i < 16; i++) {
            uid += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return uid;
    }

    public move(): void {
        if (this.keys["W"]) {
            this.y -= this.speed;
        }
        if (this.keys["S"]) {
            this.y += this.speed;
        }
        if (this.keys["A"]) {
            this.x -= this.speed;
        }
        if (this.keys["D"]) {
            this.x += this.speed;
        }
    }

    public isMoving(): boolean {
        if (this.keys["W"]) {
            return true;
        }
        if (this.keys["S"]) {
            return true;
        }
        if (this.keys["A"]) {
            return true;
        }
        if (this.keys["D"]) {
            return true;
        }

        return false;
    }

    public getReplicateMessage(): any {
        return {uid: this.uid, x: this.x, y: this.y}
    }

    public draw(context: CanvasRenderingContext2D): void {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, 50, 50);
    }
}

export default Player;