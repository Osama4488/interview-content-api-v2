import { Response } from "express";
import Category from "../models/Category";
import slugify from "slugify";
import { AuthedRequest } from "../middlewares/requireAuth";

export async function createCategory(req: AuthedRequest, res: Response) {
  const userId = req.user!.sub;
  const { category } = req.validated!.body as { category: string };

  try {
    const doc = await Category.create({
      user: userId,
      category,
      slug: slugify(category, { lower: true, strict: true }),
    });

    return res.status(201).json(doc);
  } catch (e: any) {
    if (e?.code === 11000) return res.status(409).json({ error: "Category already exists" });
    return res.status(500).json({ error: "Failed to create category" });
  }
}

export async function listCategories(req: AuthedRequest, res: Response) {
  const userId = req.user!.sub;
  const docs = await Category.find({ user: userId }).sort({ createdAt: -1 });
  return res.json(docs);
}

export async function updateCategory(req: AuthedRequest, res: Response) {
  const userId = req.user!.sub;
  const { id } = req.validated!.params as { id: string };
  const { category } = req.validated!.body as { category: string };

  try {
    const doc = await Category.findOneAndUpdate(
      { _id: id, user: userId },
      { category, slug: slugify(category, { lower: true, strict: true }) },
      { new: true, runValidators: true }
    );

    if (!doc) return res.status(404).json({ error: "Category not found" });
    return res.json(doc);
  } catch (e: any) {
    if (e?.code === 11000) return res.status(409).json({ error: "Category already exists" });
    return res.status(500).json({ error: "Failed to update category" });
  }
}

export async function deleteCategory(req: AuthedRequest, res: Response) {
  const userId = req.user!.sub;
  const { id } = req.validated!.params as { id: string };

  const doc = await Category.findOneAndDelete({ _id: id, user: userId });
  if (!doc) return res.status(404).json({ error: "Category not found" });

  return res.status(204).send();
}
