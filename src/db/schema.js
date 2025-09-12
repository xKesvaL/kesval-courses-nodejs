// On importe les différents types de champs que l'on peut utiliser avec SQLite
import { sql } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const tasks = sqliteTable("tasks", {
  // On crée nos champs et on leur donne un type
  id: integer().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  description: text().notNull(),
  status: text().notNull(),

  // C'est toujours une bonne idée de mettre des champs pour la date de création et de mise à jour
  createdAt: integer({ mode: "timestamp" })
    .notNull()
    .default(sql`(CURRENT_DATE)`),
  updatedAt: integer({ mode: "timestamp" }),
});
