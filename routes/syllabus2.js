import express from "express";
import fs from "fs";
import path from "path";
import { SubjectBuilder } from "syllabusobject";

const router = express.Router();
const SYLLABUS_ROOT = path.join("data", "syllabus");

// --- Helper ---
function loadChaptersFile(slug) {
  const filepath = path.join(SYLLABUS_ROOT, slug, "chapters.js");
  delete require.cache[require.resolve("../../" + filepath)];
  return require("../../" + filepath); // caution: assumes compiled use or .js only
}

function saveChapters(slug, data) {
  const builder = new SubjectBuilder(data);
  const text = `import { SubjectBuilder } from 'syllabusobject';\n\nexport const sb = new SubjectBuilder(${JSON.stringify(data, null, 2)});\n\nexport const ${slug}Tcode = sb;`;
  fs.writeFileSync(path.join(SYLLABUS_ROOT, slug, "chapters.js"), text);
}

function ensureFolder(slug) {
  const folder = path.join(SYLLABUS_ROOT, slug);
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
}

function updateIndex(slug) {
  const dir = path.join(SYLLABUS_ROOT, slug);
  const imports = fs.readdirSync(dir)
    .filter(f => f.startsWith("ch") && f.endsWith(".js"))
    .map(f => `import './${f}';`).join("\n");
  const text = `import { ${slug}Tcode } from './chapters.js';\n${imports}\n\nexport const ${slug} = ${slug}Tcode;`;
  fs.writeFileSync(path.join(dir, "index.js"), text);
}

// --- Routes ---
router.post("/syllabus/create", (req, res) => {
  const { tcodeName, filename, description, image } = req.body;
  const slug = filename;
  const structure = {
    tcodeName,
    filename,
    description,
    image,
    chapters: []
  };
  ensureFolder(slug);
  saveChapters(slug, structure);
  updateIndex(slug);
  res.redirect(`/syllabus/${slug}`);
});

router.get("/syllabus/:slug", (req, res) => {
  const slug = req.params.slug;
  const mod = loadChaptersFile(slug);
  const sb = mod.sb;
  res.render("syllabus/edit", { syllabus: sb.toJSON() });
});

router.post("/syllabus/:slug/add-chapter", (req, res) => {
  const slug = req.params.slug;
  const chaptersFile = path.join(SYLLABUS_ROOT, slug, "chapters.js");
  const mod = loadChaptersFile(slug);
  const current = mod.sb.toJSON();
  current.chapters.push({
    filename: req.body.filename,
    name: req.body.name,
    exercises: []
  });
  saveChapters(slug, current);
  fs.writeFileSync(path.join(SYLLABUS_ROOT, slug, `ch${current.chapters.length}_${req.body.filename}.js`), `import { ${slug}Tcode as T } from './chapters.js';\n\nexport const ${slug} = T.toJSON();\n`);
  updateIndex(slug);
  res.redirect(`/syllabus/${slug}`);
});

router.post("/syllabus/:slug/add-exercise", (req, res) => {
  const slug = req.params.slug;
  const { chapter, filename, name } = req.body;
  const mod = loadChaptersFile(slug);
  const current = mod.sb.toJSON();
  const ch = current.chapters.find(c => c.filename === chapter);
  if (!ch) return res.status(404).send("Chapter not found");
  ch.exercises.push({ filename, name });
  saveChapters(slug, current);
  updateIndex(slug);
  res.redirect(`/syllabus/${slug}`);
});

router.post("/syllabus/:slug/add-question", (req, res) => {
  const slug = req.params.slug;
  const { chapter, exercise, filename, name, type } = req.body;
  const chapterFile = fs.readdirSync(path.join(SYLLABUS_ROOT, slug))
    .find(f => f.startsWith(chapter));
  const filepath = path.join(SYLLABUS_ROOT, slug, chapterFile);

  const addLine = `\nconst ex = T.getChExByFilename('${chapter}', '${exercise}');\nex.addQuestion({ filename: '${filename}', name: '${name}', type: '${type}' });\n`;
  let content = fs.readFileSync(filepath, "utf8");
  const marker = "export const";
  const [before, after] = content.split(marker);
  content = before + addLine + marker + after;
  fs.writeFileSync(filepath, content);

  updateIndex(slug);
  res.redirect(`/syllabus/${slug}`);
});

export default router;