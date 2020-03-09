use Mix.Config

config :phoenix, :json_library, Jason

config :logger, level: :warn
config :logger, :console, format: "[$level] $message\n"

config :phoenix, :stacktrace_depth, 20
