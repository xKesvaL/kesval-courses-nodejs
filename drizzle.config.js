import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  // On dit à drizzle où se trouve le schéma de la base de données
  schema: "./src/db/schema.js",
  // On dit à drizzle que la base de données est SQLite
  dialect: "sqlite",
  // On lui donne l'identifiant de la base de données
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
