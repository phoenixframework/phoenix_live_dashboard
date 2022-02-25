defmodule Phoenix.LiveDashboard.Components.NavBarComponentTest do
  use ExUnit.Case, async: true

  import Phoenix.LiveViewTest

  alias Phoenix.LiveDashboard.NavBarComponent
  @endpoint Phoenix.LiveDashboardTest.Endpoint

  defmodule Router do
    use Phoenix.Router
    import Phoenix.LiveDashboard.Router

    scope "/" do
      live_dashboard("/dashboard")
    end
  end

  defmodule SimpleComponent do
    use Phoenix.LiveComponent

    def render(assigns) do
      ~H"""
      <div><%= @text %></div>
      """
    end
  end

  def render_items(opts) do
    opts =
      [
        items: [
          {
            "foo",
            [name: "Foo", method: :patch, render: {SimpleComponent, %{text: "foo_text"}}]
          },
          {
            "bar",
            [name: "Bar", method: :redirect, render: {SimpleComponent, %{text: "bar_text"}}]
          }
        ],
        nav_param: "nav",
        style: :pills,
        extra_params: [],
        page: %Phoenix.LiveDashboard.PageBuilder{
          node: Keyword.get(opts, :node, node()),
          route: Keyword.get(opts, :route, :foobaz),
          params: Keyword.get(opts, :params, %{})
        }
      ]
      |> Keyword.merge(opts)

    render_component(NavBarComponent, opts, router: Router)
  end

  describe "render" do
    test "renders first item by default" do
      result = render_items([])

      assert result =~
               ~s|<a class="nav-link active" data-phx-link="patch" data-phx-link-state="push" href="/dashboard/foobaz?nav=foo">Foo</a>|

      assert result =~
               ~s|<a class="nav-link" data-phx-link="redirect" data-phx-link-state="push" href="/dashboard/foobaz?nav=bar">Bar</a>|

      assert result =~ ~s|<div>foo_text</div>|
    end

    test "renders given item by params" do
      result = render_items(params: %{"nav" => "bar"})

      assert result =~ ~r|<a[^>]*class=\"nav-link\"[^>]*>Foo</a>|
      assert result =~ ~r|<a[^>]*class=\"nav-link active\"[^>]*>Bar</a>|
      assert result =~ ~s|<div>bar_text</div>|
    end

    test "renders a custom nav parameter" do
      result = render_items(nav_param: "tab", params: %{"tab" => "bar"})

      assert result =~
               ~s|<a class="nav-link" data-phx-link="patch" data-phx-link-state="push" href="/dashboard/foobaz?tab=foo">Foo</a>|

      assert result =~
               ~s|<a class="nav-link active" data-phx-link="redirect" data-phx-link-state="push" href="/dashboard/foobaz?tab=bar">Bar</a>|
    end

    test "renders nav bar keeping extra params" do
      result_without_extra = render_items(params: %{"nav" => "bar", "sort_by" => "field"})

      refute result_without_extra =~ "sort_by=field"

      result =
        render_items(
          params: %{"nav" => "bar", "sort_by" => "field", "search" => "baz"},
          extra_params: ["sort_by"]
        )

      assert result =~ ~s|href="/dashboard/foobaz?nav=foo&amp;sort_by=field"|
      assert result =~ ~s|href="/dashboard/foobaz?nav=bar&amp;sort_by=field"|

      refute result =~ "search=baz"
    end
  end

  describe "normalize_params" do
    test "validates :items" do
      page = %Phoenix.LiveDashboard.PageBuilder{}

      assert_raise ArgumentError, "the :items parameter is expected in nav bar component", fn ->
        NavBarComponent.normalize_params(%{page: page})
      end

      msg = ":items parameter must be a list, got: :invalid"

      assert_raise ArgumentError, msg, fn ->
        NavBarComponent.normalize_params(%{page: page, items: :invalid})
      end

      msg = ":items must be [{string() | atom(), [name: string(), render: fun()], got: :invalid"

      assert_raise ArgumentError, msg, fn ->
        NavBarComponent.normalize_params(%{page: page, items: [:invalid]})
      end

      msg = ":render parameter must be in item: []"

      assert_raise ArgumentError, msg, fn ->
        NavBarComponent.normalize_params(%{page: page, items: [id: []]})
      end

      assert msg =
               ":render parameter in item must be a function that returns a component, got: [render: :invalid]"

      assert_raise ArgumentError, msg, fn ->
        NavBarComponent.normalize_params(%{
          page: page,
          items: [id: [render: :invalid]]
        })
      end

      msg = ~r":name parameter must be in item: "

      assert_raise ArgumentError, msg, fn ->
        NavBarComponent.normalize_params(%{
          page: page,
          items: [id: [render: fn -> {Component, %{}} end]]
        })
      end

      msg = ~r":name parameter must be a string, got: "

      assert_raise ArgumentError, msg, fn ->
        NavBarComponent.normalize_params(%{
          page: page,
          items: [id: [name: nil, render: fn -> {Component, %{}} end]]
        })
      end

      msg = ":method parameter in item must contain value of :patch or :redirect, got: :invalid"

      assert_raise ArgumentError, msg, fn ->
        NavBarComponent.normalize_params(%{
          page: page,
          items: [id: [name: "name", render: fn -> {Component, %{}} end, method: :invalid]]
        })
      end

      msg = ":nav_param parameter must be an string or atom, got: 1"

      assert_raise ArgumentError, msg, fn ->
        NavBarComponent.normalize_params(%{
          nav_param: 1,
          page: page,
          items: [id: [name: "name", render: fn -> {Component, %{}} end]]
        })
      end

      msg = ~s|:extra_params must be a list of strings or atoms, got: [1]|

      assert_raise ArgumentError, msg, fn ->
        NavBarComponent.normalize_params(%{
          extra_params: [1],
          page: page,
          items: [id: [name: "name", render: fn -> {Component, %{}} end]]
        })
      end

      msg = ":extra_params must not contain the :nav_param field name \"tab\""

      assert_raise ArgumentError, msg, fn ->
        NavBarComponent.normalize_params(%{
          nav_param: "tab",
          extra_params: ["tab"],
          page: page,
          items: [id: [name: "name", render: fn -> {Component, %{}} end]]
        })
      end

      item_in = [name: "name", render: fn -> {Component, %{}} end]

      assert %{items: [{"id", item}], nav_param: nav_param, extra_params: []} =
               NavBarComponent.normalize_params(%{page: page, items: [id: item_in]})

      assert item[:name] == "name"
      assert item[:render]
      assert item[:method] == :patch
      assert nav_param == "nav"

      assert %{items: [{"id", ^item}]} =
               NavBarComponent.normalize_params(%{page: page, items: [{"id", item_in}]})
    end
  end
end
