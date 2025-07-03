

# ✅ Node-Hero Debugging Doctrine

---

## 🔁 Problem 1: View-Service Drift

**Cause:** We wrongly routed nested views (like chapter forms inside `tcode/edit.ejs`) to the parent’s controller or service.
**Fix:** Nesting in the view does **not** mean nesting in the backend. Always route to the correct service.
**Instruction:** A chapter form must always submit to `chapterController → chapterService`, even if it's rendered inside a tcode page.

---

## 📑 Problem 2: Unverified View Contracts

**Cause:** We began writing views before locking field names, routes, or service shape.
**Fix:** Views must be the *last thing*. First define the full data contract, test it, then write the view.
**Instruction:** Before any `.ejs` file is touched, confirm: the controller accepts correct input, calls the service, and returns the expected data.

---

## ❌ Problem 3: Silent Failures

**Cause:** Missing logging and unstructured error handling made errors invisible and debugging painful.
**Fix:** Every controller and service must log its input and errors. Use `http-errors` to throw predictable, testable error objects.
**Instruction:** Log the route entry, data received, and any thrown error. Always `console.error()` with a clear tag and message.

---

## 🔀 Problem 4: Page Boundary Breach

**Cause:** When errors spill from one page to another, we lose control of the debugging context.
**Fix:** Every controller/view pair must be treated as its own *boundary*. Errors should be logged with a tag identifying the page.
**Instruction:** Every controller must start with `console.log('▶ Entered /admin/tcode/edit')` or similar — so logs show exactly where we are.

---

## 🧪 Final Protocol: System Flow Is Test-First, Not View-First

**Old thinking:**

```bash
npm run dev → open browser → hope it works
```

**New system:**

```bash
npm run test → ensure data contract → only then open view
```

**Instruction:** Views are trivial once the correct data is confirmed via tests. The job is not to “see” the page. The job is to **deliver correct data to the view**. Once that’s done, rendering is secondary.

---

From this point forward: **No view is written until the data contract is locked and verified with Jest.**

Ready to publish this as `SYSTEM_GUIDE.md`?
