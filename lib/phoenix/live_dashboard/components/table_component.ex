defmodule Phoenix.LiveDashboard.TableComponent do
  @moduledoc false
  # `Phoenix.LiveComponent` to render a simple table.

  # This component is used in different pages like applications or sockets.
  # It can be used in a `Phoenix.LiveView` in the `render/1` function:

  # ```
  # def render(assigns) do
  #   ~L\"""
  #     <%= live_component(assigns.socket, Phoenix.LiveDashboard.TableComponent, options) %>
  #   \"""
  # end
  # ```

  # # Options

  # These are the options supported by the component:

  # * `:id` - Required. Because is a stateful `Phoenix.LiveComponent` an unique id is needed.
  # * `:columns` - Required. A `Keyword` list with the following keys:
  #   * `:field` - Required. An identifier for the column.
  #   * `:header` - Label to show in the current column. Default value is calculated from `:field`.
  #   * `:header_attrs` - A list with HTML attributes for the column header.
  #     More info: `Phoenix.HTML.Tag.tag/1`. Default `[]`.
  #   * `:format` - Function which receives the row data and returns the cell information.
  #     Default is calculated from `:field`: `row[:field]`.
  #   * `:cell_attrs` - A list with HTML attributes for the table cell.
  #     It also can be a function which receives the row data and returns an attribute list.
  #     More info: `Phoenix.HTML.Tag.tag/1`. Default: `[]`.
  #   * `:sortable` - A boolean. When it is true the column header is clickable
  #     and it fetches again rows with the new order.  At least one column should be sortable.
  #     Default: `false`
  # * `:limit_options` - A list of integers to limit the number of rows to show.
  #   Default: `[50, 100, 500, 1000, 5000]`
  # * `:page_name` - Required. The name of current `Phoenix.LiveView`.
  # * `:params` - Required. All the params received by the parent `Phoenix.LiveView`,
  #   so the table can handle its own parameters.
  # * `:row_fetcher` - Required. A function which receives the params and the node and
  #   returns a tuple with the rows and the total number:
  #   `(params(), node()) -> {list(), integer() | binary()}`
  # * `:rows_name` - A string to name the representation of the rows.
  #   Default is calculated with the given `:page_name`.
  # * `:title` - The title of the table.
  #   Default is calculated with the given `:page_name`.

  use Phoenix.LiveDashboard.Web, :live_component

  @sort_dir ~w(desc asc)
  @limit [50, 100, 500, 1000, 5000]

  @type params() :: %{
          limit: pos_integer(),
          sort_by: :atom,
          sort_dir: :desc | :asc,
          search: binary()
        }

  @impl true
  def mount(socket) do
    {:ok, socket}
  end

  @impl true
  def update(assigns, socket) do
    %{
      columns: columns,
      id: _id,
      node: node,
      page_name: page_name,
      params: all_params,
      row_fetcher: row_fetcher
    } = assigns

    limit_options = assigns[:limit_options] || @limit
    columns = normalize_columns(columns)
    table_params = normalize_table_params(all_params, columns, limit_options)
    {rows, total} = row_fetcher.(table_params, node)

    {:ok,
     assign(socket,
       all_params: all_params,
       columns: columns,
       limit_options: limit_options,
       node: node,
       page_name: page_name,
       row_attrs: assigns[:row_attrs] || [],
       row_fetcher: row_fetcher,
       rows: rows,
       rows_name: assigns[:rows_name] || Phoenix.Naming.humanize(page_name) |> String.downcase(),
       table_params: table_params,
       title: assigns[:title] || Phoenix.Naming.humanize(page_name),
       total: total
     )}
  end

  defp normalize_columns(columns) do
    Enum.map(columns, fn %{field: field} = column ->
      column
      |> Map.put_new_lazy(:header, fn -> Phoenix.Naming.humanize(field) end)
      |> Map.put_new(:header_attrs, [])
      |> Map.put_new(:format, & &1[field])
      |> Map.put_new(:cell_attrs, [])
      |> Map.put_new(:sortable, false)
    end)
  end

  defp normalize_table_params(all_params, columns, limit_options) do
    sortable_columns = sortable_columns(columns)
    sort_by = all_params |> get_in_or_first("sort_by", sortable_columns) |> String.to_atom()
    sort_dir = all_params |> get_in_or_first("sort_dir", @sort_dir) |> String.to_atom()
    limit_options = Enum.map(limit_options, &to_string/1)
    limit = all_params |> get_in_or_first("limit", limit_options) |> String.to_integer()
    search = all_params["search"]
    search = if search == "", do: nil, else: search
    %{sort_by: sort_by, sort_dir: sort_dir, limit: limit, search: search}
  end

  defp sortable_columns(columns) do
    Enum.flat_map(columns, &if(&1[:sortable], do: [to_string(&1[:field])], else: []))
  end

  defp get_in_or_first(params, key, valid) do
    value = params[key]
    if value in valid, do: value, else: hd(valid)
  end

  @impl true
  def render(assigns) do
    ~L"""
    <div class="tabular-page">
      <h5 class="card-title"><%= @title %></h5>

      <div class="tabular-search">
        <form phx-change="search" phx-submit="search" phx-target="<%= @myself %>" class="form-inline">
          <div class="form-row align-items-center">
            <div class="col-auto">
              <input type="search" name="search" class="form-control form-control-sm" value="<%= @table_params.search %>" placeholder="Search" phx-debounce="300">
            </div>
          </div>
        </form>
      </div>

      <form phx-change="select_limit" phx-target="<%= @myself %>" class="form-inline">
        <div class="form-row align-items-center">
          <div class="col-auto">Showing at most</div>
          <div class="col-auto">
            <div class="input-group input-group-sm">
              <select name="limit" class="custom-select" id="limit-select">
                <%= options_for_select(@limit_options, @table_params.limit) %>
              </select>
            </div>
          </div>
          <div class="col-auto">
            <%= @rows_name %> out of <%= @total %>
          </div>
        </div>
      </form>

      <div class="card tabular-card mb-4 mt-4">
        <div class="card-body p-0">
          <div class="dash-table-wrapper">
            <table class="table table-hover mt-0 dash-table">
              <thead>
                <tr>
                  <%= for column <- @columns do %>
                    <%= tag_with_attrs(:th, column[:header_attrs], [column]) %>
                      <%= if column[:sortable] do %>
                        <%= sort_link(@socket, @page_name, @node, @all_params, @table_params, column) %>
                      <% else %>
                        <%= column.header %>
                      <% end %>
                    </th>
                  <% end %>
                </tr>
              </thead>
              <tbody>
                <%= for row <- @rows do %>
                  <%= tag_with_attrs(:tr, @row_attrs, [row]) %>
                    <%= for column <- @columns do %>
                      <%= tag_with_attrs(:td, column[:cell_attrs], [row]) %>
                        <%= column[:format].(row) %>
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

  defp tag_with_attrs(name, fun, args), do: tag(name, calc_attrs(fun, args))

  defp calc_attrs(falsy, _) when falsy in [nil, false], do: []
  defp calc_attrs(list, _) when is_list(list), do: list
  defp calc_attrs(fun, args) when is_function(fun), do: apply(fun, args)

  defp column_header(column) do
    column.header || column.field |> to_string() |> String.capitalize()
  end

  @impl true
  def handle_event("search", %{"search" => search}, socket) do
    new_params = %{socket.assigns.table_params | search: search}
    {:noreply, push_patch(socket, to: self_path(socket, new_params))}
  end

  def handle_event("select_limit", %{"limit" => limit}, socket) do
    new_params = %{socket.assigns.table_params | limit: limit}
    {:noreply, push_patch(socket, to: self_path(socket, new_params))}
  end

  defp sort_link(socket, page_name, node, all_params, table_params, column) do
    field = column.field

    case table_params do
      %{sort_by: ^field, sort_dir: sort_dir} ->
        table_params = %{table_params | sort_dir: opposite_sort_dir(table_params), sort_by: field}

        column
        |> column_header()
        |> sort_link_body(sort_dir)
        |> live_patch(to: self_path(socket, page_name, node, all_params, table_params))

      %{} ->
        table_params = %{table_params | sort_dir: :desc, sort_by: field}

        column
        |> column_header()
        |> sort_link_body()
        |> live_patch(to: self_path(socket, page_name, node, all_params, table_params))
    end
  end

  defp sort_link_body(link_name), do: link_name

  defp sort_link_body(link_name, sort_dir) do
    [link_name | sort_link_icon(sort_dir)]
  end

  defp sort_link_icon(:asc) do
    {:safe,
     """
     <div class="dash-table-icon">
       <span class="icon-sort icon-asc"></span>
     </div>
     """}
  end

  defp sort_link_icon(:desc) do
    {:safe,
     """
     <div class="dash-table-icon">
       <span class="icon-sort icon-desc"></span>
     </div>
     """}
  end

  defp opposite_sort_dir(%{sort_dir: :desc}), do: :asc

  defp opposite_sort_dir(_), do: :desc

  defp self_path(socket, new_params) do
    %{
      page_name: page_name,
      node: node,
      all_params: all_params
    } = socket.assigns

    self_path(socket, page_name, node, all_params, new_params)
  end

  defp self_path(socket, page_name, node, all_params, new_params) do
    new_params = Enum.into(new_params, %{}, fn {k, v} -> {Atom.to_string(k), to_string(v)} end)
    live_dashboard_path(socket, page_name, node, Map.merge(all_params, new_params))
  end
end
