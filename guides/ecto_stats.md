# Configuring Ecto repository stats

This guide covers how to configure the LiveDashboard to show stats from your underlying database. At the moment, these stats can only be shown for Ecto repositories running on `Ecto.Adapters.Postgres` or `Ecto.Adapters.MyXQL`.

## Installing Ecto Stats

### PostgreSQL

To enable the "Ecto Stats" functionality for PostgreSQL in your dashboard, you will need to do the three steps below:

  1. Add the [`ecto_psql_extras`](https://hexdocs.pm/ecto_psql_extras) dependency
  2. (optional) Configure the dashboard
  3. (optional) Install custom PostgreSQL extensions

#### Add the `ecto_psql_extras` dependency

In your `mix.exs`, add the following to your `deps`:

```elixir
  {:ecto_psql_extras, "~> 0.6"},
```

### MySQL/MariaDB

To enable the "Ecto Stats" functionality for MySQL or MariaDB in your dashboard, you will need to do the three steps below:

  1. Add the [`ecto_mysql_extras`](https://hexdocs.pm/ecto_mysql_extras) dependency
  2. (optional) Configure the dashboard
  3. (optional) MySQL/MariaDB configuration

#### Add the `ecto_mysql_extras` dependency

In your `mix.exs`, add the following to your `deps`:

```elixir
  {:ecto_mysql_extras, "~> 0.3"},
```

### Configure the dashboard

This step is **only needed if you want to restrict the repositories** listed in your dashboard, because
by default all _repos_ are gonna be listed.

Go to the `live_dashboard` call in your router and list your repositories:

```elixir
live_dashboard "/dashboard", ecto_repos: [MyApp.Repo]
```

You want to list all repositories that connect to distinct databases. For example, if you have both `MyApp.Repo` and `MyApp.RepoAnother` but they connect to the same database, there is no benefit in listing both. Remember only Ecto repositories running on `Ecto.Adapters.Postgres` or `Ecto.Adapters.MyXQL` are currently supported.

If you want to disable the "Ecto Stats" option altogether, set `ecto_repos: []`.

Some queries such as `long_running_queries` can be configured by passing an extra `ecto_psql_extras_options` for PostgreSQL or `ecto_mysql_extras_options` for MySQL/MariaDB,
which is a keyword where:
- each key is the name of the query
- each value is itself a keyword to be passed as `args`

For example, if you want to configure the threshold for `long_running_queries`:

#### PostgreSQL example

```elixir
live_dashboard "/dashboard",
  ecto_repos: [MyApp.Repo],
  ecto_psql_extras_options: [long_running_queries: [threshold: "200 milliseconds"]]
```

See the [`ecto_psql_extras` documentation](https://hexdocs.pm/ecto_psql_extras/readme.html#usage) for available options.

#### MySQL/MariaDB example

```elixir
live_dashboard "/dashboard",
  ecto_repos: [MyApp.Repo],
  ecto_mysql_extras_options: [long_running_queries: [threshold: 200]]
```

See the [`ecto_mysql_extras` documentation](https://hexdocs.pm/ecto_mysql_extras/readme.html#usage) for available options.

### Install custom PostgreSQL extensions

Once the repository page is enabled, some of the queries (Calls and Outliers) require the [pg_stat_statements](https://www.postgresql.org/docs/current/pgstatstatements.html) extension to be installed. If you wish to access said functionality, you must install the extension first, otherwise said functionality won't be shown.

### MySQL/MariaDB configuration

The user which is accessing the repo should have access to the certain system level databases. See the [`ecto_mysql_extras` documentation](https://hexdocs.pm/ecto_mysql_extras/readme.html#mysql-mariadb-configuration) for more details which schemas are being used.

For MariaDB the `performance_schema` isn't enabled by default. To enable this add `performance_schema=ON` to `my.cnf`. These changes take effect after a restart. See the [`ecto_mysql_extras` documentation](https://hexdocs.pm/ecto_mysql_extras/readme.html#performance-schema) for more details.