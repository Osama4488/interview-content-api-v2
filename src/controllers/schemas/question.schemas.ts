import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

export const mongoId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

export const questionIdParamsSchema = z.object({
  id: mongoId,
});

export const createQuestionSchema = z.object({
  category: mongoId,
  question: z.string().trim().min(5).max(1000),
  answer: z.string().trim().min(1).max(20000),
});

export const listQuestionsQuerySchema = z.object({
  category: mongoId.optional(),

  // ✅ NEW
  search: z
    .string()
    .trim()
    .min(1, "Search must not be empty")
    .max(100, "Search too long")
    .optional()
    .transform((v) => (v && v.length ? v : undefined)),

  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});


export const updateQuestionSchema = z
  .object({
    category: mongoId.optional(),
    question: z.string().trim().min(5).max(1000).optional(),
    answer: z.string().trim().min(1).max(20000).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, {
    message: "At least one field must be provided",
  });
