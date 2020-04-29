# Configuring OS Data

This guide covers how to install and configure your LiveDashboard OS Data.

## Enabling `os_mon`

The OS Data comes from the `os_mon` application, which ships as part of your Erlang distribution. You can start it by adding it to the extra applications section in your `mix.exs`:

```elixir
  def application do
    [
      ...,
      extra_applications: [:logger, :runtime_tools, :os_mon]
    ]
  end
```

## Configuring os_mon

See [the Erlang docs](http://erlang.org/doc/man/os_mon_app.html) for more information and `os_mon` configuration.
