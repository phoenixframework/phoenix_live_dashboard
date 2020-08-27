defmodule Phoenix.LiveDashboard.PageBuilder do
  defstruct capabilities: nil,
            info: nil,
            module: nil,
            node: nil,
            params: nil,
            route: nil,
            session: nil,
            tick: 0

  @type unsigned_params :: map

  @callback init(term()) :: term()

  @callback menu_link(session :: term(), map()) ::
              {:ok, String.t()}
              | {:disabled, String.t()}
              | {:disabled, String.t(), String.t()}
              | :skip

  @callback mount(
              unsigned_params() | :not_mounted_at_router,
              session :: term(),
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
      import Phoenix.LiveDashboard.PageBuilder

      @behaviour Phoenix.LiveDashboard.PageBuilder

      refresher? = Keyword.get(opts, :refresher?, true)

      def __page_live__(:refresher?) do
        unquote(refresher?)
      end

      def init(opts), do: opts

      defoverridable init: 1
    end
  end
end
