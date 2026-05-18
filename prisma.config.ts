import { defineConfig } from "prisma/config";
import { loadProjectEnv } from "./lib/seed/load-env";

loadProjectEnv();

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL
  },
  migrations: {
    seed: "npx tsx prisma/seed.ts"
  }
});
