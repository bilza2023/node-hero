# Taleem Backoffice System — Overview

## Purpose

This system is an admin-only backoffice for managing syllabus data (`tcode`), chapters, exercises, and questions. It is file-first and designed to export clean structured data for public use. There is no user-facing frontend. The system is intended for internal editors only.

## Architecture Philosophy

- File-first: All content is stored in `.js` or `.json` files.
- SQLite is used only as a local utility mirror for search/admin speed. No relationships or constraints.
- Backend-rendered HTML pages using EJS. No frontend frameworks.
- Each action (create/edit) has its own dedicated page with one form.
- All navigation is section-based (tcode hub, chapter view, etc.)
- Flash messages handle success/failure. No JS alerts or toasts.

## Core Resources

1. `tcode` (syllabus)
2. `chapter`
3. `exercise`
4. `question`

Each resource supports create and edit, leading to 8 total forms.

## Admin Page Summary

- 8 Forms (Create + Edit × 4 resources)
- 1 Tcodes Home Page (lists all syllabi)
- 1 Tcode Tree View Page (view full structure of one syllabus)

Total: **10 clean admin pages**

## Workflow Principles

- One page = one job = one file write
- Tree view acts as the workspace hub
- No dynamic JS form logic
- Deletes are buttons, not full forms
