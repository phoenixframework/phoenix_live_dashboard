defmodule Phoenix.LiveDashboard.PageBuilder do
  @moduledoc """
  Page builder is the default mechanism for building custom dashboard pages.

  Each dashboard page is a LiveView with additional callbacks for
  customizing the menu appearance. One notable difference, however,
  is that a page implements a `render_page/1` callback, which must
  return one or more page builder components, instead of a `render/1`
  callback that returns `~H` or `~L` (deprecated).

  A simple and straight-forward example of a custom page is the
  `Phoenix.LiveDashboard.EtsPage` that ships with the dashboard:

      defmodule Phoenix.LiveDashboard.EtsPage do
        @moduledoc false
        use Phoenix.LiveDashboard.PageBuilder

        @impl true
        def menu_link(_, _) do
          {:ok, "ETS"}
        end

        @impl true
        def render_page(_assigns) do
          table(
            columns: table_columns(),
            id: :ets_table,
            row_attrs: &row_attrs/1,
            row_fetcher: &fetch_ets/2,
            rows_name: "tables",
            title: "ETS"
          )
        end

        defp fetch_ets(params, node) do
          %{search: search, sort_by: sort_by, sort_dir: sort_dir, limit: limit} = params

          # Here goes the code that goes through all ETS tables, searches
          # (if not nil), sorts, and limits them.
          #
          # It must return a tuple where the first element is list with
          # the current entries (up to limit) and an integer with the
          # total amount of entries.
          # ...
        end

        defp table_columns() do
          [
            %{
              field: :name,
              header: "Name or module",
            },
            %{
              field: :protection
            },
            %{
              field: :type
            },
            %{
              field: :size,
              cell_attrs: [class: "text-right"],
              sortable: :desc
            },
            %{
              field: :memory,
              format: &format_words/1,
              sortable: :desc
            },
            %{
              field: :owner,
              format: &encode_pid/1
            }
          ]
        end

        defp row_attrs(table) do
          [
            {"phx-click", "show_info"},
            {"phx-value-info", encode_ets(table[:id])},
            {"phx-page-loading", true}
          ]
        end
      end

  Once a page is defined, it must be declared in your `live_dashboard`
  route as follows:

      live_dashboard "/dashboard",
        additional_pages: [
          route_name: MyAppWeb.MyCustomPage
        ]

  Or alternatively:

      live_dashboard "/dashboard",
        additional_pages: [
          route_name: {MyAppWeb.MyCustomPage, some_option: ...}
        ]

  The second argument of the tuple will be given to the `c:init/1`
  callback. If not tuple is given, `c:init/1` will receive an empty
  list.

  ## Components

  A page can only have the components listed with this page.

  We currently support `card/1`, `columns/1`, `fields_card/1`,
  `live_layered_graph/1`, `live_nav_bar/1`, `row/1`, `shared_usage_card/1`, `live_table/1`,
  and `usage_card/1`.

  ## Helpers

  Some helpers are available for page building. The supported
  helpers are: `live_dashboard_path/2`, `live_dashboard_path/3`,
  `encode_app/1`, `encode_ets/1`, `encode_pid/1`, `encode_port/1`,
  and `encode_socket/1`.
  """

  use Phoenix.Component

  defstruct info: nil,
            module: nil,
            node: nil,
            params: nil,
            route: nil,
            tick: 0,
            allow_destructive_actions: false

  @type session :: map
  @type requirements :: [{:application | :process | :module, atom()}]
  @type unsigned_params :: map
  @type capabilities :: %{
          applications: [atom()],
          modules: [atom()],
          processes: [atom()],
          dashboard_running?: boolean(),
          system_info: nil | binary()
        }

  alias Phoenix.LiveDashboard.{
    LayeredGraphComponent,
    NavBarComponent,
    TableComponent
  }

  @doc """
  Callback invoked when a page is declared in the router.

  It receives the router options and it must return the
  tuple `{:ok, session, requirements}`.

  The page session will be serialized to the client and
  received on `mount`.

  The requirements is an optional keyword to detect the
  state of the node.

  The result of this detection will be passed as second
  argument in the `c:menu_link/2` callback.
  The possible values are:

    * `:applications` list of applications that are running or not.
    * `:modules` list of modules that are loaded or not.
    * `:pids` list of processes that alive or not.

  """
  @callback init(term()) :: {:ok, session()} | {:ok, session(), requirements()}

  @doc """
  Callback invoked when a page is declared in the router.

  It receives the session returned by the `c:init/1` callback
  and the capabilities of the current node.

  The possible return values are:

    * `{:ok, text}` when the link should be enable and text to be shown.

    * `{:disabled, text}` when the link should be disable and text to be shown.

    * `{:disabled, text, more_info_url}` similar to the previous one but
      it also includes a link to provide more information to the user.

    * `:skip` when the link should not be shown at all.
  """
  @callback menu_link(session(), capabilities()) ::
              {:ok, String.t()}
              | {:disabled, String.t()}
              | {:disabled, String.t(), String.t()}
              | :skip

  @callback mount(unsigned_params(), session(), socket :: Socket.t()) ::
              {:ok, Socket.t()} | {:ok, Socket.t(), keyword()}

  @callback render_page(assigns :: Socket.assigns()) :: Phoenix.LiveView.Rendered.t()

  @callback handle_params(unsigned_params(), uri :: String.t(), socket :: Socket.t()) ::
              {:noreply, Socket.t()}

  @doc """
  Callback invoked when an event is called.

  Note that `show_info` event is handled automatically by
  `Phoenix.LiveDashboard.PageBuilder`,
  but the `info` parameter (`phx-value-info`) needs to be encoded with
  one of the `encode_*` helper functions.

  For more details, see [`Phoenix.LiveView bindings`](https://hexdocs.pm/phoenix_live_view/Phoenix.LiveView.html#module-bindings)
  """
  @callback handle_event(event :: binary, unsigned_params(), socket :: Socket.t()) ::
              {:noreply, Socket.t()} | {:reply, map, Socket.t()}

  @callback handle_info(msg :: term, socket :: Socket.t()) ::
              {:noreply, Socket.t()}

  @callback handle_refresh(socket :: Socket.t()) ::
              {:noreply, Socket.t()}

  @optional_callbacks mount: 3,
                      handle_params: 3,
                      handle_event: 3,
                      handle_info: 2,
                      handle_refresh: 1

  @doc """
  Table live component.

  You can see it in use the applications, processes, sockets pages and many others.
  """
  attr :id, :any,
    required: true,
    doc: "Because is a stateful `Phoenix.LiveComponent` an unique id is needed."

  attr :page, __MODULE__, required: true, doc: "Dashboard page"

  slot :col, required: true, doc: "Columns for the table" do
    attr :field, :atom, required: true, doc: "Identifier for the column"

    attr :sortable, :atom,
      values: [:asc, :desc],
      doc: """
      When set, the column header is clickable and it fetches again rows with the new order.
      Required for at least one column.
      """

    attr :header, :string,
      doc: "Label to show in the current column. Default value is calculated from `:field`."

    attr :header_attrs, :any,
      doc: """
      A list with HTML attributes for the column header.
      It can be also a function that receive the column as argument
      and returns a list of 2 element tuple with HTML attribute name
      and value. Default to `[]`.
      """

    attr :cell_attrs, :any,
      doc: """
      A list with HTML attributes for the table cell.
      It can be also a function that receive the row as argument
      and returns a list of 2 element tuple with HTML attribute name
      and value. Default to `[]`.
      """
  end

  attr :row_fetcher, :any,
    required: true,
    doc: """
    A function which receives the params and the node and
    returns a tuple with the rows and the total number:
    `(params(), node() -> {list(), integer() | binary()})`.
    Optionally, if the function needs to keep a state, it can be defined as a tuple
    where the first element is a function and the second is the initial state.
    In this case, the function will receive the state as third argument and must return
    a tuple with the rows, the total number, and the new state for the following call:
    `{(params(), node(), term() -> {list(), integer() | binary(), term()}), term()}`
    """

  attr :rows_name, :string,
    doc:
      "A string to name the representation of the rows. Default is calculated from the current page."

  attr :row_attrs, :any,
    default: nil,
    doc: """
    A list with the HTML attributes for the table row.
    It can be also a function that receive the row as argument
    and returns a list of 2 element tuple with HTML attribute name
    and value.
    """

  attr :default_sort_by, :any,
    default: nil,
    doc: "The default column to sort by to. Defaults to the first sortable column."

  attr :title, :string, required: true, doc: "The title of the table."

  attr :limit, :any,
    default: [50, 100, 500, 1000, 5000],
    doc: "May be set to `false` to disable the `limit`."

  attr :search, :boolean,
    default: true,
    doc: "A boolean indicating if the search functionality is enabled."

  attr :hint, :string, default: nil, doc: "A textual hint to show close to the title."
  @spec live_table(assigns :: Socket.assigns()) :: Phoenix.LiveView.Rendered.t()
  def live_table(assigns) do
    ~H"""
    <.live_component module={TableComponent} {assigns} />
    """
  end

  @doc """
  Nav bar live component.

  You can see it in use the Metrics and Ecto info pages.
  """
  attr :id, :any,
    required: true,
    doc: "Because is a stateful `Phoenix.LiveComponent` an unique id is needed."

  attr :page, __MODULE__, required: true, doc: "Dashboard page"

  attr :nav_param, :string,
    default: "nav",
    doc: """
    An atom that configures the navigation parameter.
    It is useful when two nav bars are present in the same page.
    """

  attr :extra_params, :list,
    default: [],
    doc: """
    A list of strings representing the parameters
    that should stay when a tab is clicked. By default the nav ignores
    all params, except the current node if any.
    """

  attr :style, :atom, values: [:pills, :bar], doc: "Style for the nav bar"

  slot :item, required: true, doc: "HTML to be rendered when the tab is selected" do
    attr :name, :string, required: true, doc: "Value used in the URL when the tab is selected"

    attr :label, :string,
      doc: "Title of the tab. If it is not present, it will be calculated from `name`"

    attr :method, :string, values: ~w(patch navigate href redirect), doc: "Method used to update"
  end

  @spec live_nav_bar(assigns :: Socket.assigns()) :: Phoenix.LiveView.Rendered.t()
  def live_nav_bar(assigns) do
    ~H"""
    <.live_component module={NavBarComponent} {assigns}/>
    """
  end

  @doc """
  Hint pop-up text component
  """
  attr :text, :string, required: true, doc: "Text to show in the hint"

  @spec hint(assigns :: Socket.assigns()) :: Phoenix.LiveView.Rendered.t()
  def hint(assigns) do
    ~H"""
    <div class="hint">
      <svg class="hint-icon" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="44" height="44" fill="none"/>
        <rect x="19" y="10" width="6" height="5.76" rx="1" class="hint-icon-fill"/>
        <rect x="19" y="20" width="6" height="14" rx="1" class="hint-icon-fill"/>
        <circle cx="22" cy="22" r="20" class="hint-icon-stroke" stroke-width="4"/>
      </svg>
      <div class="hint-text"><%= @text %></div>
    </div>
    """
  end

  @doc """
  Card title component.
  """
  attr :title, :string, default: nil, doc: "The title above the card."
  attr :hint, :string, default: nil, doc: "A textual hint to show close to the title."

  @spec card_title(assigns :: Socket.assigns()) :: Phoenix.LiveView.Rendered.t()
  def card_title(assigns) do
    ~H"""
    <h5 class="card-title" :if={@title}>
      <%= @title %>
      <.hint :if={@hint} text={@hint}/>
    </h5>
    """
  end

  @doc """
  Card component.

  You can see it in use the Home and OS Data pages.
  """

  slot(:inner_block, required: true, doc: "The value that the card will show.")
  attr :title, :string, default: nil, doc: "The title above the card."
  attr :hint, :string, default: nil, doc: "A textual hint to show close to the title."
  attr :inner_title, :string, default: nil, doc: "The title inside the card."
  attr :inner_hint, :string, default: nil, doc: "A textual hint to show close to the inner title."

  attr :class, :string,
    default: "",
    doc: "A with additional css classes that will be added along banner-card class."

  @spec card(assigns :: Socket.assigns()) :: Phoenix.LiveView.Rendered.t()
  def card(assigns) do
    ~H"""
    <.card_title title={@title} hint={@hint} />
    <div class={"banner-card mt-auto #{@class}"}>
      <h6 class="banner-card-title" :if={@inner_title}>
        <%= @inner_title %>
        <.hint :if={@inner_hint} text={@inner_hint} />
      </h6>
      <div class="banner-card-value">
        <%= render_slot(@inner_block) %>
      </div>
    </div>
    """
  end

  @doc """
  Fields card component.

  You can see it in use the Home page in the Environment section.
  """

  attr :fields, :list,
    required: true,
    doc: "A list of key-value elements that will be shown inside the card."

  attr :title, :string, default: nil, doc: "The title above the card."
  attr :hint, :string, default: nil, doc: "A textual hint to show close to the title."
  attr :inner_title, :string, default: nil, doc: "The title inside the card."
  attr :inner_hint, :string, default: nil, doc: "A textual hint to show close to the inner title."

  def fields_card(assigns) do
    ~H"""
    <%= if @fields && not Enum.empty?(@fields) do %>
      <.card_title title={@title} hint={@hint} />
      <div class="fields-card">
        <div class="card mb-4">
          <div class="card-body rounded pt-3">
            <h6 class="card-title" :if={@inner_title}>
              <%= @inner_title %>
              <.hint :if={@inner_hint} text={@inner_hint} />
            </h6>
            <dl :for={{k, v} <- @fields}>
              <dt class="pb-1"><%= k %></dt>
              <dd>
                <textarea class="code-field text-monospace" readonly="readonly" rows="1"><%= v %></textarea>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    <% end %>
    """
  end

  @doc """
  Row component.

  You can see it in use the Home page and OS Data pages.
  """
  slot(:col,
    required: true,
    doc:
      "A list of components. It can receive up to 3 components." <>
        " Each element will be one column."
  )

  @spec row(assigns :: Socket.assigns()) :: Phoenix.LiveView.Rendered.t()
  def row(assigns) do
    assigns = row_validate_columns_length(assigns)

    ~H"""
    <div class="row">
      <div :for={col <- @col} class={"col-sm-#{@columns_class} mb-4 flex-column d-flex"}>
        <%= render_slot(col) %>
      </div>
    </div>
    """
  end

  defp row_validate_columns_length(assigns) do
    columns_length = length(assigns[:col] || [])

    if columns_length > 0 and columns_length < 4 do
      assign(assigns, :columns_class, div(12, columns_length))
    else
      raise ArgumentError,
            "row component must have at least 1 and at most 3 :col, got: " <>
              inspect(columns_length)
    end
  end

  @doc """
  Usage card component.

  You can see it in use the Home page and OS Data pages.
  """
  attr :title, :string, default: nil, doc: "The title above the card."
  attr :hint, :string, default: nil, doc: "A textual hint to show close to the title."
  attr :dom_id, :string, required: true, doc: "A unique identifier for all usages in this card."
  attr :csp_nonces, :any, default: %{img: nil, script: nil, style: nil}, doc: "TODO!!"

  attr :usages, :list,
    required: true,
    doc: """
    A list of `Map` with the following keys:
        * `:current` - Required. The current value of the usage.
        * `:limit` - Required. The max value of usage.
        * `:dom_sub_id` - Required. An unique identifier for the usage that will be concatenated to `dom_id`.
        * `:percent` - The used percent if the usage. Default: `nil`.
        * `:title` - Required. The title of the usage.
        * `:hint` - A textual hint to show close to the usage title. Default: `nil`.
    """

  @spec usage_card(assigns :: Socket.assigns()) :: Phoenix.LiveView.Rendered.t()
  def usage_card(assigns) do
    ~H"""
    <.card_title title={@title} hint={@hint} />
    <div class="card">
      <div class="card-body card-usage">
        <%= for usage <- @usages do %>
          <.title_bar_component dom_id={"#{@dom_id}-#{usage.dom_sub_id}"} class="py-2" percent={usage.percent} csp_nonces={@csp_nonces} >
            <div>
              <%= usage.title %>
              <.hint text={usage[:hint]} :if={usage[:hint]}/>
            </div>
            <div>
              <small class="text-muted pr-2">
                <%= usage.current %> / <%= usage.limit %>
              </small>
              <strong :if={usage[:percent]}>
                <%= usage[:percent] %>%
              </strong>
            </div>
          </.title_bar_component>
        <% end %>
      </div>
    </div>
    """
  end

  @doc false
  attr :class, :string, default: ""
  attr :color, :string, default: "blue"
  attr :dom_id, :string, required: true
  attr :percent, :float, required: true
  attr :csp_nonces, :any, required: true
  slot(:inner_block, required: true)

  # TODO we want to make this public?
  defp title_bar_component(assigns) do
    ~H"""
    <div class={@class}>
      <section>
        <div class="d-flex justify-content-between">
          <%= render_slot @inner_block %>
        </div>
        <style nonce={@csp_nonces.style}>#<%= "#{@dom_id}-progress" %>{width:<%= @percent %>%}</style>
        <div class="progress flex-grow-1 mt-2">
          <div
          class={"progress-bar bg-#{@color}"}
          role="progressbar"
          aria-valuenow={@percent}
          aria-valuemin="0"
          aria-valuemax="100"
          id={"#{@dom_id}-progress"}
          >
          </div>
        </div>
      </section>
    </div>
    """
  end

  @doc """
  Shared usage card component.

  You can see it in use the Home page and OS Data pages.
  """
  attr :usages, :list,
    required: true,
    doc: """
    A list of `Map` with the following keys:
      * `:data` - A list of tuples with 4 elements with the following data: `{usage_name, usage_percent, color, hint}`
      * `:dom_sub_id` - Required. Usage identifier.
      * `:title`- Bar title.
    """

  attr :total_data, :any,
    required: true,
    doc:
      "A list of tuples with 4 elements with following data: `{usage_name, usage_value, color, hint}`"

  attr :total_legend, :string, required: true, doc: "The legent of the total usage."
  attr :total_usage, :string, required: true, doc: "The value of the total usage."
  attr :csp_nonces, :any, default: %{img: nil, script: nil, style: nil}, doc: "TODO!!"
  attr :title, :string, default: nil, doc: "The title above the card."
  attr :hint, :string, default: nil, doc: "A textual hint to show close to the title."
  attr :inner_title, :string, default: nil, doc: "The title inside the card."
  attr :inner_hint, :string, default: nil, doc: "A textual hint to show close to the inner title."

  attr :total_formatter, :any,
    default: nil,
    doc: ~s<A function that format the `total_usage`. Default: `&("\#{&1} %")`.>

  @spec shared_usage_card(assigns :: Socket.assigns()) :: Phoenix.LiveView.Rendered.t()
  def shared_usage_card(assigns) do
    ~H"""
    <.card_title title={@title} hint={@hint} />
    <div class="card">
      <.card_title title={@inner_title} hint={@inner_hint} />
      <div class="card-body">
        <div phx-hook="PhxColorBarHighlight" id="cpu-color-bars">
          <div :for={usage <- @usages} class="flex-grow-1 mb-3">
            <div class="progress color-bar-progress flex-grow-1 mb-3">
              <span :if={usage[:title]} class="color-bar-progress-title"><%= usage[:title] %></span>
              <%= for {{name, value, color, _desc}, index} <- Enum.with_index(usage.data) do %>
                <style nonce={@csp_nonces.style}>#<%= "cpu-#{usage.dom_sub_id}-progress-#{index}" %>{width:<%= value %>%}</style>
                <div
                    title={"#{name} - #{Phoenix.LiveDashboard.Helpers.format_percent(value)}"}
                    class={"progress-bar color-bar-progress-bar bg-gradient-#{color}"}
                    role="progressbar"
                    aria-valuenow={maybe_round(value)}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    data-name={name}
                    data-empty={empty?(value)}
                    id={"cpu-#{usage.dom_sub_id}-progress-#{index}"}>
                </div>
              <% end %>
            </div>
          </div>
          <div class="color-bar-legend">
            <div class="row">
            <%= for {name, value, color, hint} <- @total_data do %>
              <div class="col-lg-6 d-flex align-items-center py-1 flex-grow-0 color-bar-legend-entry" data-name={name}>
                <div class={"color-bar-legend-color bg-#{color} mr-2"}></div>
                <span><%= name %><.hint :if={hint} text={hint} /></span>
                <span class="flex-grow-1 text-right text-muted">
                <%= if @total_formatter, do: @total_formatter.(value), else: total_formatter(value) %>
                </span>
              </div>
              <% end %>
            </div>
          </div>
          <div class="resource-usage-total text-center py-1 mt-3">
            <%= @total_legend %> <%= @total_usage %>
          </div>
        </div>
      </div>
    </div>
    """
  end

  defp total_formatter(value), do: "#{value} %"

  # TODO slot & attrs
  @doc """
  A component for drawing layered graphs.

  This is useful to represent pipelines like we have on
  [BroadwayDashboard](https://hexdocs.pm/broadway_dashboard) where
  each layer points to nodes of the layer below.
  It draws the layers from top to bottom.

  The calculation of layers and positions is done automatically
  based on options.

  ## Options

    * `:title` - The title of the component. Default: `nil`.

    * `:hint` - A textual hint to show close to the title. Default: `nil`.

    * `:layers` - A graph of layers with nodes. They represent
      our graph structure (see example). Each layer is a list
      of nodes, where each node has the following fields:

      - `:id` - The ID of the given node.
      - `:children` - The IDs of children nodes.
      - `:data` - A string or a map. If it's a map, the required fields
        are `detail` and `label`.

    * `:show_grid?` - Enable or disable the display of a grid. This
      is useful for development. Default: `false`.

    * `:y_label_offset` - The "y" offset of label position relative to the
      center of its circle. Default: `5`.

    * `:y_detail_offset` - The "y" offset of detail position relative to the
      center of its circle. Default: `18`.

    * `:background` - A function that calculates the background for a
      node based on it's data. Default: `fn _node_data -> "gray" end`.

    * `:format_label` - A function that formats the label. Defaults
      to a function that returns the label or data if data is binary.

    * `:format_detail` - A function that formats the detail field.
      This is only going to be called if data is a map.
      Default: `fn node_data -> node_data.detail end`.

  ## Examples

      iex> layers = [
      ...>   [
      ...>     %{
      ...>       id: "a1",
      ...>       data: "a1",
      ...>       children: ["b1"]
      ...>     }
      ...>   ],
      ...>   [
      ...>     %{
      ...>       id: "b1"
      ...>       data: %{
      ...>         detail: 0,
      ...>         label: "b1"
      ...>       },
      ...>       children: []
      ...>      }
      ...>    ]
      ...> ]
      iex> layered_graph(layers: layers, title: "My Graph", hint: "A simple graph")
  """
  @spec layered_graph(assigns :: Socket.assigns()) :: Phoenix.LiveView.Rendered.t()
  def layered_graph(assigns) do
    ~H"""
    <.live_component module={LayeredGraphComponent} id="wii" {assigns} />
    """
  end

  ## Helpers

  @doc """
  Encodes Sockets for URLs.

  ## Example

  This function can be used to encode `@socket` for an event value:

      <button phx-click="show-info" phx-value-info=<%= encode_socket(@socket) %>/>
  """
  @spec encode_socket(port() | binary()) :: binary()
  def encode_socket(ref) when is_port(ref) do
    ~c"#Port" ++ rest = :erlang.port_to_list(ref)
    "Socket#{rest}"
  end

  def encode_socket(ref) when is_binary(ref) do
    ref
  end

  @doc """
  Encodes ETSs references for URLs.

  ## Example

  This function can be used to encode an ETS reference for an event value:

      <button phx-click="show-info" phx-value-info=<%= encode_ets(@reference) %>/>
  """
  @spec encode_ets(reference()) :: binary()
  def encode_ets(ref) when is_reference(ref) do
    ~c"#Ref" ++ rest = :erlang.ref_to_list(ref)
    "ETS#{rest}"
  end

  @doc """
  Encodes PIDs for URLs.

  ## Example

  This function can be used to encode a PID for an event value:

      <button phx-click="show-info" phx-value-info=<%= encode_pid(@pid) %>/>
  """
  @spec encode_pid(pid()) :: binary()
  def encode_pid(pid) when is_pid(pid) do
    "PID#{:erlang.pid_to_list(pid)}"
  end

  @doc """
  Encodes Port for URLs.

  ## Example

  This function can be used to encode a Port for an event value:

      <button phx-click="show-info" phx-value-info=<%= encode_port(@port) %>/>
  """
  @spec encode_port(port()) :: binary()
  def encode_port(port) when is_port(port) do
    port
    |> :erlang.port_to_list()
    |> tl()
    |> List.to_string()
  end

  @doc """
  Encodes an application for URLs.

  ## Example

  This function can be used to encode an application for an event value:

      <button phx-click="show-info" phx-value-info=<%= encode_app(@my_app) %>/>
  """
  @spec encode_app(atom()) :: binary()
  def encode_app(app) when is_atom(app) do
    "App<#{app}>"
  end

  @doc """
  Computes a router path to the current page.
  """
  @spec live_dashboard_path(Socket.t(), page :: %__MODULE__{}) :: binary()
  def live_dashboard_path(socket, %{route: route, node: node, params: params}) do
    live_dashboard_path(socket, route, node, params, params)
  end

  @doc """
  Computes a router path to the current page with merged params.
  """
  @spec live_dashboard_path(Socket.t(), page :: %__MODULE__{}, map() | Keyword.t()) :: binary()
  def live_dashboard_path(socket, %{route: route, node: node, params: old_params}, extra) do
    new_params = Enum.into(extra, old_params, fn {k, v} -> {Atom.to_string(k), v} end)
    live_dashboard_path(socket, route, node, old_params, new_params)
  end

  # TODO: Remove this and the conditional on Phoenix v1.7+
  @compile {:no_warn_undefined, Phoenix.VerifiedRoutes}

  @doc false
  def live_dashboard_path(socket, route, node, old_params, new_params) when is_atom(node) do
    if function_exported?(socket.router, :__live_dashboard_prefix__, 0) do
      new_params = for {key, val} <- new_params, key not in ~w(page node), do: {key, val}
      prefix = socket.router.__live_dashboard_prefix__()

      path =
        if node == node() and is_nil(old_params["node"]) do
          "#{prefix}/#{route}"
        else
          "#{prefix}/#{URI.encode_www_form(to_string(node))}/#{route}"
        end

      Phoenix.VerifiedRoutes.unverified_path(socket, socket.router, path, new_params)
    else
      apply(
        socket.router.__helpers__(),
        :live_dashboard_path,
        if node == node() and is_nil(old_params["node"]) do
          [socket, :page, route, new_params]
        else
          [socket, :page, node, route, new_params]
        end
      )
    end
  end

  defmacro __using__(opts) do
    quote location: :keep, bind_quoted: [opts: opts] do
      import Phoenix.LiveView
      use Phoenix.Component
      import Phoenix.LiveDashboard.PageBuilder

      @behaviour Phoenix.LiveDashboard.PageBuilder
      refresher? = Keyword.get(opts, :refresher?, true)

      def __page_live__(:refresher?) do
        unquote(refresher?)
      end

      def init(opts), do: {:ok, opts}
      defoverridable init: 1
    end
  end

  defp maybe_round(num) when is_integer(num), do: num
  defp maybe_round(num), do: Float.ceil(num, 1)

  defp empty?(value) when is_number(value) and value > 0, do: false
  defp empty?(_), do: true
end
