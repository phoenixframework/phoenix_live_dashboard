defmodule Phoenix.LiveDashboard.MixProject do
  use Mix.Project

  @version "0.1.0"

  def project do
    [
      app: :phoenix_live_dashboard,
      version: @version,
      elixir: "~> 1.8",
      compilers: [:phoenix] ++ Mix.compilers(),
      start_permanent: Mix.env() == :prod,
      deps: deps(),
      package: package(),
      docs: docs(),
      homepage_url: "http://www.phoenixframework.org",
      description: """
      Real-time performance monitor and debugger for Phoenix
      """
    ]
  end

  # Run "mix help compile.app" to learn about applications.
  def application do
    [
      extra_applications: [:logger]
    ]
  end

  # Run "mix help deps" to learn about dependencies.
  defp deps do
    [
      {:phoenix_live_view, "~> 0.7.0"},
      {:telemetry_metrics, "~> 0.4.0"},
      {:ex_doc, "~> 0.21", only: :docs},
      {:jason, "~> 1.0", optional: true},
      {:floki, "~> 0.24.0", only: :test}
    ]
  end

  defp docs do
    [
      main: "Phoenix.LiveDashboard",
      source_ref: "v#{@version}",
      source_url: "https://github.com/phoenixframework/phoenix_live_dashboard",
      extra_section: "GUIDES",
      extras: extras(),
      groups_for_extras: groups_for_extras(),
      groups_for_modules: groups_for_modules()
    ]
  end

  defp extras do
    [
      "guides/introduction/installation.md",
      "guides/telemetry.md"
    ]
  end

  defp groups_for_extras do
    [
      Introduction: ~r/guides\/introduction\/.?/,
      Guides: ~r/guides\/[^\/]+\.md/
    ]
  end

  defp groups_for_modules do
    [
      Routing: [
        Phoenix.LiveDashboard.Helpers
      ]
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
