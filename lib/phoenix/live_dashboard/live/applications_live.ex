defmodule Phoenix.LiveDashboard.ApplicationsLive do
  use Phoenix.LiveDashboard.Web, :live_view

  alias Phoenix.LiveDashboard.SystemInfo
  alias Phoenix.LiveDashboard.TableComponent

  @page :applications
  @table_id :table

  @impl true
  def mount(%{"node" => _} = params, session, socket) do
    {:ok, assign_mount(socket, @page, params, session, true)}
  end

  @impl true
  def handle_params(params, _url, socket) do
    {:noreply,
     socket
     |> assign_params(params)
     |> assign(:params, params)}
  end

  @impl true
  def render(assigns) do
    ~L"""
      <%= live_component(assigns.socket, TableComponent, table_assigns(@params, @menu.node)) %>
    """
  end

  defp table_assigns(params, node) do
    %{
      columns: columns(),
      id: @table_id,
      node: node,
      page_name: @page,
      params: params,
      row_attrs: &row_attrs/1,
      row_fetcher: &fetch_applications/2
    }
  end

  defp fetch_applications(params, node) do
    %{search: search, sort_by: sort_by, sort_dir: sort_dir, limit: limit} = params

    SystemInfo.fetch_applications(node, search, sort_by, sort_dir, limit)
  end

  defp columns() do
    [
      %{
        field: :name,
        header: "Name",
        header_attrs: [class: "pl-4"],
        cell_attrs: [class: "pl-4"],
        sortable: true
      },
      %{
        field: :description,
        header: "Description"
      },
      %{
        field: :state,
        header: "State",
        sortable: true
      },
      %{
        field: :tree?,
        header: "Sup tree?",
        cell_attrs: [class: "text-center"],
        format: &if(&1[:tree?], do: "✓")
      },
      %{
        field: :version,
        header: "Version",
        header_attrs: [class: "px-4"],
        cell_attrs: [class: "px-4"]
      }
    ]
  end

  defp row_attrs(application) do
    attrs = [id: "app-#{application[:name]}"]

    cond do
      application[:state] == :loaded ->
        [{:class, "text-muted"} | attrs]

      application[:tree?] ->
        [
          {"phx-click", "show_info"},
          {"phx-value-app", encode_app(application[:name])},
          {"phx-page-loading", true} | attrs
        ]

      true ->
        attrs
    end
  end

  @impl true
  def handle_info({:node_redirect, node}, socket) do
    {:noreply, push_redirect(socket, to: self_path(socket, node, socket.assigns.params))}
  end

  def handle_info(:refresh, socket) do
    %{params: params, menu: menu} = socket.assigns
    send_update(TableComponent, table_assigns(params, menu.node))
    {:noreply, socket}
  end

  @impl true
  def handle_event("show_info", %{"app" => app}, socket) do
    params = Map.put(socket.assigns.params, :info, app)
    {:noreply, push_patch(socket, to: self_path(socket, node(), params))}
  end

  defp self_path(socket, node, params) do
    live_dashboard_path(socket, @page, node, params)
  end
end
