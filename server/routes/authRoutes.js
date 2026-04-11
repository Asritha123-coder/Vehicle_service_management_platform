import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

// @route   POST /register
// @desc    Register a new user
router.post("/register", registerUser);

// @route   POST /login
// @desc    Login user
router.post("/login", loginUser);

export default router;