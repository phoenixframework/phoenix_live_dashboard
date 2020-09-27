if match?({:module, _}, Code.ensure_compiled(EctoPSQLExtras)) do
  {:module, _} = Code.ensure_compiled(Postgrex)

  defmodule Phoenix.LiveDashboard.Pages.EctoPsqlExtrasPage do
    @moduledoc false
    use Phoenix.LiveDashboard.PageBuilder

    @menu_text "PsqlExtras"

    @impl true
    def init(%{repo: repo}) do
      {:ok, %{repo: repo}, process: repo}
    end

    @impl true
    def mount(_params, %{repo: repo}, socket) do
      {:ok, assign(socket, repo: repo)}
    end

    @impl true
    def menu_link(%{repo: repo}, capabilities) do
      if repo in capabilities.processes do
        {:ok, @menu_text}
      else
        {:disabled, @menu_text}
      end
    end

    @impl true
    def render_page(assigns) do
      tab_bar(tabs: tabs(assigns) |> IO.inspect())
    end

    @tables [
      :cache_hit,
      :index_cache_hit,
      :table_cache_hit,
      :index_usage,
      :locks,
      :all_locks,
      :outliers,
      :calls,
      :blocking,
      :total_index_size,
      :index_size,
      :table_size,
      :table_indexes_size,
      :total_table_size,
      :unused_indexes,
      :seq_scans,
      :long_running_queries,
      :records_rank,
      :bloat,
      :vacuum_stats
    ]
    defp tabs(%{repo: repo}) do
      for table_name <- @tables do
        {table_name,
         name: Phoenix.Naming.humanize(table_name), render: render_table(table_name, repo)}
      end
    end

    defp render_table(table, repo) do
      table(
        columns: table_columns(table),
        id: :table_id,
        # row_attrs: table_row_attrs(table),
        row_fetcher: row_fetcher(table, repo),
        title: Phoenix.Naming.humanize(table)
      )
    end

    defp table_columns(:cache_hit) do
      [%{field: :name, sortable: true}, %{field: :ratio, sortable: true}]
    end

    defp table_columns(:index_cache_hit) do
      [
        %{field: :name, sortable: true},
        %{field: :buffer_hits, sortable: true},
        %{field: :block_reads, sortable: true},
        %{field: :total_read, sortable: true},
        %{field: :ratio, sortable: true}
      ]
    end

    defp table_columns(:table_cache_hit) do
      [
        %{field: :name, sortable: true},
        %{field: :buffer_hits, sortable: true},
        %{field: :block_reads, sortable: true},
        %{field: :total_read, sortable: true},
        %{field: :ratio, sortable: true}
      ]
    end

    defp table_columns(:index_usage) do
      [
        %{field: :relname, sortable: true},
        %{field: :percent_of_times_index_used, sortable: true},
        %{field: :rows_in_table, sortable: true}
      ]
    end

    defp table_columns(:locks) do
      [
        %{field: :procpid, sortable: true},
        %{field: :relname, sortable: true},
        %{field: :transactionid, sortable: true},
        %{field: :granted, sortable: true},
        %{field: :query_snippet, sortable: true},
        %{field: :mode, sortable: true},
        %{field: :age, sortable: true}
      ]
    end

    defp table_columns(:all_locks) do
      [
        %{field: :pid, sortable: true},
        %{field: :relname, sortable: true},
        %{field: :transactionid, sortable: true},
        %{field: :granted, sortable: true},
        %{field: :query_snippet, sortable: true},
        %{field: :mode, sortable: true},
        %{field: :age, sortable: true}
      ]
    end

    defp table_columns(table) when table in [:outliers, :calls] do
      [
        %{field: :qry, sortable: true},
        %{field: :exec_time, sortable: true},
        %{field: :prop_exec_time, sortable: true},
        %{field: :ncalls, sortable: true},
        %{field: :sync_io_time, sortable: true}
      ]
    end

    defp table_columns(:blocking) do
      [
        %{field: :blocked_pid, sortable: true},
        %{field: :blocking_statement, sortable: true},
        %{field: :blocking_duration, sortable: true},
        %{field: :blocking_pid, sortable: true},
        %{field: :blocked_statement, sortable: true},
        %{field: :blocked_duration, sortable: true}
      ]
    end

    defp table_columns(:total_index_size) do
      [
        %{field: :size, sortable: true}
      ]
    end

    defp table_columns(table)
         when table in [
                :index_size,
                :index_size,
                :total_indexes_size,
                :table_size,
                :total_table_size
              ] do
      [
        %{field: :name, sortable: true},
        %{field: :size, sortable: true}
      ]
    end

    defp table_columns(:table_indexes_size) do
      [
        %{field: :table, sortable: true},
        %{field: :size, sortable: true}
      ]
    end

    defp table_columns(:unused_indexes) do
      [
        %{field: :table, sortable: true},
        %{field: :index, sortable: true},
        %{field: :index_size, sortable: true},
        %{field: :index_scans, sortable: true}
      ]
    end

    defp table_columns(:seq_scans) do
      [
        %{field: :name, sortable: true},
        %{field: :count, sortable: true}
      ]
    end

    defp table_columns(:long_running_queries) do
      [
        %{field: :pid, sortable: true},
        %{field: :duration, sortable: true},
        %{field: :query, sortable: true}
      ]
    end

    defp table_columns(:records_rank) do
      [
        %{field: :name, sortable: true},
        %{field: :estimated_count, sortable: true}
      ]
    end

    defp table_columns(:bloat) do
      [
        %{field: :type, sortable: true},
        %{field: :schemaname, sortable: true},
        %{field: :object_name, sortable: true},
        %{field: :bloat, sortable: true},
        %{field: :waste, sortable: true}
      ]
    end

    defp table_columns(:vacuum_stats) do
      [
        %{field: :schema, sortable: true},
        %{field: :table, sortable: true},
        %{field: :last_vacuum, sortable: true},
        %{field: :last_autovacuum, sortable: true},
        %{field: :rowcount, sortable: true},
        %{field: :dead_rowcount, sortable: true},
        %{field: :autovacuum_threshold, sortable: true},
        %{field: :expect_autovacuum, sortable: true}
      ]
    end

    defp row_fetcher(name, repo) do
      fn params, node ->
        :rpc.call(node, EctoPSQLExtras, :query, [name, repo, :raw])
        |> calc_rows(params)
      end
    end

    defp calc_rows(%Postgrex.Result{} = result, params) do
      %{search: _search, sort_by: sort_by, sort_dir: sort_dir, limit: limit} = params
      sorter = if sort_dir == :asc, do: &<=/2, else: &>=/2
      %{columns: columns, rows: rows} = result |> IO.inspect()

      rows =
        rows
        |> Enum.map(&Enum.zip(columns, &1))
        |> Enum.map(fn row ->
          Map.new(row, fn {key, value} -> {String.to_atom(key), convert_value(value)} end)
        end)

      count = length(rows)
      rows = rows |> Enum.sort_by(&Map.fetch!(&1, sort_by), sorter) |> Enum.take(limit)
      {rows, count}
    end

    defp convert_value(%Decimal{} = decimal) do
      Decimal.to_float(decimal)
    end

    defp convert_value(value) do
      value
    end
  end
end
