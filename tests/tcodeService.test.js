// tests/tcodeService.test.js

const prisma = require('../db');
const {
  createTcode,
  getAllTcodes,
  getTcodeById,
  updateTcode,
  deleteTcode,
  getTcodeByName
} = require('../services/tcodeService');

describe('Tcode Service — Core CRUD Tests', () => {
  let tcode;

  beforeAll(async () => {
    await prisma.chapter.deleteMany();
    await prisma.tcode.deleteMany();
  });

  test('createTcode → getTcodeByName', async () => {
    const slug = 'test-' + Date.now();
    tcode = await createTcode({ tcodeName: slug, title: 'Test Title' });

    expect(tcode).toBeTruthy();
    expect(tcode.tcodeName).toBe(slug);

    const fetched = await getTcodeByName(slug);
    expect(fetched.title).toBe('Test Title');
  });

  test('getAllTcodes returns non-empty list', async () => {
    const all = await getAllTcodes();
    expect(all.length).toBeGreaterThan(0);
  });

  test('getTcodeById works', async () => {
    const found = await getTcodeById(tcode.id);
    expect(found).toBeTruthy();
    expect(found.id).toBe(tcode.id);
  });

  test('updateTcode works', async () => {
    const updated = await updateTcode(tcode.id, { title: 'Updated Title' });
    expect(updated.title).toBe('Updated Title');
  });

  test('deleteTcode works when no chapters', async () => {
    const deleted = await deleteTcode(tcode.id);
    expect(deleted.id).toBe(tcode.id);

    const shouldBeGone = await getTcodeById(tcode.id);
    expect(shouldBeGone).toBeNull();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
