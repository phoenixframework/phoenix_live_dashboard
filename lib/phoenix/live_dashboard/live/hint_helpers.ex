defmodule Phoenix.LiveDashboard.HintHelpers do
  @moduledoc false
  import Phoenix.HTML

  def hint(text) do
    ~E"""
      <div class="hint">
        <%= icon() %>
        <div class="hint-text"><%=text %></div>
      </div>
    """
  end

  defp icon() do
    ~E"""
      <svg class="hint-icon" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="44" height="44" fill="none"/>
      <rect x="19" y="10" width="6" height="5.76" rx="1" class="hint-icon-fill"/>
      <rect x="19" y="20" width="6" height="14" rx="1" class="hint-icon-fill"/>
      <circle cx="22" cy="22" r="20" class="hint-icon-stroke" stroke-width="4"/>
      </svg>
    """
  end
end
