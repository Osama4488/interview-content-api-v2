import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import {
  createQuestion,
  listQuestions,
  updateQuestion,
  deleteQuestion,
} from "../controllers/question.controller";

import { validateBody } from "../middlewares/validateBody";
import { validateQuery } from "../middlewares/validateQuery";
import { validateParams } from "../middlewares/validateParams";

import {
  createQuestionSchema,
  listQuestionsQuerySchema,
  updateQuestionSchema,
  questionIdParamsSchema,
} from "../controllers/schemas/question.schemas";

const r = Router();
r.use(requireAuth);

r.post("/", validateBody(createQuestionSchema), createQuestion);
r.get("/", validateQuery(listQuestionsQuerySchema), listQuestions);
r.patch("/:id", validateParams(questionIdParamsSchema), validateBody(updateQuestionSchema), updateQuestion);
r.delete("/:id", validateParams(questionIdParamsSchema), deleteQuestion);

export default r;
