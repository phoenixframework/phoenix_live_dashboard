defmodule Phoenix.LiveDashboard.ProcessesPage do
  @moduledoc false
  use Phoenix.LiveDashboard.PageBuilder
  import Phoenix.LiveDashboard.Helpers

  alias Phoenix.LiveDashboard.SystemInfo

  @menu_text "Processes"

  @impl true
  def render(assigns) do
    ~H"""
    <.live_table
      id="processes-table"
      dom_id="processes-table"
      page={@page}
      row_fetcher={{&fetch_processes/3, nil}}
      row_attrs={&row_attrs/1}
      title="Processes"
    >
      <:col :let={process} field={:pid} header="PID">
        <%= process[:pid] |> encode_pid() |> String.replace_prefix("PID", "") %>
      </:col>
      <:col field={:name_or_initial_call} header="Name or initial call" />
      <:col :let={process} field={:memory} header="Memory" text_align="right" sortable={:desc}>
        <%= format_bytes(process[:memory]) %>
      </:col>
      <:col field={:reductions_diff} header="Reductions" text_align="right" sortable={:desc} />
      <:col field={:message_queue_len} header="MsgQ" text_align="right" sortable={:desc} />
      <:col :let={process} field={:current_function} header="Current function">
        <%= format_call(process[:current_function]) %>
      </:col>
    </.live_table>
    """
  end

  defp fetch_processes(params, node, state) do
    %{search: search, sort_by: sort_by, sort_dir: sort_dir, limit: limit} = params

    {processes, count, state} =
      SystemInfo.fetch_processes(node, search, sort_by, sort_dir, limit, state)

    {processes, count, state}
  end

  defp row_attrs(process) do
    [
      {"phx-click", "show_info"},
      {"phx-value-info", encode_pid(process[:pid])},
      {"phx-page-loading", true}
    ]
  end

  @impl true
  def menu_link(_, _) do
    {:ok, @menu_text}
  end
end
