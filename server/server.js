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

// Force dev mode when running locally (NOT in Vercel)
process.env.NODE_ENV = process.env.NODE_ENV || "development";

// Debug – remove later if you want
console.log("🔍 ENV MODE:", process.env.NODE_ENV);
console.log("CLERK_PUBLISHABLE_KEY:", process.env.CLERK_PUBLISHABLE_KEY);
console.log("CLERK_SECRET_KEY:", process.env.CLERK_SECRET_KEY);

const app = express();

// Clerk authentication middleware
app.use(clerkMiddleware());

// CORS (local + production)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      process.env.FRONTEND_URL, // <-- set this in Vercel env
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

app.use(express.json());

// Health check (good for debugging)
app.get("/", (req, res) => {
  res.send("✅ Server is running and responding!");
});

// Test endpoint
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working 🎉" });
});

// Inngest integration
app.use("/api/inngest", serve({ client: inngest, functions }));

// API routes
app.use("/api/workspaces", protect, workspaceRouter);
app.use("/api/projects", protect, projectRouter);
app.use("/api/tasks", protect, taskRouter);
app.use("/api/comments", protect, commentRouter);

// Run ONLY locally — Vercel will not execute this
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`🚀 Local server running at http://localhost:${PORT}`);
  });
}

// Export the app for Vercel
export default app;
