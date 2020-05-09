defmodule Phoenix.LiveDashboard.TargetNode do
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
    if is_different(node, module) && !dashboard_running?(node) do
      load(node, module)
    end
  end

  def is_different(node, module) do
    module.__info__(:md5) != :rpc.call(node, module, :__info__, [:md5])
  end

  def dashboard_running?(node) do
    rpc_call!(node, Process, :whereis, [Phoenix.LiveDashboard.DynamicSupervisor]) != nil
  end

  def os_mon(node) do
    rpc_call!(node, Application, :get_application, [:os_mon])
  end

  def rpc_call!(node, module, function, args) do
    case :rpc.call(node, module, function, args) do
      {:badrpc, reason} -> raise("Rpc call failed with #{inspect reason}")
      result -> result
    end
  end
end
