// tests/services.test.js

const prisma = require('../db');
const {
  createTcode,
  deleteTcode,
  getTcodeByName
} = require('../services/tcodeService');

const {
  createChapter,
  deleteChapter,
  getChapterByFilename
} = require('../services/chapterService');

const {
  createExercise,
  deleteExercise,
  getExerciseByFilename
} = require('../services/exerciseService');

const {
  createQuestion,
  deleteQuestion,
  getQuestionByFilename
} = require('../services/questionService');

describe('Syllabus Service Layer — Full Lifecycle', () => {
  let tcodeName, chapterFilename, exerciseFilename, questionFilename;

  beforeAll(async () => {
    // Clean slate
    await prisma.question.deleteMany();
    await prisma.exercise.deleteMany();
    await prisma.chapter.deleteMany();
    await prisma.tcode.deleteMany();
  });

  test('create → verify all entities', async () => {
    // 1️⃣ Create Tcode
    tcodeName = `tcode-${Date.now()}`;
    const tcode = await createTcode({
      tcodeName,
      title: 'Test Syllabus',
      description: 'testing',
      image: 'cover.png'
    });

    expect(tcode.tcodeName).toBe(tcodeName);

    // 2️⃣ Create Chapter
    chapterFilename = `chapter-${Date.now()}`;
    const chapter = await createChapter(tcodeName, {
      name: 'Sample Chapter',
      filename: chapterFilename,
      description: 'test chapter',
      image: 'chapter.png'
    });

    expect(chapter.filename).toBe(chapterFilename);

    // 3️⃣ Create Exercise
    exerciseFilename = `exercise-${Date.now()}`;
    const exercise = await createExercise(tcodeName, chapterFilename, {
      name: 'Sample Exercise',
      filename: exerciseFilename,
      description: 'test exercise',
      image: 'exercise.png'
    });

    expect(exercise.filename).toBe(exerciseFilename);

    // 4️⃣ Create Question
    questionFilename = `q-${Date.now()}`;
    const question = await createQuestion(tcodeName, chapterFilename, exerciseFilename, {
      name: 'Sample Question',
      type: 'slide',
      filename: questionFilename
    });

    expect(question.filename).toBe(questionFilename);

    // 5️⃣ Validate existence
    expect(await getTcodeByName(tcodeName)).toBeTruthy();
    expect(await getChapterByFilename(tcodeName, chapterFilename)).toBeTruthy();
    expect(await getExerciseByFilename(tcodeName, chapterFilename, exerciseFilename)).toBeTruthy();
    expect(await getQuestionByFilename(questionFilename)).toBeTruthy();
  });

  test('delete all in reverse order', async () => {
    await deleteQuestion((await getQuestionByFilename(questionFilename)).id);
    expect(await getQuestionByFilename(questionFilename)).toBeNull();

    await deleteExercise((await getExerciseByFilename(tcodeName, chapterFilename, exerciseFilename)).id);
    expect(await getExerciseByFilename(tcodeName, chapterFilename, exerciseFilename)).toBeNull();

    await deleteChapter((await getChapterByFilename(tcodeName, chapterFilename)).id);
    expect(await getChapterByFilename(tcodeName, chapterFilename)).toBeNull();

    await deleteTcode((await getTcodeByName(tcodeName)).id);
    expect(await getTcodeByName(tcodeName)).toBeNull();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
