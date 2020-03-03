# Configuring request logger

This guide covers how to install and configure your LiveDashboard request logger.

## Installing request logger

Installing the request logger is straight-forward. Just add the following plug to your "lib/my_app_web/endpoint.ex", right before `Plug.RequestId`:

```elixir
plug Phoenix.LiveDashboard.RequestLogger, param_key: "request_logger"
```

Now go to your dashboard and the request logger will be enabled. Start a new streaming session to access the signed parameters, then attach it to any request you want to see logged.

## Configuring request logger

There is no configuration for the request logger at the moment.
