defmodule Phoenix.LiveDashboard.ProcessesPage do
  # TODO: This should be a behaviour?

  import Phoenix.LiveView.Helpers
  import Phoenix.LiveDashboard.LiveHelpers

  alias Phoenix.LiveDashboard.SystemInfo
  alias Phoenix.LiveDashboard.TableComponent

  @table_id :table

  # @impl true
  def render(assigns) do
    ~L"""
    <%= live_component(@socket, TableComponent, table_assigns(@menu)) %>
    """
  end

  defp table_assigns(menu) do
    %{
      columns: columns(),
      id: @table_id,
      menu: menu,
      row_attrs: &row_attrs/1,
      row_fetcher: &fetch_processes/2,
      title: "Processes"
    }
  end

  defp fetch_processes(params, node) do
    %{search: search, sort_by: sort_by, sort_dir: sort_dir, limit: limit} = params

    SystemInfo.fetch_processes(node, search, sort_by, sort_dir, limit)
  end

  defp columns() do
    [
      %{
        field: :pid,
        header: "PID",
        header_attrs: [class: "pl-4"],
        cell_attrs: [class: "tabular-column-id pl-4"],
        format: &(&1[:pid] |> encode_pid() |> String.replace_prefix("PID", ""))
      },
      %{
        field: :name_or_initial_call,
        header: "Name or initial call",
        cell_attrs: [class: "tabular-column-name"]
      },
      %{
        field: :memory,
        header: "Memory",
        header_attrs: [class: "text-right"],
        cell_attrs: [class: "text-right"],
        sortable: true,
        format: &format_bytes(&1[:memory])
      },
      %{
        field: :reductions,
        header: "Reductions",
        header_attrs: [class: "text-right"],
        cell_attrs: [class: "text-right"],
        sortable: true
      },
      %{
        field: :message_queue_len,
        header: "MsgQ",
        header_attrs: [class: "text-right"],
        cell_attrs: [class: "text-right"],
        sortable: true
      },
      %{
        field: :current_function,
        header: "Current function",
        cell_attrs: [class: "tabular-column-current"],
        format: &format_call(&1[:current_function])
      }
    ]
  end

  defp row_attrs(process) do
    [
      {"phx-click", "show_info"},
      {"phx-value-info", encode_pid(process[:pid])},
      {"phx-page-loading", true}
    ]
  end
end
