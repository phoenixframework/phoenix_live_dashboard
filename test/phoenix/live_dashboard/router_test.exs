defmodule Phoenix.LiveDashboard.RouterTest do
  use ExUnit.Case, async: true

  alias Phoenix.LiveDashboard.Router

  test "sets options" do
    assert Router.__options__([]) == [
             session: {Phoenix.LiveDashboard.Router, :__session__, [nil, nil, nil]},
             layout: {Phoenix.LiveDashboard.LayoutView, :dash},
             as: :live_dashboard
           ]
  end

  test "normalizes metrics option" do
    assert Router.__options__(metrics: Foo)[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__, [{Foo, :metrics}, nil, nil]}

    assert Router.__options__(metrics: {Foo, :bar})[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__, [{Foo, :bar}, nil, nil]}

    assert_raise ArgumentError, fn ->
      Router.__options__(metrics: [])
    end
  end

  test "accepts env_keys option" do
    assert Router.__options__(env_keys: ["USER", "ROOTDIR"])[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__, [nil, ["USER", "ROOTDIR"], nil]}

    assert_raise ArgumentError, fn ->
      Router.__options__(env_keys: "FOO")
    end
  end
end
