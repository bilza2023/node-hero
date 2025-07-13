Here's the updated and cleaned version of the **DeckBuilder API (v1)** doc reflecting the new `background` methods and removing the deprecated `setBackground`.

---

# ✅ DeckBuilder API (v1)

## 🎯 Objective

Provide a programmatic interface for generating valid `deck-v1` objects. A *deck* represents a full question unit in Taleem.Help — including slides, metadata, background, and other presentation details.

---

## ✅ Top-Level Format

Every deck must look like:

```ts
{
  version: "deck-v1",
  name: string,
  description?: string,
  tags?: string[],
  status?: "draft" | "ready" | "published" | "archived",
  createdAt?: ISODateString,
  editedAt?: ISODateString,
  background?: {
    backgroundColor?: string,
    backgroundImage?: string,
    backgroundImageOpacity?: number
  },
  deck: Slide[]
}
```

---

## ✅ 20 Canonical Slide Types

1. `titleSlide`
2. `titleAndSubtitle`
3. `bulletList`
4. `twoColumnText`
5. `imageSlide`
6. `imageWithTitle`
7. `imageWithCaption`
8. `imageLeftBulletsRight`
9. `imageRightBulletsLeft`
10. `table`
11. `statistic`
12. `donutChart`
13. `bigNumber`
14. `barChart`
15. `quoteSlide`
16. `quoteWithImage`
17. `cornerWordsSlide`
18. `contactSlide`
19. `eq`
20. `fillImage`

---

## ✅ Slide Construction Rules

### Timing

* `start`: injected by DeckBuilder from previous slide’s `end`
* `end`: must be defined explicitly per slide
* `showAt`: must satisfy `start ≤ showAt ≤ end`
* If `showAt` is omitted, it defaults to `start`

### Slide Format

Each slide has:

```ts
{
  type: string,
  start: number,
  end: number,
  data: Array<{
    name: string,
    content: string | number | string[],
    showAt: number
  }>
}
```

---

## ✅ EQ Slides (Flat Input Format)

Flat array structure using `type: "math" | "text" | "heading"` for main lines, and `sp*` types for sidebar items.

```ts
deckbuilder.s.eq(50, [
  { type: "math", content: "E = mc^2", showAt: 10 },
  { type: "spHeading", content: "Einstein's Law" },
  { type: "spText", content: "Energy-mass equivalence" },
  { type: "spImage", content: "/images/box.webp" }
]);
```

Transformed internally into:

```ts
{
  type: "eq",
  start: 0,
  end: 50,
  data: [
    {
      name: "line",
      type: "math",
      content: "E = mc^2",
      showAt: 10,
      spItems: [
        { type: "spHeading", content: "Einstein's Law" },
        { type: "spText", content: "Energy-mass equivalence" },
        { type: "spImage", content: "/images/box.webp" }
      ]
    }
  ]
}
```

---

## ✅ Builder API

### Add Slides

```ts
deckbuilder.s.titleSlide(10, [
  { name: "title", content: "Hello", showAt: 0 }
]);
```

### Set Metadata

```ts
deckbuilder.addDetails({
  name: "what_is_algebra",
  description: "Intro to Algebra",
  tags: ["math", "algebra"],
  status: "draft"
});
```

### Set Background

Use new granular background setters:

```ts
deckbuilder.setBackgroundImage("/images/taleem.webp");
deckbuilder.setBackgroundColor("#F3E5AB");
deckbuilder.setBackgroundOpacity(0.1);
```

---

## ✅ Finalize Deck

```ts
const deck = deckbuilder.build(); // returns validated deck-v1 JSON
```

---

## ✅ Validation

```ts
import { zodDeckV1 } from 'deckbuild';
zodDeckV1.parse(deck); // Throws on schema error
```

---

## ❌ Deprecated

The following method has been removed:

```ts
deckbuilder.setBackground(...) // ❌ DO NOT USE
```

Use the specific methods listed above.

---

## 🔒 Freeze Notice

This `deck-v1` format is locked. Any future additions (e.g., transitions, animations) will be released under `deck-v2`.

---

Ready to save as your official updated `api.md`?
