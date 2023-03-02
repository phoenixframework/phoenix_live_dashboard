defmodule Phoenix.LiveDashboard.ProcessFilter do
  @callback list() :: [String.t()]
  @callback filter(filter_name :: String.t()) :: [any()]
  @callback render_process_info(assigns :: Socket.assigns(), filter_name :: String.t() | nil) :: Phoenix.LiveView.Rendered.t() | nil

  defmacro __using__(_) do
    quote do
      @behaviour Phoenix.LiveDashboard.ProcessFilter
      def render_process_info(_assigns, _filter_name) do
        nil
      end

      defoverridable render_process_info: 2
    end
  end


end
