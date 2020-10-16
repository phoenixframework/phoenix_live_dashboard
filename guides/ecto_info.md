# Configuring Ecto repository information

This guide covers how to configure the LiveDashboard to stats from your underlying database. At the moment, this information can only be show for Ecto repositories running on `Ecto.Adapters.Postgres`.

## Installing Ecto Info

To enable the "Ecto Info" functionality in your dashboard, you will need to do the three steps below:

  1. Add the ecto_psql_extras dependency
  2. Configure the dashboard
  3. (optional) Install custom extensions

### Add the `ecto_psql_extras` dependency

In your `mix.exs`, add the following to your `deps`:

```elixir
  {:ecto_psql_extras, "~> 0.2"},
```

### Configure the dashboard

The next step is to configure the dashboard. Go to the `live_dashboard` call in your router and list all of your repositories:

```elixir
live_dashboard "/dashboard", ecto_repos: [MyApp.Repo]
```

You want to configure each repository that connects to a distinct database. Remember that only Ecto repositories running on `Ecto.Adapters.Postgres` are currently supoprted.

If you want to disable the "Ecto Info" option altogether, set `ecto_repos: []`.

### Install custom extensions

Once the repository information is running, some of the queries (Calls and Outliers) require the [pg_stat_statements](https://www.postgresql.org/docs/current/pgstatstatements.html) extension enabled. If you wish to access said functionality, you must install the extension first, otherwise an error will be shown.
