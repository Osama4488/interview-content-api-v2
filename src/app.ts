import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import categoryRoutes from "@routes/category.routes";
import questionRoutes from "@routes/question.routes";

const app = express();

// CORS for your frontend (adjust if needed)
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

// Body & cookies
app.use(express.json());
app.use(cookieParser());

// Health
app.get("/api/health", (_req, res) => res.json({ ok: true, service: "content" }));

// Protected resources (routes themselves use requireAuth)
app.use("/api/categories", categoryRoutes);
app.use("/api/questions", questionRoutes);

export default app;
