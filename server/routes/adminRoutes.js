import express from "express";
import { getAllUsers, updateUserRole, deleteUser } from "../controllers/adminController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// Apply protection to all admin routes
router.use(authMiddleware);
router.use(roleMiddleware("admin"));

// User Management Routes
router.get("/users", getAllUsers);
router.put("/user/:id", updateUserRole);
router.delete("/user/:id", deleteUser);

export default router;