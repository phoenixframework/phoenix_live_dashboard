defmodule Phoenix.LiveDashboard.MixProject do
  use Mix.Project

  @version "0.1.0"

  def project do
    [
      app: :phoenix_live_dashboard,
      version: @version,
      elixir: "~> 1.8",
      start_permanent: Mix.env() == :prod,
      deps: deps(),
      package: package()
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
      {:phoenix_live_view, github: "phoenixframework/phoenix_live_view"},
      {:telemetry_metrics, "~> 0.3.1"},
      {:ex_doc, "~> 0.21", only: :docs},
      {:jason, "~> 1.0", optional: true},
      {:floki, ">= 0.0.0", only: :test}
    ]
  end

  defp package do
    [
      maintainers: ["Chris McCord", "José Valim"],
      licenses: ["MIT"],
      links: %{github: "https://github.com/phoenixframework/phoenix_live_dashboard"},
      files:
        ~w(assets/css assets/js lib priv) ++
          ~w(CHANGELOG.md LICENSE.md mix.exs package.json README.md)
    ]
  end
end
