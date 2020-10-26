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
      ~L"""
      <div><%= @text %></div>
      """
    end
  end

  def render_items(opts) do
    opts =
      [
        items: [
          foo: [name: "Foo", method: :patch, render: {SimpleComponent, %{text: "foo_text"}}],
          bar: [name: "Bar", method: :redirect, render: {SimpleComponent, %{text: "bar_text"}}]
        ],
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
  end

  describe "normalize_params" do
    test "validates :items" do
      page = %Phoenix.LiveDashboard.PageBuilder{}

      assert_raise ArgumentError, "expected :items parameter to be received", fn ->
        NavBarComponent.normalize_params(%{page: page})
      end

      msg = "expected :items parameter to be a list, received: :invalid"

      assert_raise ArgumentError, msg, fn ->
        NavBarComponent.normalize_params(%{page: page, items: :invalid})
      end

      msg =
        "expected :items to be [{atom(), [name: string(), render: component()], received: :invalid"

      assert_raise ArgumentError, msg, fn ->
        NavBarComponent.normalize_params(%{page: page, items: [:invalid]})
      end

      msg = "expected :render parameter to be received in item: []"

      assert_raise ArgumentError, msg, fn ->
        NavBarComponent.normalize_params(%{page: page, items: [id: []]})
      end

      assert msg =
               "expected :render parameter in item to be a component, received: [render: :invalid]"

      assert_raise ArgumentError, msg, fn ->
        NavBarComponent.normalize_params(%{
          page: page,
          items: [id: [render: :invalid]]
        })
      end

      msg = "expected :name parameter to be received in item: [render: {Component, %{}}]"

      assert_raise ArgumentError, msg, fn ->
        NavBarComponent.normalize_params(%{
          page: page,
          items: [id: [render: {Component, %{}}]]
        })
      end

      msg = "expected :method parameter in item to be :patch or :redirect, received: :invalid"

      assert_raise ArgumentError, msg, fn ->
        NavBarComponent.normalize_params(%{
          page: page,
          items: [id: [name: "name", render: {Component, %{}}, method: :invalid]]
        })
      end

      assert %{items: [id: item]} =
               NavBarComponent.normalize_params(%{
                 page: page,
                 items: [id: [name: "name", render: {Component, %{}}]]
               })

      assert item[:name] == "name"
      assert item[:render] == {Component, %{}}
      assert item[:method] == :patch

      assert %{items: [id: item]} =
               NavBarComponent.normalize_params(%{
                 page: page,
                 items: [id: [name: "name", method: :redirect, render: fn -> nil end]]
               })

      assert item[:name] == "name"
      assert item[:render]
      assert item[:method] == :redirect
    end
  end
end
