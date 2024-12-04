defmodule Phoenix.LiveDashboard.PageBuilder do
  @moduledoc """
  Page builder is the default mechanism for building custom dashboard pages.

  Each dashboard page is a LiveView with additional callbacks for
  customizing the menu appearance and the automatic refresh.

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
        def render(assigns) do
          ~H\"""
          <.live_table
            id="ets-table"
            dom_id="ets-table"
            page={@page}
            title="ETS"
            row_fetcher={&fetch_ets/2}
            row_attrs={&row_attrs/1}
            rows_name="tables"
          >
            <:col field={:name} header="Name or module" />
            <:col field={:protection} />
            <:col field={:type} />
            <:col field={:size} text_align="right" sortable={:desc} />
            <:col field={:memory} text_align="right" sortable={:desc} :let={ets}>
              <%= format_words(ets[:memory]) %>
            </:col>
            <:col field={:owner} :let={ets} >
              <%= encode_pid(ets[:owner]) %>
            </:col>
          </.live_table>
          \"""
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

  ## Options for the use macro

  The following options can be given when using the `PageBuilder` module:

  * `refresher?` - Boolean to enable or disable the automatic refresh in the page.

  ## Components

  A page can return any valid HEEx template in the `render/1` callback,
  and it can use the components listed with this page too.

  We currently support `card/1`, `fields_card/1`, `row/1`,
  `shared_usage_card/1`, and `usage_card/1`;
  and the live components `live_layered_graph/1`, `live_nav_bar/1`,
  and `live_table/1`.

  ## Helpers

  Some helpers are available for page building. The supported
  helpers are: `live_dashboard_path/2`, `live_dashboard_path/3`,
  `encode_app/1`, `encode_ets/1`, `encode_pid/1`, `encode_port/1`,
  and `encode_socket/1`.

  ## Custom Hooks

  If your page needs to register custom hooks, you can use the `register_after_opening_head_tag/2`
  function. Because the hooks need to be available on the dead render in the layout, before the
  LiveView's LiveSocket is configured, your need to do this inside an `on_mount` hook:

  ```elixir
  defmodule MyAppWeb.MyLiveDashboardHooks do
    import Phoenix.LiveView
    import Phoenix.Component

    alias Phoenix.LiveDashboard.PageBuilder

    def on_mount(:default, _params, _session, socket) do
      {:cont, PageBuilder.register_after_opening_head_tag(socket, &after_opening_head_tag/1)}
    end

    defp after_opening_head_tag(assigns) do
      ~H\"\"\"
      <script nonce={@csp_nonces[:script]}>
        window.LiveDashboard.registerCustomHooks({
          MyHook: {
            mounted() {
              // do something
            }
          }
        })
      </script>
      \"\"\"
    end
  end

  defmodule MyAppWeb.MyCustomPage do
    ...
  end
  ```

  And then add it to the list of `on_mount` hooks in the `live_dashboard` router configuration:

  ```elixir
  live_dashboard "/dashboard",
    additional_pages: [
      route_name: MyAppWeb.MyCustomPage
    ],
    on_mount: [
      MyAppWeb.MyLiveDashboardHooks
    ]
  ```

  The LiveDashboard provides a function `window.LiveDashboard.registerCustomHooks({ ... })` that you can call
  with an object of hook declarations.

  Note that in order to use external libraries, you will either need to include them from
  a CDN, or bundle them yourself and include them from your app's static paths.

  > #### A note on CSPs and libraries {: .info}
  >
  > Phoenix LiveDashboard supports CSP nonces for its own assets, configurable using the
  > `Phoenix.LiveDashboard.Router.live_dashboard/2` macro by setting the `:csp_nonce_assign_key`
  > option. If you are building a library, ensure that you render those CSP nonces on any scripts,
  > styles or images of your page. The nonces are passed to your custom page under the `:csp_nonces` assign
  > and also available in  the `after_opening_head_tag` component.
  >
  > You should use those when including scripts or styles like this:
  >
  > ```heex
  > <script nonce={@csp_nonces.script}>...</script>
  > <script nonce={@csp_nonces.script} src="..."></script>
  > <style nonce={@csp_nonces.style}>...</style>
  > <link rel="stylesheet" href="..." nonce={@csp_nonces.style}>
  > ```
  >
  > This ensures that your custom page can be used when a CSP is in place using the mechanism
  > supported by Phoenix LiveDashboard.
  >
  > If your custom page needs a different CSP policy, for example due to inline styles set by scripts,
  > please consider documenting these requirements.
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
    ChartComponent,
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

  @callback render(assigns :: Socket.assigns()) :: Phoenix.LiveView.Rendered.t()

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

  @doc """
  Callback invoked when the automatic refresh is enabled.
  """
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
  @doc type: :component
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

    attr :text_align, :string,
      values: ~w[left center right justify],
      doc: "Text align for text in the column. Default: `nil`."
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
  attr :dom_id, :string, default: nil, doc: "id attribute for the HTML the main tag."
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
  @doc type: :component
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
    <.live_component module={NavBarComponent} {assigns} />
    """
  end

  @doc """
  Hint pop-up text component
  """
  @doc type: :component
  attr :text, :string, required: true, doc: "Text to show in the hint"

  @spec hint(assigns :: Socket.assigns()) :: Phoenix.LiveView.Rendered.t()
  def hint(assigns) do
    ~H"""
    <div class="hint">
      <svg class="hint-icon" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="44" height="44" fill="none" />
        <rect x="19" y="10" width="6" height="5.76" rx="1" class="hint-icon-fill" />
        <rect x="19" y="20" width="6" height="14" rx="1" class="hint-icon-fill" />
        <circle cx="22" cy="22" r="20" class="hint-icon-stroke" stroke-width="4" />
      </svg>
      <div class="hint-text"><%= @text %></div>
    </div>
    """
  end

  @doc """
  Card title component.
  """
  @doc type: :component
  attr :title, :string, default: nil, doc: "The title above the card."
  attr :hint, :string, default: nil, doc: "A textual hint to show close to the title."

  @spec card_title(assigns :: Socket.assigns()) :: Phoenix.LiveView.Rendered.t()
  def card_title(assigns) do
    ~H"""
    <h5 :if={@title} class="card-title">
      <%= @title %>
      <.hint :if={@hint} text={@hint} />
    </h5>
    """
  end

  @doc """
  Card component.

  You can see it in use the Home and OS Data pages.
  """
  @doc type: :component
  slot :inner_block, required: true, doc: "The value that the card will show."
  attr :title, :string, default: nil, doc: "The title above the card."
  attr :hint, :string, default: nil, doc: "A textual hint to show close to the title."
  attr :inner_title, :string, default: nil, doc: "The title inside the card."
  attr :inner_hint, :string, default: nil, doc: "A textual hint to show close to the inner title."
  attr :dom_id, :string, default: nil, doc: "id attribute for the HTML the main tag."

  @spec card(assigns :: Socket.assigns()) :: Phoenix.LiveView.Rendered.t()
  def card(assigns) do
    ~H"""
    <.card_title title={@title} hint={@hint} />
    <div id={@dom_id} class="banner-card mt-auto">
      <h6 :if={@inner_title} class="banner-card-title">
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
  @doc type: :component
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
            <h6 :if={@inner_title} class="card-title">
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
  @doc type: :component
  slot :col,
    required: true,
    doc:
      "A list of components. It can receive up to 3 components." <>
        " Each element will be one column."

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
  @doc type: :component
  attr :title, :string, default: nil, doc: "The title above the card."
  attr :hint, :string, default: nil, doc: "A textual hint to show close to the title."
  attr :dom_id, :string, required: true, doc: "A unique identifier for all usages in this card."

  attr :csp_nonces, :any,
    required: true,
    doc: "A copy of CSP nonces (`@csp_nonces`) used to render the page safely"

  slot :usage, required: true, doc: "List of usages to show" do
    attr :current, :integer, required: true, doc: "The current value of the usage."
    attr :limit, :integer, required: true, doc: "The max value of usage."

    attr :dom_id, :string,
      required: true,
      doc: "An unique identifier for the usage that will be concatenated to `dom_id`."

    attr :percent, :string, doc: "The used percent of the usage."
    attr :title, :string, doc: "The title of the usage."
    attr :hint, :string, doc: "A textual hint to show close to the usage title."
  end

  @spec usage_card(assigns :: Socket.assigns()) :: Phoenix.LiveView.Rendered.t()
  def usage_card(assigns) do
    ~H"""
    <.card_title title={@title} hint={@hint} />
    <div class="card">
      <div class="card-body card-usage">
        <%= for usage <- @usage do %>
          <.title_bar_component
            dom_id={"#{@dom_id}-#{usage.dom_id}"}
            percent={usage.percent}
            csp_nonces={@csp_nonces}
          >
            <div>
              <%= usage.title %>
              <.hint :if={usage[:hint]} text={usage[:hint]} />
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
  attr :color, :string, default: "blue"
  attr :dom_id, :string, required: true
  attr :percent, :float, required: true
  attr :csp_nonces, :any, required: true
  slot :inner_block, required: true

  defp title_bar_component(assigns) do
    ~H"""
    <div class="py-2">
      <section>
        <div class="d-flex justify-content-between">
          <%= render_slot(@inner_block) %>
        </div>
        <style nonce={@csp_nonces.style}>
          #<%= "#{@dom_id}-progress" %>{width:<%= @percent %>%}
        </style>
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
  @doc type: :component
  attr :usages, :list,
    required: true,
    doc: """
    A list of `Map` with the following keys:
      * `:data` - A list of tuples with 4 elements with the following data: `{usage_name, usage_percent, color, hint}`
      * `:dom_id` - Required. Usage identifier.
      * `:title`- Bar title.
    """

  attr :total_data, :any,
    required: true,
    doc:
      "A list of tuples with 4 elements with following data: `{usage_name, usage_value, color, hint}`"

  attr :total_legend, :string, required: true, doc: "The legent of the total usage."
  attr :total_usage, :string, required: true, doc: "The value of the total usage."
  attr :dom_id, :string, default: nil, doc: "id attribute for the HTML the main tag."

  attr :csp_nonces, :any,
    required: true,
    doc: "A copy of CSP nonces (`@csp_nonces`) used to render the page safely"

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
        <div phx-hook="PhxColorBarHighlight" id={"#{@dom_id}-color-bars"}>
          <div :for={usage <- @usages} class="flex-grow-1 mb-3">
            <div class="progress color-bar-progress flex-grow-1 mb-3">
              <span :if={usage[:title]} class="color-bar-progress-title"><%= usage[:title] %></span>
              <%= for {{name, value, color, _desc}, index} <- Enum.with_index(usage.data) do %>
                <style nonce={@csp_nonces.style}>
                  #<%= "#{@dom_id}-#{usage.dom_id}-progress-#{index}" %>{width:<%= value %>%}
                </style>
                <div
                  title={"#{name} - #{Phoenix.LiveDashboard.Helpers.format_percent(value)}"}
                  class={"progress-bar color-bar-progress-bar bg-gradient-#{color}"}
                  role="progressbar"
                  aria-valuenow={maybe_round(value)}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  data-name={name}
                  data-empty={empty?(value)}
                  id={"#{@dom_id}-#{usage.dom_id}-progress-#{index}"}
                >
                </div>
              <% end %>
            </div>
          </div>
          <div class="color-bar-legend">
            <div class="row">
              <%= for {name, value, color, hint} <- @total_data do %>
                <div
                  class="col-lg-6 d-flex align-items-center py-1 flex-grow-0 color-bar-legend-entry"
                  data-name={name}
                >
                  <div class={"color-bar-legend-color bg-#{color} mr-2"}></div>
                  <span><%= name %><.hint :if={hint} text={hint} /></span>
                  <span class="flex-grow-1 text-right text-muted">
                    <%= if @total_formatter,
                      do: @total_formatter.(value),
                      else: total_formatter(value) %>
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

  @doc """
  A component for drawing layered graphs.

  This is useful to represent pipelines like we have on
  [BroadwayDashboard](https://hexdocs.pm/broadway_dashboard) where
  each layer points to nodes of the layer below.
  It draws the layers from top to bottom.

  The calculation of layers and positions is done automatically
  based on options.

  [INSERT LVATTRDOCS]

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
  """
  @doc type: :component
  attr :id, :any,
    required: true,
    doc: "Because is a stateful `Phoenix.LiveComponent` an unique id is needed."

  attr :title, :string, default: nil, doc: "The title of the component."

  attr :hint, :string, default: nil, doc: "A textual hint to show close to the title."

  attr :layers, :list,
    required: true,
    doc: """
    A graph of layers with nodes. They represent
    our graph structure (see example). Each layer is a list
    of nodes, where each node has the following fields:

      - `:id` - The ID of the given node.
      - `:children` - The IDs of children nodes.
      - `:data` - A string or a map. If it's a map, the required fields
        are `detail` and `label`.
    """

  attr :show_grid?, :boolean,
    default: false,
    doc: "Enable or disable the display of a grid. This is useful for development."

  attr :y_label_offset, :integer,
    default: 5,
    doc: "The \"y\" offset of label position relative to the center of its circle."

  attr :y_detail_offset, :integer,
    default: 18,
    doc: "The \"y\" offset of detail position relative to the center of its circle."

  attr :background, :any,
    doc: """
    A function that calculates the background for a
    node based on it's data. Default: `fn _node_data -> \"gray\" end`."
    """

  attr :format_label, :any,
    doc: """
    A function that formats the label. Defaults
    to a function that returns the label or data if data is binary.
    """

  attr :format_detail, :any,
    doc: """
    A function that formats the detail field.
    This is only going to be called if data is a map.
    Default: `fn node_data -> node_data.detail end`.
    """

  @spec live_layered_graph(assigns :: Socket.assigns()) :: Phoenix.LiveView.Rendered.t()
  def live_layered_graph(assigns) do
    ~H"""
    <.live_component module={LayeredGraphComponent} id={@id} {assigns} />
    """
  end

  @doc """
  List of label value.

  You can see it in use in the modal in Ports or Processes page.
  """
  @doc type: :component
  slot :elem, required: true, doc: "Value for each element of the list" do
    attr :label, :string, required: true, doc: "Label for the elem"
  end

  def label_value_list(assigns) do
    ~H"""
    <table class="table table-hover tabular-info-table">
      <tbody>
        <tr :for={{elem, index} <- Enum.with_index(@elem)}>
          <td class={first_elem_class(index)}><%= elem.label %></td>
          <td class={first_elem_class(index)}><pre><%= render_slot(elem) %></pre></td>
        </tr>
      </tbody>
    </table>
    """
  end

  defp first_elem_class(0), do: "border-top-0"
  defp first_elem_class(_), do: nil

  @doc false
  attr :id, :string,
    required: true,
    doc: "Because is a stateful `Phoenix.LiveComponent` an unique id is needed."

  attr :title, :string, required: true, doc: "Title of the modal"

  attr :return_to, :string, required: true, doc: "Path to return when closing the modal"
  slot :inner_block, required: true, doc: "Content to show in the modal"

  def live_modal(assigns) do
    ~H"""
    <.live_component
      module={Phoenix.LiveDashboard.ModalComponent}
      id={@id}
      title={@title}
      return_to={@return_to}
    >
      <%= render_slot(@inner_block) %>
    </.live_component>
    """
  end

  @doc false
  attr :id, :string,
    required: true,
    doc: "Because is a stateful `Phoenix.LiveComponent` an unique id is needed."

  attr :data, :list,
    default: [],
    doc: """
    Temporary list of points to show in the chart.
    Each element should be the format `{optional_label, x, y}`.
    New points can be added using the function `send_data_to_chart/2` in real time.
    """

  attr :title, :string, required: true, doc: "Title of the chart"
  attr :hint, :string, default: nil, doc: "A textual hint to show close to the title."

  attr :kind, :atom,
    values: [:counter, :last_value, :sum, :summary, :distribution],
    doc: "Kind of chart to use."

  attr :label, :string, default: nil, doc: "Default label to use in the chart."
  attr :tags, :list, default: [], doc: "Optional list of tags."
  attr :prune_threshold, :integer, default: 1_000, doc: "Number of points to keep before pruning."
  attr :unit, :string, default: "", doc: "The unit that represent the chart."

  attr :bucket_size, :integer,
    doc: "Bucket size for histogram. Default: 20 when `kind = :histogram`, otherwise `nil`."

  attr :full_width, :boolean, default: false, doc: "Size of the chart"

  def live_chart(assigns) do
    assigns =
      assign_new(assigns, :bucket_size, fn ->
        if assigns.kind == :histogram, do: 20, else: nil
      end)

    ~H"""
    <.live_component
      module={ChartComponent}
      id={@id}
      title={@title}
      hint={@hint}
      kind={@kind}
      label={@label}
      tags={@tags}
      prune_threshold={@prune_threshold}
      unit={@unit}
      bucket_size={@bucket_size}
      full_width={@full_width}
    />
    """
  end

  @doc false
  def send_data_to_chart(id, data) do
    Phoenix.LiveView.send_update(ChartComponent, id: id, data: data)
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

  @doc """
  Registers a component to be rendered after the opening head tag in the layout.
  """
  def register_after_opening_head_tag(socket, component) do
    register_head(socket, component, :after_opening_head_tag)
  end

  @doc """
  Registers a component to be rendered before the closing head tag in the layout.
  """
  def register_before_closing_head_tag(socket, component) do
    register_head(socket, component, :before_closing_head_tag)
  end

  defp register_head(socket, component, assign) do
    case socket do
      %{assigns: %{^assign => [_ | _]}} ->
        update(socket, assign, fn existing -> [component | existing] end)

      _ ->
        assign(socket, assign, [component])
    end
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
