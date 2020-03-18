import css from "../css/app.scss"
import "phoenix_html"
import { Socket } from "phoenix"
import NProgress from "nprogress"
import { LiveSocket } from "phoenix_live_view"
import PhxChartComponent from "./metrics_live"
import PhxRequestLoggerCookie from "./request_logger_cookie"
import PhxRequestLoggerQueryParameter from "./request_logger_query_parameter"
import PhxRequestLoggerMessages from "./request_logger_messages"

let Hooks = {
  PhxChartComponent: PhxChartComponent,
  PhxRequestLoggerCookie: PhxRequestLoggerCookie,
  PhxRequestLoggerQueryParameter: PhxRequestLoggerQueryParameter,
  PhxRequestLoggerMessages: PhxRequestLoggerMessages
}

let socketPath = document.querySelector("html").getAttribute("phx-socket") || "/live"
let csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content")
let liveSocket = new LiveSocket(socketPath, Socket, {
  hooks: Hooks,
  params: { _csrf_token: csrfToken }
})

// Show progress bar on live navigation and form submits
window.addEventListener("phx:page-loading-start", info => NProgress.start())
window.addEventListener("phx:page-loading-stop", info => NProgress.done())

// connect if there are any LiveViews on the page
liveSocket.connect()

// expose liveSocket on window for web console debug logs and latency simulation:
// >> liveSocket.enableDebug()
// >> liveSocket.enableLatencySim(1000)
window.liveSocket = liveSocket
