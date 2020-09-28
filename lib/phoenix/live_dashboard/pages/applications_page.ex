defmodule Phoenix.LiveDashboard.ApplicationsPage do
  @moduledoc false
  use Phoenix.LiveDashboard.PageBuilder

  alias Phoenix.LiveDashboard.SystemInfo

  @table_id :table
  @menu_text "Applications"

  @impl true
  def render_page(_assigns) do
    table(
      columns: columns(),
      id: @table_id,
      row_attrs: &row_attrs/1,
      row_fetcher: &fetch_applications/2,
      title: "Applications"
    )
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
        sortable: :asc
      },
      %{
        field: :description,
        header: "Description"
      },
      %{
        field: :state,
        header: "State",
        sortable: :asc
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
