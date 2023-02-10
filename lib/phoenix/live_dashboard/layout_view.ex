defmodule Phoenix.LiveDashboard.LayoutView do
  @moduledoc false
  use Phoenix.LiveDashboard.Web, :html

  embed_templates "layouts/*"

  def render("dash.html", assigns), do: dash(assigns)

  defp csp_nonce(conn, type) when type in [:script, :style, :img] do
    csp_nonce_assign_key = conn.private.csp_nonce_assign_key[type]
    conn.assigns[csp_nonce_assign_key]
  end

  def live_socket_path(conn) do
    [Enum.map(conn.script_name, &["/" | &1]) | conn.private.live_socket_path]
  end
end
