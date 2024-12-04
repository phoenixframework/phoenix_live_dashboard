# Used by "mix format"
locals_without_parens = [
  embed_templates: 1,
  embed_templates: 2
]

[
  import_deps: [:phoenix],
  plugins: [Phoenix.LiveView.HTMLFormatter],
  # TODO: remove when we drop support for LV 0.19/0.20
  migrate_eex_to_curly_interpolation: false,
  inputs: ["*.{ex,exs}", "{config,lib,test}/**/*.{ex,exs}"],
  locals_without_parens: locals_without_parens,
  export: [locals_without_parens: locals_without_parens]
]
