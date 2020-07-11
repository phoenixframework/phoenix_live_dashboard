defmodule Phoenix.LiveDashboard.TableComponent do
  use Phoenix.LiveDashboard.Web, :live_component

  @sort_dir ~w(desc asc)
  @limit ~w(50 100 500 1000 5000)

  @impl true
  def mount(socket) do
    {:ok, socket}
  end

  @impl true
  def update(assigns, socket) do
    %{
      columns: columns,
      row_fetcher: row_fetcher,
      params: params,
      self_path: self_path,
      title: title
    } = assigns

    limit_options = assigns[:limit_options] || @limit
    columns = normalize_columns(columns)
    params = normalize_table_params(params, columns, limit_options)
    {rows, total} = row_fetcher.(params)

    {:ok,
     assign(socket,
       columns: columns,
       limit_options: limit_options,
       rows_name: assigns[:rows_name] || "rows",
       params: params,
       row_attrs: assigns[:row_attrs] || [],
       row_fetcher: row_fetcher,
       rows: rows,
       self_path: self_path,
       title: title,
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

  defp normalize_table_params(params, columns, limit_options) do
    sortable_columns = sortable_columns(columns)
    sort_by = params |> get_in_or_first("sort_by", sortable_columns) |> String.to_atom()
    sort_dir = params |> get_in_or_first("sort_dir", @sort_dir) |> String.to_atom()
    limit = params |> get_in_or_first("limit", limit_options) |> String.to_integer()
    search = params["search"]
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
      <%= if @title do %>
        <h5 class="card-title"><%= @title %></h5>
      <% end %>

      <div class="tabular-search">
        <form phx-change="search" phx-submit="search" phx-target="<%= @myself %>" class="form-inline">
          <div class="form-row align-items-center">
            <div class="col-auto">
              <input type="search" name="search" class="form-control form-control-sm" value="<%= @params.search %>" placeholder="Search" phx-debounce="300">
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
                <%= options_for_select(@limit_options, @params.limit) %>
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
                        <%= sort_link(@socket, @self_path, @params, column) %>
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
                      <%= tag_with_attrs(:td, column[:cell_attrs], [column, row]) %>
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
    %{self_path: self_path, params: params} = socket.assigns

    {:noreply, push_patch(socket, to: self_path.(socket, %{params | search: search}))}
  end

  def handle_event("select_limit", %{"limit" => limit}, socket) do
    %{self_path: self_path, params: params} = socket.assigns

    {:noreply, push_patch(socket, to: self_path.(socket, %{params | limit: limit}))}
  end

  defp sort_link(socket, self_path, params, column) do
    field = column.field

    case params do
      %{sort_by: ^field, sort_dir: sort_dir} ->
        params = %{params | sort_dir: opposite_sort_dir(params), sort_by: field}

        column
        |> column_header()
        |> sort_link_body(sort_dir)
        |> live_patch(to: self_path.(socket, params))

      %{} ->
        params = %{params | sort_dir: :desc, sort_by: field}

        column
        |> column_header()
        |> sort_link_body()
        |> live_patch(to: self_path.(socket, params))
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
end
