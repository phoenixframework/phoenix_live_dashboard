defmodule Phoenix.LiveDashboard.PageNotFound do
  defexception [:message, plug_status: 404]
end

defmodule Phoenix.LiveDashboard.PageLive do
  use Phoenix.LiveDashboard.Web, :live_view
  import Phoenix.LiveDashboard.Helpers
  alias Phoenix.LiveView.Socket
  alias Phoenix.LiveDashboard.MenuComponent

  defstruct dashboard_running?: nil,
            info: nil,
            metrics: nil,
            node: nil,
            nodes: nil,
            os_mon: nil,
            page_live: nil,
            params: nil,
            refresh: nil,
            refresh_options: nil,
            refresher?: nil,
            request_logger: nil,
            route: nil,
            session: nil,
            tick: 0

  @type unsigned_params :: map

  @callback mount(
              unsigned_params() | :not_mounted_at_router,
              session :: map,
              socket :: Socket.t()
            ) ::
              {:ok, Socket.t()} | {:ok, Socket.t(), keyword()}

  @callback render(assigns :: Socket.assigns()) :: Phoenix.LiveView.Rendered.t()

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

  defmacro __using__(opts) do
    quote bind_quoted: [opts: opts] do
      import Phoenix.LiveView
      import Phoenix.LiveView.Helpers
      import Phoenix.LiveDashboard.Helpers
      @behaviour Phoenix.LiveDashboard.PageLive
      @default_refresh 5
      @supported_refresh [{"1s", 1}, {"2s", 2}, {"5s", 5}, {"15s", 15}, {"30s", 30}]

      refresher? = Keyword.get(opts, :refresher?, true)
      refresh = Keyword.get(opts, :refresh, @default_refresh)
      refresh_options = Keyword.get(opts, :refresh_options, @supported_refresh)

      def __page_live__(:refresher?) do
        unquote(refresher?)
      end

      def __page_live__(:refresh) do
        unquote(refresh)
      end

      def __page_live__(:refresh_options) do
        unquote(refresh_options)
      end
    end
  end

  @impl true
  def mount(%{"node" => _, "page" => page} = params, session, socket) do
    case Map.fetch(session, page) do
      {:ok, {page_live, page_session}} ->
        assign_mount(socket, page_live, page_session, params, session)

      {:ok, value} ->
        msg = "invalid value: #{inspect(value)} must be `{ModulePage, session}`"
        raise Phoenix.LiveDashboard.PageNotFound, msg

      :error ->
        raise Phoenix.LiveDashboard.PageNotFound, "unknown page #{inspect(page)}"
    end
  end

  def mount(_params, _session, socket) do
    {:ok, redirect_to_current_node(socket)}
  end

  defp assign_mount(socket, page_live, page_session, params, session) do
    socket =
      Phoenix.LiveView.assign(socket, :page, %__MODULE__{
        page_live: page_live,
        session: page_session
      })

    with %Socket{redirected: nil} = socket <- assign_params(socket, params),
         %Socket{redirected: nil} = socket <- assign_node(socket, params),
         %Socket{redirected: nil} = socket <- assign_refresh(socket),
         %Socket{redirected: nil} = socket <- assign_capabilities(socket, session) do
      maybe_apply_module(socket, :mount, [params, page_session], &{:ok, &1})
    else
      %Socket{} = redirected_socket -> {:ok, redirected_socket}
    end
  end

  defp assign_params(socket, params) do
    update_page(socket, params: params, info: info(params), route: route(params))
  end

  defp route(%{"page" => page}), do: String.to_existing_atom(page)

  defp info(%{"info" => info} = params), do: {info, Map.delete(params, "info")}
  defp info(%{}), do: nil

  defp assign_node(socket, params) do
    param_node = Map.fetch!(params, "node")

    if found_node = Enum.find(nodes(), &(Atom.to_string(&1) == param_node)) do
      if connected?(socket) do
        :net_kernel.monitor_nodes(true, node_type: :all)
      end

      update_page(socket, node: found_node, nodes: nodes())
    else
      redirect_to_current_node(socket)
    end
  end

  def assign_refresh(socket) do
    page_live = socket.assigns.page.page_live

    socket
    |> update_page(
      refresher?: page_live.__page_live__(:refresher?),
      refresh: page_live.__page_live__(:refresh),
      refresh_options: page_live.__page_live__(:refresh_options)
    )
    |> init_schedule_refresh()
  end

  defp init_schedule_refresh(socket) do
    if connected?(socket) and socket.assigns.page.refresher? do
      schedule_refresh(socket)
    else
      assign(socket, timer: nil)
    end
  end

  defp schedule_refresh(socket) do
    assign(socket, timer: Process.send_after(self(), :refresh, socket.assigns.page.refresh * 1000))
  end

  def assign_capabilities(socket, session) do
    capabilities = Phoenix.LiveDashboard.SystemInfo.ensure_loaded(socket.assigns.page.node)

    update_page(socket,
      metrics: capabilities.dashboard && session["metrics"],
      os_mon: capabilities.os_mon,
      request_logger: capabilities.dashboard && session["request_logger"],
      dashboard_running?: capabilities.dashboard
    )
  end

  defp maybe_apply_module(socket, fun, params, default) do
    if function_exported?(socket.assigns.page.page_live, fun, length(params) + 1) do
      apply(socket.assigns.page.page_live, fun, params ++ [socket])
    else
      default.(socket)
    end
  end

  @impl true
  def handle_params(params, url, socket) do
    socket = assign_params(socket, params)
    maybe_apply_module(socket, :handle_params, [params, url], &{:noreply, &1})
  end

  @impl true
  def render(assigns) do
    ~L"""
    <header class="d-flex">
      <div class="container d-flex flex-column">
        <h1>
          <span class="header-title-part">Phoenix </span>
          <span class="header-title-part">LiveDashboard<span>
        </h1>
        <%= live_component(assigns.socket, MenuComponent, page: @page) %>
      </div>
    </header>
    <%= live_info(@socket, @page) %>
    <section id="main" role="main" class="container">
      <%= @page.page_live.render(assigns) %>
    </section>
    """
  end

  @impl true
  def handle_info({:nodeup, _, _}, socket) do
    {:noreply, update_page(socket, nodes: nodes())}
  end

  def handle_info({:nodedown, _, _}, socket) do
    {:noreply, validate_nodes_or_redirect(socket)}
  end

  def handle_info(:refresh, socket) do
    socket
    |> update(:page, fn page -> %{page | tick: page.tick + 1} end)
    |> schedule_refresh()
    |> maybe_apply_module(:handle_refresh, [], &{:noreply, &1})
  end

  def handle_info(message, socket) do
    maybe_apply_module(socket, :handle_info, [message], &{:noreply, &1})
  end

  @impl true
  def handle_event("select_node", params, socket) do
    param_node = params["node"]

    node = Enum.find(nodes(), &(Atom.to_string(&1) == param_node))

    page = socket.assigns.page

    if node && node != page.node do
      to = live_dashboard_path(socket, page.route, node, page.params)
      {:noreply, push_redirect(socket, to: to)}
    else
      {:noreply, redirect_to_current_node(socket)}
    end
  end

  def handle_event("select_refresh", params, socket) do
    case Integer.parse(params["refresh"]) do
      {refresh, ""} -> {:noreply, update_page(socket, refresh: refresh)}
      _ -> {:noreply, socket}
    end
  end

  def handle_event("show_info", %{"info" => info}, socket) do
    to = live_dashboard_path(socket, socket.assigns.page, &Map.put(&1, :info, info))
    {:noreply, push_patch(socket, to: to)}
  end

  def handle_event(event, params, socket) do
    socket.assigns.page.page_live.handle_event(event, params, socket)
  end

  ## Node helpers

  defp validate_nodes_or_redirect(socket) do
    if socket.assigns.page.node not in nodes() do
      socket
      |> put_flash(:error, "Node #{socket.assigns.page.node} disconnected.")
      |> redirect_to_current_node()
    else
      update_page(socket, nodes: nodes())
    end
  end

  defp redirect_to_current_node(socket) do
    push_redirect(socket, to: live_dashboard_path(socket, :home, node(), []))
  end

  defp update_page(socket, assigns) do
    update(socket, :page, fn page ->
      Enum.reduce(assigns, page, fn {key, value}, page ->
        Map.replace!(page, key, value)
      end)
    end)
  end
end
