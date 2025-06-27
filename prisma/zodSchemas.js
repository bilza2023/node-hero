const { z } = require('zod');

// 🔷 Helper: Slug-safe name (URL + filename friendly)
const slugRegex = /^[a-z0-9\-]+$/;

// 🔷 Tcode input schema
const NewTcodeSchema = z.object({
  tcodeName: z.string()
    .min(2)
    .max(30)
    .regex(slugRegex, { message: 'tcodeName must be lowercase, alphanumeric, and hyphen-only (no spaces or symbols)' }),
  title: z.string().min(2),
  description: z.string().optional(),
  image: z.string().optional()
});

// 🔷 Chapter
const NewChapterSchema = z.object({
  filename: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  image: z.string().optional()
});

// 🔷 Exercise
const NewExerciseSchema = z.object({
  filename: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  image: z.string().optional()
});

// 🔷 Question
const NewQuestionSchema = z.object({
  filename: z.string().min(1),
  name: z.string().min(1),
  type: z.string().min(1), // or restrict with z.enum(['slide', 'mcq', 'note']) later
  chapter: z.string().min(1),
  exercise: z.string().min(1)
});

module.exports = {
  NewTcodeSchema,
  NewChapterSchema,
  NewExerciseSchema,
  NewQuestionSchema
};
