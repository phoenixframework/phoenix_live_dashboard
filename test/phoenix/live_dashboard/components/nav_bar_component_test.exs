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
        <.live_component module={NavBarComponent} {assigns}>
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
end
