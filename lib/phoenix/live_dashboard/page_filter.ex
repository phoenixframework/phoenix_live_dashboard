defmodule Phoenix.LiveDashboard.PageFilter do
  @moduledoc """
  Page filter allows to customize the view of table components.
  This could be useful for cases where there are too many items and/or
  the customized list of items is desired.
  For instance, you may have millions of processes per node. Then, using the standard Processes page
  may present a performance problem. Besides, you may want to look at the application-specific groups of processes,
  rather then going through the whole list.

  Example of custom page filter implementation:

    defmodule ProcessFilter.Demo do
      @behaviour Phoenix.LiveDashboard.PageFilter

      # This will result in having Filter dropdown in Processes page
      @impl true
      def list() do
        ["Registered", "All", "Phoenix"]
      end

      # These are custom filter implementations
      @impl true
      def filter("Registered") do
        Process.registered() |> Enum.map(fn name -> %{pid: Process.whereis(name), name_or_initial_call: name} end)
      end

      def filter("All") do
        Process.list()
      end

      def filter("Phoenix") do
        Process.registered() |> Enum.flat_map(fn name -> String.contains?(to_string(name), "Phoenix") && [
          %{pid: Process.whereis(name), name_or_initial_call: name}] || []
        end)
      end

      # This is a custom modal that displays the process info we're interested in
      @impl true
      def info_content(assigns, filter) when filter == "Registered" do
        assigns = assign(assigns, :filter, filter)
        info_list(assigns)
      end

      # Processes other than "Registered" will have a default modal.
      def info_content(_assigns, _filter) do
        nil
      end


      defp info_list(assigns) do
        [
          %{label: "Filtered", value: assigns.filter},
          %{label: "Registered name", value: assigns.registered_name},
          %{label: "Total heap size", value: assigns.total_heap_size}
        ]
      end

    end


   To enable the filter for Processes page, add this to your config.exs:

   config :phoenix_live_dashboard, :process_filter, ProcessFilter.Demo

  What will happen:

  - The Processes page will have Filter dropdown defined in list() function;
  - The groups of processed will be displayed according to selected filter  ;
  - The custom modal will be displayed for the processes of "Registered" group.

  """

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
      <tr :for={elem <- @info_content}>
          <td class="border-top-0"><%= elem.label %></td>
          <td class="border-top-0"><pre><%= elem.value %></pre></td>
        </tr>
      <% end %>
      </tbody>
    </table>
    """
  end

  defp render_page_content(_assigns, content)
       when is_struct(content, Phoenix.LiveView.Rendered) do
    content
  end
end
