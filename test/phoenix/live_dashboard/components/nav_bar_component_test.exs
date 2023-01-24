defmodule Phoenix.LiveDashboard.Components.NavBarComponentTest do
  use ExUnit.Case, async: true

  use Phoenix.Component
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

  def render_items(assigns) do
    assigns =
      [
        id: :id,
        nav_param: "nav",
        style: :pills,
        extra_params: [],
        page: %Phoenix.LiveDashboard.PageBuilder{
          node: Keyword.get(assigns, :node, node()),
          route: Keyword.get(assigns, :route, :foobaz),
          params: Keyword.get(assigns, :params, %{})
        }
      ]
      |> Keyword.merge(assigns)

    render_component(
      fn assigns ->
        ~H"""
        <.live_component module={NavBarComponent} {assigns} >
          <:item name="Foo" method="patch">
            <span>foo_text</span>
          </:item>
          <:item name="Bar" method="redirect">
            <span>bar_text</span>
          </:item>
        </.live_component>
        """
      end,
      assigns,
      router: Router
    )
  end

  describe "render" do
    test "renders first item by default" do
      result = render_items([])

      assert result =~
               ~r|<a href="/dashboard/foobaz\?nav=Foo" data-phx-link="patch" data-phx-link-state="push" class="nav-link active">[\r\n\s]*Foo[\r\n\s]*</a>|

      assert result =~
               ~r|<a href="/dashboard/foobaz\?nav=Bar" class="nav-link">[\r\n\s]*Bar[\r\n\s]*</a>|

      assert result =~ ~s|<span>foo_text</span>|
    end

    test "renders given item by params" do
      result = render_items(params: %{"nav" => "Bar"})

      assert result =~ ~r|<a[^>]*class="nav-link"[^>]*>[\r\n\s]*Foo[\r\n\s]*</a>|
      assert result =~ ~r|<a[^>]*class="nav-link active"[^>]*>[\r\n\s]*Bar[\r\n\s]*</a>|
      assert result =~ ~s|<span>bar_text</span>|
    end

    test "renders a custom nav parameter" do
      result = render_items(nav_param: "tab", params: %{"tab" => "Bar"})

      assert result =~
               ~r|<a href="/dashboard/foobaz\?tab=Foo" data-phx-link="patch" data-phx-link-state="push" class="nav-link">[\r\n\s]*Foo[\r\n\s]*</a>|

      assert result =~
               ~r|<a href="/dashboard/foobaz\?tab=Bar" class="nav-link active">[\r\n\s]*Bar[\r\n\s]*</a>|
    end

    test "renders nav bar keeping extra params" do
      result_without_extra = render_items(params: %{"nav" => "Bar", "sort_by" => "field"})

      refute result_without_extra =~ "sort_by=field"

      result =
        render_items(
          params: %{"nav" => "bar", "sort_by" => "field", "search" => "baz"},
          extra_params: ["sort_by"]
        )

      assert result =~ ~s|href="/dashboard/foobaz?nav=Foo&amp;sort_by=field"|
      assert result =~ ~s|href="/dashboard/foobaz?nav=Bar&amp;sort_by=field"|

      refute result =~ "search=baz"
    end
  end

  # describe "normalize_params" do
  #   test "validates :items" do
  #     page = %Phoenix.LiveDashboard.PageBuilder{}

  #     assert_raise ArgumentError, "the :items parameter is expected in nav bar component", fn ->
  #       NavBarComponent.normalize_params(%{page: page})
  #     end

  #     msg = ":items parameter must be a list, got: :invalid"

  #     assert_raise ArgumentError, msg, fn ->
  #       NavBarComponent.normalize_params(%{page: page, items: :invalid})
  #     end

  #     msg = ":items must be [{string() | atom(), [name: string(), render: fun()], got: :invalid"

  #     assert_raise ArgumentError, msg, fn ->
  #       NavBarComponent.normalize_params(%{page: page, items: [:invalid]})
  #     end

  #     msg = ":render parameter must be in item: []"

  #     assert_raise ArgumentError, msg, fn ->
  #       NavBarComponent.normalize_params(%{page: page, items: [id: []]})
  #     end

  #     assert msg =
  #              ":render parameter in item must be a function that returns a component, got: [render: :invalid]"

  #     assert_raise ArgumentError, msg, fn ->
  #       NavBarComponent.normalize_params(%{
  #         page: page,
  #         items: [id: [render: :invalid]]
  #       })
  #     end

  #     msg = ~r":name parameter must be in item: "

  #     assert_raise ArgumentError, msg, fn ->
  #       NavBarComponent.normalize_params(%{
  #         page: page,
  #         items: [id: [render: fn -> {Component, %{}} end]]
  #       })
  #     end

  #     msg = ~r":name parameter must be a string, got: "

  #     assert_raise ArgumentError, msg, fn ->
  #       NavBarComponent.normalize_params(%{
  #         page: page,
  #         items: [id: [name: nil, render: fn -> {Component, %{}} end]]
  #       })
  #     end

  #     msg = ":method parameter in item must contain value of :patch or :redirect, got: :invalid"

  #     assert_raise ArgumentError, msg, fn ->
  #       NavBarComponent.normalize_params(%{
  #         page: page,
  #         items: [id: [name: "name", render: fn -> {Component, %{}} end, method: :invalid]]
  #       })
  #     end

  #     msg = ":nav_param parameter must be an string or atom, got: 1"

  #     assert_raise ArgumentError, msg, fn ->
  #       NavBarComponent.normalize_params(%{
  #         nav_param: 1,
  #         page: page,
  #         items: [id: [name: "name", render: fn -> {Component, %{}} end]]
  #       })
  #     end

  #     msg = ~s|:extra_params must be a list of strings or atoms, got: [1]|

  #     assert_raise ArgumentError, msg, fn ->
  #       NavBarComponent.normalize_params(%{
  #         extra_params: [1],
  #         page: page,
  #         items: [id: [name: "name", render: fn -> {Component, %{}} end]]
  #       })
  #     end

  #     msg = ":extra_params must not contain the :nav_param field name \"tab\""

  #     assert_raise ArgumentError, msg, fn ->
  #       NavBarComponent.normalize_params(%{
  #         nav_param: "tab",
  #         extra_params: ["tab"],
  #         page: page,
  #         items: [id: [name: "name", render: fn -> {Component, %{}} end]]
  #       })
  #     end

  #     item_in = [name: "name", render: fn -> {Component, %{}} end]

  #     assert %{items: [{"id", item}], nav_param: nav_param, extra_params: []} =
  #              NavBarComponent.normalize_params(%{page: page, items: [id: item_in]})

  #     assert item[:name] == "name"
  #     assert item[:render]
  #     assert item[:method] == :patch
  #     assert nav_param == "nav"

  #     assert %{items: [{"id", ^item}]} =
  #              NavBarComponent.normalize_params(%{page: page, items: [{"id", item_in}]})
  #   end
  # end
end
