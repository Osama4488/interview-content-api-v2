import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

export const validateQuery =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.query);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation error",
        issues: parsed.error.issues,
      });
    }

    (req as any).validated = (req as any).validated ?? {};
    (req as any).validated.query = parsed.data;

    next();
  };
