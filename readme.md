## Node-Hero — Project Scope Document

### 🧭 Purpose

Node-Hero is a monolithic, server-rendered admin app designed for **offline-first** data operations. It uses only proven patterns from classic frameworks (like Laravel or Rails), with no frontend frameworks and minimal dependencies. It is built for clarity, durability, and repeatable internal workflows.

---

### 🔧 Architecture Overview

* **Monolithic App**: Single Express server handling all logic and rendering
* **Server-rendered HTML**: EJS or similar; no React/Svelte
* **Local-first**: SQLite and file system — runs offline without cloud services
* **Prisma + SQLite**: All data flows into SQLite first — this is the single source of truth
* **Files and JSON Backups**: DB exports, file uploads, and archival stored separately for backup/versioning

---

### 📐 System Principles

1. **No Frontend Frameworks**

   * Use HTML templates and optional vanilla JS only
   * Inspired by Laravel/Rails classic views

2. **State = DB**

   * All application state is persisted in SQLite
   * No in-memory or frontend state handling unless absolutely required

3. **Service Layer = Logic Only**

   * Each service handles data, validation, and DB writes/reads
   * Services never handle routing or rendering
   * Controllers are responsible for calling services and routing users

4. **Standalone Pages**

   * Each page or form is independently operable
   * Pages do not rely on upstream context
   * All context (e.g., selected chapter/exercise) is either selected in-page or inferred from DB via ID

---

### 📦 Current Functional Areas (Scope-Defined)

* Syllabus tree viewer and editor
* Create/edit questions
* Image upload + gallery
* Form creation and editing
* Basic dashboard management (via DB rows)

---

### 🧱 Accepted Patterns

* Pure service-first flow (pages call services → services update DB)
* Views are dumb: no logic, no decision-making
* All user actions translate to deterministic, isolated DB updates

---

### ❌ Excluded From Scope

* No React/Svelte
* No live syncing or websockets
* No dynamic frontend state frameworks
* No external services assumed (e.g., S3, Firebase)

---

### 🔒 Locked Assumptions

* DB is the single source of truth
* Pages never pass logic context to each other
* Services are pure and stateless
* Views can be re-rendered from DB at any point without confusion

---

> This scope must remain fixed. All features and modules must respect these boundaries.
> Future expansions must be documented and approved before breaking this structure.


Core Modules in the App

Syllabus Module

Data Pulling Module

Data Uploading Module

Local Data Management Module