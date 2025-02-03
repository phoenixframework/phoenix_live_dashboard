defmodule Phoenix.LiveDashboard.MixProject do
  use Mix.Project

  @version "0.8.6"

  def project do
    [
      app: :phoenix_live_dashboard,
      version: @version,
      elixir: "~> 1.12",
      elixirc_paths: elixirc_paths(Mix.env()),
      deps: deps(),
      package: package(),
      name: "LiveDashboard",
      docs: docs(),
      homepage_url: "http://www.phoenixframework.org",
      description: "Real-time performance dashboard for Phoenix",
      aliases: aliases(),
      xref: [exclude: [:cpu_sup, :disksup, :memsup]]
    ]
  end

  defp elixirc_paths(:test), do: ["lib", "test/support"]
  defp elixirc_paths(_), do: ["lib"]

  def application do
    [
      mod: {Phoenix.LiveDashboard.Application, []},
      extra_applications: extra_applications(Mix.env())
    ]
  end

  defp extra_applications(:test), do: [:ssh, :os_mon, :runtime_tools, :logger]
  defp extra_applications(_), do: [:logger]

  defp aliases do
    [
      setup: ["deps.get", "cmd --cd assets npm install"],
      dev: "run --no-halt dev.exs",
      "assets.build": [
        "esbuild default --minify",
        "sass default --no-source-map --style=compressed"
      ]
    ]
  end

  defp deps do
    [
      # Actual deps
      {:mime, "~> 1.6 or ~> 2.0"},
      {:phoenix_live_view, "~> 0.19 or ~> 1.0", phoenix_live_view_opts()},
      {:telemetry_metrics, "~> 0.6 or ~> 1.0"},
      {:ecto_psql_extras, "~> 0.8", optional: true},
      {:ecto_mysql_extras, "~> 0.5", optional: true},
      {:ecto_sqlite3_extras, "~> 1.1.7 or ~> 1.2.0", optional: true},
      {:ecto, "~> 3.6.2 or ~> 3.7", optional: true},

      # Dev and test
      {:circular_buffer, "~> 0.4", only: :dev},
      {:telemetry_poller, "~> 1.0", only: :dev},
      {:phoenix_live_reload, "~> 1.2", only: :dev},
      {:plug_cowboy, "~> 2.0", only: :dev},
      {:jason, "~> 1.0", only: [:dev, :test, :docs]},
      {:floki, "~> 0.27", only: :test},
      {:stream_data, "~> 1.0", only: :test},
      {:ecto_sqlite3, "~> 0.17", only: [:dev, :test]},
      {:ex_doc, "~> 0.21", only: :docs},
      {:makeup_eex, ">= 0.1.1", only: :docs},
      {:esbuild, "~> 0.5", only: :dev},
      {:dart_sass, "~> 0.7", only: :dev}
    ]
  end

  defp phoenix_live_view_opts do
    if path = System.get_env("LIVE_VIEW_PATH") do
      [path: path]
    else
      []
    end
  end

  defp docs do
    [
      main: "Phoenix.LiveDashboard",
      source_ref: "v#{@version}",
      source_url: "https://github.com/phoenixframework/phoenix_live_dashboard",
      extra_section: "GUIDES",
      extras: extras(),
      nest_modules_by_prefix: [Phoenix.LiveDashboard],
      groups_for_docs: [
        Components: &(&1[:type] == :component)
      ]
    ]
  end

  defp extras do
    [
      "guides/ecto_stats.md",
      "guides/metrics.md",
      "guides/metrics_history.md",
      "guides/os_mon.md",
      "guides/request_logger.md"
    ]
  end

  defp package do
    [
      maintainers: ["Michael Crumm", "Chris McCord", "José Valim", "Alex Castaño"],
      licenses: ["MIT"],
      links: %{github: "https://github.com/phoenixframework/phoenix_live_dashboard"},
      files: ~w(dist lib CHANGELOG.md LICENSE.md mix.exs README.md)
    ]
  end
end
