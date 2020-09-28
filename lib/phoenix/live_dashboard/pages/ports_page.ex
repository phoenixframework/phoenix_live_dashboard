defmodule Phoenix.LiveDashboard.PortsPage do
  @moduledoc false
  use Phoenix.LiveDashboard.PageBuilder

  alias Phoenix.LiveDashboard.SystemInfo

  @table_id :table
  @menu_text "Ports"

  @impl true
  def render_page(_assigns) do
    table(
      columns: columns(),
      id: @table_id,
      row_attrs: &row_attrs/1,
      row_fetcher: &fetch_ports/2,
      title: "Ports"
    )
  end

  defp fetch_ports(params, node) do
    %{search: search, sort_by: sort_by, sort_dir: sort_dir, limit: limit} = params

    SystemInfo.fetch_ports(node, search, sort_by, sort_dir, limit)
  end

  defp columns() do
    [
      %{
        field: :port,
        header_attrs: [class: "pl-4"],
        cell_attrs: [class: "tabular-column-id pl-4"],
        format: &(&1[:port] |> encode_port() |> String.replace_prefix("Port", ""))
      },
      %{
        field: :name,
        header: "Name or path",
        cell_attrs: [class: "w-50"],
        format: &format_path(&1[:name])
      },
      %{
        field: :os_pid,
        header: "OS pid",
        format: &if(&1[:os_pid] != :undefined, do: &1[:os_pid])
      },
      %{
        field: :input,
        header_attrs: [class: "text-right"],
        cell_attrs: [class: "tabular-column-bytes"],
        format: &format_bytes(&1[:input]),
        sortable: :desc
      },
      %{
        field: :output,
        header_attrs: [class: "text-right pr-4"],
        cell_attrs: [class: "tabular-column-bytes pr-4"],
        format: &format_bytes(&1[:output]),
        sortable: :desc
      },
      %{
        field: :id,
        header_attrs: [class: "text-right"],
        cell_attrs: [class: "text-right"]
      },
      %{
        field: :owner,
        format: &inspect(&1[:connected])
      }
    ]
  end

  defp row_attrs(port) do
    [
      {"phx-click", "show_info"},
      {"phx-value-info", encode_port(port[:port])},
      {"phx-page-loading", true}
    ]
  end

  @impl true
  def menu_link(_, _) do
    {:ok, @menu_text}
  end
end
