
# EQ Slide Format (v1)

## ✅ Objective

Define the flat structure for **equation slides** (`type: "eq"`) where each `line` is followed by optional sidebar `sp*` items. This version removes all imperative APIs.

---

## ✅ Builder Pattern (flat form)

Use a single call with a flat array:

```ts
deckbuilder.s.eq(50, [
  { type: "math", content: "E = mc^2", showAt: 10 },
  { type: "spHeading", content: "Einstein's Law" },
  { type: "spText", content: "Energy-mass equivalence" },
  { type: "spImage", content: "/images/box.webp" },

  { type: "text", content: "Final line", showAt: 40 },
  { type: "spText", content: "Summary note" }
]);
```

Each non-`sp*` entry starts a new `line`. All following `sp*` entries (with no `showAt`) are attached to that line.

---

## ✅ Internal JSON Format (after build)

```json
{
  "type": "eq",
  "start": 0,
  "end": 50,
  "data": [
    {
      "name": "line",
      "type": "math",
      "content": "E = mc^2",
      "showAt": 10,
      "spItems": [
        { "type": "spHeading", "content": "Einstein's Law" },
        { "type": "spText", "content": "Energy-mass equivalence" },
        { "type": "spImage", "content": "/images/box.webp" }
      ]
    },
    {
      "name": "line",
      "type": "text",
      "content": "Final line",
      "showAt": 40,
      "spItems": [
        { "type": "spText", "content": "Summary note" }
      ]
    }
  ]
}
```

> Only `line` entries carry `showAt`. `sp*` items are attached automatically.

---

## ✅ Allowed `type` values

| For main lines    | `type`         |
|------------------|----------------|
| Line types       | `"text"`, `"math"`, `"heading"` |

| For sidebar items | `type`         |
|------------------|----------------|
| Sidebar types    | `"spText"`, `"spMath"`, `"spImage"`, `"spHeading"` |

---

## ✅ Timing Rules

* Only the `line` requires a `showAt` value
* All `sp*` items are attached to the most recent `line`
* If `sp*` has its own `showAt`, it is ignored

---

## ✅ Validation

```ts
import { zodSchemaV1 } from 'deckbuild';
zodSchemaV1.parse(deck); // deck includes flat EQ slide
```

---

## 🔒 Freeze Notice

This EQ pattern is frozen under `deck-v1`. Future changes (e.g., spItem timing or grouping) will be released in `deck-v2`.
````
