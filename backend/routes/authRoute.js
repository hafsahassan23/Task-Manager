import express from "express";
import { login, signup } from "../controllers/authController.js";

const router = express.Router();

// Route only decides:
// when POST /signup is called, run signup controller
router.post("/signup", signup);
router.post("/login", login);

export default router;