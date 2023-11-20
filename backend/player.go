package main

import "github.com/gorilla/websocket"

type Player struct {
	UID        string `json:"uid"`
	X          int    `json:"x"`
	Y          int    `json:"y"`
	Connection *websocket.Conn
}
