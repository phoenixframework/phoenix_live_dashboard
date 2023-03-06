defmodule Phoenix.LiveDashboard.PageFilter do
  @callback list() :: [String.t()]
  @callback filter(filter_name :: String.t()) :: [any()]
  @callback info_content(assigns :: Socket.assigns(), filter_name :: String.t() | nil) ::
              Phoenix.LiveView.Rendered.t() | [map()] | nil

  defmacro __using__(_) do
    quote do
      @behaviour Phoenix.LiveDashboard.PageFilter
      def info_content(_assigns, _filter_name) do
        nil
      end

      defoverridable info_content: 2
    end
  end

  def render_info_page(assigns, filter, filter_mod) do
    content = filter_mod.info_content(assigns, filter)
    content && render_page_content(assigns, content)
  end

  use Phoenix.Component

  defp render_page_content(assigns, content) when is_list(content) do
    assigns = assign(assigns, :info_content, content)

    ~H"""
    <table class="table table-hover tabular-info-table">
      <tbody>
      <%= for elem <- @info_content do %>
        <tr>
          <td class="border-top-0"><%= elem.label %></td>
          <td class="border-top-0"><pre><%= elem.value %></pre></td>
        </tr>
      <% end %>
      </tbody>
    </table>
    """
  end

  defp render_page_content(_assigns, content) do
    content
  end
end
