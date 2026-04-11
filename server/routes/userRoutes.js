import express from "express";
import { getTechnicians } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// Get all technicians (admin/service_center only)
router.get("/technicians", authMiddleware, roleMiddleware("admin", "service_center"), getTechnicians);

export default router;
