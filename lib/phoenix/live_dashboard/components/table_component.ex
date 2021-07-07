defmodule Phoenix.LiveDashboard.TableComponent do
  use Phoenix.LiveDashboard.Web, :live_component

  alias Phoenix.LiveDashboard.PageBuilder

  @limit [50, 100, 500, 1000, 5000]

  @type params() :: %{
          limit: pos_integer(),
          sort_by: :atom,
          sort_dir: :desc | :asc,
          search: binary(),
          hint: binary() | nil
        }

  @impl true
  def mount(socket) do
    {:ok, socket}
  end

  def normalize_params(params) do
    params
    |> validate_required([:columns, :id, :row_fetcher, :title])
    |> normalize_columns()
    |> validate_required_one_sortable_column()
    |> Map.put_new(:search, true)
    |> Map.put_new(:limit, @limit)
    |> Map.put_new(:row_attrs, [])
    |> Map.put_new(:hint, nil)
    |> Map.update(:default_sort_by, nil, &(&1 && to_string(&1)))
    |> Map.put_new_lazy(:rows_name, fn ->
      Phoenix.Naming.humanize(params.title) |> String.downcase()
    end)
  end

  defp validate_required(params, list) do
    case Enum.find(list, &(not Map.has_key?(params, &1))) do
      nil -> :ok
      key -> raise ArgumentError, "the #{inspect(key)} parameter is expected in table component"
    end

    params
  end

  defp normalize_columns(%{columns: columns} = params) when is_list(columns) do
    %{params | columns: Enum.map(columns, &normalize_column/1)}
  end

  defp normalize_columns(%{columns: columns}) do
    raise ArgumentError, ":columns must be a list, got: #{inspect(columns)}"
  end

  defp normalize_column(column) do
    case Access.fetch(column, :field) do
      {:ok, nil} ->
        msg = ":field parameter must not be nil, got: #{inspect(column)}"
        raise ArgumentError, msg

      {:ok, field} when is_atom(field) or is_binary(field) ->
        column
        |> Map.new()
        |> Map.put_new_lazy(:header, fn -> Phoenix.Naming.humanize(field) end)
        |> Map.put_new(:header_attrs, [])
        |> Map.put_new(:format, & &1)
        |> Map.put_new(:cell_attrs, [])
        |> Map.put_new(:sortable, nil)

      {:ok, _} ->
        msg = ":field parameter must be an atom or a string, got: "
        raise ArgumentError, msg <> inspect(column)

      :error ->
        msg = "the :field parameter is expected, got: #{inspect(column)}"
        raise ArgumentError, msg
    end
  end

  defp validate_required_one_sortable_column(%{columns: columns} = params) do
    sortable_columns = sortable_columns(columns)

    if sortable_columns == [] do
      raise ArgumentError, "must have at least one column with :sortable parameter"
    else
      params
    end
  end

  @impl true
  def update(assigns, socket) do
    assigns = normalize_table_params(assigns)

    %{
      table_params: table_params,
      page: page,
      row_fetcher: row_fetcher
    } = assigns

    {rows, total, socket} = fetch_rows(row_fetcher, table_params, page.node, socket)
    assigns = Map.merge(assigns, %{rows: rows, total: total})
    {:ok, assign(socket, assigns)}
  end

  defp fetch_rows(row_fetcher, table_params, page_node, socket)
       when is_function(row_fetcher, 2) do
    {rows, total} = row_fetcher.(table_params, page_node)
    {rows, total, socket}
  end

  defp fetch_rows({row_fetcher, initial_state}, table_params, page_node, socket)
       when is_function(row_fetcher, 3) do
    state = Map.get(socket.assigns, :row_fetcher_state, initial_state)
    {rows, total, state} = row_fetcher.(table_params, page_node, state)
    {rows, total, assign(socket, :row_fetcher_state, state)}
  end

  defp normalize_table_params(assigns) do
    %{columns: columns, page: %{params: all_params}, default_sort_by: sort_by} = assigns
    sortable_columns = sortable_columns(columns)

    sort_by =
      all_params
      |> get_in_or_first("sort_by", sort_by, sortable_columns)
      |> String.to_atom()

    sort_dir =
      all_params
      |> get_in_or_first("sort_dir", sortable_dirs(columns, sort_by))
      |> String.to_atom()

    limit =
      if assigns.limit do
        all_params
        |> get_in_or_first("limit", Enum.map(assigns.limit, &to_string/1))
        |> String.to_integer()
      else
        nil
      end

    search = all_params["search"]
    search = if search == "", do: nil, else: search

    table_params = %{sort_by: sort_by, sort_dir: sort_dir, limit: limit, search: search}
    Map.put(assigns, :table_params, table_params)
  end

  defp sortable_columns(columns) do
    for column <- columns, column.sortable, do: to_string(column.field)
  end

  defp sortable_dirs(columns, field) do
    case Enum.find(columns, &(&1.field == field)) do
      %{sortable: :desc} -> ~w(desc asc)
      %{sortable: :asc} -> ~w(asc desc)
    end
  end

  defp get_in_or_first(params, key, default \\ nil, valid) do
    value = params[key]
    if value in valid, do: value, else: default || hd(valid)
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="tabular">
      <h5 class="card-title"><%= @title %> <%= @hint && hint(do: @hint) %></h5>

      <%= if @search do %>
        <div class="tabular-search">
          <form phx-change="search" phx-submit="search" phx-target={@myself} class="form-inline">
            <div class="form-row align-items-center">
              <div class="col-auto">
                <input type="search" name="search" class="form-control form-control-sm" value={@table_params.search} placeholder="Search" phx-debounce="300">
              </div>
            </div>
          </form>
        </div>
      <% end %>

      <form phx-change="select_limit" phx-target={@myself} class="form-inline">
        <div class="form-row align-items-center">
          <%= if @limit do %>
            <div class="col-auto">Showing at most</div>
            <div class="col-auto">
              <div class="input-group input-group-sm">
                <select name="limit" class="custom-select" id="limit-select">
                  <%= options_for_select(@limit, @table_params.limit) %>
                </select>
              </div>
            </div>
            <div class="col-auto">
              <%= @rows_name %> out of <%= @total %>
            </div>
          <% else %>
            <div class="col-auto">
              Showing <%= @total %> <%= @rows_name %>
            </div>
          <% end %>
        </div>
      </form>

      <div class="card tabular-card mb-4 mt-4">
        <div class="card-body p-0">
          <div class="dash-table-wrapper">
            <table class="table table-hover mt-0 dash-table">
              <thead>
                <tr>
                  <%= for column <- @columns do %>
                    <th {calc_attrs(column.header_attrs, [column])}>
                      <%= if direction = column.sortable do %>
                        <%= sort_link(@socket, @page, @table_params, column, direction) %>
                      <% else %>
                        <%= column.header %>
                      <% end %>
                    </th>
                  <% end %>
                </tr>
              </thead>
              <tbody>
                <%= for row <- @rows do %>
                  <tr {calc_attrs(@row_attrs, [row])}>
                    <%= for column <- @columns do %>
                      <td {calc_attrs(column.cell_attrs, [row])}>
                        <%= column.format.(row[column.field]) %>
                      </td>
                    <% end %>
                  </tr>
                <% end %>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    """
  end

  defp calc_attrs(falsy, _) when falsy in [nil, false], do: []
  defp calc_attrs(list, _) when is_list(list), do: list
  defp calc_attrs(fun, args) when is_function(fun), do: apply(fun, args)

  defp column_header(column) do
    column.header || column.field |> to_string() |> String.capitalize()
  end

  @impl true
  def handle_event("search", %{"search" => search}, socket) do
    table_params = %{socket.assigns.table_params | search: search}
    to = PageBuilder.live_dashboard_path(socket, socket.assigns.page, table_params)
    {:noreply, push_patch(socket, to: to)}
  end

  def handle_event("select_limit", %{"limit" => limit}, socket) do
    table_params = %{socket.assigns.table_params | limit: limit}
    to = PageBuilder.live_dashboard_path(socket, socket.assigns.page, table_params)
    {:noreply, push_patch(socket, to: to)}
  end

  defp sort_link(socket, page, table_params, column, direction) do
    field = column.field

    case table_params do
      %{sort_by: ^field, sort_dir: sort_dir} ->
        table_params = %{table_params | sort_dir: opposite_sort_dir(table_params), sort_by: field}

        column
        |> column_header()
        |> sort_link_body(sort_dir)
        |> live_patch(to: PageBuilder.live_dashboard_path(socket, page, table_params))

      %{} ->
        table_params = %{table_params | sort_dir: direction, sort_by: field}

        column
        |> column_header()
        |> sort_link_body()
        |> live_patch(to: PageBuilder.live_dashboard_path(socket, page, table_params))
    end
  end

  defp sort_link_body(link_name), do: link_name

  defp sort_link_body(link_name, sort_dir) do
    [link_name | sort_link_icon(sort_dir)]
  end

  defp sort_link_icon(:desc) do
    raw("""
    <div class="dash-table-icon">
      <span class="icon-sort icon-desc"></span>
    </div>
    """)
  end

  defp sort_link_icon(:asc) do
    raw("""
    <div class="dash-table-icon">
      <span class="icon-sort icon-asc"></span>
    </div>
    """)
  end

  defp opposite_sort_dir(%{sort_dir: :desc}), do: :asc
  defp opposite_sort_dir(_), do: :desc
end
