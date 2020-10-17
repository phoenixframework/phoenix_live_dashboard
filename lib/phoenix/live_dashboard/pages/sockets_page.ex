defmodule Phoenix.LiveDashboard.SocketsPage do
  @moduledoc false
  use Phoenix.LiveDashboard.PageBuilder

  alias Phoenix.LiveDashboard.SystemInfo

  @table_id :table
  @menu_text "Sockets"

  @impl true
  def render_page(_assigns) do
    table(
      columns: columns(),
      id: @table_id,
      row_attrs: &row_attrs/1,
      row_fetcher: &fetch_sockets/2,
      title: "Sockets"
    )
  end

  defp fetch_sockets(params, node) do
    %{search: search, sort_by: sort_by, sort_dir: sort_dir, limit: limit} = params

    SystemInfo.fetch_sockets(node, search, sort_by, sort_dir, limit)
  end

  defp columns() do
    [
      %{
        field: :port,
        header_attrs: [class: "pl-4"],
        format: &(&1 |> encode_socket() |> String.trim_leading("Socket")),
        cell_attrs: [class: "tabular-column-name tabular-column-id pl-4"]
      },
      %{
        field: :module,
        sortable: :asc
      },
      %{
        field: :send_oct,
        header: "Sent",
        header_attrs: [class: "text-right pr-4"],
        format: &format_bytes/1,
        cell_attrs: [class: "tabular-column-bytes pr-4"],
        sortable: :desc
      },
      %{
        field: :recv_oct,
        header: "Received",
        header_attrs: [class: "text-right pr-4"],
        format: &format_bytes/1,
        cell_attrs: [class: "tabular-column-bytes pr-4"],
        sortable: :desc
      },
      %{
        field: :local_address,
        header: "Local Address",
        sortable: :asc
      },
      %{
        field: :foreign_address,
        sortable: :asc
      },
      %{
        field: :state,
        sortable: :asc
      },
      %{
        field: :type,
        sortable: :asc
      },
      %{
        field: :connected,
        header: "Owner",
        format: &encode_pid/1
      }
    ]
  end

  defp row_attrs(socket) do
    [
      {"phx-click", "show_info"},
      {"phx-value-info", encode_socket(socket[:port])},
      {"phx-page-loading", true}
    ]
  end

  @impl true
  def menu_link(_, _) do
    {:ok, @menu_text}
  end
end
