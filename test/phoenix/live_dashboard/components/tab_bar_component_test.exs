defmodule Phoenix.LiveDashboard.Components.TabBarComponentTest do
  use ExUnit.Case, async: true

  import Phoenix.LiveViewTest

  alias Phoenix.LiveDashboard.TabBarComponent
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

  def render_tabs(opts) do
    opts =
      [
        tabs: [
          foo: [name: "Foo", method: :patch, render: {SimpleComponent, [text: "foo_text"]}],
          bar: [name: "Bar", method: :redirect, render: {SimpleComponent, [text: "bar_text"]}]
        ],
        page: %Phoenix.LiveDashboard.PageBuilder{
          node: Keyword.get(opts, :node, node()),
          route: Keyword.get(opts, :route, :foobaz),
          params: Keyword.get(opts, :params, %{})
        }
      ]
      |> Keyword.merge(opts)

    render_component(TabBarComponent, opts, router: Router)
  end

  describe "render" do
    test "renders first tab by default" do
      result = render_tabs([])

      assert result =~
               ~s|<a class="nav-link active" data-phx-link="patch" data-phx-link-state="push" href="/dashboard/nonode%40nohost/foobaz?tab=foo">Foo</a>|

      assert result =~
               ~s|<a class="nav-link" data-phx-link="redirect" data-phx-link-state="push" href="/dashboard/nonode%40nohost/foobaz?tab=bar">Bar</a>|

      assert result =~ ~s|<div>foo_text</div>|
    end

    test "renders given tab by params" do
      result = render_tabs(params: %{"tab" => "bar"})

      assert result =~ ~r|<a[^>]*class=\"nav-link\"[^>]*>Foo</a>|
      assert result =~ ~r|<a[^>]*class=\"nav-link active\"[^>]*>Bar</a>|
      assert result =~ ~s|<div>bar_text</div>|
    end
  end

  describe "normalize_params" do
    test "validates :tabs" do
      page = %Phoenix.LiveDashboard.PageBuilder{}

      assert {:error, msg} = TabBarComponent.normalize_params(%{page: page})
      assert msg == "expected :tabs parameter to be received"

      assert {:error, msg} = TabBarComponent.normalize_params(%{page: page, tabs: :invalid})
      assert msg == "expected :tabs parameter to be a list, received: :invalid"

      assert {:error, msg} = TabBarComponent.normalize_params(%{page: page, tabs: [:invalid]})

      assert msg ==
               "expected :tabs to be [{atom(), [name: string(), render: component()], received: :invalid"

      assert {:error, msg} = TabBarComponent.normalize_params(%{page: page, tabs: [id: []]})
      assert msg == "expected :render parameter to be received in tab: []"

      assert {:error, msg} =
               TabBarComponent.normalize_params(%{
                 page: page,
                 tabs: [id: [render: :invalid]]
               })

      assert msg ==
               "expected :render parameter in tab to be a component, received: [render: :invalid]"

      assert {:error, msg} =
               TabBarComponent.normalize_params(%{
                 page: page,
                 tabs: [id: [render: {Component, [:args]}]]
               })

      assert msg ==
               "expected :name parameter to be received in tab: [render: {Component, [:args]}]"

      assert {:error, msg} =
               TabBarComponent.normalize_params(%{
                 page: page,
                 tabs: [id: [name: "name", render: {Component, [:args]}, method: :invalid]]
               })

      assert msg ==
               "expected :method parameter in tab to be :patch or :redirect, received: :invalid"

      assert {:ok, %{tabs: [id: tab]}} =
               TabBarComponent.normalize_params(%{
                 page: page,
                 tabs: [id: [name: "name", render: {Component, [:args]}]]
               })

      assert tab[:name] == "name"
      assert tab[:render] == {Component, [:args]}
      assert tab[:method] == :patch

      assert {:ok, %{tabs: [id: tab]}} =
               TabBarComponent.normalize_params(%{
                 page: page,
                 tabs: [id: [name: "name", method: :redirect, render: fn -> nil end]]
               })

      assert tab[:name] == "name"
      assert tab[:render]
      assert tab[:method] == :redirect
    end
  end
end
