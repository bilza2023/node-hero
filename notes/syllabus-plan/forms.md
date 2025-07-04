# Admin Form Specifications

Each form has: purpose, required inputs, optional inputs, and post-action behavior.

---

## 1. Create Tcode

**Purpose**: Start a new syllabus  
**Inputs**:

- `tcode_id` (required, unique)
- `title` (required)
- `subject_code` (optional)  
  **Success**: Write new `tcode.js`, redirect to Tree View with success flash  
  **Failure**: Show error flash on same page

---

## 2. Edit Tcode

**Purpose**: Update metadata of existing syllabus  
**Inputs**:

- `title`
- `subject_code`  
  **Success**: Update file, redirect to Tree View  
  **Failure**: Show error flash

---

## 3. Create Chapter

**Purpose**: Add chapter to given tcode  
**Inputs**:

- `chapter_id` (required, unique within tcode)
- `title` (required)
- `order` (optional)  
  **Success**: Append to `chapters[]` in `tcode.js`, redirect to Tree View  
  **Failure**: Flash error, e.g. duplicate ID

---

## 4. Edit Chapter

**Purpose**: Update chapter info  
**Inputs**:

- `title`
- `order`  
  **Success**: Update chapter in file  
  **Failure**: Flash message

---

## 5. Create Exercise

**Purpose**: Add exercise to a chapter  
**Inputs**:

- `exercise_id` (required)
- `title` (required)
- `order` (optional)  
  **Success**: Append to `exercises[]` under target chapter  
  **Failure**: Flash message

---

## 6. Edit Exercise

Same structure as Chapter Edit  
Fields: `title`, `order`

---

## 7. Create Question

**Purpose**: Add a new question entry  
**Inputs**:

- `question.filename` (required, unique in subject)
- `text` (optional preview or name)  
  **Success**: Append to exercise's `questions[]` and create new file under `/questions/`  
  **Failure**: Duplicate filename, missing parent → flash error

---

## 8. Edit Question

**Inputs**:

- `text`, `notes`, etc.
- Does not modify filename  
  **Success**: Update fields in file  
  **Failure**: Flash error
