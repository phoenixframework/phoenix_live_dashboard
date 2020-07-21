defmodule Phoenix.LiveDashboard.PageNotFound do
  defexception [:message, plug_status: 404]
end

defmodule Phoenix.LiveDashboard.PageLive do
  use Phoenix.LiveDashboard.Web, :live_view
  import Phoenix.LiveDashboard.LiveHelpers

  @impl true
  def mount(%{"node" => _, "page" => page} = params, session, socket) do
    if module = session[page] do
      socket
      |> assign_mount(String.to_existing_atom(page), params, session, true)
      |> assign(:module, module)
      |> maybe_apply_module(:mount, [params, session, :__socket__], &{:ok, &1})
    else
      raise Phoenix.LiveDashboard.PageNotFound, "unknown page #{inspect(page)}"
    end
  end

  def mount(_params, _session, socket) do
    {:ok, push_redirect(socket, to: live_dashboard_path(socket, :home, node()))}
  end

  defp maybe_apply_module(socket, fun, params, default) do
    if function_exported?(socket.assigns.module, fun, length(params)) do
      params = Enum.map(params, &if(&1 == :__socket__, do: socket, else: &1))
      apply(socket.assigns.module, fun, params)
    else
      default.(socket)
    end
  end

  @impl true
  def handle_params(params, _url, socket) do
    {:noreply, assign_params(socket, params)}
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
    |> maybe_apply_module(:handle_refresh, [:__socket__], &{:noreply, &1})
  end

  def handle_info(message, socket) do
    maybe_apply_module(socket, :handle_info, [message, :__socket__], &{:noreply, &1})
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
