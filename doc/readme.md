# Task Runner

<? @include readme/badges.md ?>

> Run build tasks

Runs named task functions that return streams, arrays of deferred task functions or invoke the callback function.

<? @include {=readme} install.md ?>

## Usage

Create a task file like this one ([source file](/mkdoc.js)):

<? @source {javascript=s/\.\/index/mktask/gm} ../mkdoc.js ?>

And build README.md using:

```shell
mk
```

Or more explicitly:

```shell
mk readme
```

<? @include {=readme} guide.md ?>

<? @exec mkapi *.js --title=API --level=2 ?>
<? @include {=readme} license.md links.md ?>
