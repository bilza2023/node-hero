# Question Schema (v1)

This document defines the canonical `Question` table schema used in the Taleem file-first content system. It reflects the design decision that **each question is a standalone unit**, where the `deck` is primary and all metadata is auxiliary.

---

## ✅ Purpose

The schema supports a system where:

* **Deck files are the source of truth**
* **Questions are loaded into SQLite for querying and filtering**
* **Each question is identified by its file-based slug**

---

## ✅ Final Prisma Model

```prisma
model Question {
  id          Int      @id @default(autoincrement()) // internal index
  filename    String   @unique                      // canonical slug (e.g., "gold_eq_01")
  deck        Json                                 // parsed ZodDeckV1 object

  name        String                                // from .addDetails()
  description String
  tags        Json                                  // array of strings: ["physics", "eq"]
  status      String                                // draft, ready, published, archived
  createdAt   DateTime
  editedAt    DateTime
}
```

---

## ✅ Field Definitions

| Field         | Type     | Description                                                  |
| ------------- | -------- | ------------------------------------------------------------ |
| `id`          | Int      | Auto-incremented primary key                                 |
| `filename`    | String   | Unique file-safe slug (also used for audio paths, zips, etc) |
| `deck`        | Json     | Full parsed deck object (ZodDeckV1)                          |
| `name`        | String   | Human-readable question name from `addDetails()`             |
| `description` | String   | Short description for UI/context                             |
| `tags`        | Json     | Array of strings (stored as JSON)                            |
| `status`      | String   | One of: `draft`, `ready`, `published`, `archived`            |
| `createdAt`   | DateTime | ISO string timestamp                                         |
| `editedAt`    | DateTime | ISO string timestamp                                         |

---

## ✅ Path Conventions (Deterministic)

| Resource      | Path Format                       |
| ------------- | --------------------------------- |
| Deck File     | `/questions/{filename}.js`        |
| Audio File    | `/sounds/{filename}.opus`         |
| Meta Output   | `/meta/{filename}.json` (if used) |
| Bundle Export | `/bundles/{filename}.zip`         |

All resources are named based on `filename`, making the system fully deterministic.

---

## ✅ Usage Notes

* The `deck` field is central to all operations — filtering, bundling, previewing.
* `tags` are stored as JSON arrays to support SQLite compatibility.
* No image/audio paths are stored — they are inferred via filename.
* This schema assumes deck files are **immutable** — changes must happen via re-export.

---

## 🔒 Version Lock

This schema is **locked as `question-schema-v1`**. Any changes must be released under `question-schema-v2.md` with migration notes.
