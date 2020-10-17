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
            columns: columns(),
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

        defp columns() do
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
  At the moment, only `nav_bar/1` and `table/1` are supported.
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

  alias Phoenix.LiveDashboard.{TableComponent, NavBarComponent}

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
          columns: columns(),
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
      * `:header` - Label to show in the current column. Default value is calculated from `:field`.
      * `:header_attrs` - A list with HTML attributes for the column header. Default: `[]`.
      * `:format` - Function which receives the value and returns the cell information.
        Default is the field value itself.
      * `:cell_attrs` - A list with HTML attributes for the table cell. Default: `[]`.
      * `:sortable` - Either `:asc` or `:desc` with the default sorting. When set, the column
        header is clickable and it fetches again rows with the new order. At least one column
        should be sortable. Default: `nil`

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
