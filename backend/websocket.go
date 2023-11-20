package main

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/websocket"
	"net/http"
)

var players = make(map[string]Player)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func handleWebSocket(w http.ResponseWriter, r *http.Request) {

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println(err.Error())
		http.Error(w, "Could not establish WebSocket connection", http.StatusBadRequest)
		return
	}
	defer conn.Close()

	for {
		_, p, err := conn.ReadMessage()

		if err != nil {
			return
		}

		var playerReplication Player
		err = json.Unmarshal(p, &playerReplication)

		if err != nil {
			continue
		}

		playerReplication.Connection = conn
		players[playerReplication.UID] = playerReplication
		replicatePlayerToOther(playerReplication)
	}
}

func replicatePlayerToOther(player Player) {
	jsonString, err := json.Marshal(player)

	if err != nil {
		return
	}

	for k, v := range players {
		if k == player.UID {
			continue
		}

		err := v.Connection.WriteMessage(websocket.TextMessage, jsonString)

		if err != nil {
			delete(players, k)
		}
	}
}
