package main

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/websocket"
	"net/http"
)

type Game struct {
	players  map[string]Player
	upgrader websocket.Upgrader
}

func CreateGame() *Game {
	var players = make(map[string]Player)

	var upgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}

	return &Game{players: players, upgrader: upgrader}
}

func (client *Game) handleWebSocket(w http.ResponseWriter, r *http.Request) {

	conn, err := client.upgrader.Upgrade(w, r, nil)
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

		_, ok := client.players[playerReplication.UID]

		playerReplication.Connection = conn
		client.players[playerReplication.UID] = playerReplication

		if !ok {
			client.replicatePlayersToOther(playerReplication)
		}

		client.replicatePlayerToOther(playerReplication)
	}
}

func (client *Game) replicatePlayersToOther(player Player) {

	for k, v := range client.players {
		if k == player.UID {
			continue
		}

		jsonString, err := json.Marshal(v)

		if err != nil {
			continue
		}

		err = player.Connection.WriteMessage(websocket.TextMessage, jsonString)

		if err != nil {
			delete(client.players, k)
		}
	}
}

func (client *Game) replicatePlayerToOther(player Player) {
	jsonString, err := json.Marshal(player)

	if err != nil {
		return
	}

	for k, v := range client.players {
		if k == player.UID {
			continue
		}

		err := v.Connection.WriteMessage(websocket.TextMessage, jsonString)

		if err != nil {
			delete(client.players, k)
		}
	}
}
