# Admin Routes Plan

## Tcode Routes

- GET  `/syllabus`                  → Tcodes Home Page (list all)
- GET  `/syllabus/new`              → Create Tcode Form
- POST `/syllabus/new`              → Submit Tcode creation
- GET  `/syllabus/:id/edit`         → Edit Tcode Form
- POST `/syllabus/:id/edit`         → Submit Tcode edit
- GET  `/syllabus/:id`              → Tcode Tree View Page

## Chapter Routes

- GET  `/syllabus/:id/chapter/new`          → Create Chapter Form
- POST `/syllabus/:id/chapter/new`          → Submit Chapter creation
- GET  `/syllabus/:id/chapter/:cid/edit`    → Edit Chapter Form
- POST `/syllabus/:id/chapter/:cid/edit`    → Submit Chapter edit

## Exercise Routes

- GET  `/syllabus/:id/chapter/:cid/exercise/new`        → Create Exercise Form
- POST `/syllabus/:id/chapter/:cid/exercise/new`        → Submit Exercise creation
- GET  `/syllabus/:id/chapter/:cid/exercise/:eid/edit`  → Edit Exercise Form
- POST `/syllabus/:id/chapter/:cid/exercise/:eid/edit`  → Submit Exercise edit

## Question Routes

- GET  `/syllabus/:id/question/new`           → Create Question Form
- POST `/syllabus/:id/question/new`           → Submit Question creation
- GET  `/syllabus/:id/question/:qid/edit`     → Edit Question Form
- POST `/syllabus/:id/question/:qid/edit`     → Submit Question edit

## Delete Actions (No Forms)

Handled via buttons on edit pages:

- POST `/syllabus/:id/delete`
- POST `/syllabus/:id/chapter/:cid/delete`
- POST `/syllabus/:id/chapter/:cid/exercise/:eid/delete`
- POST `/syllabus/:id/question/:qid/delete`

## Navigation Notes

- All edit pages should link back to Tree View  
- Tree View links to all “add” forms  
- Tcodes home links to Tree View
