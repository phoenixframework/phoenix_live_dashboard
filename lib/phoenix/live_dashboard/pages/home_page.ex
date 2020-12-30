defmodule Phoenix.LiveDashboard.HomePage do
  @moduledoc false
  use Phoenix.LiveDashboard.PageBuilder

  import Phoenix.HTML

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
    """
  ]

  @impl true
  def mount(_params, session, socket) do
    %{
      # Read once
      system_info: system_info,
      environment: environment,
      # Kept forever
      system_limits: system_limits,
      # Updated periodically
      system_usage: system_usage
    } = SystemInfo.fetch_system_info(socket.assigns.page.node, session["env_keys"])

    socket =
      assign(socket,
        system_info: system_info,
        system_limits: system_limits,
        system_usage: system_usage,
        environment: environment
      )

    {:ok, socket}
  end

  @impl true
  def render_page(assigns) do
    row(
      components: [
        page_columns(
          columns: [
            [
              erlang_info_row(assigns.system_info),
              elixir_info_row(assigns.system_info),
              io_info_row(assigns.system_usage),
              run_queues_row(assigns.system_usage)
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
      title: "System information",
      components: [
        page_columns(
          columns: [
            card(
              value: "#{system_info.banner} [#{system_info.system_architecture}]",
              class: ["no-title"]
            )
          ]
        )
      ]
    )
  end

  defp elixir_info_row(system_info) do
    row(
      components: [
        page_columns(
          columns: [
            card(
              title: "Elixir",
              value: system_info[:elixir_version],
              class: ["bg-elixir", "text-white"]
            ),
            card(
              title: "Phoenix",
              value: system_info[:phoenix_version],
              class: ["bg-phoenix", "text-white"]
            ),
            card(
              title: "Dashboard",
              value: system_info[:dashboard_version],
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
        page_columns(
          columns: [
            card(title: "Uptime", value: format_uptime(system_usage.uptime)),
            card(
              title: "Total input",
              hint: @hints[:total_input],
              value: format_bytes(system_usage.io |> elem(0))
            ),
            card(
              title: "Total output",
              hint: @hints[:total_output],
              value: format_bytes(system_usage.io |> elem(1))
            )
          ]
        )
      ]
    )
  end

  defp run_queues_row(system_usage) do
    row(
      title: "Run queues",
      components: [
        page_columns(
          columns: [
            card(
              title: "Total",
              hint: @hints[:total_queues],
              value: system_usage.total_run_queue
            ),
            card(title: "CPU", value: system_usage.cpu_run_queue),
            card(title: "IO", value: system_usage.total_run_queue - system_usage.cpu_run_queue)
          ]
        )
      ]
    )
  end

  defp atoms_usage_row(assings) do
    params = atoms_usage_params(assings)

    row(
      title: "System limits",
      components: [
        page_columns(
          columns: [
            usage_card(params)
          ]
        )
      ]
    )
  end

  defp ports_usage_row(assings) do
    params = ports_usage_params(assings)

    row(
      components: [
        page_columns(
          columns: [
            usage_card(params)
          ]
        )
      ]
    )
  end

  defp processes_usage_row(assings) do
    params = processes_usage_params(assings)

    row(
      components: [
        page_columns(
          columns: [
            usage_card(params)
          ]
        )
      ]
    )
  end

  defp memory_shared_usage_row(assings) do
    params = memory_usage_params(assings)

    row(
      title: "Memory",
      components: [
        page_columns(
          columns: [
            shared_usage_card(params)
          ]
        )
      ]
    )
  end

  defp atoms_usage_params(%{system_usage: system_usage, system_limits: system_limits}) do
    hint = ~E"""
      If the number of atoms keeps growing even if the system load is stable, you may have an atom leak in your application.
      You must avoid functions such as <code>String.to_atom/1</code> which can create atoms dynamically.
    """

    usages = [
      %{
        current: system_usage.atoms,
        limit: system_limits.atoms,
        percent: percentage(system_usage.atoms, system_limits.atoms),
        sub_dom_id: "total",
        hint: hint,
        title: "Atoms"
      }
    ]

    [usages: usages, dom_id: "atoms"]
  end

  defp ports_usage_params(%{system_usage: system_usage, system_limits: system_limits}) do
    hint = """
      If the number of ports keeps growing even if the system load is stable, you may have a port leak in your application.
      This means ports are being opened by a parent process that never exits or never closes them.
    """

    usages = [
      %{
        current: system_usage.ports,
        limit: system_limits.ports,
        percent: percentage(system_usage.ports, system_limits.ports),
        sub_dom_id: "total",
        hint: hint,
        title: "Ports"
      }
    ]

    [usages: usages, dom_id: "ports"]
  end

  defp processes_usage_params(%{system_usage: system_usage, system_limits: system_limits}) do
    hint = """
      If the number of processes keeps growing even if the system load is stable, you may have a process leak in your application.
      This means processes are being spawned and they never exit.
    """

    usages = [
      %{
        current: system_usage.processes,
        limit: system_limits.processes,
        percent: percentage(system_usage.processes, system_limits.processes),
        sub_dom_id: "total",
        hint: hint,
        title: "Processes"
      }
    ]

    [usages: usages, dom_id: "processes"]
  end

  defp memory_usage_params(%{system_usage: system_usage}) do
    total = system_usage.memory.total
    memory_usage = calculate_memory_usage(system_usage.memory)
    usages = [calculate_memory_usage_percent(memory_usage, total)]

    [
      usages: usages,
      total_data: memory_usage,
      total_legend: "Total usage:",
      total_usage: format_bytes(system_usage.memory[:total]),
      total_formatter: &format_bytes(&1),
      csp_nonces: %{img: nil, script: nil, style: nil},
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
      dom_sub_id: "total",
      title: "Memory"
    }
  end

  @impl true
  def handle_refresh(socket) do
    {:noreply,
     assign(socket, system_usage: SystemInfo.fetch_system_usage(socket.assigns.page.node))}
  end
end
