defmodule Phoenix.LiveDashboard.Plugins do
  def load(plugins) do
    Application.ensure_all_started(:phoenix_live_dashboard)

    Enum.reduce(plugins, [], fn {plugin, options}, hooks ->
      Application.ensure_started(plugin)

      Application.fetch_env(plugin, :hooks)
      |> case do
        {:ok, plugin_hooks} ->
          Keyword.put(hooks, plugin, [
            options: options,
            hooks: plugin_hooks
          ])
        _ ->
          raise "Library #{Atom.to_string(plugin)} is not a plugin"
      end
    end)
  end

  def call(plugins, name, args) do
    Keyword.values(plugins)
    |> call_plugin(name, args, [])
  end

  defp call_plugin([plugin | plugins], name, args, results) do
    args = [Keyword.get(plugin, :options, [])] ++ args

    result = Keyword.get(plugin, :hooks, [])
    |> Keyword.get(name, [])
    |> call_hooks(args, results)

    call_plugin(plugins, name, args, result ++ results)
  end

  defp call_plugin([], _name, _args, results) do
    results
  end

  defp call_hooks([{module, function} | plugins], args, results) do
    result = Kernel.apply(module, function, args)
    call_hooks(plugins, args, [result | results])
  end

  defp call_hooks([], _args, results) do
    results
  end
end
