import app from "./app";
import { connectDB } from "@config/db";
import { env } from "@config/env";

(async () => {
  await connectDB();
  app.listen(env.port, () => {
    console.log(`🚀 Content API on http://localhost:${env.port}`);
  });
})();
