defmodule Phoenix.LiveDashboard.TableHelpers do
  # Helpers for pages that need to render tables
  @moduledoc false

  import Phoenix.LiveView
  import Phoenix.LiveView.Helpers
  import Phoenix.LiveDashboard.LiveHelpers

  @limit ~w(50 100 500 1000 5000)
  @sort_dir ~w(desc asc)

  def assign_table_params(socket, params, sort_by, sort_dir \\ @sort_dir) do
    sort_by = params |> get_in_or_first("sort_by", sort_by) |> String.to_atom()
    sort_dir = params |> get_in_or_first("sort_dir", sort_dir) |> String.to_atom()
    limit = params |> get_in_or_first("limit", @limit) |> String.to_integer()
    search = params["search"]
    search = if search == "", do: nil, else: search
    assign(socket, :params, %{sort_by: sort_by, sort_dir: sort_dir, limit: limit, search: search})
  end

  defp get_in_or_first(params, key, valid) do
    value = params[key]
    if value in valid, do: value, else: hd(valid)
  end

  def limit_options(), do: @limit

  def sort_link(socket, live_action, menu, params, sort_by, link_name) do
    case params do
      %{sort_by: ^sort_by, sort_dir: sort_dir} ->
        params = %{params | sort_dir: opposite_sort_dir(params), sort_by: sort_by}

        link_name
        |> sort_link_body(sort_dir)
        |> live_patch(to: live_dashboard_path(socket, live_action, menu.node, params))

      %{} ->
        params = %{params | sort_dir: :desc, sort_by: sort_by}

        link_name
        |> sort_link_body()
        |> live_patch(to: live_dashboard_path(socket, live_action, menu.node, params))
    end
  end

  defp sort_link_body(link_name), do: link_name

  defp sort_link_body(link_name, sort_dir) do
    [link_name | sort_link_icon(sort_dir)]
  end

  defp sort_link_icon(:asc) do
    {:safe,
     """
     <div class="dash-table-icon">
       <span class="icon-sort icon-asc"></span>
     </div>
     """}
  end

  defp sort_link_icon(:desc) do
    {:safe,
     """
     <div class="dash-table-icon">
       <span class="icon-sort icon-desc"></span>
     </div>
     """}
  end

  defp opposite_sort_dir(%{sort_dir: :desc}), do: :asc

  defp opposite_sort_dir(_), do: :desc
end
