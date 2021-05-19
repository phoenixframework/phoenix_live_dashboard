defmodule Phoenix.LiveDashboard.PageBuilder do
  @moduledoc """
  Page builder is the default mechanism for building custom dashboard pages.

  Each dashboard page is a LiveView with additional callbacks for
  customizing the menu appearance. One notable difference, however,
  is that a page implements a `render_page/1` callback, which must
  return one or more page builder components, instead of a `render/1`
  callback that returns `~L`.

  A simple and straight-forward example of a custom page is the
  `Phoenix.LiveDashboard.ETSPage` that ships with the dashboard:

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
  We currently support `card/1`, `columns/1`, `fields_card/1`, `nav_bar/1`,
  `row/1`, `shared_usage_card/1`, `table/1`, and `usage_card/1`.
  """

  defstruct info: nil,
            module: nil,
            node: nil,
            params: nil,
            route: nil,
            tick: 0,
            allow_destructive_actions: false

  @opaque component :: {module, map}

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
    TableComponent,
    NavBarComponent,
    CardComponent,
    FieldsCardComponent,
    UsageCardComponent,
    SharedUsageCardComponent,
    ColumnsComponent,
    RowComponent
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

  @callback render_page(assigns :: Socket.assigns()) :: component()

  @callback handle_params(unsigned_params(), uri :: String.t(), socket :: Socket.t()) ::
              {:noreply, Socket.t()}

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
  Renders a table component.

  It can be rendered in any dashboard page via the `render_page/1` function:

      def render_page(assigns) do
        table(
          columns: table_columns(),
          id: @table_id,
          row_attrs: &row_attrs/1,
          row_fetcher: &fetch_applications/2,
          title: "Applications"
        )
      end

  You can see it in use the applications, processes, sockets pages and
  many others.

  # Options

  These are the options supported by the component:

    * `:id` - Required. Because is a stateful `Phoenix.LiveComponent` an unique id is needed.

    * `:columns` - Required. A `Keyword` list with the following keys:
      * `:field` - Required. An identifier for the column.
      * `:sortable` - Required for at least one column. Either `:asc` or
        `:desc` with the default sorting. When set, the column header is
        clickable and it fetches again rows with the new order. Default: `nil`.
      * `:header` - Label to show in the current column. Default value is calculated from `:field`.
      * `:header_attrs` - A list with HTML attributes for the column header. Default: `[]`.
      * `:format` - Function which receives the value and returns the cell information.
        Default is the field value itself.
      * `:cell_attrs` - A list with HTML attributes for the table cell. Default: `[]`.

    * `:row_fetcher` - Required. A function which receives the params and the node and
      returns a tuple with the rows and the total number:
      `(params(), node()) -> {list(), integer() | binary()}`

    * `:rows_name` - A string to name the representation of the rows.
      Default is calculated from the current page.

    * `:default_sort_by` - The default columnt to sort by to.
      Defaults to the first sortable column.

    * `:title` - The title of the table.
      Default is calculated with the current page.

    * `:limit` - A list of integers to limit the number of rows to show.
      Default: `[50, 100, 500, 1000, 5000]`. May be set to `false` to disable the `limit`.

    * `:search` - A boolean indicating if the search functionality is enabled.
      Default: `true`.

    * `:hint` - A textual hint to show close to the title. Default: `nil`.
  """
  @spec table(keyword()) :: component()
  def table(assigns) do
    assigns =
      assigns
      |> Map.new()
      |> TableComponent.normalize_params()

    {TableComponent, assigns}
  end

  @doc """
  Renders a nav bar.

  It can be rendered in any dashboard page via the `render_page/1` function:

      def render_page(assigns) do
        nav_bar(
          items: [
            phoenix_metrics: [
              name: "Phoenix Metrics",
              render: table(...)
            ],

            vm_metrics: [
              name: "VM Metrics",
              render: fn -> table(...expensive_parameters) end
            ]
          ]
        )
      end

  You can see it in use the Metrics and Ecto info pages.
  """
  @spec nav_bar(keyword()) :: component()
  def nav_bar(assigns) do
    assigns =
      assigns
      |> Map.new()
      |> NavBarComponent.normalize_params()

    {NavBarComponent, assigns}
  end

  @doc """
  Renders a card component.

  It can be rendered in any dashboard page via the `render_page/1` function:

      def render_page(assigns) do
        card(
          title: "Run queues",
          inner_title: "Total",
          class: "additional-class",
          value: 1.5
        )
      end

  You can see it in use the Home and OS Data pages.

  # Options

  These are the options supported by the component:

    * `:value` - Required. The value that the card will show.

    * `:title` - The title above the card.
      Default: `nil`.

    * `:inner_title` - The title inside the card.
      Default: `nil`.

    * `:hint` - A textual hint to show close to the title.
      Default: `nil`.

    * `:inner_hint` - A textual hint to show close to the inner title.
      Default: `nil`.

    * `:class` - A list of additional css classes that will be added along banner-card class.
      Default: `[]`.
  """
  @spec card(keyword()) :: component()
  def card(assigns) do
    assigns =
      assigns
      |> Map.new()
      |> CardComponent.normalize_params()

    {CardComponent, assigns}
  end

  @doc """
  Renders a fields card component.

  It can be rendered in any dashboard page via the `render_page/1` function:

      def render_page(assigns) do
        fields_card(
          title: "Run queues",
          inner_title: "Total",
          fields: ["USER": "...", "ROOTDIR: "..."]
        )
      end

  You can see it in use the Home page in the Environment section.

  # Options

  These are the options supported by the component:

    * `:fields` - Required. A list of key-value elements that will be shown inside the card.

    * `:title` - The title above the card.
      Default: `nil`.

    * `:inner_title` - The title inside the card.
      Default: `nil`.

    * `:hint` - A textual hint to show close to the title.
      Default: `nil`.

    * `:inner_hint` - A textual hint to show close to the inner title.
      Default: `nil`.
  """
  @spec fields_card(keyword()) :: component()
  def fields_card(assigns) do
    assigns =
      assigns
      |> Map.new()
      |> FieldsCardComponent.normalize_params()

    {FieldsCardComponent, assigns}
  end

  @doc """
  Renders a column component.

  It can be rendered in any dashboard page via the `render_page/1` function:

      def render_page(assigns) do
        columns(
          columns: [
            card(...),
            card_usage(...)
          ]
        )
      end

  You can see it in use the Home page and OS Data pages.

  # Options

  These are the options supported by the component:

    * `:columns` - Required. A list of components.
      It can receive up to 3 components.
      Each element will be one column.
  """
  @spec columns(keyword()) :: component()
  def columns(assigns) do
    assigns =
      assigns
      |> Map.new()
      |> ColumnsComponent.normalize_params()

    {ColumnsComponent, assigns}
  end

  @doc """
  Renders a row component.

  It can be rendered in any dashboard page via the `render_page/1` function:

      def render_page(assigns) do
        row(
          components: [
            card(...),
            columns(...)
          ]
        )
      end

  You can see it in use the Home page and OS Data pages.

  # Options

  These are the options supported by the component:

    * `:components` - Required. A list of components.
      It can receive up to 3 components.
      Each element will be one column.
  """
  @spec row(keyword()) :: component()
  def row(assigns) do
    assigns =
      assigns
      |> Map.new()
      |> RowComponent.normalize_params()

    {RowComponent, assigns}
  end

  @doc """
  Renders a usage card component.

  It can be rendered in any dashboard page via the `render_page/1` function:

      def render_page(assigns) do
        usage_card(
          usages: [
            %{
              current: 10,
              limit: 150,
              dom_sub_id: "1",
              title: "Memory",
              percent: "13"
            }
          ],
          dom_id: "memory"
        )
      end

  You can see it in use the Home page and OS Data pages.

  # Options

  These are the options supported by the component:

    * `:usages` - Required. A list of `Map` with the following keys:
      * `:current` - Required. The current value of the usage.
      * `:limit` - Required. The max value of usage.
      * `:dom_sub_id` - Required. An unique identifier for the usage that will be concatenated to `dom_id`.
      * `:percent` - The used percent if the usage. Default: `nil`.
      * `:title` - Required. The title of the usage.
      * `:hint` - A textual hint to show close to the usage title. Default: `nil`.

    * `:dom_id` - Required. A unique identifier for all usages in this card.
    * `:title` - The title of the card. Default: `nil`.
    * `:hint` - A textual hint to show close to the card title. Default: `nil`.
  """
  @spec usage_card(keyword()) :: component()
  def usage_card(assigns) do
    assigns =
      assigns
      |> Map.new()
      |> UsageCardComponent.normalize_params()

    {UsageCardComponent, assigns}
  end

  @doc """
  Renders a shared usage card component.

  It can be rendered in any dashboard page via the `render_page/1` function:

      def render_page(assigns) do
        shared_usage_card(
          usages: [
            %{
              data: [
                {"Atoms", 1.4, "green", nil},
                {"Binary", 9.1, "blue", nil},
                {"Code", 31.5, "purple", nil},
                {"ETS", 3.6, "yellow", nil},
                {"Processes", 25.8, "orange", nil},
                {"Other", 28.5, "dark-gray", nil}
              ],
              dom_sub_id: "total"
            }
          ],
          dom_id: "memory",
          total_data: [
            {"Atoms", 737513, "green", nil},
            {"Binary", 4646392, "blue", nil},
            {"Code", 16060819, "purple", nil},
            {"ETS", 1845584, "yellow", nil},
            {"Processes", 13146728, "orange", nil},
            {"Other", 14559276, "dark-gray", nil}
          ],
          total_legend: "Total usage:"
          total_usage: "47.4 MB"
        )
      end

  You can see it in use the Home page and OS Data pages.

  # Options

  These are the options supported by the component:

    * `:usages` - Required. A list of `Map` with the following keys:
      * `:data` - A list of tuples with 4 elements with the following data:
        `{usage_name, usage_percent, color, hint}`
      * `:dom_sub_id` - Required. Usage identifier.
      * `:title`- Bar title.
    * `:total_data` -  Required. A list of tuples with 4 elements with following data:
        `{usage_name, usage_value, color, hint}`
    * `:total_legend` - Required. The legent of the total usage.
    * `:total_usage` - Required. The value of the total usage.
    * `:dom_id` - Required. A unique identifier for all usages in this card.
    * `:title` - The title above the card. Default: `nil`.
    * `:inner_title` - The title inside the card. Default: `nil`.
    * `:hint` - A textual hint to show close to the title. Default: `nil`.
    * `:inner_hint` - A textual hint to show close to the inner title. Default: `nil`.
    * `:total_formatter` - A function that format the `total_usage`. Default: `&("\#{&1} %")`.
  """
  @spec shared_usage_card(keyword()) :: component()
  def shared_usage_card(assigns) do
    assigns =
      assigns
      |> Map.new()
      |> SharedUsageCardComponent.normalize_params()

    {SharedUsageCardComponent, assigns}
  end

  defmacro __using__(opts) do
    quote bind_quoted: [opts: opts] do
      import Phoenix.LiveView
      import Phoenix.LiveView.Helpers
      import Phoenix.LiveDashboard.Helpers
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
end
