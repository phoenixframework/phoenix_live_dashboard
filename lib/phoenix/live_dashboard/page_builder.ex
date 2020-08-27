defmodule Phoenix.LiveDashboard.PageBuilder do
  defstruct info: nil,
            module: nil,
            node: nil,
            params: nil,
            route: nil,
            tick: 0

  @type session :: map
  @type unsigned_params :: map

  @doc """
  Callback invoked when a page is declared in the router.

  It receives the router options and it must return the
  page session that will be serialized to the client and
  received on `mount`.
  """
  @callback init(term()) :: session

  @callback menu_link(session, map()) ::
              {:ok, String.t()}
              | {:disabled, String.t()}
              | {:disabled, String.t(), String.t()}
              | :skip

  @callback mount(unsigned_params(), session, socket :: Socket.t()) ::
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
