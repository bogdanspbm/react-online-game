package main

import (
	"net/http"
)

func main() {
	game := CreateGame()
	http.HandleFunc("/ws", game.handleWebSocket)
	http.ListenAndServe(":8080", nil)
}
