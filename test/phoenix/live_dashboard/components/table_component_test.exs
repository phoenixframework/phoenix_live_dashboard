defmodule Phoenix.LiveDashboard.TableComponentTest do
  use ExUnit.Case, async: true

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

  defp render_table(opts) do
    columns = [%{field: :foo, sortable: :desc}, %{field: :bar, sortable: :desc}, %{field: :baz}]

    page = %{
      node: Keyword.get(opts, :node, node()),
      route: Keyword.get(opts, :route, :foobaz),
      params: Keyword.get(opts, :params, %{})
    }

    opts =
      Map.merge(
        %{
          columns: columns,
          id: :component_id,
          page: page,
          row_fetcher: &row_fetcher/2,
          title: "Title"
        },
        Map.new(opts)
      )
      |> TableComponent.normalize_params()

    render_component(TableComponent, opts, router: Router)
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

    test "renders columns" do
      columns = [
        %{
          field: :foo,
          header: "Foo header",
          header_attrs: [class: "header-foo-class"],
          format: &"foo-format-#{&1}",
          cell_attrs: [class: "cell-foo-class"],
          sortable: :desc
        },
        %{field: :bar, cell_attrs: [class: "cell-bar-class"]},
        %{field: :baz}
      ]

      result = render_table(columns: columns)

      assert result =~ "Foo header"
      assert result =~ "Bar"
      assert result =~ "Baz"
      assert result =~ ~r|<th>[\r\n\s]*Baz[\r\n\s]*</th>|

      assert result =~ ~s|<th class=\"header-foo-class\">|

      assert result =~ ~r|<td class=\"cell-foo-class\">[\r\n\s]*foo-format-1[\r\n\s]*</td>|
      assert result =~ ~r|<td class=\"cell-foo-class\">[\r\n\s]*foo-format-4[\r\n\s]*</td>|

      assert result =~ ~r|<td class=\"cell-bar-class\">[\r\n\s]*2[\r\n\s]*</td>|
      assert result =~ ~r|<td class=\"cell-bar-class\">[\r\n\s]*5[\r\n\s]*</td>|

      assert result =~ ~r|<td>[\r\n\s]*3[\r\n\s]*</td>|
      assert result =~ ~r|<td>[\r\n\s]*6[\r\n\s]*</td>|
    end

    test "renders title" do
      title = "This is the title"
      result = render_table(title: title)
      assert result =~ title
    end

    test "renders limit options" do
      result = render_table(limit: [10, 100, 1000])

      assert result =~
               ~s|<option value=\"10\" selected>10</option><option value=\"100\">100</option><option value=\"1000\">1000</option>|

      result = render_table(params: %{"limit" => "5"}, limit: [10, 100, 1000])

      assert result =~
               ~s|<option value=\"10\" selected>10</option><option value=\"100\">100</option><option value=\"1000\">1000</option>|

      result = render_table(params: %{"limit" => "100"}, limit: [10, 100, 1000])

      assert result =~
               ~s|<option value=\"10\">10</option><option value=\"100\" selected>100</option><option value=\"1000\">1000</option>|
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

  describe "normalize_params/1" do
    test "validates required params" do
      msg = "expected :columns parameter to be received"

      assert_raise ArgumentError, msg, fn ->
        TableComponent.normalize_params(%{})
      end

      msg = "expected :id parameter to be received"

      assert_raise ArgumentError, msg, fn ->
        TableComponent.normalize_params(%{columns: []})
      end

      msg = "expected :row_fetcher parameter to be received"

      assert_raise ArgumentError, msg, fn ->
        TableComponent.normalize_params(%{id: "id", columns: []})
      end

      msg = "expected :title parameter to be received"

      assert_raise ArgumentError, msg, fn ->
        TableComponent.normalize_params(%{
          row_fetcher: &row_fetcher/2,
          id: "id",
          columns: []
        })
      end
    end

    test "normalizes columns" do
      msg = "expected :field parameter to be received, column received: []"

      assert_raise ArgumentError, msg, fn ->
        TableComponent.normalize_params(%{
          title: "title",
          row_fetcher: &row_fetcher/2,
          id: "id",
          columns: [[]]
        })
      end

      msg = "expected :field parameter not to be nil, column received: [field: nil]"

      assert_raise ArgumentError, msg, fn ->
        TableComponent.normalize_params(%{
          title: "title",
          row_fetcher: &row_fetcher/2,
          id: "id",
          columns: [[field: nil]]
        })
      end

      msg = "expected :field parameter to be an atom or a string, column received: [field: 7]"

      assert_raise ArgumentError, msg, fn ->
        TableComponent.normalize_params(%{
          title: "title",
          row_fetcher: &row_fetcher/2,
          id: "id",
          columns: [[field: 7]]
        })
      end

      assert params =
               TableComponent.normalize_params(%{
                 title: "title",
                 row_fetcher: &row_fetcher/2,
                 id: "id",
                 columns: [[field: "id"]]
               })

      assert [
               %{
                 cell_attrs: [],
                 field: "id",
                 format: format_fun,
                 header: "Id",
                 header_attrs: [],
                 sortable: nil
               }
             ] = params.columns

      assert "id" = format_fun.("id")
    end

    test "adds default values" do
      assert %{
               columns: [_],
               id: "id",
               limit: [50, 100, 500, 1000, 5000],
               row_attrs: [],
               row_fetcher: fun,
               rows_name: "title",
               title: "title",
               search: true,
               hint: nil
             } =
               TableComponent.normalize_params(%{
                 title: "title",
                 row_fetcher: &row_fetcher/2,
                 id: "id",
                 columns: [[field: :id]]
               })

      assert is_function(fun, 2)
    end
  end
end
