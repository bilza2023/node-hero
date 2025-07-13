
# DeckBuilder Meta Format (v1)

This document defines the structure and purpose of the `meta-v1` object used for narration timings and image references.

---

## ✅ Purpose

The meta object supports:

* **Label-based slide lookup**
* **Precise narration item control**
* **Tracking associated images per timing segment**

---

## ✅ Format: meta-v1

```ts
{
  version: "meta-v1",
  entries: [
    {
      label: "slide_key_taxreport",
      end: 30,
      items: [0, 1, 2],
      images: ["/images/chart.png"]
    },
    {
      label: "big_result",
      end: 60,
      items: [5, 6]
    }
  ]
}
```

---

## ✅ Fields

| Field    | Type      | Required | Description                             |
| -------- | --------- | -------- | --------------------------------------- |
| `label`  | string    | ✅        | Unique ID for UI/navigation             |
| `end`    | number    | ✅        | Global time at which this block ends    |
| `items`  | number\[] | ✅        | Flat list of showAt times used in slide |
| `images` | string\[] | ❌        | Optional: images linked to this segment |

---

## ✅ Schema Definition (Zod)

```ts
const metaEntrySchema = z.object({
  label: z.string(),
  end: z.number(),
  items: z.array(z.number()),
  images: z.array(z.string()).optional()
});

export const metaV1Schema = z.object({
  version: z.literal("meta-v1"),
  entries: z.array(metaEntrySchema)
});
```

---

## 🧠 Design Principles

* Each `label` refers to a narratable unit
* `items[]` must align with `showAt` values across slides
* `images[]` allows declarative sync with gallery or media

---

## 🔒 Freeze Notice

The meta format is frozen in `meta-v1`. Only flat arrays of labeled blocks are supported.
Plugin-based meta extensions (v2) may be added in future via `version` switch.
