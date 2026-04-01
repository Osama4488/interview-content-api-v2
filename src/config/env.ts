import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const req = (k: string) => {
  const v = process.env[k];
  if (!v) throw new Error(`Missing env ${k}`);
  return v;
};

export const env = {
  port: Number(process.env.PORT ?? 4002),
  mongoUri: req("MONGO_URI"),
  jwtAccessSecret: req("JWT_ACCESS_SECRET"),
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:3000"
};
