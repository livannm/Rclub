import { defineConfig } from "prisma/config";

export default defineConfig({
  migrate: {
    url: process.env.DATABASE_URL ?? "postgresql://localhost:5432/rclub"
  }
});
