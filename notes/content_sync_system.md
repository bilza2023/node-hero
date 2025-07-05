# Content Sync System (Canonical Design)

## Overview

This document describes the final architecture for managing syllabus and question content in the Taleem system. The goal is to separate responsibilities cleanly between backend and frontend, while supporting easy collaboration, safe editing, and zero-conflict deployments.

---

## Canonical Structure

### ✅ Backend (Node-Hero)

* **Owns all syllabus and question content**
* Central place for:

  * Creating syllabus (Tcode, Chapters, Exercises)
  * Managing questions
  * Storing deckbuilder content (editable source format)
  * Converting to JSON decks for frontend
* Acts as the **single source of truth**

### ✅ Frontend (SvelteKit + SQLite)

* Fully read-only
* Pulls already-built `question.content` (deck JSON)
* Never sees or parses deckbuilder format
* Uses local SQLite `dev.db` copied from backend

---

## Data Model

### Question Table (in backend SQLite DB)

| Field        | Purpose                           |
| ------------ | --------------------------------- |
| `filename`   | Unique identifier                 |
| `title`      | Display name for question         |
| `deckCode`   | Raw deckbuilder format JS code    |
| `content`    | Final Player-compatible JSON deck |
| `type`       | (e.g. `slide`)                    |
| `exerciseId` | FK to Exercise                    |

### Flow

1. Author or AI generates `deckCode`
2. Node-Hero runs `.build()` to produce `content` (JSON)
3. Both `deckCode` and `content` are saved in the DB
4. Frontend copies DB (via FileZilla or sync script)
5. Frontend Player reads `content` field only

---

## Why This Works

### 🔁 Collaboration Friendly

* Editors or AI can generate JS files (deckCode)
* Files are easy to pass around and edit
* Changes don’t require DB dumps or migrations

### 🔒 Safety + Separation

* Backend holds raw formats + compilation logic
* Frontend is display-only, no security risk

### 🔧 Portability

* Decks can be rebuilt anytime from `deckCode`
* DB content can be regenerated if corrupted

---

## Final Rule

> **Frontend sees only `question.content` (built JSON).**
> **Backend owns both `deckCode` and `content`.**

The system is now stable, extensible, and safe for both team use and scale.
