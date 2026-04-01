import { Router } from "express";
import { requireAuth } from "@middlewares/requireAuth";

import {
  createCategory,
  listCategories,
  updateCategory,
  deleteCategory,
} from "@controllers/category.controller";

import { validateBody } from "@middlewares/validateBody";
import { validateParams } from "@middlewares/validateParams";

import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdParamsSchema,
} from "@controllers/schemas/category.schemas";

const r = Router();

r.use(requireAuth);

r.post("/", validateBody(createCategorySchema), createCategory);
r.get("/", listCategories);
r.patch("/:id", validateParams(categoryIdParamsSchema), validateBody(updateCategorySchema), updateCategory);
r.delete("/:id", validateParams(categoryIdParamsSchema), deleteCategory);

export default r;
