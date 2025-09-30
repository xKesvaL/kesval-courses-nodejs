import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { db } from "./db/clientDb.js";
import { tasks } from "./db/schema.js";
import { auth } from "./lib/auth.js";
import { cors } from "hono/cors";
import { Server } from "socket.io";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    allowMethods: ["POST", "GET", "OPTIONS", "PUT"],
  })
);

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

// Route qui renvoie la liste des tâches
app.get("/tasks", async (c) => {
  // on récupère plusieurs (toutes, ici) tâches
  const tasks = await db.query.tasks.findMany();

  // On confirme que tout s'est bien passé et on renvoie les taches
  return c.json({
    status: "success",
    data: tasks,
  });
});

// Route qui crée une nouvelle tâche
app.post("/tasks", async (c) => {
  // On récupère les données depuis le body
  const { title, description, status } = await c.req.json();
  // On insère la tache dans la BDD
  const task = await db.insert(tasks).values({ title, description, status });
  // On confirme que tout s'est bien passé et on renvoie la tache
  return c.json({
    status: "success",
    data: task,
  });
});

// Route qui met à jour une tâche
app.put("/tasks/:id", async (c) => {
  // On récupère l'id de la tâche depuis le paramètre de la route
  const { id } = c.req.param();
  // On récupère les données depuis le body
  const { title, description, status } = await c.req.json();
  // On met à jour la tache dans la BDD
  const task = await db
    .update(tasks)
    .set({ title, description, status })
    .where(eq(tasks.id, id));
  // On confirme que tout s'est bien passé et on renvoie la tache
  return c.json({
    status: "success",
    data: task,
  });
});

const server = serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);

const ioServer = new Server(server, {
  serveClient: false,
  cors: {
    origin: "http://localhost:5173",
  },
});

ioServer.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("sendMessage", (data) => {
    console.log(data);

    socket.emit("receiveMessage", data);
  });
});
