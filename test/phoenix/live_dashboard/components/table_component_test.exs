defmodule Phoenix.LiveDashboard.TableComponentTest do
  use ExUnit.Case, async: true

  import Phoenix.LiveViewTest

  alias Phoenix.LiveDashboard.TableComponent
  @endpoint Phoenix.LiveDashboardTest.Endpoint

  defp row_fetcher(params) do
    send(self(), {:row_fetcher, params})
    {[[foo: 1, bar: 2, baz: 3], [foo: 4, bar: 5, baz: 6]], 2}
  end

  defp self_path(socket, params) do
    send(self(), {:self_path, {socket, params}})
    "/"
  end

  defp render_table(opts) do
    columns = [%{field: :foo, sortable: true}, %{field: :bar, sortable: true}, %{field: :baz}]

    opts =
      Keyword.merge(
        [
          columns: columns,
          id: :component_id,
          params: %{},
          row_fetcher: &row_fetcher/1,
          self_path: &self_path/2,
          title: "Title"
        ],
        opts
      )

    render_component(TableComponent, opts)
  end

  describe "rendering" do
    test "calls to raw_fetcher/1 with params" do
      render_table(params: %{})
      assert_received {:row_fetcher, %{sort_dir: :desc, limit: 50, sort_by: :foo}}

      params = %{
        "sort_by" => "bar",
        "sort_dir" => "asc",
        "limit" => "5000"
      }

      render_table(params: params)
      assert_received {:row_fetcher, %{sort_dir: :asc, limit: 5000, sort_by: :bar}}
    end

    test "renders columns" do
      columns = [
        %{
          field: :foo,
          header: "Foo header",
          header_attrs: [class: "header-foo-class"],
          format: &"foo-format-#{&1[:foo]}",
          cell_attrs: [class: "cell-foo-class"],
          sortable: true
        },
        %{field: :bar, cell_attrs: &[class: "cell-bar-class-#{&1[:bar]}"]},
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

      assert result =~ ~r|<td class=\"cell-bar-class-2\">[\r\n\s]*2[\r\n\s]*</td>|
      assert result =~ ~r|<td class=\"cell-bar-class-5\">[\r\n\s]*5[\r\n\s]*</td>|

      assert result =~ ~r|<td>[\r\n\s]*3[\r\n\s]*</td>|
      assert result =~ ~r|<td>[\r\n\s]*6[\r\n\s]*</td>|
    end

    test "renders title" do
      title = "This is the title"
      result = render_table(title: title)
      assert result =~ title
    end

    test "renders limit options" do
      result = render_table(limit_options: ~w(10 100 1000))

      assert result =~
               ~s|<option value=\"10\" selected>10</option><option value=\"100\">100</option><option value=\"1000\">1000</option>|

      result = render_table(limit_options: [10, 100, 1000])

      assert result =~
               ~s|<option value=\"10\" selected>10</option><option value=\"100\">100</option><option value=\"1000\">1000</option>|
    end

    test "renders rows_name" do
      result = render_table(rows_name: "waldos")
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
end
