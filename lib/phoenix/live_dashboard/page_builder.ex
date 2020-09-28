defmodule Phoenix.LiveDashboard.PageBuilder do
  defstruct info: nil,
            module: nil,
            node: nil,
            params: nil,
            route: nil,
            tick: 0

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

  This component is used in different pages like applications or sockets.
  It can be used in a `Phoenix.LiveView` in the `render/1` function:

      def render_page(assigns) do
        table(
          columns: columns(),
          id: @table_id,
          row_attrs: &row_attrs/1,
          row_fetcher: &fetch_applications/2,
          title: "Applications"
        )
      end

  # Options

  These are the options supported by the component:

    * `:id` - Required. Because is a stateful `Phoenix.LiveComponent` an unique id is needed.

    * `:columns` - Required. A `Keyword` list with the following keys:
      * `:field` - Required. An identifier for the column.
      * `:header` - Label to show in the current column. Default value is calculated from `:field`.
      * `:header_attrs` - A list with HTML attributes for the column header.
        More info: `Phoenix.HTML.Tag.tag/1`. Default `[]`.
      * `:format` - Function which receives the row data and returns the cell information.
        Default is calculated from `:field`: `row[:field]`.
      * `:cell_attrs` - A list with HTML attributes for the table cell.
        It also can be a function which receives the row data and returns an attribute list.
        More info: `Phoenix.HTML.Tag.tag/1`. Default: `[]`.
      * `:sortable` - Either `:asc` or `:desc` with the default sorting. When set, the column
        header is clickable and it fetches again rows with the new order. At least one column
        should be sortable. Default: `nil`

    * `:limit_options` - A list of integers to limit the number of rows to show.
      Default: `[50, 100, 500, 1000, 5000]`

    * `:params` - Required. All the params received by the parent `Phoenix.LiveView`,
      so the table can handle its own parameters.

    * `:row_fetcher` - Required. A function which receives the params and the node and
      returns a tuple with the rows and the total number:
      `(params(), node()) -> {list(), integer() | binary()}`

    * `:rows_name` - A string to name the representation of the rows.
      Default is calculated from the current page.

    * `:title` - The title of the table.
      Default is calculated with the current page.
  """
  @spec table(keyword()) :: component()
  def table(assigns) do
    assigns =
      assigns
      |> Map.new()
      |> TableComponent.normalize_params()

    {TableComponent, assigns}
  end

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
