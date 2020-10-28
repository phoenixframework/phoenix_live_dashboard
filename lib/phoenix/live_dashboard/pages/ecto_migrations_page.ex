defmodule Phoenix.LiveDashboard.EctoMigrationsPage do
  @moduledoc false
  use Phoenix.LiveDashboard.PageBuilder

  @compile {:no_warn_undefined, [Ecto]}
  @disabled_link "https://hexdocs.pm/phoenix_live_dashboard/ecto_migrations.html"

  @default_opts %{migration_path: "migrations"}

  @impl true
  def init(%{repo: nil}), do: {:ok, %{repo: nil}}

  def init(%{repo: repo} = args),
    do: {:ok, Map.merge(@default_opts, args), process: repo}

  @impl true
  def mount(_params, %{repo: repo, migration_path: migration_path}, socket) do
    {:ok, assign(socket, repo: repo, migration_path: migration_path)}
  end

  @impl true
  def menu_link(%{repo: nil}, _capabilities) do
    if Code.ensure_loaded?(Ecto.Adapters.SQL) do
      {:disabled, "Ecto Migrations", @disabled_link}
    else
      :skip
    end
  end

  def menu_link(%{repo: repo, migration_path: path}, capabilities) do
    path = Phoenix.Naming.humanize(path)
    title = "#{repo |> inspect() |> String.replace(".", " ")} #{path}"

    cond do
      repo not in capabilities.processes ->
        :skip

      Code.ensure_loaded?(Ecto.Adapters.SQL) ->
        {:ok, title}

      true ->
        {:disabled, title, @disabled_link}
    end
  end

  @impl true
  def render_page(assigns) do
    table(
      columns: columns(),
      id: :table_id,
      row_fetcher: &row_fetcher(assigns.repo, assigns.migration_path, &1, &2),
      rows_name: "migrations",
      title: "Migrations"
    )
  end

  defp columns() do
    [
      %{
        field: :id,
        sortable: :desc,
        header: "ID"
      },
      %{
        field: :name,
        sortable: :asc
      },
      %{
        field: :state
      },
      %{
        field: :state,
        header: "",
        format: &show_button/1
      }
    ]
  end

  # ~s(<button class="btn btn-danger" phx-target="<%= @myself %>" phx-click="rollback">Rollback</button>)
  defp show_button(:up), do: "Rollback"

  # ~s(<button class="btn btn-primary" phx-target="<%= @myself %>" phx-click="migrate">Migrate</button>)
  defp show_button(:down), do: "Migrate"

  defp row_fetcher(repo, path, params, _node) do
    %{search: search, sort_by: sort_by, sort_dir: sort_dir, limit: limit} = params

    sorter = if sort_dir == :asc, do: &<=/2, else: &>=/2

    migrations =
      for migration <- get_migrations(repo, path),
          show_migration?(migration, search),
          do: migration

    count = length(migrations)

    migrations =
      migrations |> Enum.sort_by(&Keyword.fetch!(&1, sort_by), sorter) |> Enum.take(limit)

    {migrations, count}
  end

  defp get_migrations(repo, path) do
    for {state, id, name} <-
          Ecto.Migrator.migrations(repo, [Ecto.Migrator.migrations_path(repo, path)]),
        do: [state: state, id: id, name: name]
  end

  defp show_migration?(_, nil), do: true
  defp show_migration?(migration, search), do: migration[:name] =~ search
end
