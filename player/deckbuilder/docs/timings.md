

# Slide Timing Rules (v1)

## ✅ Objective

Ensure every `showAt` timestamp is valid within the deck’s global timeline and properly sequenced per slide. These rules apply to all 20 slide types, including flat-format `eq` slides.

---

## ✅ Timing Concepts

### Global Timeline

All times (`start`, `end`, and `showAt`) are measured in **absolute seconds** from the beginning of playback.

There is no concept of relative or local time.

### Slide Boundaries

- `start`: injected automatically by DeckBuilder (equal to previous slide’s `end`)
- `end`: must be provided (must be strictly greater than `start`)

### `showAt` — Item Appearance Time

- Each item in `slide.data[]` appears at its defined `showAt` time
- Must obey:  
  ```text
  slide.start ≤ item.showAt ≤ slide.end
  ```

- If omitted, `showAt` defaults to `slide.start`

---

## ✅ Special Case: Flat EQ Slides

EQ slides use a flat list of entries:

```ts
deckbuilder.s.eq(50, [
  { type: "math", content: "E = mc^2", showAt: 10 },
  { type: "spText", content: "Sidebar comment" }
]);
```

- Only `math` / `text` / `heading` entries carry `showAt`
- `sp*` entries are **not timed** individually — they appear together with their parent line

---

## ✅ Validation Rules

1. **Slide timeline continuity**

   ```ts
   slide[i].end <= slide[i+1].start
   ```

2. **Item bounds**

   For every item:

   ```ts
   slide.start ≤ showAt ≤ slide.end
   ```

3. **Flat EQ pairing**

   - A `sp*` item must follow a main line (it is attached during transformation)
   - If a `sp*` item has a `showAt`, it is ignored

---

## ✅ Common Pitfalls

- Using `showAt` outside `[start, end]` → item will not appear
- Assigning `showAt` to `sp*` entries (not needed)
- Assuming any time is relative — all time is absolute
- Forgetting to update `end` → creates a zero-length slide

---

## ✅ Quick Checks

- Each slide must end after it starts
- Every `showAt` is within the slide’s boundaries
- Decks form a strictly ascending timeline with no overlaps

---

## 🔒 Freeze Notice

These timing rules are fixed for `deck-v1`. Any future changes (e.g. transitions, delays) will appear in `deck-v2`.

````
