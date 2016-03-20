# Source

Example for the mk(1) program supplied by [mkdoc][].

A paragraph of markdown text followed by an include processing instruction.

<? @include include.md ?>

Followed by some more markdown content and the result of executing a shell command:

<? @exec whoami ?>

Finally include the link definition file.

<? @include links.md ?>
