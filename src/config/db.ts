import mongoose from "mongoose";
import { env } from "../config/env";

export async function connectDB() {
  mongoose.set("strictQuery", true);
  await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 30000 });
  console.log("✅ MongoDB connected (content)");
}
