

# Backoffice1: Taleem Content Control System

## 1. Purpose

This app is a fully repurposed version of the original `node-hero` system. Its purpose is to serve as the **central backoffice** for managing syllabus data, uploading educational content (narration, presentations, images), and exporting structured outputs for the Taleem website. It is GUI-enabled but remains minimal — powered entirely by server-rendered EJS views with no frontend frameworks.

---

## 2. Design Philosophy

* **Single source of truth: Filesystem**

  * All critical data (syllabus, questions, decks, uploads) is stored in local files
* **Secondary database: SQLite**

  * Used for querying, indexing, and admin UI display only
* **No frontend frameworks**

  * Only EJS views rendered from the backend
  * No dynamic routing, no React/Svelte, no JS-driven state
* **Admin-centric**

  * No student-facing features
  * Designed purely for content creators and admins

---

## 3. Core Features

### 3.1 Syllabus Creation / Management

* Define syllabus using the hierarchy:

  ```
  Subject > Chapter > Topic > Question
  ```
* Create, edit, or delete:

  * Chapters
  * Topics
  * Individual questions (with ID/slug)
* Data is stored in:

  * `.js` files per syllabus object
  * SQLite (mirrored automatically for UI)

### 3.2 Content Uploading

Each **question** can be linked to:

* Narration: `.opus` audio files
* Presentation Decks: `.js` deck files
* Images: `.webp` static assets

Uploads are saved under a structured folder layout and linked by question ID.

### 3.3 Output Export

* A utility view/button allows export of:

  * Entire syllabus in JSON
  * All question metadata
  * Asset manifests
* Outputs are saved to `/out/` as ready-to-publish JSON files

### 3.4 Git / Remote Tools

* A utility section (or CLI option) can:

  * Push exported files to GitHub/GitLab
  * Optionally sync assets to cloud
* Git commands are run via:

  * `simple-git` in Node
  * OR shell wrapper (`child_process`)

---

## 4. File and Folder Structure

```
project-root/
├── data/
│   ├── syllabus/       # .js files representing syllabus objects
│   ├── questions/      # .js (or .json) files with question metadata
│   ├── decks/          # Deck presentation files (.js)
│   ├── images/         # Uploaded images (.webp)
│   ├── narration/      # Audio files (.opus)
│   └── out/            # Exported output files (JSON bundles)
├── db/
│   └── backoffice.db   # SQLite admin DB
├── views/              # EJS templates
├── routes/             # Express routes for UI + uploads
├── public/             # Static assets (CSS, etc.)
├── utils/              # File writers, parsers, git tools
├── app.js              # Express app entry
└── README.md
```

---

## 5. Admin Interface Features

All built in EJS:

* Syllabus Manager

  * Create/edit chapter/topic/question
* Upload Panel

  * Upload narration, decks, images linked to question
* Listing Views

  * Searchable syllabus index (SQLite)
* Export Panel

  * Export all data into `/data/out/`
* Git Utility

  * Push/export from inside panel (optional)

---

## 6. Next Steps

* [ ] Confirm folder layout + naming rules (slugs vs IDs)
* [ ] Build file parsers + SQLite sync logic
* [ ] Implement syllabus CRUD interface
* [ ] Add upload endpoints + link to questions
* [ ] Create export engine
* [ ] Add Git utility (simple-git or shell)

---

Let me know if you'd like this saved into a file or loaded into a code canvas.
