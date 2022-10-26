# Used by "mix format"
locals_without_parens = [
  embed_templates: 1,
  embed_templates: 2,
]

[
  import_deps: [:phoenix],
  inputs: ["*.{ex,exs}", "{config,lib,test}/**/*.{ex,exs}"],
  locals_without_parens: locals_without_parens,
  export: [locals_without_parens: locals_without_parens]
]
