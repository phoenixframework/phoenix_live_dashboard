defmodule Phoenix.LiveDashboard.PageNotFound do
  defexception [:message, plug_status: 404]
end

defmodule Phoenix.LiveDashboard.PageLive do
  use Phoenix.LiveDashboard.Web, :live_view
  import Phoenix.LiveDashboard.LiveHelpers

  @impl true
  def mount(%{"node" => _, "page" => page} = params, session, socket) do
    if module = session[page] do
      {:ok,
       socket
       |> assign_mount(String.to_existing_atom(page), params, session, true)
       |> assign(:module, module)}
    else
      raise Phoenix.LiveDashboard.PageNotFound, "unknown page #{inspect(page)}"
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
    to = live_dashboard_path(socket, socket.assigns.menu.page, node, socket.assigns.params)
    {:noreply, push_redirect(socket, to: to)}
  end

  def handle_info(:refresh, socket) do
    menu = socket.assigns.menu
    {:noreply, assign(socket, :menu, update_in(menu.tick, &(&1 + 1)))}
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
