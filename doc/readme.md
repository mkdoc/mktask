# Task Runner

<? @include readme/badges.md ?>

> Run build tasks

Runs named task functions that return streams, arrays of deferred task functions or invoke the callback function.

<? @include {=readme} install.md ?>

## Usage

Create a `mkdoc.js` task file like this one ([source file](/mkdoc.js)):

<? @source {javascript=s/\.\/index/mktask/gm} ../mkdoc.js ?>

Then you can build all tasks using:

```shell
mk
```

Or specific tasks:

```shell
mk readme
```

To see a list of the tasks use:

```shell
mk --tasks
```

<? @include {=readme} guide.md ?>

<? @exec mkapi *.js --title=API --level=2 ?>
<? @include {=readme} license.md links.md ?>
