defmodule Phoenix.LiveDashboard.TableComponentTest do
  use ExUnit.Case, async: true

  use Phoenix.Component
  import Phoenix.LiveViewTest

  alias Phoenix.LiveDashboard.TableComponent
  @endpoint Phoenix.LiveDashboardTest.Endpoint

  defmodule Router do
    use Phoenix.Router
    import Phoenix.LiveDashboard.Router

    scope "/" do
      live_dashboard("/dashboard")
    end
  end

  defp row_fetcher(params, node) do
    send(self(), {:row_fetcher, params, node})
    {[[foo: 1, bar: 2, baz: 3], [foo: 4, bar: 5, baz: 6]], 2}
  end

  defp row_fetcher(params, node, state) do
    send(self(), {:row_fetcher, params, node, state})
    {[[foo: 1, bar: 2, baz: 3], [foo: 4, bar: 5, baz: 6]], 2, state + 1}
  end

  defp default_assigns(assigns \\ []) do
    page = %{
      node: Keyword.get(assigns, :node, node()),
      route: Keyword.get(assigns, :route, :foobaz),
      params: Keyword.get(assigns, :params, %{})
    }

    Map.merge(
      %{
        id: :component_id,
        dom_id: :component_id,
        page: page,
        row_fetcher: &row_fetcher/2,
        title: "Title"
      },
      Map.new(assigns)
    )
  end

  defp render_table(assigns) do
    assigns = default_assigns(assigns)

    render_component(
      fn assigns ->
        ~H"""
        <.live_component module={TableComponent} {assigns}>
          <:col field={:foo} sortable={:desc} />
          <:col field={:bar} sortable={:desc} />
          <:col field={:baz} />
        </.live_component>
        """
      end,
      assigns,
      router: Router
    )
  end

  describe "rendering" do
    test "calls to row_fetcher/2 with params and node" do
      render_table(params: %{})
      assert_received {:row_fetcher, %{sort_dir: :desc, limit: 50, sort_by: :foo}, node}
      assert node == node()

      params = %{
        "sort_by" => "bar",
        "sort_dir" => "asc",
        "limit" => "5000"
      }

      render_table(params: params)
      assert_received {:row_fetcher, %{sort_dir: :asc, limit: 5000, sort_by: :bar}, ^node}
    end

    test "calls to row_fetcher/3 with params, node and state" do
      render_table(row_fetcher: {&row_fetcher/3, 0}, params: %{})
      assert_received {:row_fetcher, %{sort_dir: :desc, limit: 50, sort_by: :foo}, node, 0}
      assert node == node()

      params = %{
        "sort_by" => "bar",
        "sort_dir" => "asc",
        "limit" => "5000"
      }

      render_table(row_fetcher: {&row_fetcher/3, 1}, params: params)
      assert_received {:row_fetcher, %{sort_dir: :asc, limit: 5000, sort_by: :bar}, ^node, 1}
    end

    test "renders columns" do
      result =
        render_component(
          fn assigns ->
            ~H"""
            <.live_component module={TableComponent} {assigns}>
              <:col :let={row} field={:foo} header="Foo header" sortable={:desc}>
                <%= "foo-format-#{row[:foo]}" %>
              </:col>
              <:col field={:bar} text_align="right" />
              <:col field={:baz} />
            </.live_component>
            """
          end,
          default_assigns(dom_id: "qux"),
          router: Router
        )

      assert result =~ "Foo header"
      assert result =~ "Bar"
      assert result =~ "Baz"

      assert result =~ ~s|<th class="qux-foo">|
      assert result =~ ~s|<th class="qux-bar text-right">|
      assert result =~ ~r|<th class="qux-baz">[\r\n\s]*Baz[\r\n\s]*</th>|

      assert result =~ ~r|<td class="qux-foo">[\r\n\s]*foo-format-1[\r\n\s]*</td>|
      assert result =~ ~r|<td class="qux-foo">[\r\n\s]*foo-format-4[\r\n\s]*</td>|

      assert result =~ ~r|<td class="qux-bar text-right">[\r\n\s]*2[\r\n\s]*</td>|
      assert result =~ ~r|<td class="qux-bar text-right">[\r\n\s]*5[\r\n\s]*</td>|

      assert result =~ ~r|<td class="qux-baz">[\r\n\s]*3[\r\n\s]*</td>|
      assert result =~ ~r|<td class="qux-baz">[\r\n\s]*6[\r\n\s]*</td>|
    end

    test "renders title" do
      title = "This is the title"
      result = render_table(title: title)
      assert result =~ title
    end

    test "renders limit options" do
      result = render_table(limit: [10, 100, 1000])

      assert result =~
               ~s|<option selected value=\"10\">10</option><option value=\"100\">100</option><option value=\"1000\">1000</option>|

      result = render_table(params: %{"limit" => "5"}, limit: [10, 100, 1000])

      assert result =~
               ~s|<option selected value=\"10\">10</option><option value=\"100\">100</option><option value=\"1000\">1000</option>|

      result = render_table(params: %{"limit" => "100"}, limit: [10, 100, 1000])

      assert result =~
               ~s|<option value=\"10\">10</option><option selected value=\"100\">100</option><option value=\"1000\">1000</option>|
    end

    test "disables limit" do
      result = render_table(limit: false)
      refute result =~ "<select name=\"limit\""
      assert result =~ "Showing 2 title"
    end

    test "disables search" do
      assert render_table(search: true) =~ "<input type=\"search\" name=\"search\""
      refute render_table(search: false) =~ "<input type=\"search\" name=\"search\""
    end

    test "renders rows_name" do
      result = render_table(rows_name: "waldos")
      assert result =~ "waldos out of 2"

      result = render_table(title: "Waldos")
      assert result =~ "waldos out of 2"
    end

    test "renders row_attrs" do
      row_attrs = [class: "row-attrs"]
      result = render_table(row_attrs: row_attrs)
      assert result =~ "<tr class=\"row-attrs\">"

      row_attrs = fn
        [{:foo, 1} | _] -> [class: "row-attrs-1"]
        [{:foo, 4} | _] -> [class: "row-attrs-4"]
      end

      result = render_table(row_attrs: row_attrs)
      assert result =~ "<tr class=\"row-attrs-1\">"
      assert result =~ "<tr class=\"row-attrs-4\">"
    end
  end

  describe "validate params" do
    test "normalizes columns" do
      assert_raise ArgumentError, ~r"the :field parameter is expected, got:", fn ->
        render_component(
          fn assigns ->
            ~H"""
            <.live_component module={TableComponent} {assigns}>
              <:col />
            </.live_component>
            """
          end,
          default_assigns(),
          router: Router
        )
      end

      assert_raise ArgumentError, ~r":field parameter must not be nil, got: ", fn ->
        render_component(
          fn assigns ->
            ~H"""
            <.live_component module={TableComponent} {assigns}>
              <:col field={nil} />
            </.live_component>
            """
          end,
          default_assigns(),
          router: Router
        )
      end

      assert_raise ArgumentError, ~r":field parameter must be an atom or a string, got: ", fn ->
        render_component(
          fn assigns ->
            ~H"""
            <.live_component module={TableComponent} {assigns}>
              <:col field={7} />
            </.live_component>
            """
          end,
          default_assigns(),
          router: Router
        )
      end

      msg = "must have at least one column with :sortable parameter"

      assert_raise ArgumentError, msg, fn ->
        render_component(
          fn assigns ->
            ~H"""
            <.live_component module={TableComponent} {assigns}>
              <:col field={:id} />
            </.live_component>
            """
          end,
          default_assigns(),
          router: Router
        )
      end
    end
  end
end
