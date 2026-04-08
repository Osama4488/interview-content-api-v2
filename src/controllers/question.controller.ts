import { Response } from "express";
import Question from "../models/Question";
import { AuthedRequest } from "../middlewares/requireAuth";

export async function createQuestion(req: AuthedRequest, res: Response) {
  const userId = req.user!.sub;
  const { category, question, answer } = req.validated!.body as {
    category: string;
    question: string;
    answer: string;
  };

  const doc = await Question.create({
    user: userId,
    category,
    question,
    answer,
  });

  return res.status(201).json(doc);
}

export async function listQuestions(req: AuthedRequest, res: Response) {
  const userId = req.user!.sub;

  const { category, search, page, limit } = req.validated!.query as {
    category?: string;
    search?: string;
    page: number;
    limit: number;
  };

  const q: any = { user: userId };
  if (category) q.category = category;

  if (search) {
    const safe = escapeRegex(search);
    q.$or = [
      { question: { $regex: safe, $options: "i" } },
      { answer: { $regex: safe, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Question.find(q).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Question.countDocuments(q),
  ]);

  return res.json({ items, total, page, limit });
}

function escapeRegex(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function updateQuestion(req: AuthedRequest, res: Response) {
  const userId = req.user!.sub;
  const { id } = req.validated!.params as { id: string };
  const update = req.validated!.body as {
    category?: string;
    question?: string;
    answer?: string;
  };

  const doc = await Question.findOneAndUpdate(
    { _id: id, user: userId },
    update,
    { new: true, runValidators: true }
  );

  if (!doc) return res.status(404).json({ error: "Question not found" });
  return res.json(doc);
}

export async function deleteQuestion(req: AuthedRequest, res: Response) {
  const userId = req.user!.sub;
  const { id } = req.validated!.params as { id: string };

  const doc = await Question.findOneAndDelete({ _id: id, user: userId });
  if (!doc) return res.status(404).json({ error: "Question not found" });

  return res.status(204).send();
}



