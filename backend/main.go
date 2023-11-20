package main

import (
	"net/http"
)

func main() {
	http.HandleFunc("/ws", handleWebSocket)
	http.ListenAndServe(":8080", nil)
}
