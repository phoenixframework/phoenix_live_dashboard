defmodule Phoenix.LiveDashboard.TableHelpers do
  @moduledoc false
  import Phoenix.LiveView
  import Phoenix.LiveView.Helpers
  import Phoenix.LiveDashboard.Web

  @limit ~w(50 100 500 1000 5000)
  @sort_dir ~w(desc asc)

  def assign_params(socket, params, sort_by) do
    sort_by = params |> get_in_or_first("sort_by", sort_by) |> String.to_atom()
    sort_dir = params |> get_in_or_first("sort_dir", @sort_dir) |> String.to_atom()
    limit = params |> get_in_or_first("limit", @limit) |> String.to_integer()
    assign(socket, :params, %{sort_by: sort_by, sort_dir: sort_dir, limit: limit})
  end

  defp get_in_or_first(params, key, valid) do
    value = params[key]
    if value in valid, do: value, else: hd(valid)
  end

  def limit_options(), do: @limit

  def sort_link(socket, params, sort_by, sort_dir) do
    %{live_action: live_action, menu: %{node: node}} = socket.assigns
    body = sort_link_body(sort_dir)

    case params do
      %{sort_by: ^sort_by, sort_dir: ^sort_dir} ->
        body

      %{} ->
        params = %{params | sort_dir: sort_dir, sort_by: sort_by}
        live_patch(body, to: live_dashboard_path(socket, live_action, node, [], params))
    end
  end

  defp sort_link_body(:asc), do: "asc"
  defp sort_link_body(:desc), do: "desc"
end
