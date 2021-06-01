defmodule Phoenix.LiveDashboard.ProcessesPage do
  @moduledoc false
  use Phoenix.LiveDashboard.PageBuilder
  import Phoenix.LiveDashboard.Helpers

  alias Phoenix.LiveDashboard.SystemInfo

  @table_id :table
  @menu_text "Processes"

  @impl true
  def render_page(_assigns) do
    table(
      columns: table_columns(),
      id: @table_id,
      row_attrs: &row_attrs/1,
      row_fetcher: {&fetch_processes/3, nil},
      title: "Processes"
    )
  end

  defp fetch_processes(params, node, state) do
    %{search: search, sort_by: sort_by, sort_dir: sort_dir, limit: limit} = params

    {processes, count, state} =
      SystemInfo.fetch_processes(node, search, sort_by, sort_dir, limit, state)

    {processes, count, state}
  end

  defp table_columns() do
    [
      %{
        field: :pid,
        header: "PID",
        header_attrs: [class: "pl-4"],
        cell_attrs: [class: "tabular-column-id pl-4"],
        format: &(&1 |> encode_pid() |> String.replace_prefix("PID", ""))
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
        sortable: :desc,
        format: &format_bytes/1
      },
      %{
        field: :reductions_diff,
        header: "Reductions",
        header_attrs: [class: "text-right"],
        cell_attrs: [class: "text-right"],
        sortable: :desc
      },
      %{
        field: :message_queue_len,
        header: "MsgQ",
        header_attrs: [class: "text-right"],
        cell_attrs: [class: "text-right"],
        sortable: :desc
      },
      %{
        field: :current_function,
        header: "Current function",
        cell_attrs: [class: "tabular-column-current"],
        format: &format_call/1
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

  @impl true
  def menu_link(_, _) do
    {:ok, @menu_text}
  end
end
