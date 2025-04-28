# CHANGELOG

## v0.8.7 (2025-04-28)

* Fix warnings on Erlang/OTP 28
* Fix metrics history not rendering on LiveView 1.0.2+

## v0.8.6 (2024-12-30)

* Update Erlang docs url
* Fix rendering of durations in Elixir v1.18+
* Fix warnings on Elixir v1.18+
* Remove img nonce which had no effect whatsoever

## v0.8.5 (2024-11-14)

* Provide a mechanism for user extensible LiveView hooks
* Add Erlang/OTP 27 Process label support

## v0.8.4 (2024-06-21)

* Add immutable directive to cache-control header
* Wrap log lines in request logger page
* Fix deprecation warnings on LiveView release candidate

## v0.8.3 (2023-10-28)

* Address deprecation warnings from Phoenix.LiveView and Phoenix.HTML

## v0.8.2 (2023-09-23)

* Support Phoenix.LiveView 0.20.0

## v0.8.1 (2023-08-12)

* Fix warnings on more recent Elixir versions
* Fix OS Mon bug on Windows
* Support custom `on_mount` callback

## v0.8.0 (2023-05-30)

* Support and require Phoenix.LiveView 0.19.0
* Memory Allocators page
* Serve static assets from the router
* Use the new Phoenix.Component

## v0.7.2 (2022-10-26)

* Support Phoenix.LiveView 0.18.3

## v0.7.1 (2022-10-13)

* Support distribution metrics
* Load Phoenix assets from app directory

## v0.7.0 (2022-09-21)

* Support and require Phoenix.LiveView 0.18.0
* Add fullscreen when viewing the app info
* Use csp_nonces on os_mon page

## v0.6.5 (2022-02-20)

* Support and require Phoenix.LiveView 0.17.7

## v0.6.4 (2022-02-03)

* Fix crash on PID info modal when remote pids were present

## v0.6.3 (2022-01-30)

* Fix crash on metrics page when none of the tags specified in a metric are found
* Fix crash on OS data when CPU information cannot be retrieved
* Do not generate compile-time dependencies for dashboard parameters

## v0.6.2 (2021-12-07)

* Improve navigation on Ecto Stats page
* Fix warning on telemetry attaching
* Support more recent MIME versions

## v0.6.1 (2021-10-29)

* Require LiveView v0.17.3
* Remove warnings on latest Phoenix.HTML
* Make charts smoother when prunning data

## v0.6.0 (2021-10-21)

* Require LiveView v0.17.1
* Add Ecto Stats for MySQL (and MariaDB) databases

## v0.5.3 (2021-10-06)

* Show OTP 24.1+ new sockets in tab
* Allow metrics and request logger to be disabled
* Do not include embedded assets in priv

## v0.5.2 (2021-09-21)

* Fix Ecto stats page when running on multi node env

## v0.5.1 (2021-09-07)

* Clarify "No Ecto Repos" messages
* Support strings on navbars titles

## v0.5.0 (2021-08-10)

* Require LiveView v0.16.0
* Fallback to longpoll when websockets are not available
* Remove CPU cards as the result was often inaccurate
* Ignore `nil` measurements in telemetry panes
* Remember refresh selection by using cookies
* Show reductions diff in Processes table
* Allow `home_app` (besides Elixir and Phoenix) to be configured
* Support styles in `navbar` and provide parameter customization
* Add auto-discovery of Ecto repositories
* Add many more components to PageBuilder

## v0.4.0 (2020-11-20)

* Require LiveView v0.15.0

## v0.3.6 (2020-10-28)

* Ensure socket info component displays correctly

## v0.3.5 (2020-10-27)

* Fix regression were home path helper was removed

## v0.3.4 (2020-10-27)

* Only add node to the URL if explicitly required to improve reliability in non-clustered environments

## v0.3.3 (2020-10-24)

* Only show Calls/Outliers in Ecto Stats if extension is enabled
* Fix warnings shown in LiveView console
* Handle `:undefined` when formatting `:current_function`

## v0.3.2 (2020-10-18)

* Improve sorting and formatting in Ecto Stats tables

## v0.3.1 (2020-10-17)

* Ensure the dashboard compiles without optional dependencies

## v0.3.0 (2020-10-16)

* Use `$initial_call` from process dictionary as the initial call whenever available
* Allow custom pages via `Phoenix.LiveDashboard.PageBuilder`
* Allow processes to be killed when `:allow_destructive_actions` is enabled
* Add an Ecto Stats page that shows stats from PSQL databases

## v0.2.10 (2020-10-13)

* Support `:request_logger_cookie_domain` configuration
* Support latest `telemetry_metrics` package

## v0.2.9 (2020-09-28)

* Update `phoenix_live_view` to 0.14.7
* Make the default sorting order configurable in table component
* Fix an issue with JS failures on color charts with legends
* Fix an issue with refresh configuration not being set and update default to be 15 seconds
* Move "Update every" prompt to the top, change tabs to pills to better handle multiple lines

## v0.2.8 (2020-09-15)

* Support `csp_nonce_assign_key` to better handle CSP policies
* Do not crash when `:current_function` is undefined

## v0.2.7 (2020-07-07)

* Add hooks for historical data on metrics dashboard
* Limit chart data via `:prune_threshold` reporter option
* Do not crash the application tab if `which_children` fails
* Several visual improvements

## v0.2.6 (2020-06-03)

* Support tags on summary metrics
* Add supervision trees to the Applications tab

## v0.2.5 (2020-05-22)

* Allow cross-linking of info sections
* Require latest LiveView

## v0.2.4 (2020-05-22)

* Do not crash on duplicate disks
* Support latest LiveView

## v0.2.3 (2020-05-15)

* Allow the Dashboard to connect to nodes even if they are not running the Dashboard (or Phoenix)
* Support hidden nodes
* Allow some environment variables to be opted-in and shown in the Dashboard
* Support latest `telemetry_metrics`

## v0.2.2 (2020-05-05)

* Improvements on the amount of data sent between client/server
* Fix OS Data page on Windows

## v0.2.1 (2020-04-29)

* Add "Applications" page
* Add "OS Data" page

## v0.2.0 (2020-04-22)

* Add "Ports" page
* Add "Sockets" page
* Add "ETS" page

## v0.1.1 (2020-04-18)

* Respect script_name on dashboard socket url
* Add hint for Total input/output
* Fix metric charts on Safari
* Fix Process search for Erlang modules

## v0.1.0 (2020-04-16)

* Initial release.
