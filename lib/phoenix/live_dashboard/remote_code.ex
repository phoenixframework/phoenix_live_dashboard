defmodule Phoenix.LiveDashboard.RemoteCode do
  @moduledoc false

  def ensure_loaded(node, module) do
    case :rpc.call(node, Code, :ensure_loaded, [module]) do
      {:module, _} -> maybe_replace(node, module)
      {:error, :nofile} -> load(node, module)
    end
  end

  def load(node, module) do
    {_module, binary, filename} = :code.get_object_code(module)
    :rpc.call(node, :code, :load_binary, [module, filename, binary])
  end

  def maybe_replace(node, module) do
    if is_different(node, module) && !has_live_dashboard(node) do
      load(node, module)
    end
  end

  def is_different(node, module) do
    module.__info__(:md5) != :rpc.call(node, module, :__info__, [:md5])
  end

  def has_live_dashboard(node) do
    case :rpc.call(node, Code, :ensure_loaded, [Phoenix.LiveDashboard]) do
      {:module, _} -> true
      {:error, :nofile} -> false
    end
  end
end
