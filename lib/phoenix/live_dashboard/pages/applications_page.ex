defmodule Phoenix.LiveDashboard.ApplicationsPage do
  @moduledoc false
  use Phoenix.LiveDashboard.PageBuilder

  alias Phoenix.LiveDashboard.SystemInfo

  @menu_text "Applications"

  @impl true
  def render_page(assigns) do
    ~H"""
    <.live_table
      id="table"
      page={@page}
      title="Applications"
      row_fetcher={&fetch_applications/2}
      row_attrs={&row_attrs/1}
    >
      <:col
        field={:name}
        sortable={:asc}
        header_attrs={[class: "pl-4"]}
        cell_attrs={[class: "pl-4"]}
      />
      <:col field={:description} />
      <:col field={:state} sortable={:asc} />
      <:col field={:tree?} header="Sup tree?" cell_attrs={[class: "text-center"]} :let={app}>
        <%= if app[:tree?], do: "✓" %>
      </:col>
      <:col field={:version} header_attrs={[class: "px-4"]} cell_attrs={[class: "px-4"]}/>
    </.live_table>
    """
  end

  defp fetch_applications(params, node) do
    %{search: search, sort_by: sort_by, sort_dir: sort_dir, limit: limit} = params

    SystemInfo.fetch_applications(node, search, sort_by, sort_dir, limit)
  end

  defp row_attrs(application) do
    attrs = [id: "app-#{application[:name]}"]

    cond do
      application[:state] == :loaded ->
        [{:class, "text-muted"} | attrs]

      application[:tree?] ->
        [
          {"phx-click", "show_info"},
          {"phx-value-info", encode_app(application[:name])},
          {"phx-page-loading", true} | attrs
        ]

      true ->
        attrs
    end
  end

  @impl true
  def menu_link(_, _) do
    {:ok, @menu_text}
  end
end
