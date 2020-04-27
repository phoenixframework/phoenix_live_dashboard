# Configuring os_mon

This guide covers how to enable os_mon application.

## Enabling os_mon

The os_mon is installed by default with your elixir distribution. You start it by adding to the extra applications section in mix.exs

```elixir
  def application do
    [
      mod: {MyApp.Application, []},
      extra_applications: [:logger, :runtime_tools, :os_mon]
    ]
  end
```

## Configuring os_mon

There is no configuration for the os_mon  at the moment.
