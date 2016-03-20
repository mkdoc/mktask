## Example

Inline code examples from the working example in [/doc/example](/doc/example).

The build file [mkdoc.js](/doc/example/mkdoc.js):

<? @source {javascript} ../example/mkdoc.js ?>

The input source file [source.md](/doc/example/source.md):

<? @source {markdown} ../example/source.md ?>

Include files [include.md](/doc/example/include.md) and [links.md](/doc/example/links.md):

<? @source {markdown} ../example/include.md ?>
<? @source {markdown} ../example/links.md ?>

Result:

<? @exec {markdown} cd doc/example && mk ?>
