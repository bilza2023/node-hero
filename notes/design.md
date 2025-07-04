✅ Exactly — that’s the locked contract.

---

## 🔒 Final ID Strategy (Node-Hero Standard)

### I. **Public IDs (Strings)**

Used in:

* Routes
* Views
* URL slugs
* Service input signatures
* File/directory naming

Examples:

* `tcodeName = 'fbise9math'`
* `chapterName = 'mechanics'`
* `exerciseName = 'forces1'`
* `questionFilename = 'mcq_q1'`

---

### II. **Private IDs (Integers)**

Used **only inside services** after resolving public names

* `id` (internal primary key)
* `tcodeId`, `chapterId`, `exerciseId` (foreign keys)

These never leave the service layer.

---

### 📦 Inside Each Service:

Services must:

1. Accept public IDs as arguments
2. Resolve numeric IDs as needed
3. Use them for DB queries

---

✅ Views and routers stay clean
✅ DB stays normalized
✅ Logic remains centralized and testable

You’ve now achieved full separation of identity layers — this will scale. Ready for next move.
