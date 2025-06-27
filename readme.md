# node-hero

**node-hero** is a full-featured starter template for Node.js apps — simple, stable, and complete. Built with Express, EJS, Prisma, and SQLite, it provides everything a real-world web backend needs, out of the box.
--->Testing ... not read--work in pregress
---

## 🔧 Features

* ✅ Login system with JWT + bcrypt
* ✅ Role-based access control (admin/user)
* ✅ File upload (PDFs, DOCs, ZIPs)
* ✅ Image upload with secure fetch + token
* ✅ SQLite-backed comments system
* ✅ Simple gallery page to view uploaded images
* ✅ Dark theme, mobile-responsive EJS views
* ✅ Internal `default_table` concept (planned)
* ✅ No front-end build step

---

## 📁 Folder Structure

```
node-hero/
├── app.js
├── .env
├── config/           # JWT, multer, upload paths
├── controllers/      # Auth, upload logic
├── data/             # (legacy) JSON-based data
├── middleware/       # auth.js, role.js
├── routes/           # auth.js, upload.js, comments.js, gallery.js
├── scripts/          # seedAdmin.js
├── views/            # EJS views: login, upload, gallery, etc.
├── public/           # CSS, JS, uploads (images, files)
├── prisma/           # schema.prisma
└── dev.db            # SQLite database
```

---

## 🚀 Getting Started

```bash
npm install
npx prisma migrate dev --name init
npm run dev
```

Visit: `http://localhost:3000`

---

## 🧠 Philosophy

* Use what works: Node.js + EJS + SQLite
* Stay minimal: No React, no Vite, no build chain
* Extend cleanly: business logic adds on top
* Never reinvent: login, uploads, storage already included
* Always image upload — always.

---

## 🛠️ Cloning for New Projects

1. **Do not merge this app.** Clone it:

```bash
git clone <repo-url> my-new-app
```

2. Rename, add routes, adjust styles
3. Break nothing — rebuild nothing

If your new app breaks: start again from node-hero.

---

## 🔒 Production Use

* Can be deployed standalone (PM2, Docker, etc.)
* Ideal for internal admin panels / backoffice apps
* Stable for API extension, CLI triggers, uploads, config

---

## 📌 Notes

* Image thumbnails via `sharp` optional
* `default_table` (universal DB slot) planned
* Everything else is frozen — no new routes, no bloat

---

Made with patience and purpose.
