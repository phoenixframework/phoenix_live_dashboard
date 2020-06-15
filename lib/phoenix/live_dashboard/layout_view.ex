defmodule Phoenix.LiveDashboard.LayoutView do
  @moduledoc false
  use Phoenix.LiveDashboard.Web, :view

  js_bundle = if Mix.env() == "prod", do: "app.js", else: "app.dev.js"
  css_bundle = if Mix.env() == "prod", do: "app.css", else: "app.dev.css"

  js_path = Path.join(__DIR__, "../../../priv/static/js/" <> js_bundle)
  css_path = Path.join(__DIR__, "../../../priv/static/css/" <> css_bundle)

  @external_resource js_path
  @external_resource css_path

  @app_js File.read!(js_path)
  @app_css File.read!(css_path)

  def render("app.js", _), do: @app_js
  def render("app.css", _), do: @app_css

  def live_socket_path(conn) do
    [Enum.map(conn.script_name, &["/" | &1]) | conn.private.live_socket_path]
  end
end
