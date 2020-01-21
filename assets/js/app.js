import css from "../css/app.css"
import "phoenix_html"
import { Socket } from "phoenix"
import { LiveSocket } from "phoenix_live_view"
import PhxLiveMetric from "./telemetry_live"

const PHX_SOCKET = "/live"

/* The LiveView Hooks for the Phoenix.LiveDashboard components. */
let Hooks = {
  PhxLiveMetric: PhxLiveMetric
}

let socketPath = document.querySelector("html").getAttribute("phx-socket") || PHX_SOCKET
let csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content")
let liveSocket = new LiveSocket(socketPath, Socket, {
  hooks: Hooks,
  params: { _csrf_token: csrfToken }
})

liveSocket.connect()
