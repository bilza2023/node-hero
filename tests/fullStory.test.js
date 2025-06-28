const prisma = require('../db');

describe('Tcode → Chapter → Exercise → Question lifecycle', () => {
  let tcodeId, chapterId, exerciseId, questionId;

  // Clean DB before the suite
  beforeAll(async () => {
    await prisma.question.deleteMany();
    await prisma.exercise.deleteMany();
    await prisma.chapter.deleteMany();
    await prisma.tcode.deleteMany();
  });

  test('create all entities in correct order', async () => {
    // 1️⃣  TCODE
    const tcode = await prisma.tcode.create({
      data: {
        tcodeName: `tcode-${Date.now()}`,
        title: 'Sample Tcode',
        description: 'demo',
        image: 'tcode.png',
      },
    });
    tcodeId = tcode.id;

    // 2️⃣  CHAPTER
    const chapter = await prisma.chapter.create({
      data: {
        name: 'chapter-one',
        filename: `chapter-${Date.now()}.md`,
        description: 'demo chapter',
        image: 'chapter.png',
        order: 1,
        tcodeId,
      },
    });
    chapterId = chapter.id;

    // 3️⃣  EXERCISE  (uses **name** not title)
    const exercise = await prisma.exercise.create({
      data: {
        name: 'exercise-one',
        filename: `exercise-${Date.now()}.md`,
        description: 'demo exercise',
        image: 'exercise.png',
        chapterId,
      },
    });
    exerciseId = exercise.id;

    // 4️⃣  QUESTION  (only text + exerciseId)
    const question = await prisma.question.create({
        data: {
          name: `q-${Date.now()}`,  // ← required by schema
          type: 'slide',
          filename: `q-${Date.now()}.md`,  // ← required by schema
          exerciseId,
        },
      });
      questionId = question.id; 

    // 5️⃣  Assertions
    expect(await prisma.tcode.findUnique({ where: { id: tcodeId } })).toBeTruthy();
    expect(await prisma.chapter.findUnique({ where: { id: chapterId } })).toBeTruthy();
    expect(await prisma.exercise.findUnique({ where: { id: exerciseId } })).toBeTruthy();
    expect(await prisma.question.findUnique({ where: { id: questionId } })).toBeTruthy();
  });

  test('delete in reverse & verify cleanup', async () => {
    await prisma.question.delete({ where: { id: questionId } });
    expect(await prisma.question.findUnique({ where: { id: questionId } })).toBeNull();

    await prisma.exercise.delete({ where: { id: exerciseId } });
    expect(await prisma.exercise.findUnique({ where: { id: exerciseId } })).toBeNull();

    await prisma.chapter.delete({ where: { id: chapterId } });
    expect(await prisma.chapter.findUnique({ where: { id: chapterId } })).toBeNull();

    await prisma.tcode.delete({ where: { id: tcodeId } });
    expect(await prisma.tcode.findUnique({ where: { id: tcodeId } })).toBeNull();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
