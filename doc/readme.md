# Task Runner

<? @include readme/badges.md ?>

> Run build tasks

Runs named task functions that return streams, arrays of deferred task functions or invoke the callback function.

<? @include {=readme} install.md ?>

***
<!-- @toc -->
***

## Usage

Create a `mkdoc.js` task file like this one ([source file](/mkdoc.js)):

<? @source {javascript=s/\.\/index/mktask/gm} ../mkdoc.js ?>

Note that you **should not install** the `mktask` dependency, it is resolved by the command line program.

<? @include {=readme} example.md guide.md sample.md help.md ?>

<? @exec mkapi *.js --title=API --level=2 ?>
<? @include {=readme} license.md links.md ?>
