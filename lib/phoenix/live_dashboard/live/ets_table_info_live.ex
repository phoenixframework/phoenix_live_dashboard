defmodule Phoenix.LiveDashboard.EtsTableInfoLive do
  use Phoenix.LiveDashboard.Web, :live_view
  import Phoenix.LiveDashboard.TableHelpers

  alias Phoenix.LiveDashboard.{SystemInfo, EtsTableInfoComponent}

  @max_list_length 100

  @impl true
  def mount(%{"node" => _} = params, session, socket) do
    {:ok, assign_defaults(socket, params, session, true)}
  end

  @impl true
  def handle_params(params, _url, socket) do
    {:noreply,
     socket
     |> assign_ref(params)
     |> assign_info()}
  end

  @impl true
  def render(assigns) do
    ~L"""
    <div class="processes-page">
      <h5 class="card-title">ETS - Table info</h5>

      <div class="ets-table-info">
        <div class="card">
          <div class="card-body p-0">
            <div class="dash-table-wrapper">
              <table class="table ets-table-info-table">
                <tbody>
                  <tr><td class="border-top-0">ID</td><td class="border-top-0"><pre><%= @id %></pre></td></tr>
                  <tr><td class="border-top-0">Name</td><td class="border-top-0"><pre><%= @name %></pre></td></tr>
                  <tr><td class="border-top-0">Size</td><td class="border-top-0"><pre><%= @size %></pre></td></tr>
                  <tr><td class="border-top-0">Node</td><td class="border-top-0"><pre><%= @node %></pre></td></tr>
                  <tr><td class="border-top-0">Named table</td><td class="border-top-0"><pre><%= @named_table %></pre></td></tr>
                  <tr><td class="border-top-0">Read concurrency</td><td class="border-top-0"><pre><%= @read_concurrency %></pre></td></tr>
                  <tr><td class="border-top-0">Write concurrency</td><td class="border-top-0"><pre><%= @write_concurrency %></pre></td></tr>
                  <tr><td class="border-top-0">Compressed</td><td class="border-top-0"><pre><%= @compressed %></pre></td></tr>
                  <tr><td class="border-top-0">Memory</td><td class="border-top-0"><pre><%= @memory %></pre></td></tr>
                  <tr><td class="border-top-0">Owner</td><td class="border-top-0"><pre><%= @owner %></pre></td></tr>
                  <tr><td class="border-top-0">Heir</td><td class="border-top-0"><pre><%= @heir %></pre></td></tr>
                  <tr><td class="border-top-0">Type</td><td class="border-top-0"><pre><%= @type %></pre></td></tr>
                  <tr><td class="border-top-0">Keypos</td><td class="border-top-0"><pre><%= @keypos %></pre></td></tr>
                  <tr><td class="border-top-0">Protection</td><td class="border-top-0"><pre><%= @protection %></pre></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="card mt-4">
          <div class="card-body p-0">
            <div class="dash-table-wrapper">
              <table class="table mt-0 dash-table">
                <thead>
                  <tr>
                    <th colspan="100%" class="pl-4">Entries</th>
                  </tr>
                </thead>
                <tbody>
                  <%= if @entries != :private do %>
                    <%= for entry <- @entries, entry = Tuple.to_list(entry) do %>
                      <tr>
                        <%= for index <- 0..(@entries_columns - 1) do %>
                          <td class="table-column-ref pl-4">
                            <%= if Enum.at(entry, index) != nil do %>
                              <%= Enum.at(entry, index) |> inspect_val() %>
                            <% end %>
                          </td>
                        <% end %>
                      </tr>
                    <% end %>
                  <% else %>
                    <tr>
                      <td class="pl-4">This ETS table is private.</td>
                    </tr>
                  <% end %>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    """
  end

  @impl true
  def handle_info({:node_redirect, node}, socket) do
    {:noreply, push_redirect(socket, to: self_path(socket, node, socket.assigns.params))}
  end

  def handle_info(:refresh, socket) do
    {:noreply, assign_info(socket)}
  end

  defp assign_ref(socket, %{"ref" => ref_param}) do
    assign(socket, ref: decode_reference(ref_param))
  end

  defp assign_info(%{assigns: assigns} = socket) do
    socket = case SystemInfo.fetch_table_info(assigns.ref) do
      {:ok, info} ->
        Enum.reduce(info, socket, fn {key, val}, acc ->
          assign(acc, key, inspect_info(key, val))
        end)
        |> assign(alive: true)
      :error ->
        assign(socket, alive: false)
    end

    case SystemInfo.fetch_table_entries(assigns.ref) do
      {:ok, entries} ->
        entries_columns = Enum.reduce(entries, 0, &Enum.max([tuple_size(&1), &2]))
        assign(socket, entries: entries, entries_columns: entries_columns)
      {:error, :private} -> assign(socket, entries: :private)
    end
  end

  defp inspect_info(key, val)
       when key in [:links, :monitors, :monitored_by],
       do: inspect_list(val)

  defp inspect_info(:current_function, val), do: SystemInfo.format_call(val)
  defp inspect_info(:initial_call, val), do: SystemInfo.format_call(val)
  defp inspect_info(:current_stacktrace, val), do: format_stack(val)
  defp inspect_info(_key, val), do: inspect_val(val)

  defp inspect_val({:ref, ref}) when is_reference(ref) do
    inspect_val(ref)
  end

  defp inspect_val(val), do: inspect(val, pretty: true, limit: 100)

  defp inspect_list(list) do
    {entries, left_over} = Enum.split(list, @max_list_length)

    entries
    # |> Enum.map(&inspect_val(&1, link_builder))
    |> Kernel.++(if left_over == [], do: [], else: ["..."])
    |> Enum.intersperse({:safe, "<br />"})
  end

  defp format_stack(stacktrace) do
    stacktrace
    |> Exception.format_stacktrace()
    |> String.split("\n")
    |> Enum.map(&String.replace_prefix(&1, "   ", ""))
    |> Enum.join("\n")
  end

  defp self_path(socket, node, params) do
    live_dashboard_path(socket, :ets, node, [], params)
  end

  @doc false
  def encode_reference(ref) do
    ref
    |> :erlang.ref_to_list()
    |> List.to_string()
  end

  @doc false
  def decode_reference(list_ref), do: :erlang.list_to_ref(String.to_charlist(list_ref))
end
