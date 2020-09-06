defmodule Phoenix.LiveDashboard.PageBuilder do
  defstruct info: nil,
            module: nil,
            node: nil,
            params: nil,
            route: nil,
            tick: 0

  @type session :: map
  @type requirements :: keyword
  @type unsigned_params :: map
  @type capabilities :: %{
          apps: %{optional(atom()) => boolean()},
          modules: %{optional(module()) => boolean()},
          pids: %{optional(pid()) => boolean()},
          dashboard: nil | pid(),
          system_info: nil | binary()
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

      def init(opts), do: {:ok, opts}

      defoverridable init: 1
    end
  end
end
