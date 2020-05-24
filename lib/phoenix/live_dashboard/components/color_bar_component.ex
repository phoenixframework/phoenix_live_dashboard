defmodule Phoenix.LiveDashboard.ColorBarComponent do
  use Phoenix.LiveDashboard.Web, :live_component

  def mount(socket) do
    {:ok, assign(socket, :title, nil)}
  end

  def render(assigns) do
    ~L"""
    <div class="progress flex-grow-1 mb-3">
      <span class="progress-title"><%= @title %></span>
    <%= for {name, value, color, _desc} <- @data do %>
      <div
      title="<%=name %> - <%= format_percent(value) %>"
      class="progress-bar bg-gradient-<%= color %>"
      role="progressbar"
      aria-valuenow="<%= maybe_round(value) %>"
      aria-valuemin="0"
      aria-valuemax="100"
      style="width: <%= value %>%">
      </div>
      <% end %>
    </div>
    """
  end

  defp maybe_round(num) when is_integer(num), do: num
  defp maybe_round(num), do: Float.ceil(num, 1)
end
