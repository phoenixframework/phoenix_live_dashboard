defmodule Phoenix.LiveDashboard.PageFilter do
  @callback list() :: [String.t()]
  @callback filter(filter_name :: String.t()) :: [any()]
  @callback info_content(assigns :: Socket.assigns(), filter_name :: String.t() | nil) :: Phoenix.LiveView.Rendered.t() | nil

  defmacro __using__(_) do
    quote do
      @behaviour Phoenix.LiveDashboard.ProcessFilter
      def info_content(_assigns, _filter_name) do
        nil
      end

      defoverridable info_content: 2
    end
  end


end
