defmodule Phoenix.LiveDashboard.LayoutView do
  @moduledoc false
  use Phoenix.LiveDashboard.Web, :html

  embed_templates "layouts/*"

  phoenix_path = Application.app_dir(:phoenix, "priv/static/phoenix.js")

  phoenix_html_path = Application.app_dir(:phoenix_html, "priv/static/phoenix_html.js")

  phoenix_live_view_path =
    Application.app_dir(:phoenix_live_view, "priv/static/phoenix_live_view.js")

  js_path = Path.join(__DIR__, "../../../dist/js/app.js")
  css_path = Path.join(__DIR__, "../../../dist/css/app.css")

  @external_resource phoenix_path
  @external_resource phoenix_html_path
  @external_resource phoenix_live_view_path
  @external_resource js_path
  @external_resource css_path

  @app_js """
  #{File.read!(phoenix_html_path) |> String.replace("//# sourceMappingURL=", "// ")}
  #{File.read!(phoenix_path) |> String.replace("//# sourceMappingURL=", "// ")}
  #{File.read!(phoenix_live_view_path) |> String.replace("//# sourceMappingURL=", "// ")}
  #{File.read!(js_path)}
  """
  def render("app.js", _), do: @app_js

  @app_css File.read!(css_path)
  def render("app.css", _), do: @app_css

  def render("dash.html", assigns), do: dash(assigns)

  defp csp_nonce(conn, type) when type in [:script, :style, :img] do
    csp_nonce_assign_key = conn.private.csp_nonce_assign_key[type]
    conn.assigns[csp_nonce_assign_key]
  end

  def live_socket_path(conn) do
    [Enum.map(conn.script_name, &["/" | &1]) | conn.private.live_socket_path]
  end
end
