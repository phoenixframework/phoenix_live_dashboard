defmodule Phoenix.LiveDashboard.HomePage do
  @moduledoc false
  use Phoenix.LiveDashboard.PageBuilder

  import Phoenix.HTML
  import Phoenix.LiveDashboard.Helpers

  alias Phoenix.LiveDashboard.SystemInfo

  @memory_usage_sections [
    {:atom, "Atoms", "green", nil},
    {:binary, "Binary", "blue", nil},
    {:code, "Code", "purple", nil},
    {:ets, "ETS", "yellow", nil},
    {:process, "Processes", "orange", nil},
    {:other, "Other", "dark-gray", nil}
  ]

  @menu_text "Home"

  @hints [
    total_input: "The total number of bytes received through ports/sockets.",
    total_output: "The total number of bytes output to ports/sockets.",
    total_queues: """
      Each core in your machine gets a scheduler to process all instructions within the Erlang VM.
      Each scheduler has its own queue, which is measured by this number. If this number keeps on
      growing, it means the machine is overloaded. The queue sizes can also be broken into CPU and IO.
    """,
    atoms: ~E"""
      If the number of atoms keeps growing even if the system load is stable, you may have an atom leak in your application.
      You must avoid functions such as <code>String.to_atom/1</code> which can create atoms dynamically.
    """,
    ports: """
      If the number of ports keeps growing even if the system load is stable, you may have a port leak in your application.
      This means ports are being opened by a parent process that never exits or never closes them.
    """,
    processes: """
      If the number of processes keeps growing even if the system load is stable, you may have a process leak in your application.
      This means processes are being spawned and they never exit.
    """
  ]

  @impl true
  def mount(_params, session, socket) do
    {app_title, app_name} = session[:home_app]

    %{
      # Read once
      system_info: system_info,
      environment: environment,
      # Kept forever
      system_limits: system_limits,
      # Updated periodically
      system_usage: system_usage
    } = SystemInfo.fetch_system_info(socket.assigns.page.node, session[:env_keys], app_name)

    socket =
      assign(socket,
        system_info: system_info,
        system_limits: system_limits,
        system_usage: system_usage,
        environment: environment,
        app_title: app_title
      )

    {:ok, socket}
  end

  @impl true
  def render_page(assigns) do
    row(
      components: [
        columns(
          components: [
            [
              erlang_info_row(assigns.system_info),
              elixir_info_row(assigns.system_info, assigns.app_title),
              io_info_row(assigns.system_usage),
              run_queues_row(assigns.system_usage),
              environments_row(assigns.environment)
            ],
            [
              atoms_usage_row(assigns),
              ports_usage_row(assigns),
              processes_usage_row(assigns),
              memory_shared_usage_row(assigns)
            ]
          ]
        )
      ]
    )
  end

  @impl true
  def menu_link(_, _) do
    {:ok, @menu_text}
  end

  defp erlang_info_row(system_info) do
    row(
      components: [
        columns(
          components: [
            card(
              title: "System information",
              value: "#{system_info.banner} [#{system_info.system_architecture}]",
              class: ["no-title"]
            )
          ]
        )
      ]
    )
  end

  defp elixir_info_row(system_info, app_title) do
    row(
      components: [
        columns(
          components: [
            card(
              inner_title: "Elixir",
              value: system_info[:elixir_version],
              class: ["bg-elixir", "text-white"]
            ),
            card(
              inner_title: "Phoenix",
              value: system_info[:phoenix_version],
              class: ["bg-phoenix", "text-white"]
            ),
            card(
              inner_title: app_title,
              value: system_info[:app_version],
              class: ["bg-dashboard", "text-white"]
            )
          ]
        )
      ]
    )
  end

  defp io_info_row(system_usage) do
    row(
      components: [
        columns(
          components: [
            card(
              inner_title: "Uptime",
              value: format_uptime(system_usage.uptime)
            ),
            card(
              inner_title: "Total input",
              inner_hint: @hints[:total_input],
              value: format_bytes(system_usage.io |> elem(0))
            ),
            card(
              inner_title: "Total output",
              inner_hint: @hints[:total_output],
              value: format_bytes(system_usage.io |> elem(1))
            )
          ]
        )
      ]
    )
  end

  defp run_queues_row(system_usage) do
    row(
      components: [
        columns(
          components: [
            card(
              title: "Run queues",
              inner_title: "Total",
              inner_hint: @hints[:total_queues],
              value: system_usage.total_run_queue
            ),
            card(
              inner_title: "CPU",
              value: system_usage.cpu_run_queue
            ),
            card(
              inner_title: "IO",
              value: system_usage.total_run_queue - system_usage.cpu_run_queue
            )
          ]
        )
      ]
    )
  end

  defp environments_row(environments) do
    row(
      components: [
        columns(
          components: [
            fields_card(
              title: "Environment",
              fields: environments
            )
          ]
        )
      ]
    )
  end

  defp atoms_usage_row(assigns) do
    usages = usage_params(:atoms, assigns)

    params = [
      usages: usages,
      dom_id: "atoms",
      title: "System limits",
      csp_nonces: assigns.csp_nonces
    ]

    row(
      components: [
        columns(
          components: [
            usage_card(params)
          ]
        )
      ]
    )
  end

  defp ports_usage_row(assigns) do
    usages = usage_params(:ports, assigns)
    params = [usages: usages, dom_id: "ports", csp_nonces: assigns.csp_nonces]

    row(
      components: [
        columns(
          components: [
            usage_card(params)
          ]
        )
      ]
    )
  end

  defp processes_usage_row(assigns) do
    usages = usage_params(:processes, assigns)
    params = [usages: usages, dom_id: "processes", csp_nonces: assigns.csp_nonces]

    row(
      components: [
        columns(
          components: [
            usage_card(params)
          ]
        )
      ]
    )
  end

  defp memory_shared_usage_row(assigns) do
    params = memory_usage_params(assigns)

    row(
      components: [
        columns(
          components: [
            shared_usage_card(params)
          ]
        )
      ]
    )
  end

  defp usage_params(type, %{system_usage: system_usage, system_limits: system_limits}) do
    [
      %{
        current: system_usage[type],
        limit: system_limits[type],
        percent: percentage(system_usage[type], system_limits[type]),
        dom_sub_id: "total",
        hint: @hints[type],
        title: Phoenix.Naming.humanize(type)
      }
    ]
  end

  defp memory_usage_params(%{system_usage: system_usage} = assigns) do
    total = system_usage.memory.total
    memory_usage = calculate_memory_usage(system_usage.memory)
    usages = [calculate_memory_usage_percent(memory_usage, total)]

    [
      title: "Memory",
      usages: usages,
      total_data: memory_usage,
      total_legend: "Total usage:",
      total_usage: format_bytes(system_usage.memory[:total]),
      total_formatter: &format_bytes(&1),
      csp_nonces: assigns.csp_nonces,
      dom_id: "memory"
    ]
  end

  defp calculate_memory_usage(memory_usage) do
    for {key, name, color, desc} <- @memory_usage_sections, value = memory_usage[key] do
      {name, value, color, desc}
    end
  end

  defp calculate_memory_usage_percent(memory_usage, total) do
    data =
      Enum.map(memory_usage, fn {name, value, color, desc} ->
        {name, percentage(value, total), color, desc}
      end)

    %{
      data: data,
      dom_sub_id: "total"
    }
  end

  @impl true
  def handle_refresh(socket) do
    {:noreply,
     assign(socket, system_usage: SystemInfo.fetch_system_usage(socket.assigns.page.node))}
  end
end
