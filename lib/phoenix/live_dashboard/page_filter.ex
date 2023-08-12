defmodule Phoenix.LiveDashboard.PageFilter do
  @moduledoc """
  Page filter allows to customize the list of items for table components.
  This could be useful for cases where there are too many items and/or
  the customized list of items is desired.
  For instance, you may have millions of processes per node. Then, using the standard Processes page
  may present a performance problem. Besides, you may want to look at the application-specific groups of processes,
  rather then going through the whole list.

  Example of custom page filter implementation:

  defmodule ProcessFilter.Demo do
  @behaviour Phoenix.LiveDashboard.PageFilter

  @impl true
  def list() do
    ["All", "Registered", "Phoenix"]
  end

  @impl true
  def default_filter() do
    "Phoenix"
  end

  @impl true
  def filter("Registered") do
    Process.registered() |> Enum.map(fn name -> Process.whereis(name) end)
  end

  def filter("All") do
    Process.list()
  end

  def filter("Phoenix") do
    Process.registered() |> Enum.flat_map(fn name -> String.contains?(to_string(name), "Phoenix") &&
      [Process.whereis(name)]  || []
  end)
  end
  end


   To enable the filter for Processes page, add this to your config.exs:

   config :phoenix_live_dashboard, :process_filter, ProcessFilter.Demo

  What will happen:

  - The Processes page will have Filter dropdown defined in list() function;
  - The groups of processes will be displayed according to selected filter

  """

  @callback list() :: [String.t()]

  @callback filter(filter_name :: String.t()) :: [any()]

  @callback default_filter() :: String.t()

  defmacro __using__(_) do
    quote do
      @behaviour Phoenix.LiveDashboard.PageFilter
      def default_filter() do
        List.first(list())
      end

      defoverridable default_filter: 0
    end
  end
end
