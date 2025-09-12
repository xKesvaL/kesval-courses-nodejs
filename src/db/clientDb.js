// Cette ligne nous sert à importer les variables d'environnement
import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema.js";
// Et on y accède en utilisant process.env.NOM_DE_LA_VARIABLE
export const db = drizzle(process.env.DATABASE_URL, {
  schema,
});
