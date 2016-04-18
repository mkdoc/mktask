### Task Arguments

Task functions are automatically exposed the parsed arguments object via `this.args` such that `mk readme --env devel` would result in the readme task being able to access the `env` option using `this.args.options.env`.

Flags are available in `this.args.flags` such that `mk readme -v` yields `true` for `this.args.flags.v`.

Note that some command line arguments are handled by the `mk` program you should take care that the names do not conflict.

For detailed information on the `args` object see the [argparse library][argparse].
