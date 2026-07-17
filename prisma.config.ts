import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: "postgresql://neondb_owner:npg_2wZUiJF7LDMO@ep-cool-truth-atc94z1b-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require",
  },
});