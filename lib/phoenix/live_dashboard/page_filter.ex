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

    end


   To enable the filter for Processes page, add this to your config.exs:

   config :phoenix_live_dashboard, :process_filter, ProcessFilter.Demo

  What will happen:

  - The Processes page will have Filter dropdown defined in list() function;
  - The groups of processed will be displayed according to selected filter  ;

  """

  @callback list() :: [String.t()]

  @callback filter(filter_name :: String.t()) :: [any()]
end
