import express from "express";
import { createTask, deleteTask, getAllTasks, getOneTask, updateTask } from "../controllers/taskController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected route
router.post("/create_task", authMiddleware, createTask);
router.get("/get_all_tasks", authMiddleware, getAllTasks);
router.get("/get_task/:id", authMiddleware, getOneTask);
router.put("/update_task/:id", authMiddleware, updateTask);
router.delete("/delete_task/:id", authMiddleware, deleteTask);


export default router;