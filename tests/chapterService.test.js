// tests/chapterService.test.js

const prisma = require('../db');
const {
  createTcode,
  deleteTcode,
  getTcodeByName
} = require('../services/tcodeService');

const {
  createChapter,
  getChaptersForTcode,
  updateChapter,
  deleteChapter
} = require('../services/chapterService');

describe('Chapter Service — CRUD Tests', () => {
  let tcodeName, tcodeId, chapterId;

  beforeAll(async () => {
    await prisma.chapter.deleteMany();
    await prisma.tcode.deleteMany();

    tcodeName = 'tcode-' + Date.now();
    const tcode = await createTcode({
      tcodeName,
      title: 'Test Tcode'
    });

    tcodeId = tcode.id;
  });

  test('createChapter → getChaptersForTcode', async () => {
    const filename = 'chapter-' + Date.now();
    const title = 'Test Chapter';

    const chapter = await createChapter(tcodeName, {
      title,
      filename
    });

    expect(chapter.filename).toBe(filename);
    chapterId = chapter.id;

    const result = await getChaptersForTcode(tcodeName);
    expect(result.chapters.some(c => c.filename === filename)).toBe(true);
  });

  test('updateChapter → changes title', async () => {
    const updated = await updateChapter(chapterId, { title: 'Updated Chapter' });
    expect(updated.title).toBe('Updated Chapter');
  });

  test('deleteChapter → removes record', async () => {
    const deleted = await deleteChapter(chapterId);
    expect(deleted.id).toBe(chapterId);
  });

  afterAll(async () => {
    await deleteTcode(tcodeId);
    await prisma.$disconnect();
  });
});
