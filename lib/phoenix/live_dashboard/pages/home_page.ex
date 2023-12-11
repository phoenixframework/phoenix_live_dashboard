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
    atoms: """
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
  def render(assigns) do
    ~H"""
    <.row>
      <:col>
        <.erlang_info_row {@system_info} />
        <.elixir_info_row {@system_info} app_title={@app_title} />
        <.io_info_row
          uptime={@system_usage.uptime}
          input={elem(@system_usage.io, 0)}
          output={elem(@system_usage.io, 1)}
        />
        <.run_queues_row {@system_usage} />
        <.environments_row fields={@environment} />
      </:col>
      <:col>
        <.atoms_usage_row
          system_usage={@system_usage}
          system_limits={@system_limits}
          csp_nonces={@csp_nonces}
        />
        <.ports_usage_row
          system_usage={@system_usage}
          system_limits={@system_limits}
          csp_nonces={@csp_nonces}
        />
        <.processes_usage_row
          system_usage={@system_usage}
          system_limits={@system_limits}
          csp_nonces={@csp_nonces}
        />
        <.memory_shared_usage_row system_usage={@system_usage} csp_nonces={@csp_nonces} />
      </:col>
    </.row>
    """
  end

  @impl true
  def menu_link(_, _) do
    {:ok, @menu_text}
  end

  attr :banner, :string, required: true
  attr :system_architecture, :string, required: true

  defp erlang_info_row(assigns) do
    ~H"""
    <.row>
      <:col>
        <.card dom_id="system-info-card" title="System information">
          <%= "#{@banner} [#{@system_architecture}]" %>
        </.card>
      </:col>
    </.row>
    """
  end

  attr :elixir_version, :string, required: true
  attr :phoenix_version, :string, required: true
  attr :app_title, :string, required: true
  attr :app_version, :string, required: true

  defp elixir_info_row(assigns) do
    ~H"""
    <.row>
      <:col>
        <.card dom_id="elixir-card" inner_title="Elixir">
          <%= @elixir_version %>
        </.card>
      </:col>
      <:col>
        <.card dom_id="phoenix-card" inner_title="Phoenix">
          <%= @phoenix_version %>
        </.card>
      </:col>
      <:col>
        <.card dom_id="app-card" inner_title={@app_title}>
          <%= @app_version %>
        </.card>
      </:col>
    </.row>
    """
  end

  attr :uptime, :integer, required: true
  attr :input, :integer, required: true
  attr :output, :integer, required: true

  defp io_info_row(assigns) do
    ~H"""
    <.row>
      <:col>
        <.card inner_title="Uptime">
          <%= format_uptime(@uptime) %>
        </.card>
      </:col>
      <:col>
        <.card inner_title="Total input" inner_hint={hint_msg(:total_input)}>
          <%= format_bytes(@input) %>
        </.card>
      </:col>
      <:col>
        <.card inner_title="Total output" inner_hint={hint_msg(:total_output)}>
          <%= format_bytes(@output) %>
        </.card>
      </:col>
    </.row>
    """
  end

  attr :total_run_queue, :integer, required: true
  attr :cpu_run_queue, :integer, required: true

  defp run_queues_row(assigns) do
    ~H"""
    <.row>
      <:col>
        <.card title="Run queues" inner_title="Total" inner_hint={hint_msg(:total_queues)}>
          <%= @total_run_queue %>
        </.card>
      </:col>
      <:col>
        <.card inner_title="CPU">
          <%= @cpu_run_queue %>
        </.card>
      </:col>
      <:col>
        <.card inner_title="IO">
          <%= @total_run_queue - @cpu_run_queue %>
        </.card>
      </:col>
    </.row>
    """
  end

  attr :fields, :list, required: true

  defp environments_row(assigns) do
    ~H"""
    <.row>
      <:col>
        <.fields_card title="Environment" fields={@fields} />
      </:col>
    </.row>
    """
  end

  attr :system_usage, :any, required: true
  attr :system_limits, :any, required: true
  attr :csp_nonces, :any, required: true

  defp atoms_usage_row(assigns) do
    ~H"""
    <.row>
      <:col>
        <.usage_card dom_id="atoms" csp_nonces={@csp_nonces} title="System limits">
          <:usage {usage_params(:atoms, @system_usage, @system_limits)} />
        </.usage_card>
      </:col>
    </.row>
    """
  end

  attr :system_usage, :any, required: true
  attr :system_limits, :any, required: true
  attr :csp_nonces, :any, required: true

  defp ports_usage_row(assigns) do
    ~H"""
    <.row>
      <:col>
        <.usage_card dom_id="ports" csp_nonces={@csp_nonces}>
          <:usage {usage_params(:ports, @system_usage, @system_limits)} />
        </.usage_card>
      </:col>
    </.row>
    """
  end

  attr :system_usage, :any, required: true
  attr :system_limits, :any, required: true
  attr :csp_nonces, :any, required: true

  defp processes_usage_row(assigns) do
    ~H"""
    <.row>
      <:col>
        <.usage_card dom_id="processes" csp_nonces={@csp_nonces}>
          <:usage {usage_params(:processes, @system_usage, @system_limits)} />
        </.usage_card>
      </:col>
    </.row>
    """
  end

  defp usage_params(type, system_usage, system_limits) do
    %{
      current: system_usage[type],
      limit: system_limits[type],
      percent: percentage(system_usage[type], system_limits[type]),
      dom_id: "total",
      hint: raw(@hints[type]),
      title: Phoenix.Naming.humanize(type)
    }
  end

  attr :system_usage, :any, required: true
  attr :csp_nonces, :any, required: true

  defp memory_shared_usage_row(assigns) do
    memory_usage = calculate_memory_usage(assigns.system_usage.memory)
    assigns = assign(assigns, :memory_usage, memory_usage)

    ~H"""
    <.row>
      <:col>
        <.shared_usage_card
          dom_id="memory"
          title="Memory"
          usages={[calculate_memory_usage_percent(@memory_usage, @system_usage.memory.total)]}
          total_data={@memory_usage}
          total_legend="Total usage:"
          total_usage={format_bytes(@system_usage.memory.total)}
          total_formatter={&format_bytes(&1)}
          csp_nonces={@csp_nonces}
        />
      </:col>
    </.row>
    """
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
      dom_id: "total"
    }
  end

  defp hint_msg(key), do: @hints[key]

  @impl true
  def handle_refresh(socket) do
    {:noreply,
     assign(socket, system_usage: SystemInfo.fetch_system_usage(socket.assigns.page.node))}
  end
end
