import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

export const validateBody =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation error",
        issues: parsed.error.issues,
      });
    }

    // IMPORTANT: req.validated doesn't exist by default
    (req as any).validated = (req as any).validated ?? {};
    (req as any).validated.body = parsed.data;

    next();
  };
