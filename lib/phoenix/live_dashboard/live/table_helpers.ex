defmodule Phoenix.LiveDashboard.TableHelpers do
  @moduledoc false
  import Phoenix.HTML
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

  def sort_link(socket, params, sort_by, link_name) do
    %{live_action: live_action, menu: %{node: node}} = socket.assigns

    case params do
      %{sort_by: ^sort_by, sort_dir: sort_dir} ->
        params = %{params | sort_dir: opposite_sort_dir(params), sort_by: sort_by}

        link_name
        |> sort_link_body(sort_dir)
        |> live_patch(to: live_dashboard_path(socket, live_action, node, [], params))

      %{} ->
        params = %{params | sort_dir: :desc, sort_by: sort_by}

        link_name
        |> sort_link_body()
        |> live_patch(to: live_dashboard_path(socket, live_action, node, [], params))
    end
  end

  defp sort_link_body(link_name), do: link_name

  defp sort_link_body(link_name, sort_dir) do
    [link_name | sort_link_icon(sort_dir)]
  end

  defp sort_link_icon(:asc) do
    ~E"""
    <div class="dash-table-icon">
      <span class="icon-sort icon-asc"></span>
    </div>
    """
  end

  defp sort_link_icon(:desc) do
    ~E"""
    <div class="dash-table-icon">
      <span class="icon-sort icon-desc"></span>
    </div>
    """
  end

  defp opposite_sort_dir(%{sort_dir: :desc}), do: :asc

  defp opposite_sort_dir(_), do: :desc

  def live_modal(socket, component, opts) do
    path = Keyword.fetch!(opts, :return_to)
    modal_opts = [id: :modal, return_to: path, component: component, opts: opts]
    live_component(socket, Phoenix.LiveDashboard.ModalComponent, modal_opts)
  end
end
