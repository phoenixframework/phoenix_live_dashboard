defmodule Phoenix.LiveDashboard.PageNotFound do
  defexception [:message, plug_status: 404]
end

defmodule Phoenix.LiveDashboard.PageLive do
  use Phoenix.LiveDashboard.Web, :live_view
  import Phoenix.LiveDashboard.LiveHelpers

  @type unsigned_params :: map

  @callback mount(
              unsigned_params() | :not_mounted_at_router,
              session :: map,
              socket :: Socket.t()
            ) ::
              {:ok, Socket.t()} | {:ok, Socket.t(), keyword()}

  @callback render(assigns :: Socket.assigns()) :: Phoenix.LiveView.Rendered.t()

  @callback terminate(reason, socket :: Socket.t()) :: term
            when reason: :normal | :shutdown | {:shutdown, :left | :closed | term}

  @callback handle_params(unsigned_params(), uri :: String.t(), socket :: Socket.t()) ::
              {:noreply, Socket.t()}

  @callback handle_event(event :: binary, unsigned_params(), socket :: Socket.t()) ::
              {:noreply, Socket.t()} | {:reply, map, Socket.t()}

  @callback handle_call(msg :: term, {pid, reference}, socket :: Socket.t()) ::
              {:noreply, Socket.t()} | {:reply, term, Socket.t()}

  @callback handle_info(msg :: term, socket :: Socket.t()) ::
              {:noreply, Socket.t()}

  @callback handle_refresh(socket :: Socket.t()) ::
              {:noreply, Socket.t()}

  @optional_callbacks mount: 3,
                      terminate: 2,
                      handle_params: 3,
                      handle_event: 3,
                      handle_call: 3,
                      handle_info: 2,
                      handle_refresh: 1

  defmacro __using__(opts) do
    quote bind_quoted: [opts: opts] do
      import Phoenix.LiveView
      import Phoenix.LiveView.Helpers
      import Phoenix.LiveDashboard.LiveHelpers
      @behaviour Phoenix.LiveDashboard.PageLive

      refresher? = Keyword.get(opts, :refresher?, true)

      def __page_live__(:refresher?) do
        unquote(refresher?)
      end
    end
  end

  @impl true
  def mount(%{"node" => _, "page" => page} = params, session, socket) do
    if module = session[page] do
      refresher? = module.__page_live__(:refresher?)

      socket
      |> assign_mount(String.to_existing_atom(page), params, session, refresher?)
      |> assign(:module, module)
      |> maybe_apply_module(:mount, [params, session], &{:ok, &1})
    else
      raise Phoenix.LiveDashboard.PageNotFound, "unknown page #{inspect(page)}"
    end
  end

  def mount(_params, _session, socket) do
    {:ok, push_redirect(socket, to: live_dashboard_path(socket, :home, node()))}
  end

  defp maybe_apply_module(socket, fun, params, default) do
    if function_exported?(socket.assigns.module, fun, length(params) + 1) do
      apply(socket.assigns.module, fun, params ++ [socket])
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
    assigns.module.render(assigns)
  end

  @impl true
  def handle_info({:node_redirect, node}, socket) do
    to = live_dashboard_path(socket, socket.assigns.menu.page, node, socket.assigns.menu.params)
    {:noreply, push_redirect(socket, to: to)}
  end

  def handle_info(:refresh, socket) do
    menu = socket.assigns.menu

    socket
    |> assign(:menu, update_in(menu.tick, &(&1 + 1)))
    |> maybe_apply_module(:handle_refresh, [], &{:noreply, &1})
  end

  def handle_info(message, socket) do
    maybe_apply_module(socket, :handle_info, [message], &{:noreply, &1})
  end

  @impl true
  def handle_event("show_info", %{"info" => info}, socket) do
    to = self_path(socket, socket.assigns.menu, &Map.put(&1, :info, info))
    {:noreply, push_patch(socket, to: to)}
  end

  def handle_event(event, params, socket) do
    socket.assigns.module.handle_event(event, params, socket)
  end
end
