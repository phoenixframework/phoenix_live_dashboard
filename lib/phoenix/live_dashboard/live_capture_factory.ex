defmodule Phoenix.LiveDashboard.LiveCaptureFactory do
  @moduledoc false

  def csp_nonces(context) do
    case context do
      %{csp_style_nonce: style_nonce, csp_script_nonce: script_nonce} ->
        %{style: style_nonce, script: script_nonce}

      _ ->
        %{style: "nonce", script: "nonce"}
    end
  end

  def page_stub(params \\ %{}) do
    params =
      case params do
        list when is_list(list) -> Map.new(list)
        map -> map
      end

    base = %{
      __struct__: Phoenix.LiveDashboard.PageBuilder,
      route: "example",
      node: node(),
      params: %{}
    }

    Map.merge(base, params)
  end

  def table_row_fetcher(_params, _node) do
    {[%{name: "alpha", count: 12}, %{name: "beta", count: 7}], 2}
  end

  def table_row_fetcher_empty(_params, _node) do
    {[], 0}
  end

  def layered_background(_node_data), do: "gray"
  def layered_label(node_data) when is_binary(node_data), do: node_data
  def layered_label(node_data) when is_map(node_data), do: node_data.label
  def layered_detail(node_data) when is_map(node_data), do: node_data.detail

  def chart_distribution_data do
    [
      {"bucket-1", 5, -5_000_000},
      {"bucket-2", 12, -4_000_000},
      {"bucket-3", 9, -3_000_000},
      {"bucket-4", 2, -2_000_000}
    ]
  end

  def title_bar_assigns do
    %{
      dom_id: "title-bar",
      percent: 42.5,
      csp_nonces: LiveCapture.Attribute.with_csp_nonces(&__MODULE__.csp_nonces/1),
      inner_block: [
        %{
          __slot__: :inner_block,
          inner_block: &__MODULE__.title_bar_inner_block/2
        }
      ],
      class: "mb-2",
      color: "blue"
    }
  end

  def title_bar_inner_block(_assigns, _slot), do: "Usage"

  def app_info_assigns do
    %{
      alive: true,
      width: 240,
      height: 160,
      nodes: [
        %{
          x: 20,
          y: 20,
          width: 120,
          height: 30,
          label: "Supervisor",
          value: {:proc, self(), []}
        },
        %{
          x: 20,
          y: 70,
          width: 120,
          height: 30,
          label: "Worker",
          value: {:proc, self(), []}
        }
      ],
      lines: [
        %{x1: 80, y1: 50, x2: 80, y2: 70}
      ]
    }
  end

  def ets_info_assigns do
    %{
      alive: true,
      id: "12345",
      name: "cache",
      size: 3,
      node: node(),
      named_table: true,
      read_concurrency: false,
      write_concurrency: false,
      compressed: false,
      memory: "2 KB",
      owner: "PID 0.111.0",
      heir: "none",
      type: :set,
      keypos: 1,
      protection: :protected
    }
  end

  def process_info_assigns do
    %{
      alive: true,
      page: %{allow_destructive_actions: false},
      registered_name: nil,
      label: nil,
      current_function: "Elixir.Task.Supervised/2",
      initial_call: "Elixir.Task.Supervised/2",
      status: :running,
      message_queue_len: 0,
      ancestor_links: ["PID 0.200.0"],
      other_links: [],
      monitors: [],
      monitored_by: [],
      trap_exit: false,
      error_handler: :error_handler,
      priority: :normal,
      group_leader: "PID 0.0.0",
      total_heap_size: 233,
      heap_size: 144,
      stack_size: 24,
      reductions: 1024,
      garbage_collection: "enabled",
      suspending: "false",
      current_stacktrace: "Elixir.Task.Supervised/2"
    }
  end

  def socket_info_assigns do
    %{
      alive: true,
      module: :gen_tcp,
      send_oct: 2048,
      recv_oct: 4096,
      local_address: "127.0.0.1:4000",
      foreign_address: "127.0.0.1:51234",
      state: :connected,
      type: :stream,
      connected: "PID 0.201.0"
    }
  end

  def port_info_assigns do
    %{
      alive: true,
      name: "bash",
      id: 12,
      connected: "PID 0.202.0",
      input: 1024,
      output: 2048,
      os_pid: 4242,
      links: ["PID 0.111.0", "PID 0.222.0"]
    }
  end

  def usage_card_single do
    [
      %{
        current: 12,
        limit: 100,
        dom_id: "single",
        percent: "12",
        title: "Disk",
        hint: "Sample usage"
      }
    ]
  end

  def total_formatter(value), do: "#{value} units"

  def home_page_assigns do
    %{
      page: page_stub(route: :home),
      app_title: "SampleApp",
      csp_nonces: LiveCapture.Attribute.with_csp_nonces(&__MODULE__.csp_nonces/1),
      environment: [{"MIX_ENV", "dev"}, {"REGION", "local"}],
      system_info: %{
        banner: "Erlang/OTP 27",
        system_architecture: "x86_64-apple-darwin",
        elixir_version: "Elixir 1.17.0",
        phoenix_version: "Phoenix 1.7.13",
        app_version: "0.1.0"
      },
      system_limits: %{
        atoms: 1_048_576,
        ports: 1024,
        processes: 262_144
      },
      system_usage: %{
        uptime: 12_345,
        io: {1_048_576, 2_097_152},
        total_run_queue: 7,
        cpu_run_queue: 3,
        atoms: 42_000,
        ports: 120,
        processes: 1_234,
        memory: %{
          atom: 8_000_000,
          binary: 10_000_000,
          code: 12_000_000,
          ets: 4_000_000,
          process: 6_000_000,
          other: 2_000_000,
          total: 42_000_000
        }
      }
    }
  end

  def applications_page_assigns do
    %{
      page: page_stub(route: :applications),
      row_fetcher: &__MODULE__.applications_row_fetcher/2
    }
  end

  def applications_row_fetcher(_params, _node) do
    {[
       %{name: :logger, description: "Logger", state: :started, tree?: true, version: "1.0.0"},
       %{name: :ssl, description: "SSL", state: :loaded, tree?: false, version: "9.0.0"}
     ], 2}
  end

  def processes_page_assigns do
    %{
      page: page_stub(route: :processes),
      row_fetcher: {&__MODULE__.processes_row_fetcher/3, nil}
    }
  end

  def processes_row_fetcher(_params, _node, state) do
    rows = [
      %{
        pid: self(),
        name_or_initial_call: "Elixir.Task.Supervised",
        memory: 1_024_000,
        reductions_diff: 120,
        message_queue_len: 0,
        current_function: {Phoenix.LiveDashboard.PageBuilder, :live_table, 1}
      }
    ]

    {rows, length(rows), state}
  end

  def ports_page_assigns do
    %{
      page: page_stub(route: :ports),
      row_fetcher: &__MODULE__.ports_row_fetcher/2
    }
  end

  def ports_row_fetcher(_params, _node) do
    port = sample_port()

    {[
       %{
         port: port,
         name: "/usr/bin/cat",
         os_pid: 4242,
         input: 1_024,
         output: 2_048,
         id: 1,
         owner: self()
       }
     ], 1}
  end

  def sockets_page_assigns do
    %{
      page: page_stub(route: :sockets),
      row_fetcher: &__MODULE__.sockets_row_fetcher/2
    }
  end

  def sockets_row_fetcher(_params, _node) do
    {[
       %{
         port: "Socket 1",
         module: :gen_tcp,
         send_oct: 1_024,
         recv_oct: 2_048,
         local_address: "127.0.0.1:4000",
         foreign_address: "127.0.0.1:51234",
         state: :connected,
         type: :stream,
         connected: self()
       }
     ], 1}
  end

  def ets_page_assigns do
    %{
      page: page_stub(route: :ets),
      row_fetcher: &__MODULE__.ets_row_fetcher/2
    }
  end

  def ets_row_fetcher(_params, _node) do
    {[
       %{
         id: make_ref(),
         name: "cache",
         protection: :protected,
         type: :set,
         size: 10,
         memory: 2_048,
         owner: self()
       }
     ], 1}
  end

  def memory_allocators_page_assigns do
    %{
      page: page_stub(route: :memory_allocators),
      row_fetcher: {&__MODULE__.memory_allocators_row_fetcher/3, nil}
    }
  end

  def memory_allocators_row_fetcher(_params, _node, state) do
    rows = [
      %{name: :binary, block_size: 1_024, carrier_size: 8_192, max_carrier_size: 16_384}
    ]

    {rows, length(rows), state}
  end

  def metrics_page_assigns do
    %{
      page: page_stub(route: :metrics, params: %{"nav" => "vm"}),
      items: ["vm"],
      metrics: nil,
      nav: "vm"
    }
  end

  def sample_metric do
    %{
      __struct__: Telemetry.Metrics.Counter,
      name: [:demo, :metric],
      description: "Demo metric",
      tags: [],
      reporter_options: %{},
      unit: :millisecond
    }
  end

  def sample_metric_summary do
    %{
      __struct__: Telemetry.Metrics.Summary,
      name: [:demo, :summary],
      description: "Summary metric",
      tags: [],
      reporter_options: %{},
      unit: :millisecond
    }
  end

  def os_mon_page_assigns() do
    %{
      page: page_stub(route: :os_mon),
      csp_nonces: LiveCapture.Attribute.with_csp_nonces(&__MODULE__.csp_nonces/1),
      cpu: %{
        count: 8,
        load1: 0.12,
        load5: 0.2,
        load15: 0.3,
        avg1: 0.02,
        avg5: 0.03,
        avg15: 0.04
      },
      mem_usages: [
        %{
          current: "1.0 GB",
          limit: "4.0 GB",
          percent: 25.0,
          dom_id: :used_memory,
          hint: "Used memory",
          title: "Used"
        }
      ],
      disk_usages: [
        %{
          current: "120 GB",
          limit: "500 GB",
          percent: 24.0,
          dom_id: 0,
          title: "/"
        }
      ]
    }
  end

  def ecto_stats_page_assigns do
    %{
      error: :no_ecto_repos_available
    }
  end

  def request_logger_page_assigns do
    %{
      page: page_stub(route: :request_logger),
      stream: "demo",
      param_key: nil,
      cookie_key: nil,
      cookie_domain: nil,
      cookie_enabled: false,
      autoscroll_enabled: true,
      messages_present: false,
      streams: %{messages: []},
      show_refresh_link: false
    }
  end

  def page_live_assigns do
    %{
      page: %Phoenix.LiveDashboard.PageBuilder{
        info: nil,
        module: Phoenix.LiveDashboard.LiveCapturePageStub,
        node: node(),
        params: %{},
        route: :home,
        allow_destructive_actions: false
      },
      menu: %Phoenix.LiveDashboard.PageLive{
        links: [],
        nodes: [node()],
        refresher?: false,
        dashboard_mount_path: "/dashboard"
      },
      csp_nonces: LiveCapture.Attribute.with_csp_nonces(&__MODULE__.csp_nonces/1)
    }
  end

  def sample_port do
    port = Port.open({:spawn, "cat"}, [])
    Port.close(port)
    port
  end
end
