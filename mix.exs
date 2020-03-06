defmodule Phoenix.LiveDashboard.MixProject do
  use Mix.Project

  @version "0.1.0"

  def project do
    [
      app: :phoenix_live_dashboard,
      version: @version,
      elixir: "~> 1.7",
      compilers: [:phoenix] ++ Mix.compilers(),
      elixirc_paths: elixirc_paths(Mix.env()),
      deps: deps(),
      package: package(),
      docs: docs(),
      homepage_url: "http://www.phoenixframework.org",
      description: "Real-time performance monitor and tracer for Phoenix"
    ]
  end

  defp elixirc_paths(:test), do: ["lib", "test/support"]
  defp elixirc_paths(_), do: ["lib"]

  # Run "mix help compile.app" to learn about applications.
  def application do
    [
      mod: {Phoenix.LiveDashboard.Application, []},
      extra_applications: [:logger]
    ]
  end

  # Run "mix help deps" to learn about dependencies.
  defp deps do
    [
      {:phoenix_live_view, "~> 0.8.0", github: "phoenixframework/phoenix_live_view"},
      {:telemetry_metrics, "~> 0.4.0"},
      {:telemetry_poller, "~> 0.4.0", only: :dev},
      {:phoenix_live_reload, "~> 1.2", only: :dev},
      {:plug_cowboy, "~> 2.0", only: :dev},
      {:jason, "~> 1.0", only: [:dev, :test]},
      {:floki, "~> 0.24.0", only: :test},
      {:ex_doc, "~> 0.21", only: :docs}
    ]
  end

  defp docs do
    [
      main: "Phoenix.LiveDashboard",
      source_ref: "v#{@version}",
      source_url: "https://github.com/phoenixframework/phoenix_live_dashboard",
      extra_section: "GUIDES",
      extras: extras(),
      nest_modules_by_prefix: [Phoenix.LiveDashboard]
    ]
  end

  defp extras do
    [
      "guides/metrics.md",
      "guides/request_logger.md"
    ]
  end

  defp package do
    [
      maintainers: ["Michael Crumm", "Chris McCord", "José Valim"],
      licenses: ["MIT"],
      links: %{github: "https://github.com/phoenixframework/phoenix_live_dashboard"},
      files:
        ~w(assets/css assets/js lib priv) ++
          ~w(CHANGELOG.md LICENSE.md mix.exs package.json README.md)
    ]
  end
end
