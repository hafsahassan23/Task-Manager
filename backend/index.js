import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import dns from "dns";
import authRoutes from "./routes/authRoute.js";
import taskRoutes from "./routes/taskRoute.js";

// Set reliable DNS servers to avoid SRV query issues on Windows
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // Ignore if not permitted
}

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file (both local backend and root)
dotenv.config();
dotenv.config({ path: path.join(__dirname, ".env") });

// Create an Express application
const app = express();

// Enable CORS for the application
app.use(cors());

// Enable JSON body parsing
app.use(express.json());

// MongoDB connection helper with caching for Serverless environments
let isConnected = false;
let isConnecting = false;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    isConnected = true;
    return;
  }
  if (isConnecting) return;

  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
      console.warn("MONGODB_URI is not defined in environment variables");
      return;
    }
    isConnecting = true;
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message || error);
  } finally {
    isConnecting = false;
  }
};

// Initial DB connection attempt on startup
connectDB();

// Health check routes
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Task Management Server is running" });
});

app.get("/api", (req, res) => {
  res.json({ status: "ok", message: "Task Management API is running" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Read the PORT value from the .env file (default to 5000)
const port = process.env.PORT || 5000;

// Start the Express server locally (when not running inside Vercel serverless wrapper)
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

// Export the Express app for Vercel Serverless Functions
export default app;