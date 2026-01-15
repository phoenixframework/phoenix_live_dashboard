defmodule Phoenix.LiveDashboard.SocketsPage do
  @moduledoc false
  use Phoenix.LiveDashboard.PageBuilder
  use Phoenix.LiveDashboard.LiveCapture

  alias Phoenix.LiveDashboard.SystemInfo
  import Phoenix.LiveDashboard.Helpers

  @menu_text "Sockets"

  @impl true
  capture attributes: Phoenix.LiveDashboard.LiveCaptureFactory.sockets_page_assigns()
  def render(assigns) do
    assigns =
      assigns
      |> assign_new(:row_fetcher, fn -> &fetch_sockets/2 end)
      |> assign_new(:row_attrs, fn -> &row_attrs/1 end)

    ~H"""
    <.live_table
      id="sockets-table"
      dom_id="sockets-table"
      page={@page}
      title="Sockets"
      row_fetcher={@row_fetcher}
      row_attrs={@row_attrs}
    >
      <:col :let={socket} field={:port}>
        <%= socket[:port] |> encode_socket() |> String.trim_leading("Socket") %>
      </:col>
      <:col field={:module} sortable={:asc} />
      <:col :let={socket} field={:send_oct} header="Sent" text_align="right" sortable={:desc}>
        <%= format_bytes(socket[:send_oct]) %>
      </:col>
      <:col :let={socket} field={:recv_oct} header="Received" text_align="right" sortable={:desc}>
        <%= format_bytes(socket[:recv_oct]) %>
      </:col>
      <:col field={:local_address} header="Local Address" sortable={:asc} />
      <:col field={:foreign_address} sortable={:asc} />
      <:col field={:state} sortable={:asc} />
      <:col field={:type} sortable={:asc} />
      <:col :let={socket} field={:connected} header="Owner">
        <%= encode_pid(socket[:connected]) %>
      </:col>
    </.live_table>
    """
  end

  defp fetch_sockets(params, node) do
    %{search: search, sort_by: sort_by, sort_dir: sort_dir, limit: limit} = params

    SystemInfo.fetch_sockets(node, search, sort_by, sort_dir, limit)
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
