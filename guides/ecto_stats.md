# Configuring Ecto repository stats

This guide covers how to configure the LiveDashboard to stats from your underlying database. At the moment, these stats can only be show for Ecto repositories running on `Ecto.Adapters.Postgres`.

## Installing Ecto Stats

To enable the "Ecto Stats" functionality in your dashboard, you will need to do the three steps below:

  1. Add the ecto_psql_extras dependency
  2. Configure the dashboard
  3. (optional) Install custom extensions

### Add the `ecto_psql_extras` dependency

In your `mix.exs`, add the following to your `deps`:

```elixir
  {:ecto_psql_extras, "~> 0.6"},
```

### Configure the dashboard

The next step is to configure the dashboard. Go to the `live_dashboard` call in your router and list all of your repositories:

```elixir
live_dashboard "/dashboard", ecto_repos: [MyApp.Repo]
```

You want to list all repositories that connect to distinct databases. For example, if you have both `MyApp.Repo` and `MyApp.RepoAnother` but they connect to the same database, there is no benefit in listing both. Remember only Ecto repositories running on `Ecto.Adapters.Postgres` are currently supported.

If you want to disable the "Ecto Stats" option altogether, set `ecto_repos: []`.

### Install custom extensions

Once the repository page is enabled, some of the queries (Calls and Outliers) require the [pg_stat_statements](https://www.postgresql.org/docs/current/pgstatstatements.html) extension installed. If you wish to access said functionality, you must install the extension first, otherwise said functionality won't be shown.
