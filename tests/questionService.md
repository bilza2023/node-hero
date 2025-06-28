const prisma = require('../db');
const {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
} = require('../services/questionService');

let exerciseId;
let questionId;

beforeAll(async () => {
  await prisma.question.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.chapter.deleteMany();

  // Create dummy chapter with all required fields
  const chapter = await prisma.chapter.create({
    data: {
      name: 'dummy-chapter', // ✅ required
      title: 'Dummy Chapter',
      filename: `chapter-${Date.now()}.md`, // ✅ required
    },
  });

  // Create dummy exercise with all required fields
  const exercise = await prisma.exercise.create({
    data: {
      title: 'Dummy Exercise',
      filename: `exercise-${Date.now()}.md`,
      chapterId: chapter.id,
    },
  });

  exerciseId = exercise.id;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('questionService', () => {
  test('createQuestion inserts a question', async () => {
    const q = await createQuestion({
      text: 'What is 2 + 2?',
      exerciseId,
    });
    expect(q).toHaveProperty('id');
    expect(q.text).toBe('What is 2 + 2?');
    questionId = q.id;
  });

  test('getQuestionById retrieves the question', async () => {
    const q = await getQuestionById(questionId);
    expect(q).toBeDefined();
    expect(q.id).toBe(questionId);
    expect(q.exercise).toBeDefined();
  });

  test('getAllQuestions returns array with at least one item', async () => {
    const all = await getAllQuestions();
    expect(Array.isArray(all)).toBe(true);
    expect(all.length).toBeGreaterThan(0);
  });

  test('updateQuestion updates the text', async () => {
    const updated = await updateQuestion(questionId, {
      text: 'Updated Question Text',
    });
    expect(updated.text).toBe('Updated Question Text');
  });

  test('deleteQuestion removes the question', async () => {
    const deleted = await deleteQuestion(questionId);
    expect(deleted.id).toBe(questionId);

    const check = await getQuestionById(questionId);
    expect(check).toBeNull();
  });
});
