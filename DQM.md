

## 🔖 SPEC DOC: “Decoupled Questions Model (DQM)”

**Status:** Proposed
**Author:** System Architecture Team
**Date:** \[To be set]
**Tagline:** *“Questions are content. Exercises are playlists.”*

---

### ✅ 1. GOAL

Transition from a parent-bound question model to a **decoupled system** where:

* A **Question** is a standalone content unit
* An **Exercise** is a flexible container of `questionIds[]`
* The **syllabus becomes a view**, not a binding

---

### ✅ 2. WHY THIS MATTERS (Philosophical Gains)

#### I. **Content is Content — Not Structure**

> We stop pretending a question *lives* in an exercise.
> Instead, we store questions independently like a question bank.
> This removes structural dependencies from pure content.

#### II. **Exercises Become Playlists**

> Exercises are now “named groupings” of questions.
> You can reuse questions in multiple exercises, reorder them freely, or clone an exercise with different sequencing.

#### III. **Reusability + Refactoring**

> A single algebra question can now appear in:
>
> * Chapter 1’s intro
> * Chapter 5’s review
> * A diagnostic test
> * A spaced repetition session

No duplication. Just different references.

#### IV. **Future Power: Smart Composition**

> With decoupled design, we can later:
>
> * Auto-generate exercises from tags, difficulty, topic
> * Merge exercises on the fly
> * Build adaptive sets (“give 5 random geometry questions”)

---

### ✅ 3. WHAT WILL CHANGE

#### BEFORE

* Each `Question` contains `exerciseId`
* Questions are *owned* by one exercise
* Exercises are implicitly defined by their questions

#### AFTER

* `Question` is independent
* `Exercise` contains an ordered list: `questionIds[]`
* Order, grouping, and identity of exercises are stored separately

---

### ✅ 4. BENEFITS SUMMARY

| Feature                       | Old System           | New (DQM) Model              |
| ----------------------------- | -------------------- | ---------------------------- |
| Question Reuse                | ❌ Not possible       | ✅ Multiple exercises allowed |
| Content Stored Independently  | ❌ Bound to structure | ✅ Fully decoupled            |
| Syllabus = Layout + Content   | ❌ Mixed together     | ✅ Separated cleanly          |
| Playlists / Dynamic Exercises | ❌ Hard to build      | ✅ Natural design fit         |
| “Question Bank” Architecture  | ❌ Incoherent         | ✅ Canonical                  |
| Future Adaptive Features      | ❌ Very limited       | ✅ Fully possible             |

---

### ✅ 5. NEXT STEPS (Post-Lock)

* [ ] Rename this initiative: “Decoupled Questions Model (DQM)”?
* [ ] Schedule refactor window (after 10 presentations or 1 week)
* [ ] Map service/db changes
* [ ] Identify migration path: which models change, which stay

---
Here is a concise `.md` version of the **execution plan** for the SPEC DOC: “Decoupled Questions Model (DQM)”.

---

````markdown
# ✅ Execution Plan: Decoupled Questions Model (DQM)

This plan finalizes the move away from SQLite and defines a fully file-based content architecture for questions and syllabus.

---

## 🧠 Core Principles

- **No database**: All content and structure live in the filesystem.
- **Questions = Files**: Each question is a JSON file in a folder.
- **Syllabus = Object**: A single JS/JSON object defines the structure and links.

---

## 🔁 Responsibilities

| Layer      | Role                                 |
|------------|--------------------------------------|
| Syllabus   | Maps structure to question filenames |
| Question   | Self-contained content unit (JSON)   |
| Exercise   | Playlist of question filenames       |

---

## 📌 Editing Flow

- To **add a question to an exercise**, append its filename to:
  ```js
  exercise.questions = ["filename1", "filename2"]
````

* The question file must exist in `/content/questions/`.

---

## ✅ Enforcement Rules

1. Filenames must be unique within the questions folder.
2. No `exerciseId`, `tcodeId`, or chapter reference in the question file.
3. The only linkage is: syllabus → question filename.
4. No DB or dynamic storage involved.

---

## 🛠 Future Extensions

* Add UI to edit `exercise.questions[]`
* Add validator to check broken references
* Add CLI to sync or bulk-create content

```

---

Let me know when you're ready for structure layer or admin tool design.
```
