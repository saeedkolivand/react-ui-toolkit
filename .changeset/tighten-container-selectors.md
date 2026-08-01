---
"@crosskit-ui/styles": patch
---

Stop container components restyling what a consumer puts inside them.

`data-part` is a shared namespace: **33 part names are used by more than one
component** — `label` by twelve, `item` by ten, `title` by eight. A loose
`[data-scope="x"] [data-part="y"]` rule therefore reaches any nested component
that happens to use the same part name.

Measured in Chromium, each composition against the identical tree rendered
loose:

|                                        |                                                |
| -------------------------------------- | ---------------------------------------------- |
| a `List` inside a `Card`               | header and footer took the Card's 16px padding |
| a `Descriptions` inside a `Card`       | header took 16px it does not have              |
| a `Statistic` inside a `Result`        | title repainted at weight 600, centred         |
| a `Steps` inside an `Alert`            | title, content and description resized         |
| a `Statistic` inside a `Skeleton.Node` | title took the placeholder's fill and radius   |
| a `List` inside an `Empty`             | footer gained a top margin and centred         |
| a `Result` inside a `Button`           | title and icon took the button's label rules   |

`Card`, `Alert`, `Tag`, `Button`, `Result`, `Empty` and `Skeleton` now reach
their own parts through child combinators or compound selectors. No component's
own rendering changes — only what its rules can reach.

The combinator alone, with no `[data-part="root"]` added to the scope. `Alert`
renders its dismiss control as a `Button` with its own part stamped on it, and
consumer attributes spread last — so the stamped name
_replaces_ `root` and every rule requiring it stops matching.

Import order is **not** a defence. It decides ties only, so a container with an
extra attribute on its root (`[data-scope="card"][data-size="md"] …`, three
attributes) outranks a child combinator (two) whatever order the files load in.
That is why `Card` reached into components defined in a later file.

(`Tag` and `Toast` write their part onto a raw `<button>`, so they never had a
`root` to lose.)
