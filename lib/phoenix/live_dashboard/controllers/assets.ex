defmodule Phoenix.LiveDashboard.Assets do
  # Plug to serve dependency-specific assets for the dashboard.
  @moduledoc false
  import Plug.Conn

  phoenix_js_paths =
    for app <- [:phoenix, :phoenix_html, :phoenix_live_view] do
      path = Application.app_dir(app, ["priv", "static", "#{app}.js"])
      Module.put_attribute(__MODULE__, :external_resource, path)
      path
    end

  css_path = Path.join(__DIR__, "../../../../dist/css/app.css")
  @external_resource css_path
  @css File.read!(css_path)

  js_path = Path.join(__DIR__, "../../../../dist/js/app.js")
  @external_resource js_path

  @js """
  #{for path <- phoenix_js_paths, do: path |> File.read!() |> String.replace("//# sourceMappingURL=", "// ")}
  #{File.read!(js_path)}
  """

  @hashes %{
    :css => Base.encode16(:crypto.hash(:md5, @css), case: :lower),
    :js => Base.encode16(:crypto.hash(:md5, @js), case: :lower)
  }

  def init(asset) when asset in [:css, :js], do: asset

  def call(conn, asset) do
    {contents, content_type} = contents_and_type(asset)

    conn
    |> put_resp_header("content-type", content_type)
    |> put_resp_header("cache-control", "public, max-age=31536000")
    |> send_resp(200, contents)
    |> halt()
  end

  defp contents_and_type(:css), do: {@css, "text/css"}
  defp contents_and_type(:js), do: {@js, "text/javascript"}

  # TODO: Remove this and the conditional on Phoenix v1.7+
  @compile {:no_warn_undefined, Phoenix.VerifiedRoutes}

  @doc """
  Returns a hashed path to a static asset.
  """
  def hashed_path(conn, asset) when asset in [:css, :js] do
    hash = Map.fetch!(@hashes, asset)

    if function_exported?(conn.private.phoenix_router, :__live_dashboard_prefix__, 0) do
      prefix = conn.private.phoenix_router.__live_dashboard_prefix__()

      Phoenix.VerifiedRoutes.unverified_path(
        conn,
        conn.private.phoenix_router,
        "#{prefix}/#{asset}-#{hash}"
      )
    else
      apply(
        conn.private.phoenix_router.__helpers__(),
        :live_dashboard_asset_path,
        [conn, asset, hash]
      )
    end
  end
end
