defmodule Phoenix.LiveDashboard.LiveCapture do
  use LiveCapture.Component

  root_layout {Phoenix.LiveDashboard.LayoutView, :dash}
  plugs [__MODULE__.ConnPlugs]
  breakpoints s: "480px", m: "768px", l: "1279px", xl: "1600px"

  defmodule ConnPlugs do
    @moduledoc false
    import Plug.Conn

    def init(opts), do: opts

    def call(conn, _opts) do
      put_private(conn, :live_socket_path, ["/live"])
    end
  end
end
