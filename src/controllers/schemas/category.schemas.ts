import { z } from "zod";

// reuse the same mongoId pattern (you can later move this to common.ts to avoid duplication)
export const mongoId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

export const categoryIdParamsSchema = z.object({
  id: mongoId,
});

export const createCategorySchema = z.object({
  category: z.string().trim().min(2).max(80),
});

export const updateCategorySchema = z.object({
  category: z.string().trim().min(2).max(80),
});
