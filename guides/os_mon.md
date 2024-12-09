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

> Some operating systems break Erlang into multiple packages. In this case, you may need to install a package such as `erlang-os-mon` or similar.

## Configuring os_mon

See [the Erlang docs](https://www.erlang.org/doc/apps/os_mon/os_mon_app.html) for more information and `os_mon` configuration.
