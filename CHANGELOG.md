# CHANGELOG

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
