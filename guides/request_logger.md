# Configuring request logger

This guide covers how to install and configure your LiveDashboard request logger.

## Installing request logger

Installing the request logger is straight-forward. Just add the following plug to your "lib/my_app_web/endpoint.ex", right before `Plug.RequestId`:

```elixir
plug Phoenix.LiveDashboard.RequestLogger,
  param_key: "request_logger",
  cookie_key: "request_logger"
```

If your application is an API only, then you most likely don't use cookies, which means you can remove the "cookie_key" option.

Now go to your dashboard and the Request Logger will be enabled. Once you click it, you will have the option to either pass a parameter to stream requests logs or to enable/disable a cookie that streams requests logs.

## Configuring request logger

There is no configuration for the request logger at the moment.
