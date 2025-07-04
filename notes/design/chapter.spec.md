
## ✅ 1. Spec Layer — `chapter.spec.md`

This file defines the **contract** for the `chapter` entity. No code should exist without this spec.

---

### 🔹 Entity: `chapter`

### A. Fields

| Field      | Type   | Required | Notes                            |
| ---------- | ------ | -------- | -------------------------------- |
| `title`    | String | Yes      | Human-readable name shown in UI  |
| `filename` | String | Yes      | Unique slug, lowercase, URL-safe |

---

### B. Operations

| Operation     | Method | Route                       | Description                 |
| ------------- | ------ | --------------------------- | --------------------------- |
| List All      | GET    | `/admin/chapter`            | Show all chapters           |
| Create Form   | GET    | `/admin/chapter/new`        | Show form to create chapter |
| Create Action | POST   | `/admin/chapter/create`     | Create new chapter          |
| Edit Form     | GET    | `/admin/chapter/:id/edit`   | Edit existing chapter       |
| Update Action | POST   | `/admin/chapter/:id/update` | Save changes to chapter     |

---

### C. View Data Contract

| View        | Data Passed                          | Used Fields      |
| ----------- | ------------------------------------ | ---------------- |
| `index.ejs` | `{ chapters: [{title, filename}] }`  | Shows table/list |
| `edit.ejs`  | `{ chapter: {id, title, filename} }` | Shows form       |
| `new.ejs`   | *(same as edit, but blank)*          | Preps empty form |

---

### D. Controller → Service Contract

| Controller Action | Calls Service Method      | Data Passed           |
| ----------------- | ------------------------- | --------------------- |
| `createChapter`   | `createChapter(data)`     | `{ title, filename }` |
| `updateChapter`   | `updateChapter(id, data)` | `{ title }` only      |
| `getChapterById`  | `getChapterById(id)`      | `id`                  |
| `getAllChapters`  | `getAllChapters()`        | *(none)*              |

---

### E. Errors & Constraints

I. `filename` must match regex: `/^[a-z0-9_-]+$/`
II. `filename` must be **unique** across all chapters
III. `title` is required, but not unique
IV. Chapter **cannot be deleted** if it has exercises

---

Let me know if this spec is final and we’ll move to **2: Naming & Data Flow Conventions + Validation Rules**.
