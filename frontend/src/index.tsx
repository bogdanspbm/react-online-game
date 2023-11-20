import * as React from "react"
import * as ReactDOM from "react-dom"
import { createEvent, createStore } from "effector"
import { useEvent, useStore } from "effector-react"

import { ConstantBackoff, Websocket, WebsocketBuilder, WebsocketEvent } from "websocket-ts"

import { applyPatch } from "fast-json-patch"
import App from "./app";

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root")
)