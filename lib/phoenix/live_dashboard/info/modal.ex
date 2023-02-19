defmodule Phoenix.LiveDashboard.Modal do
  @type param() :: binary()
  @type decoded_param() :: term()
  @callback decode_params(param()) :: {:ok, decoded_param()} | :error
  @callback title(param(), decoded_param()) :: binary()
  @optional_callbacks title: 2

  defmacro __using__(opts) do
    quote location: :keep, bind_quoted: [opts: opts] do
      use Phoenix.LiveDashboard.Web, :live_component
      @behaviour Phoenix.LiveDashboard.Modal

      @impl Phoenix.LiveDashboard.Modal
      def title(param, _), do: param

      defoverridable title: 2
    end
  end
end
