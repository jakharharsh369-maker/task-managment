import express from "express";
import cors from "cors";
import "dotenv/config";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import { clerkMiddleware } from "@clerk/express";
import workspaceRouter from "./routes/workspaceRoutes.js";
import { protect } from "./middlewares/authMiddleware.js";
import projectRouter from "./routes/projectRoutes.js";
import taskRouter from "./routes/taskRoutes.js";
import commentRouter from "./routes/commentRoutes.js";
import { createServer } from "@vercel/node"; // only once

// 🧩 DEBUG — Check if .env is loading correctly
console.log("🔍 DEBUG: Checking environment variables...");
console.log("CLERK_PUBLISHABLE_KEY:", process.env.CLERK_PUBLISHABLE_KEY);
console.log("CLERK_SECRET_KEY:", process.env.CLERK_SECRET_KEY);

const app = express();

// Clerk Middleware (handles auth)
app.use(clerkMiddleware());

// CORS
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// Basic test route
app.get("/", (req, res) => res.send("✅ Server is live and accessible!"));

// Inngest route
app.use("/api/inngest", serve({ client: inngest, functions }));

// API routes
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working 🎉" });
});
app.use("/api/workspaces", protect, workspaceRouter);
app.use("/api/projects", protect, projectRouter);
app.use("/api/tasks", protect, taskRouter);
app.use("/api/comments", protect, commentRouter);

export const config = {
  runtime: "nodejs",
};

export default createServer(app);
