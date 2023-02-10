defmodule Phoenix.LiveDashboard.Assets do
  # Plug to serve dependency-specific assets for the dashboard.
  @moduledoc false

  phoenix_path = Application.app_dir(:phoenix, ["priv", "static", "phoenix.js"])

  phoenix_html_path = Application.app_dir(:phoenix_html, ["priv", "static", "phoenix_html.js"])

  phoenix_live_view_path =
    Application.app_dir(:phoenix_live_view, ["priv", "static", "phoenix_live_view.js"])

  js_path = Path.join(__DIR__, "../../../../dist/js/app.js")
  css_path = Path.join(__DIR__, "../../../../dist/css/app.css")

  @external_resource phoenix_path
  @external_resource phoenix_html_path
  @external_resource phoenix_live_view_path
  @external_resource js_path
  @external_resource css_path

  @app_css File.read!(css_path)

  @app_js """
  #{File.read!(phoenix_html_path) |> String.replace("//# sourceMappingURL=", "// ")}
  #{File.read!(phoenix_path) |> String.replace("//# sourceMappingURL=", "// ")}
  #{File.read!(phoenix_live_view_path) |> String.replace("//# sourceMappingURL=", "// ")}
  #{File.read!(js_path)}
  """

  @app_css_hash Base.encode16(:crypto.hash(:md5, @app_css), case: :lower)
  @app_js_hash Base.encode16(:crypto.hash(:md5, @app_css), case: :lower)

  def init(asset) when asset in [:css, :js], do: asset

  def call(conn, asset) do
    Plug.Conn.send_resp(
      conn,
      200,
      case asset do
        :css -> @app_css
        :js -> @app_js
      end
    )
  end

  # TODO: Remove this and the conditional on Phoenix v1.7+
  @compile {:no_warn_undefined, Phoenix.VerifiedRoutes}

  @doc """
  Returns a hashed path to a static asset.
  """
  def hashed_path(conn, asset) when asset in ["app.css", "app.js"] do
    if function_exported?(conn.private.phoenix_router, :__live_dashboard_prefix__, 0) do
      prefix = conn.private.phoenix_router.__live_dashboard_prefix__()

      Phoenix.VerifiedRoutes.unverified_path(
        conn,
        conn.private.phoenix_router,
        "#{prefix}/#{asset}-#{asset_hash(asset)}"
      )
    else
      apply(
        conn.private.phoenix_router.__helpers__(),
        :live_dashboard_asset_path,
        [conn, asset_action(asset), asset_hash(asset)]
      )
    end
  end

  defp asset_action("app.css"), do: :css
  defp asset_action("app.js"), do: :js

  defp asset_hash("app.css"), do: @app_css_hash
  defp asset_hash("app.js"), do: @app_js_hash
end
